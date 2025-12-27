import { useAuth } from '@/src/auth/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const WORKOUT_HISTORY = [
	{
		id: '1',
		date: 'Сегодня',
		time: '18:30',
		duration: '45 мин',
		type: 'Силовая',
		muscleGroups: ['Грудь', 'Трицепс'],
		exercises: 4,
		sets: 16,
		volume: 4800,
	},
	{
		id: '2',
		date: 'Вчера',
		time: '19:15',
		duration: '60 мин',
		type: 'Кардио',
		muscleGroups: ['Ноги', 'Пресс'],
		exercises: 5,
		sets: 20,
		volume: 3200,
	},
	{
		id: '3',
		date: '2 дня назад',
		time: '17:45',
		duration: '50 мин',
		type: 'Верх тела',
		muscleGroups: ['Спина', 'Бицепс'],
		exercises: 5,
		sets: 18,
		volume: 4200,
	},
	{
		id: '4',
		date: '3 дня назад',
		time: '20:00',
		duration: '40 мин',
		type: 'Ноги',
		muscleGroups: ['Квадрицепс', 'Бицепс бедра'],
		exercises: 4,
		sets: 16,
		volume: 3800,
	},
	{
		id: '5',
		date: '4 дня назад',
		time: '18:00',
		duration: '55 мин',
		type: 'Круговая',
		muscleGroups: ['Все тело'],
		exercises: 6,
		sets: 24,
		volume: 5200,
	},
]

const MONTHS = [
	'Янв',
	'Фев',
	'Мар',
	'Апр',
	'Май',
	'Июн',
	'Июл',
	'Авг',
	'Сен',
	'Окт',
	'Ноя',
	'Дек',
]

