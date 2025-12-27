import { AuthProvider } from '@/src/auth/AuthContext'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<AuthProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name='index' />
						<Stack.Screen name='(public)' />
						<Stack.Screen name='(auth)' />
					</Stack>
				</AuthProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
