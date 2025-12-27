import { Stack } from 'expo-router'

export default function PublicLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='index' />
			<Stack.Screen
				name='login'
				options={{
					presentation: 'modal',
					animation: 'slide_from_bottom',
				}}
			/>
			<Stack.Screen
				name='register'
				options={{
					presentation: 'modal',
					animation: 'slide_from_bottom',
				}}
			/>
			<Stack.Screen
				name='subscription'
				options={{
					presentation: 'modal',
					animation: 'slide_from_bottom',
				}}
			/>
		</Stack>
	)
}
