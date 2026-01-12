// app/(tabs)/history.tsx
import { useDatabase } from '@/app/contexts/database-context'
import { formatDate } from '@/scripts/database'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


// Константы для цветов
const COLORS = {
	primary: '#34C759',
	background: '#121212',
	card: '#1C1C1E',
	border: '#2C2C2E',
	text: '#FFFFFF',
	textSecondary: '#8E8E93',
	accent: '#FF9500',
	success: '#34C759',
	warning: '#FF9500',
	error: '#FF3B30',
} as const

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

// Подкомпонент для карточки тренировки
interface WorkoutCardProps {
	workout: any
	onPress: (id: number) => void
}

const WorkoutCard: React.FC<WorkoutCardProps> = React.memo(
	({ workout, onPress }) => {
		const handlePress = useCallback(() => {
			onPress(workout.id)
		}, [workout.id, onPress])

		const muscleGroups =
			workout.muscle_groups?.split(',').map((g: string) => g.trim()) || []

		return (
			<TouchableOpacity
				onPress={handlePress}
				style={styles.workoutCard}
				activeOpacity={0.7}
			>
				<View style={styles.workoutHeader}>
					<View>
						<Text style={styles.workoutDate}>{formatDate(workout.date)}</Text>
						<Text style={styles.workoutTime}>{workout.time}</Text>
					</View>
					<View style={styles.workoutTypeBadge}>
						<Text style={styles.workoutTypeText}>{workout.type}</Text>
					</View>
				</View>

				<View style={styles.muscleGroups}>
					{muscleGroups.map((muscle: string, index: number) => (
						<View
							key={`${workout.id}-${muscle}-${index}`}
							style={styles.muscleTag}
						>
							<Text style={styles.muscleTagText}>{muscle}</Text>
						</View>
					))}
				</View>

				<View style={styles.workoutStats}>
					<View style={styles.statItem}>
						<Ionicons name='barbell' size={16} color={COLORS.textSecondary} />
						<Text style={styles.statText}>{workout.exercises_count} упр.</Text>
					</View>
					<View style={styles.statItem}>
						<Ionicons name='repeat' size={16} color={COLORS.textSecondary} />
						<Text style={styles.statText}>{workout.sets_count} подх.</Text>
					</View>
					<View style={styles.statItem}>
						<Ionicons name='time' size={16} color={COLORS.textSecondary} />
						<Text style={styles.statText}>{workout.duration} мин</Text>
					</View>
					<View style={styles.statItem}>
						<Ionicons
							name='trending-up'
							size={16}
							color={COLORS.textSecondary}
						/>
						<Text style={styles.statText}>{workout.volume} кг</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
)

// Подкомпонент для дня календаря
interface CalendarDayProps {
	dayData: any
	daySize: number
}

const CalendarDayComponent: React.FC<CalendarDayProps> = React.memo(
	({ dayData, daySize }) => {
		if (!dayData.day) {
			return (
				<View style={[styles.emptyDay, { width: daySize, height: daySize }]} />
			)
		}

		const today = new Date()
		const isToday =
			dayData.day === today.getDate() &&
			dayData.month === today.getMonth() &&
			dayData.year === today.getFullYear()

		return (
			<View
				style={[styles.calendarDay, { width: daySize, height: daySize + 10 }]}
			>
				<View
					style={[
						styles.dayCircle,
						dayData.hasWorkout && styles.dayCircleActive,
						isToday && styles.dayCircleToday,
					]}
				>
					<Text
						style={[
							styles.dayNumber,
							dayData.hasWorkout && styles.dayNumberActive,
							isToday && styles.dayNumberToday,
						]}
					>
						{dayData.day}
					</Text>
				</View>
				{dayData.hasWorkout && <View style={styles.dayDot} />}
			</View>
		)
	}
)

// Подкомпонент для кнопки фильтра
interface FilterButtonProps {
	muscle: string
	isActive: boolean
	onPress: (muscle: string) => void
}

const FilterButton: React.FC<FilterButtonProps> = React.memo(
	({ muscle, isActive, onPress }) => {
		const handlePress = useCallback(() => {
			onPress(muscle)
		}, [muscle, onPress])

		const getFilterLabel = useCallback((filter: string) => {
			if (filter === 'all') return 'Все мышцы'
			return filter
		}, [])

		return (
			<TouchableOpacity
				style={[styles.filterButton, isActive && styles.filterButtonActive]}
				onPress={handlePress}
				activeOpacity={0.7}
			>
				<Text style={[styles.filterText, isActive && styles.filterTextActive]}>
					{getFilterLabel(muscle)}
				</Text>
			</TouchableOpacity>
		)
	}
)

// Основной компонент
export default function HistoryTab() {
	const router = useRouter()
	const {
		workouts,
		stats,
		isLoading,
		refreshWorkouts,
		refreshStats,
		getWorkoutDetails,
	} = useDatabase()

	const [selectedFilter, setSelectedFilter] = useState('all')
	const [monthDays, setMonthDays] = useState<any[]>([])
	const [refreshing, setRefreshing] = useState(false)
	const [calendarWorkouts, setCalendarWorkouts] = useState<any[]>([])

	const { width } = Dimensions.get('window')
	const DAY_SIZE = (width - 80) / 7

	// Получаем все уникальные группы мышц из тренировок
	const muscleGroups = useMemo(() => {
		const groups = new Set<string>()
		workouts.forEach(workout => {
			const muscles =
				workout.muscle_groups?.split(',').map((g: string) => g.trim()) || []
			muscles.forEach((muscle: string) => {
				if (muscle) groups.add(muscle)
			})
		})
		return ['all', ...Array.from(groups)]
	}, [workouts])

	// Фильтруем тренировки по выбранной группе мышц
	const filteredWorkouts = useMemo(() => {
		if (selectedFilter === 'all') return workouts

		return workouts.filter(workout => {
			const muscles =
				workout.muscle_groups?.split(',').map((g: string) => g.trim()) || []
			return muscles.includes(selectedFilter)
		})
	}, [workouts, selectedFilter])

	// Генерируем календарь на текущий месяц с тренировками
	const generateMonthCalendar = useCallback((workouts: any[]): any[] => {
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth()

		const firstDay = new Date(year, month, 1)
		const lastDay = new Date(year, month + 1, 0)
		const daysInMonth = lastDay.getDate()
		const firstDayOfWeek = firstDay.getDay()

		const days: any[] = []

		// Добавляем пустые ячейки для дней предыдущего месяца
		for (let i = 0; i < firstDayOfWeek; i++) {
			days.push({ day: null, hasWorkout: false })
		}

		// Создаем массив дней месяца с тренировками
		const workoutDays = new Set<number>()
		workouts.forEach(workout => {
			const workoutDate = new Date(workout.date)
			if (
				workoutDate.getFullYear() === year &&
				workoutDate.getMonth() === month
			) {
				workoutDays.add(workoutDate.getDate())
			}
		})

		// Добавляем дни текущего месяца
		for (let day = 1; day <= daysInMonth; day++) {
			const hasWorkout = workoutDays.has(day)
			days.push({
				day,
				hasWorkout,
				month,
				year,
				date: new Date(year, month, day),
			})
		}

		return days
	}, [])

	const handleWorkoutPress = useCallback(
		async (id: number) => {
			try {
				const details = await getWorkoutDetails(id)
				router.push({
					pathname: '/(routes)/workout-details',
					params: { id: id.toString(), data: JSON.stringify(details) },
				} as any)
			} catch (error) {
				console.error('Error getting workout details:', error)
			}
		},
		[router, getWorkoutDetails]
	)

	const handleRedirectToFullHistory = useCallback(() => {
		router.push('/(routes)/full-history' as any)
	}, [router])

	const handleFilterPress = useCallback(
		(muscle: string) => {
			setSelectedFilter(muscle)
			refreshWorkouts(muscle === 'all' ? undefined : muscle)
		},
		[refreshWorkouts]
	)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		try {
			await Promise.all([
				refreshWorkouts(selectedFilter === 'all' ? undefined : selectedFilter),
				refreshStats(),
			])
		} catch (error) {
			console.error('Error refreshing:', error)
		} finally {
			setRefreshing(false)
		}
	}, [refreshWorkouts, refreshStats, selectedFilter])

	// Инициализация календаря при загрузке тренировок
	useEffect(() => {
		if (workouts.length > 0) {
			const calendar = generateMonthCalendar(workouts)
			setMonthDays(calendar)
			setCalendarWorkouts(workouts)
		}
	}, [workouts, generateMonthCalendar])

	// Рендер элементы для FlatList
	const renderWorkoutCard = useCallback(
		({ item }: { item: any }) => (
			<WorkoutCard workout={item} onPress={handleWorkoutPress} />
		),
		[handleWorkoutPress]
	)

	const renderCalendarDay = useCallback(
		({ item }: { item: any }) => (
			<CalendarDayComponent dayData={item} daySize={DAY_SIZE} />
		),
		[DAY_SIZE]
	)

	const renderFilterButton = useCallback(
		({ item }: { item: string }) => (
			<FilterButton
				muscle={item}
				isActive={selectedFilter === item}
				onPress={handleFilterPress}
			/>
		),
		[selectedFilter, handleFilterPress]
	)

	if (isLoading && !refreshing) {
		return (
			<SafeAreaView style={[styles.container, styles.centered]}>
				<ActivityIndicator size='large' color={COLORS.primary} />
				<Text style={styles.loadingText}>Загрузка данных...</Text>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={[]}
				renderItem={null}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={[COLORS.primary]}
						tintColor={COLORS.primary}
					/>
				}
				ListHeaderComponent={
					<>
						<View style={styles.header}>
							<View>
								<Text style={styles.title}>История тренировок</Text>
								<Text style={styles.subtitle}>Отслеживайте ваш прогресс</Text>
							</View>
							<TouchableOpacity style={styles.exportButton} activeOpacity={0.7}>
								<Ionicons
									name='download-outline'
									size={24}
									color={COLORS.primary}
								/>
							</TouchableOpacity>
						</View>

						{/* Статистика */}
						<View style={styles.statsOverview}>
							<View style={styles.streakCard}>
								<View style={styles.streakIconContainer}>
									<Ionicons name='flame' size={32} color={COLORS.accent} />
								</View>
								<View>
									<Text style={styles.streakNumber}>
										{stats?.streak_days || 0}
									</Text>
									<Text style={styles.streakLabel}>Дней подряд</Text>
								</View>
								<View style={styles.statsDivider} />
								<View>
									<Text style={styles.streakNumber}>{workouts.length}</Text>
									<Text style={styles.streakLabel}>Всего тренировок</Text>
								</View>
							</View>
						</View>

						{/* Фильтры по мышцам */}
						{muscleGroups.length > 1 && (
							<View style={styles.section}>
								<View style={styles.sectionHeader}>
									<Text style={styles.sectionTitle}>Фильтровать по мышцам</Text>
								</View>
								<FlatList
									data={muscleGroups}
									renderItem={renderFilterButton}
									keyExtractor={item => item}
									horizontal
									showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.filtersContainer}
									initialNumToRender={5}
									windowSize={5}
								/>
							</View>
						)}

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
								<FlatList
									data={monthDays}
									renderItem={renderCalendarDay}
									keyExtractor={(item, index) =>
										item.day ? `day-${item.day}` : `empty-${index}`
									}
									numColumns={7}
									scrollEnabled={false}
									contentContainerStyle={styles.monthDays}
									initialNumToRender={35}
								/>
							</View>
						</View>

						{/* Список тренировок */}
						<View style={styles.section}>
							<View style={styles.sectionHeader}>
								<Text style={styles.sectionTitle}>Последние тренировки</Text>
								<TouchableOpacity
									onPress={handleRedirectToFullHistory}
									activeOpacity={0.7}
								>
									<Text style={styles.seeAll}>Все →</Text>
								</TouchableOpacity>
							</View>
						</View>
					</>
				}
				ListFooterComponent={
					filteredWorkouts.length > 0 ? (
						<View style={styles.footer}>
							<FlatList
								data={filteredWorkouts}
								renderItem={renderWorkoutCard}
								keyExtractor={item => item.id.toString()}
								scrollEnabled={false}
								contentContainerStyle={styles.workoutList}
								initialNumToRender={3}
								maxToRenderPerBatch={5}
								windowSize={5}
							/>
						</View>
					) : (
						<View style={styles.emptyState}>
							<Ionicons
								name='barbell-outline'
								size={64}
								color={COLORS.textSecondary}
							/>
							<Text style={styles.emptyStateTitle}>Нет тренировок</Text>
							<Text style={styles.emptyStateText}>
								{selectedFilter === 'all'
									? 'Начните свою первую тренировку!'
									: `Нет тренировок для группы "${selectedFilter}"`}
							</Text>
							<TouchableOpacity
								style={styles.startWorkoutButton}
								onPress={() => router.push('/(tabs)/workout' as any)}
								activeOpacity={0.7}
							>
								<Text style={styles.startWorkoutButtonText}>
									Начать тренировку
								</Text>
							</TouchableOpacity>
						</View>
					)
				}
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={muscleGroups.length > 1 ? [2] : []}
				contentContainerStyle={styles.scrollContent}
				initialNumToRender={10}
				maxToRenderPerBatch={20}
				windowSize={21}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: COLORS.textSecondary,
	},
	scrollContent: {
		paddingBottom: 20,
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
		color: COLORS.text,
	},
	subtitle: {
		fontSize: 16,
		color: COLORS.textSecondary,
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
		backgroundColor: COLORS.card,
		borderRadius: 20,
		padding: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		borderWidth: 2,
		borderColor: COLORS.accent,
		shadowColor: COLORS.accent,
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
	},
	streakNumber: {
		fontSize: 28,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 2,
		textAlign: 'center',
	},
	streakLabel: {
		fontSize: 12,
		color: COLORS.textSecondary,
		fontWeight: '500',
		textAlign: 'center',
	},
	statsDivider: {
		width: 1,
		height: 40,
		backgroundColor: COLORS.border,
		marginHorizontal: 20,
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
		color: COLORS.text,
	},
	monthLabel: {
		fontSize: 14,
		color: COLORS.textSecondary,
		fontWeight: '500',
	},
	seeAll: {
		fontSize: 14,
		color: COLORS.primary,
		fontWeight: '600',
	},
	calendar: {
		backgroundColor: COLORS.card,
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
		fontSize: 12,
		color: COLORS.textSecondary,
		fontWeight: '500',
		flex: 1,
		textAlign: 'center',
	},
	monthDays: {
		width: '100%',
	},
	calendarDay: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 4,
	},
	dayCircle: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: COLORS.border,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 4,
	},
	dayCircleActive: {
		backgroundColor: COLORS.primary,
	},
	dayCircleToday: {
		borderWidth: 2,
		borderColor: COLORS.primary,
		backgroundColor: 'transparent',
	},
	dayNumber: {
		fontSize: 14,
		fontWeight: '600',
		color: COLORS.textSecondary,
	},
	dayNumberActive: {
		color: COLORS.text,
	},
	dayNumberToday: {
		color: COLORS.primary,
		fontWeight: 'bold',
	},
	dayDot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: COLORS.primary,
	},
	emptyDay: {
		marginBottom: 4,
	},
	filtersContainer: {
		paddingLeft: 20,
		paddingRight: 10,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: COLORS.card,
		borderRadius: 20,
		marginRight: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	filterButtonActive: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	filterText: {
		fontSize: 14,
		color: COLORS.textSecondary,
		fontWeight: '500',
	},
	filterTextActive: {
		color: COLORS.text,
	},
	footer: {
		paddingBottom: 40,
	},
	workoutList: {
		paddingHorizontal: 20,
	},
	workoutCard: {
		backgroundColor: COLORS.card,
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
		color: COLORS.text,
	},
	workoutTime: {
		fontSize: 14,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	workoutTypeBadge: {
		backgroundColor: 'rgba(52, 199, 89, 0.2)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	workoutTypeText: {
		fontSize: 12,
		fontWeight: '600',
		color: COLORS.primary,
	},
	muscleGroups: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 12,
	},
	muscleTag: {
		backgroundColor: COLORS.border,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 8,
		marginBottom: 4,
	},
	muscleTagText: {
		fontSize: 12,
		color: COLORS.textSecondary,
	},
	workoutStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
		paddingTop: 12,
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statText: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginLeft: 4,
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
		paddingHorizontal: 20,
	},
	emptyStateTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.text,
		marginTop: 16,
		marginBottom: 8,
	},
	emptyStateText: {
		fontSize: 16,
		color: COLORS.textSecondary,
		textAlign: 'center',
		marginBottom: 24,
	},
	startWorkoutButton: {
		backgroundColor: COLORS.primary,
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 12,
	},
	startWorkoutButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.text,
	},
})
