import { AuthProvider } from '@/src/auth/AuthContext'
import { ThemeProvider, useTheme } from '@/src/theme/ThemeContex'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

// Компонент для установки StatusBar в зависимости от темы
function ThemedStatusBar() {
	const { isDark } = useTheme()
	return <StatusBar style={!isDark ? 'light' : 'dark'} />
}

function RootLayoutContent() {
	const { colors } = useTheme()

	return (
		<>
			<ThemedStatusBar />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor: colors.background,
					},
				}}
			>
				<Stack.Screen name='index' />
				<Stack.Screen name='(public)' />
				<Stack.Screen name='(auth)' />
			</Stack>
		</>
	)
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<ThemeProvider>
				<AuthProvider>
					<RootLayoutContent />
				</AuthProvider>
			</ThemeProvider>
		</SafeAreaProvider>
	)
}
