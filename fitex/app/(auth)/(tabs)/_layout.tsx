// app/(tabs)/_layout.tsx
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Tabs, useRouter } from 'expo-router'
import { Platform, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabsLayout() {
	const { bottom } = useSafeAreaInsets()
	const router = useRouter()

	const handleStartWorkout = () => {
		// Генерируем ID для новой тренировки
		const workoutId = 'quick-' + Date.now()
		// Переходим сразу на страницу тренировки
		router.push(`/workout/${workoutId}`)
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#34C759',
				tabBarInactiveTintColor: '#8E8E93',

				tabBarStyle: {
					borderTopWidth: 0,
					elevation: 0,
					shadowOpacity: 0,
					height: 70 + bottom,
					paddingBottom: bottom + 8,
					paddingTop: 8,
					position: 'relative',
				},

				tabBarBackground: () => (
					<View style={{ flex: 1 }}>
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

			{/* Центральная большая кнопка "Старт" */}
			<Tabs.Screen
				name='start-workout'
				options={{
					title: 'Старт',
					tabBarShowLabel: false,
					tabBarButton: props => (
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<TouchableOpacity
								onPress={handleStartWorkout}
								style={{
									top: -25,
									width: 70,
									height: 70,
									borderRadius: 35,
									backgroundColor: '#34C759',
									alignItems: 'center',
									justifyContent: 'center',
									shadowColor: '#34C759',
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.3,
									shadowRadius: 8,
									elevation: 8,
									borderWidth: 3,
									borderColor: 'rgba(255,255,255,0.1)',
								}}
							>
								<Ionicons name='play' size={30} color='white' />
							</TouchableOpacity>
						</View>
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