export default function HistoryTab() {
	const { isSubscribed } = useAuth()
	const [selectedFilter, setSelectedFilter] = useState('all')
	const [stats, setStats] = useState({
		totalWorkouts: 24,
		totalVolume: 52400,
		streak: 7,
		favoriteExercise: 'Жим лежа',
	})

	const filters = [
		{ id: 'all', label: 'Все' },
		{ id: 'week', label: 'Неделя' },
		{ id: 'month', label: 'Месяц' },
		{ id: 'chest', label: 'Грудь' },
		{ id: 'legs', label: 'Ноги' },
	]

	const renderWorkoutCard = ({ item }: { item: any }) => (
		<TouchableOpacity style={styles.workoutCard}>
			<View style={styles.workoutHeader}>
				<View>
					<Text style={styles.workoutDate}>{item.date}</Text>
					<Text style={styles.workoutTime}>{item.time}</Text>
				</View>
				<View style={styles.workoutTypeBadge}>
					<Text style={styles.workoutTypeText}>{item.type}</Text>
				</View>
			</View>

			<View style={styles.muscleGroups}>
				{item.muscleGroups.map((muscle: string, index: number) => (
					<View key={index} style={styles.muscleTag}>
						<Text style={styles.muscleTagText}>{muscle}</Text>
					</View>
				))}
			</View>

			<View style={styles.workoutStats}>
				<View style={styles.statItem}>
					<Ionicons name='barbell' size={16} color='#666' />
					<Text style={styles.statText}>{item.exercises} упр.</Text>
				</View>
				<View style={styles.statItem}>
					<Ionicons name='repeat' size={16} color='#666' />
					<Text style={styles.statText}>{item.sets} подх.</Text>
				</View>
				<View style={styles.statItem}>
					<Ionicons name='time' size={16} color='#666' />
					<Text style={styles.statText}>{item.duration}</Text>
				</View>
				<View style={styles.statItem}>
					<Ionicons name='trending-up' size={16} color='#666' />
					<Text style={styles.statText}>{item.volume} кг</Text>
				</View>
			</View>
		</TouchableOpacity>
	)

	const renderCalendar = () => {
		const today = new Date()
		const days = []

		for (let i = 6; i >= 0; i--) {
			const date = new Date(today)
			date.setDate(today.getDate() - i)

			const hasWorkout = Math.random() > 0.3 // Моковые данные

			days.push(
				<View key={i} style={styles.calendarDay}>
					<Text style={styles.dayName}>
						{['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()]}
					</Text>
					<View
						style={[styles.dayCircle, hasWorkout && styles.dayCircleActive]}
					>
						<Text
							style={[styles.dayNumber, hasWorkout && styles.dayNumberActive]}
						>
							{date.getDate()}
						</Text>
					</View>
					{hasWorkout && <View style={styles.dayDot} />}
				</View>
			)
		}

		return days
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>История тренировок</Text>
						<Text style={styles.subtitle}>Отслеживайте ваш прогресс</Text>
					</View>
					<TouchableOpacity style={styles.exportButton}>
						<Ionicons name='download' size={24} color='#007AFF' />
					</TouchableOpacity>
				</View>

				<View style={styles.statsOverview}>
					<View style={styles.statCard}>
						<Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
						<Text style={styles.statLabel}>Тренировок</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statNumber}>
							{stats.totalVolume.toLocaleString()}
						</Text>
						<Text style={styles.statLabel}>Общий объем, кг</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statNumber}>{stats.streak}</Text>
						<Text style={styles.statLabel}>Дней подряд</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={[styles.statNumber, { fontSize: 16 }]}>
							{stats.favoriteExercise}
						</Text>
						<Text style={styles.statLabel}>Любимое упражнение</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Активность</Text>
					<View style={styles.calendar}>{renderCalendar()}</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Фильтры</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.filtersContainer}
					>
						{filters.map(filter => (
							<TouchableOpacity
								key={filter.id}
								style={[
									styles.filterButton,
									selectedFilter === filter.id && styles.filterButtonActive,
								]}
								onPress={() => setSelectedFilter(filter.id)}
							>
								<Text
									style={[
										styles.filterText,
										selectedFilter === filter.id && styles.filterTextActive,
									]}
								>
									{filter.label}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Последние тренировки</Text>
						<TouchableOpacity>
							<Text style={styles.seeAll}>Все →</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={WORKOUT_HISTORY}
						renderItem={renderWorkoutCard}
						keyExtractor={item => item.id}
						scrollEnabled={false}
						contentContainerStyle={styles.workoutList}
					/>
				</View>

				{!isSubscribed && (
					<TouchableOpacity style={styles.premiumCard}>
						<View style={styles.premiumContent}>
							<Ionicons name='stats-chart' size={32} color='#FF9500' />
							<View style={styles.premiumText}>
								<Text style={styles.premiumTitle}>Расширенная статистика</Text>
								<Text style={styles.premiumDescription}>
									Откройте детальную аналитику с подпиской Premium
								</Text>
							</View>
						</View>
						<Ionicons name='chevron-forward' size={24} color='#8E8E93' />
					</TouchableOpacity>
				)}

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Прогресс по упражнениям</Text>
					<View style={styles.exerciseProgress}>
						<View style={styles.progressItem}>
							<Text style={styles.exerciseName}>Жим лежа</Text>
							<View style={styles.progressBar}>
								<View style={[styles.progressFill, { width: '85%' }]} />
							</View>
							<Text style={styles.progressText}>+15 кг за месяц</Text>
						</View>
						<View style={styles.progressItem}>
							<Text style={styles.exerciseName}>Приседания</Text>
							<View style={styles.progressBar}>
								<View style={[styles.progressFill, { width: '70%' }]} />
							</View>
							<Text style={styles.progressText}>+10 кг за месяц</Text>
						</View>
						<View style={styles.progressItem}>
							<Text style={styles.exerciseName}>Тяга в наклоне</Text>
							<View style={styles.progressBar}>
								<View style={[styles.progressFill, { width: '65%' }]} />
							</View>
							<Text style={styles.progressText}>+8 кг за месяц</Text>
						</View>
					</View>
				</View>
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
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginTop: 4,
	},
	exportButton: {
		padding: 8,
	},
	statsOverview: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 10,
		marginTop: 10,
	},
	statCard: {
		width: '50%',
		padding: 16,
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#007AFF',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: '#666',
		textAlign: 'center',
	},
	section: {
		marginTop: 24,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1a1a1a',
		marginLeft: 20,
		marginBottom: 12,
	},
	seeAll: {
		fontSize: 14,
		color: '#007AFF',
		fontWeight: '600',
		marginRight: 20,
	},
	calendar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 16,
		paddingVertical: 16,
	},
	calendarDay: {
		alignItems: 'center',
	},
	dayName: {
		fontSize: 12,
		color: '#8E8E93',
		marginBottom: 8,
	},
	dayCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#f5f5f5',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 4,
	},
	dayCircleActive: {
		backgroundColor: '#007AFF',
	},
	dayNumber: {
		fontSize: 14,
		fontWeight: '600',
		color: '#666',
	},
	dayNumberActive: {
		color: '#fff',
	},
	dayDot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#34C759',
	},
	filtersContainer: {
		paddingLeft: 20,
		paddingRight: 10,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#fff',
		borderRadius: 20,
		marginRight: 8,
		borderWidth: 1,
		borderColor: '#e5e5ea',
	},
	filterButtonActive: {
		backgroundColor: '#007AFF',
		borderColor: '#007AFF',
	},
	filterText: {
		fontSize: 14,
		color: '#666',
		fontWeight: '500',
	},
	filterTextActive: {
		color: '#fff',
	},
	workoutList: {
		paddingHorizontal: 20,
	},
	workoutCard: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
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
	workoutDate: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	workoutTime: {
		fontSize: 14,
		color: '#8E8E93',
		marginTop: 2,
	},
	workoutTypeBadge: {
		backgroundColor: '#E3F2FD',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	workoutTypeText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#007AFF',
	},
	muscleGroups: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 12,
	},
	muscleTag: {
		backgroundColor: '#f5f5f5',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 8,
		marginBottom: 4,
	},
	muscleTagText: {
		fontSize: 12,
		color: '#666',
	},
	workoutStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statText: {
		fontSize: 12,
		color: '#666',
		marginLeft: 4,
	},
	premiumCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginTop: 20,
		borderRadius: 16,
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#FF9500',
	},
	premiumContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	premiumText: {
		marginLeft: 12,
	},
	premiumTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 4,
	},
	premiumDescription: {
		fontSize: 14,
		color: '#666',
	},
	exerciseProgress: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 16,
		padding: 16,
	},
	progressItem: {
		marginBottom: 16,
	},
	exerciseName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1a1a1a',
		marginBottom: 8,
	},
	progressBar: {
		height: 8,
		backgroundColor: '#e5e5ea',
		borderRadius: 4,
		marginBottom: 4,
		overflow: 'hidden',
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#34C759',
		borderRadius: 4,
	},
	progressText: {
		fontSize: 12,
		color: '#666',
	},
})
