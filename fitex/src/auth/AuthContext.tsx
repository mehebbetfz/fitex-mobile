import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import api from '../api/client'

WebBrowser.maybeCompleteAuthSession()

/* ================= TYPES ================= */

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: string
  hasSubscription: boolean
  subscriptionExpiresAt?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isSubscribed: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  checkSubscription: (u?: User) => Promise<boolean>
  syncData: () => Promise<void>
}

/* ================= CONTEXT ================= */

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isSubscribed: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  checkSubscription: async () => false,
  syncData: async () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

/* ================= PROVIDER ================= */

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)

  /* ================= GOOGLE DISCOVERY ================= */

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  }

  /* ================= REDIRECT URI ================= */

  const useProxy = Platform.select({ web: false, default: true })
  
  const redirectUri = makeRedirectUri({
    // Для Expo Go
    native: 'exp://aqhgedg-mehebbet55-8081.exp.direct',
  })

  console.log('REDIRECT URI:', redirectUri)

  /* ================= AUTH REQUEST ================= */

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      usePKCE: true,
      responseType: ResponseType.Code,
    },
    discovery
  )

  /* ================= LOAD USER ================= */

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token')
      const userData = await SecureStore.getItemAsync('user_data')

      if (!token || !userData) {
        setIsLoading(false)
        return
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      const parsedUser: User = JSON.parse(userData)
      setUser(parsedUser)

      await checkSubscription(parsedUser)
    } catch (e) {
      console.error('Load user error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  /* ================= RESPONSE HANDLER ================= */

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params
      handleGoogleCallback(code)
    }

    if (response?.type === 'error') {
      Alert.alert('Ошибка', 'Google авторизация отменена')
      setIsLoading(false)
    }
  }, [response])

  /* ================= SIGN IN ================= */

  const signInWithGoogle = async () => {
    if (Platform.OS === 'web') {
      // Для веб используем прямой переход на Google OAuth
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email&access_type=offline`
      window.location.href = authUrl
      return
    }

    try {
      // Для мобильных устройств используем promptAsync без useProxy
      await promptAsync()
    } catch (error) {
      console.error('Auth prompt error:', error)
      Alert.alert('Ошибка', 'Не удалось открыть Google авторизацию')
    }
  }

  /* ================= CALLBACK ================= */

  const handleGoogleCallback = async (code: string) => {
    try {
      setIsLoading(true)
      
      // Отправляем код на ваш бэкенд для получения access token
      const res = await api.post('/auth/google/callback', {
        code,
        redirect_uri: redirectUri,
        code_verifier: request?.codeVerifier,
      })

      const { access_token, user: userData } = res.data

      // Сохраняем токен и данные пользователя
      await SecureStore.setItemAsync('access_token', access_token)
      await SecureStore.setItemAsync('user_data', JSON.stringify(userData))

      // Устанавливаем токен в заголовки API
      api.defaults.headers.common.Authorization = `Bearer ${access_token}`

      setUser(userData)
      await checkSubscription(userData)

      Alert.alert('Успех', 'Вы вошли через Google')
    } catch (e: any) {
      console.error('Google callback error:', e?.response?.data || e)
      Alert.alert('Ошибка', e?.response?.data?.message || 'Не удалось войти')
    } finally {
      setIsLoading(false)
    }
  }

  /* ================= SUBSCRIPTION ================= */

  const checkSubscription = async (u?: User): Promise<boolean> => {
    try {
      const currentUser = u ?? user
      if (!currentUser) return false

      const res = await api.get('/subscription/status')
      const { hasActiveSubscription, subscription } = res.data

      setIsSubscribed(hasActiveSubscription)

      if (hasActiveSubscription && subscription?.expiresAt) {
        const updatedUser: User = {
          ...currentUser,
          subscriptionExpiresAt: subscription.expiresAt,
        }

        setUser(updatedUser)
        await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser))
      }

      return hasActiveSubscription
    } catch (e) {
      console.error('Subscription error:', e)
      return false
    }
  }

  /* ================= SYNC ================= */

  const syncData = async () => {
    try {
      const offline = await SecureStore.getItemAsync('offline_data')
      if (!offline) {
        Alert.alert('Нет данных для синхронизации')
        return
      }

      const hasSub = await checkSubscription()
      if (!hasSub) {
        Alert.alert('Требуется подписка')
        return
      }

      await api.post('/sync/upload', { data: JSON.parse(offline) })
      await SecureStore.deleteItemAsync('offline_data')

      Alert.alert('Успех', 'Данные синхронизированы')
    } catch (e) {
      console.error('Sync error:', e)
      Alert.alert('Ошибка синхронизации')
    }
  }

  /* ================= SIGN OUT ================= */

  const signOut = async () => {
    try {
      // Отзываем токен Google (опционально)
      if (user) {
        await api.post('/auth/revoke-google')
      }
    } catch (error) {
      console.error('Revoke error:', error)
    } finally {
      // Очищаем локальное хранилище
      await SecureStore.deleteItemAsync('access_token')
      await SecureStore.deleteItemAsync('user_data')
      await SecureStore.deleteItemAsync('offline_data')

      // Удаляем заголовок авторизации
      delete api.defaults.headers.common.Authorization
      
      // Сбрасываем состояние
      setUser(null)
      setIsSubscribed(false)
    }
  }

  /* ================= PROVIDER ================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSubscribed,
        signInWithGoogle,
        signOut,
        checkSubscription,
        syncData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}