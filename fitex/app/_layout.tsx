import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

function RootLayoutContent() {
	return (
		<>
			<Stack
				screenOptions={{
					headerShown: false,
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
			<RootLayoutContent />
		</SafeAreaProvider>
	)
}
