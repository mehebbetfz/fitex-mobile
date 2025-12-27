import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#007AFF',
				tabBarInactiveTintColor: '#8E8E93',
				tabBarStyle: {
					backgroundColor: '#ffffff',
					borderTopColor: '#e5e5ea',
					height: 60,
					paddingBottom: 8,
					paddingTop: 8,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
				},
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Тренировки',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='fitness' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='recovery'
				options={{
					title: 'Восстановление',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='heart' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='history'
				options={{
					title: 'История',
					tabBarIcon: ({ color, size }) => (
						<MaterialIcons name='history' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Профиль',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='person' size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
