import { useAuth } from '@/src/auth/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import {
	Dimensions,
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
	const [monthDays, setMonthDays] = useState<any[]>([])
	const [stats, setStats] = useState({
		streak: 7,
	})

	// Получаем все уникальные группы мышц из истории тренировок
	const getAllMuscleGroups = () => {
		const groups = new Set<string>()
		WORKOUT_HISTORY.forEach(workout => {
			workout.muscleGroups.forEach(group => groups.add(group))
		})
		return Array.from(groups)
	}

	const muscleGroups = ['all', ...getAllMuscleGroups()]

	// Фильтруем тренировки по выбранной группе мышц
	const filteredWorkouts = WORKOUT_HISTORY.filter(workout => {
		if (selectedFilter === 'all') return true
		return workout.muscleGroups.includes(selectedFilter)
	})

	// Генерируем календарь на текущий месяц
	const generateMonthCalendar = () => {
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth()

		// Первый день месяца
		const firstDay = new Date(year, month, 1)
		// Последний день месяца
		const lastDay = new Date(year, month + 1, 0)

		// Количество дней в месяце
		const daysInMonth = lastDay.getDate()

		// День недели первого дня (0 - воскресенье, 1 - понедельник и т.д.)
		const firstDayOfWeek = firstDay.getDay()

		const days = []

		// Добавляем пустые ячейки для дней предыдущего месяца
		for (let i = 0; i < firstDayOfWeek; i++) {
			days.push({ day: null, hasWorkout: false })
		}

		// Добавляем дни текущего месяца
		for (let day = 1; day <= daysInMonth; day++) {
			const hasWorkout = Math.random() > 0.6 // Моковые данные
			days.push({ day, hasWorkout })
		}

		return days
	}

	useEffect(() => {
		setMonthDays(generateMonthCalendar())
	}, [])

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
					<Ionicons name='barbell' size={16} color='#8E8E93' />
					<Text style={styles.statText}>{item.exercises} упр.</Text>
				</View>
				<View style={styles.statItem}>
					<Ionicons name='repeat' size={16} color='#8E8E93' />
					<Text style={styles.statText}>{item.sets} подх.</Text>
				</View>
				<View style={styles.statItem}>
					<Ionicons name='time' size={16} color='#8E8E93' />
					<Text style={styles.statText}>{item.duration}</Text>
				</View>
				<View style={styles.statItem}>
					<Ionicons name='trending-up' size={16} color='#8E8E93' />
					<Text style={styles.statText}>{item.volume} кг</Text>
				</View>
			</View>
		</TouchableOpacity>
	)

	const getFilterLabel = (filter: string) => {
		if (filter === 'all') return 'Все мышцы'
		return filter
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>История тренировок</Text>
						<Text style={styles.subtitle}>Отслеживайте ваш прогресс</Text>
					</View>
				</View>

				{/* Статистика - только дней подряд */}
				<View style={styles.statsOverview}>
					<View style={styles.streakCard}>
						<View style={styles.streakIconContainer}>
							<Ionicons name='flame' size={32} color='#FF9500' />
						</View>
						<View>
							<Text style={styles.streakNumber}>{stats.streak}</Text>
							<Text style={styles.streakLabel}>Дней подряд</Text>
						</View>
					</View>
				</View>

				{/* Фильтры по мышцам */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Фильтровать по мышцам</Text>
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.filtersContainer}
					>
						{muscleGroups.map(muscle => (
							<TouchableOpacity
								key={muscle}
								style={[
									styles.filterButton,
									selectedFilter === muscle && styles.filterButtonActive,
								]}
								onPress={() => setSelectedFilter(muscle)}
							>
								<Text
									style={[
										styles.filterText,
										selectedFilter === muscle && styles.filterTextActive,
									]}
								>
									{getFilterLabel(muscle)}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				{/* Активность - календарь на месяц */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Активность за месяц</Text>
						<Text style={styles.monthLabel}>
							{MONTHS[new Date().getMonth()]} {new Date().getFullYear()}
						</Text>
					</View>
					<View style={styles.calendar}>
						{/* Дни недели */}
						<View style={styles.weekDays}>
							{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
								<Text key={day} style={styles.weekDay}>
									{day}
								</Text>
							))}
						</View>

						{/* Дни месяца */}
						<View style={styles.monthDays}>
							{monthDays.map((dayData, index) => (
								<View key={index} style={styles.calendarDay}>
									{dayData.day ? (
										<>
											<View
												style={[
													styles.dayCircle,
													dayData.hasWorkout && styles.dayCircleActive,
												]}
											>
												<Text
													style={[
														styles.dayNumber,
														dayData.hasWorkout && styles.dayNumberActive,
													]}
												>
													{dayData.day}
												</Text>
											</View>
											{dayData.hasWorkout && <View style={styles.dayDot} />}
										</>
									) : (
										<View style={styles.emptyDay} />
									)}
								</View>
							))}
						</View>
					</View>
				</View>

				{/* Список тренировок */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Последние тренировки</Text>
						<TouchableOpacity>
							<Text style={styles.seeAll}>Все →</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={filteredWorkouts}
						renderItem={renderWorkoutCard}
						keyExtractor={item => item.id}
						scrollEnabled={false}
						contentContainerStyle={styles.workoutList}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const { width } = Dimensions.get('window')
const DAY_SIZE = (width - 80) / 7

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0A0A0A',
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
		color: '#FFFFFF',
	},
	subtitle: {
		fontSize: 16,
		color: '#8E8E93',
		marginTop: 4,
	},
	exportButton: {
		padding: 8,
	},
	statsOverview: {
		paddingHorizontal: 20,
		marginTop: 20,
	},
	streakCard: {
		backgroundColor: '#1C1C1E',
		borderRadius: 20,
		padding: 20,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#FF9500',
		shadowColor: '#FF9500',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 10,
	},
	streakIconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: 'rgba(255, 149, 0, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	streakNumber: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#FF9500',
		marginBottom: 2,
	},
	streakLabel: {
		fontSize: 14,
		color: '#8E8E93',
		fontWeight: '500',
	},
	section: {
		marginTop: 24,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	monthLabel: {
		fontSize: 14,
		color: '#8E8E93',
		fontWeight: '500',
	},
	seeAll: {
		fontSize: 14,
		color: '#00ff1eff',
		fontWeight: '600',
	},
	calendar: {
		backgroundColor: '#1C1C1E',
		marginHorizontal: 20,
		borderRadius: 20,
		padding: 16,
	},
	weekDays: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	weekDay: {
		width: DAY_SIZE,
		textAlign: 'center',
		fontSize: 12,
		color: '#8E8E93',
		fontWeight: '500',
	},
	monthDays: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	calendarDay: {
		width: DAY_SIZE,
		height: DAY_SIZE + 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 4,
	},
	dayCircle: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#2C2C2E',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 4,
	},
	dayCircleActive: {
		backgroundColor: '#3fb55aff',
	},
	dayNumber: {
		fontSize: 14,
		fontWeight: '600',
		color: '#8E8E93',
	},
	dayNumberActive: {
		color: '#FFFFFF',
	},
	dayDot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#34C759',
	},
	emptyDay: {
		width: 32,
		height: 32,
	},
	filtersContainer: {
		paddingLeft: 20,
		paddingRight: 10,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: '#1C1C1E',
		borderRadius: 20,
		marginRight: 8,
		borderWidth: 1,
		borderColor: '#2C2C2E',
	},
	filterButtonActive: {
		backgroundColor: '#00ff2aff',
		borderColor: '#00ff2fff',
	},
	filterText: {
		fontSize: 14,
		color: '#8E8E93',
		fontWeight: '500',
	},
	filterTextActive: {
		color: '#FFFFFF',
	},
	workoutList: {
		paddingHorizontal: 20,
	},
	workoutCard: {
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
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
		color: '#FFFFFF',
	},
	workoutTime: {
		fontSize: 14,
		color: '#8E8E93',
		marginTop: 2,
	},
	workoutTypeBadge: {
		backgroundColor: 'rgba(0, 255, 72, 0.2)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	workoutTypeText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#00ff3cff',
	},
	muscleGroups: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 12,
	},
	muscleTag: {
		backgroundColor: '#2C2C2E',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 8,
		marginBottom: 4,
	},
	muscleTagText: {
		fontSize: 12,
		color: '#8E8E93',
	},
	workoutStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#2C2C2E',
		paddingTop: 12,
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statText: {
		fontSize: 12,
		color: '#8E8E93',
		marginLeft: 4,
	},
})
