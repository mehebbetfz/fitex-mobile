// app/(tabs)/_layout.tsx
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Tabs } from 'expo-router'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabsLayout() {
	const { bottom } = useSafeAreaInsets()

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#34C759',
				tabBarInactiveTintColor: '#8E8E93',

				// Убираем position: 'absolute' — теперь таббар занимает место в layout
				tabBarStyle: {
					borderTopWidth: 0,
					elevation: 0, // Android тень
					shadowOpacity: 0, // iOS тень
					height: 70 + bottom, // Учитываем safe area снизу
					paddingBottom: bottom + 8,
					paddingTop: 8,
					// Важно: не указываем position, bottom, left, right
				},

				// Полупрозрачный градиентный фон таббара
				tabBarBackground: () => (
					<View style={{ flex: 1, overflow: 'hidden' }}>
						<LinearGradient
							colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.85)']}
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: 1 }}
							style={{
								flex: 1,
								borderTopWidth: 1,
								borderTopColor: 'rgba(255,255,255,0.05)',
							}}
						/>
					</View>
				),

				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
					marginTop: Platform.OS === 'ios' ? 0 : 2,
				},

				tabBarIconStyle: {
					marginBottom: 0,
				},

				tabBarItemStyle: {
					paddingVertical: 6,
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Тренировки',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='fitness-outline' size={size} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name='recovery'
				options={{
					title: 'Восстановление',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='heart-outline' size={size} color={color} />
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
						<Ionicons name='person-outline' size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
