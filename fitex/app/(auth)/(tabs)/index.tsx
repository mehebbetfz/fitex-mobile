import { useAuth } from '@/src/auth/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
	Alert,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Моковые данные для тестирования
const MUSCLE_GROUPS = [
	{ id: '1', name: 'Грудь', icon: '🏋️', color: '#FF6B6B', exercises: 12 },
	{ id: '2', name: 'Спина', icon: '💪', color: '#4ECDC4', exercises: 15 },
	{ id: '3', name: 'Ноги', icon: '🦵', color: '#45B7D1', exercises: 20 },
	{ id: '4', name: 'Плечи', icon: '👤', color: '#96CEB4', exercises: 10 },
	{ id: '5', name: 'Руки', icon: '💪', color: '#FFEAA7', exercises: 18 },
	{ id: '6', name: 'Пресс', icon: '🔥', color: '#DDA0DD', exercises: 8 },
]

const WORKOUT_PLANS = [
	{ id: '1', name: 'Начальный', duration: '30 мин', difficulty: 'Легко' },
	{ id: '2', name: 'Силовая', duration: '45 мин', difficulty: 'Средне' },
	{ id: '3', name: 'Интенсив', duration: '60 мин', difficulty: 'Сложно' },
]

export default function WorkoutTab() {
	const router = useRouter()
	const { user, isSubscribed } = useAuth()
	const [selectedMuscle, setSelectedMuscle] = useState(null)
	const [quickWorkouts, setQuickWorkouts] = useState(WORKOUT_PLANS)

	const handleMusclePress = (muscle: any) => {
		if (!isSubscribed) {
			Alert.alert(
				'Требуется подписка',
				'Для доступа к полному списку упражнений требуется подписка',
				[
					{ text: 'Отмена', style: 'cancel' },
					{
						text: 'Оформить',
						onPress: () => router.push('/(public)/subscription'),
					},
				]
			)
			return
		}
		setSelectedMuscle(muscle)
		router.push(`/(auth)/workout/create?muscle=${muscle.id}`)
	}

	const handleQuickStart = (plan: any) => {
		if (!isSubscribed) {
			Alert.alert(
				'Требуется подписка',
				'Для доступа к тренировочным планам требуется подписка',
				[
					{ text: 'Отмена', style: 'cancel' },
					{
						text: 'Оформить',
						onPress: () => router.push('/(public)/subscription'),
					},
				]
			)
			return
		}
		router.push(`/(auth)/workout/${plan.id}`)
	}

	const renderMuscleCard = ({ item }: { item: any }) => (
		<TouchableOpacity
			style={[styles.muscleCard, { backgroundColor: item.color }]}
			onPress={() => handleMusclePress(item)}
		>
			<Text style={styles.muscleIcon}>{item.icon}</Text>
			<Text style={styles.muscleName}>{item.name}</Text>
			<Text style={styles.exerciseCount}>{item.exercises} упражнений</Text>
		</TouchableOpacity>
	)

	const renderWorkoutPlan = ({ item }: { item: any }) => (
		<TouchableOpacity
			style={styles.workoutCard}
			onPress={() => handleQuickStart(item)}
		>
			<View style={styles.workoutHeader}>
				<Text style={styles.workoutName}>{item.name}</Text>
				<View style={styles.difficultyBadge}>
					<Text style={styles.difficultyText}>{item.difficulty}</Text>
				</View>
			</View>
			<Text style={styles.workoutDuration}>⏱️ {item.duration}</Text>
			<TouchableOpacity style={styles.startButton}>
				<Text style={styles.startButtonText}>Начать</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	)

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<View>
						<Text style={styles.greeting}>
							Привет, {user?.firstName || 'Спортсмен'}!
						</Text>
						<Text style={styles.subtitle}>Готовы к тренировке?</Text>
					</View>
					<TouchableOpacity
						onPress={() => router.push('/(auth)/workout/create')}
					>
						<Ionicons name='add-circle' size={36} color='#007AFF' />
					</TouchableOpacity>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Группы мышц</Text>
					<FlatList
						data={MUSCLE_GROUPS}
						renderItem={renderMuscleCard}
						keyExtractor={item => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.muscleList}
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Быстрый старт</Text>
					<FlatList
						data={quickWorkouts}
						renderItem={renderWorkoutPlan}
						keyExtractor={item => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.workoutList}
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Сегодняшняя тренировка</Text>
					<View style={styles.todayWorkout}>
						<Text style={styles.todayTitle}>Силовая тренировка груди</Text>
						<View style={styles.stats}>
							<View style={styles.stat}>
								<Text style={styles.statNumber}>4</Text>
								<Text style={styles.statLabel}>упражнения</Text>
							</View>
							<View style={styles.stat}>
								<Text style={styles.statNumber}>12</Text>
								<Text style={styles.statLabel}>подходов</Text>
							</View>
							<View style={styles.stat}>
								<Text style={styles.statNumber}>45</Text>
								<Text style={styles.statLabel}>минут</Text>
							</View>
						</View>
						<TouchableOpacity
							style={styles.continueButton}
							onPress={() => router.push('/(auth)/workout/1')}
						>
							<Text style={styles.continueButtonText}>Продолжить →</Text>
						</TouchableOpacity>
					</View>
				</View>

				{!isSubscribed && (
					<TouchableOpacity
						style={styles.subscriptionBanner}
						onPress={() => router.push('/(public)/subscription')}
					>
						<Text style={styles.bannerTitle}>Откройте все возможности</Text>
						<Text style={styles.bannerText}>
							Перейдите на Премиум для полного доступа
						</Text>
						<Text style={styles.bannerCta}>Попробовать бесплатно →</Text>
					</TouchableOpacity>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 10,
	},
	greeting: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginTop: 4,
	},
	section: {
		marginTop: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1a1a1a',
		marginLeft: 20,
		marginBottom: 12,
	},
	muscleList: {
		paddingLeft: 20,
		paddingRight: 10,
	},
	muscleCard: {
		width: 120,
		height: 140,
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
		justifyContent: 'space-between',
	},
	muscleIcon: {
		fontSize: 32,
	},
	muscleName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
	exerciseCount: {
		fontSize: 12,
		color: 'rgba(255, 255, 255, 0.8)',
	},
	workoutList: {
		paddingLeft: 20,
		paddingRight: 10,
	},
	workoutCard: {
		width: 200,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	workoutHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	workoutName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	difficultyBadge: {
		backgroundColor: '#FFEAA7',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	difficultyText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#FF9500',
	},
	workoutDuration: {
		fontSize: 14,
		color: '#666',
		marginBottom: 16,
	},
	startButton: {
		backgroundColor: '#007AFF',
		paddingVertical: 8,
		borderRadius: 8,
		alignItems: 'center',
	},
	startButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600',
	},
	todayWorkout: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 16,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	todayTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 16,
	},
	stats: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 20,
	},
	stat: {
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	statLabel: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	continueButton: {
		backgroundColor: '#34C759',
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: 'center',
	},
	continueButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	subscriptionBanner: {
		backgroundColor: '#007AFF',
		margin: 20,
		padding: 20,
		borderRadius: 16,
		alignItems: 'center',
	},
	bannerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 8,
	},
	bannerText: {
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.9)',
		textAlign: 'center',
		marginBottom: 12,
	},
	bannerCta: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
})
