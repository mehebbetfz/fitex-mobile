import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Типы для данных
interface WeightRecord {
	id: string
	date: string
	weight: number
	change: number
}

interface BodyMeasurement {
	id: string
	name: string
	current: number
	previous: number
	unit: string
	trend: 'up' | 'down' | 'stable'
}

interface ProgressStat {
	id: string
	title: string
	value: string
	subtitle: string
	icon: string
	trend: 'positive' | 'negative' | 'neutral'
}

const screenWidth = Dimensions.get('window').width

// Моковые данные для статистики
const WEIGHT_HISTORY_DATA = [
	{ month: 'Янв', weight: 78.5 },
	{ month: 'Фев', weight: 77.8 },
	{ month: 'Мар', weight: 76.3 },
	{ month: 'Апр', weight: 75.7 },
	{ month: 'Май', weight: 75.2 },
	{ month: 'Июн', weight: 74.8 },
]

const BODY_MEASUREMENTS: BodyMeasurement[] = [
	{
		id: '1',
		name: 'Грудь',
		current: 102,
		previous: 104,
		unit: 'см',
		trend: 'down',
	},
	{
		id: '2',
		name: 'Талия',
		current: 84,
		previous: 87,
		unit: 'см',
		trend: 'down',
	},
	{
		id: '3',
		name: 'Бедра',
		current: 95,
		previous: 93,
		unit: 'см',
		trend: 'up',
	},
	{
		id: '4',
		name: 'Бицепс',
		current: 38,
		previous: 36,
		unit: 'см',
		trend: 'up',
	},
	{
		id: '5',
		name: 'Трицепс',
		current: 35,
		previous: 33,
		unit: 'см',
		trend: 'up',
	},
	{
		id: '6',
		name: 'Шея',
		current: 40,
		previous: 41,
		unit: 'см',
		trend: 'down',
	},
	{ id: '7', name: 'Икры', current: 42, previous: 40, unit: 'см', trend: 'up' },
	{
		id: '8',
		name: 'Плечо',
		current: 45,
		previous: 43,
		unit: 'см',
		trend: 'up',
	},
]

const PROGRESS_STATS: ProgressStat[] = [
	{
		id: '1',
		title: 'Общий вес',
		value: '-3.7 кг',
		subtitle: 'за 6 месяцев',
		icon: 'scale',
		trend: 'positive',
	},
	{
		id: '2',
		title: 'Жир',
		value: '18.5%',
		subtitle: '-4.0% за 6 мес',
		icon: 'water',
		trend: 'positive',
	},
	{
		id: '3',
		title: 'Мышцы',
		value: '+4.1 кг',
		subtitle: 'прирост массы',
		icon: 'fitness',
		trend: 'positive',
	},
	{
		id: '4',
		title: 'ИМТ',
		value: '23.4',
		subtitle: 'нормальный вес',
		icon: 'analytics',
		trend: 'positive',
	},
	{
		id: '5',
		title: 'Сила',
		value: '+27%',
		subtitle: 'рост за 3 мес',
		icon: 'barbell',
		trend: 'positive',
	},
	{
		id: '6',
		title: 'Выносливость',
		value: '+35%',
		subtitle: 'улучшение',
		icon: 'speedometer',
		trend: 'positive',
	},
]

const RECORDS = [
	{
		id: '1',
		exercise: 'Жим лежа',
		weight: '120 кг',
		date: '2 дня назад',
		trend: 'up',
	},
	{
		id: '2',
		exercise: 'Присед',
		weight: '160 кг',
		date: 'неделю назад',
		trend: 'up',
	},
	{
		id: '3',
		exercise: 'Становая',
		weight: '180 кг',
		date: '3 дня назад',
		trend: 'stable',
	},
	{
		id: '4',
		exercise: 'Подтягивания',
		weight: '+30 кг',
		date: 'месяц назад',
		trend: 'up',
	},
	{
		id: '5',
		exercise: 'Бег 5км',
		weight: '22:15',
		date: 'неделю назад',
		trend: 'up',
	},
	{
		id: '6',
		exercise: 'Отжимания',
		weight: '45 раз',
		date: '5 дней назад',
		trend: 'up',
	},
]

const WORKOUT_HISTORY = [
	{
		id: '1',
		date: 'Сегодня',
		type: 'Силовая',
		duration: '60 мин',
		calories: 520,
	},
	{ id: '2', date: 'Вчера', type: 'Кардио', duration: '45 мин', calories: 380 },
	{
		id: '3',
		date: '2 дня назад',
		type: 'Восстановление',
		duration: '30 мин',
		calories: 180,
	},
	{
		id: '4',
		date: '3 дня назад',
		type: 'Силовая',
		duration: '75 мин',
		calories: 610,
	},
]

export default function StatisticsTab() {
	const router = useRouter()
	const [activeChart, setActiveChart] = useState<'weight' | 'fat' | 'muscle'>(
		'weight'
	)
	const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
	const [selectedMetric, setSelectedMetric] = useState('weight')

	const handleAddMeasurement = () => {
		router.push('/(auth)/statistics/add')
	}

	// Простая визуализация графика веса
	const renderWeightChart = () => {
		const maxWeight = Math.max(...WEIGHT_HISTORY_DATA.map(d => d.weight))
		const minWeight = Math.min(...WEIGHT_HISTORY_DATA.map(d => d.weight))
		const range = maxWeight - minWeight

		return (
			<View style={styles.chartContainer}>
				<View style={styles.chartYAxis}>
					<Text style={styles.chartYLabel}>{maxWeight.toFixed(1)}</Text>
					<Text style={styles.chartYLabel}>
						{((maxWeight + minWeight) / 2).toFixed(1)}
					</Text>
					<Text style={styles.chartYLabel}>{minWeight.toFixed(1)}</Text>
				</View>
				<View style={styles.chartContent}>
					{WEIGHT_HISTORY_DATA.map((item, index) => {
						const height = ((item.weight - minWeight) / range) * 150
						return (
							<View key={index} style={styles.chartColumn}>
								<View style={[styles.chartBar, { height }]} />
								<Text style={styles.chartXLabel}>{item.month}</Text>
								<Text style={styles.chartValue}>{item.weight}</Text>
							</View>
						)
					})}
				</View>
			</View>
		)
	}

	// Простая визуализация кругового графика
	const renderProgressChart = () => {
		const progressData = [
			{ label: 'Вес', value: 80, color: '#34C759' },
			{ label: 'Сила', value: 65, color: '#FF9500' },
			{ label: 'Вынос', value: 90, color: '#5856D6' },
			{ label: 'Гибкость', value: 50, color: '#FF2D55' },
		]

		return (
			<View style={styles.progressChartContainer}>
				<View style={styles.progressChartRow}>
					{progressData.slice(0, 2).map((item, index) => (
						<View key={index} style={styles.progressCircleContainer}>
							<View style={styles.progressCircleOuter}>
								<View
									style={[
										styles.progressCircleInner,
										{
											height: `${item.value}%`,
											backgroundColor: item.color,
										},
									]}
								/>
							</View>
							<Text style={styles.progressCircleLabel}>{item.label}</Text>
							<Text style={styles.progressCircleValue}>{item.value}%</Text>
						</View>
					))}
				</View>
				<View style={styles.progressChartRow}>
					{progressData.slice(2, 4).map((item, index) => (
						<View key={index} style={styles.progressCircleContainer}>
							<View style={styles.progressCircleOuter}>
								<View
									style={[
										styles.progressCircleInner,
										{
											height: `${item.value}%`,
											backgroundColor: item.color,
										},
									]}
								/>
							</View>
							<Text style={styles.progressCircleLabel}>{item.label}</Text>
							<Text style={styles.progressCircleValue}>{item.value}%</Text>
						</View>
					))}
				</View>
			</View>
		)
	}

	// График процента жира
	const renderFatChart = () => {
		const fatData = [
			{ month: 'Янв', fat: 22.5 },
			{ month: 'Фев', fat: 21.8 },
			{ month: 'Мар', fat: 20.5 },
			{ month: 'Апр', fat: 19.7 },
			{ month: 'Май', fat: 19.0 },
			{ month: 'Июн', fat: 18.5 },
		]

		const maxFat = Math.max(...fatData.map(d => d.fat))
		const minFat = Math.min(...fatData.map(d => d.fat))
		const range = maxFat - minFat

		return (
			<View style={styles.chartContainer}>
				<View style={styles.chartYAxis}>
					<Text style={styles.chartYLabel}>{maxFat.toFixed(1)}%</Text>
					<Text style={styles.chartYLabel}>
						{((maxFat + minFat) / 2).toFixed(1)}%
					</Text>
					<Text style={styles.chartYLabel}>{minFat.toFixed(1)}%</Text>
				</View>
				<View style={styles.chartContent}>
					{fatData.map((item, index) => {
						const height = ((item.fat - minFat) / range) * 150
						return (
							<View key={index} style={styles.chartColumn}>
								<View
									style={[
										styles.chartBar,
										{
											height,
											backgroundColor: '#0A84FF',
										},
									]}
								/>
								<Text style={styles.chartXLabel}>{item.month}</Text>
								<Text style={styles.chartValue}>{item.fat}%</Text>
							</View>
						)
					})}
				</View>
			</View>
		)
	}

	// Гистограмма мышечной массы
	const renderMuscleChart = () => {
		const muscleData = [
			{ muscle: 'Грудь', mass: 92 },
			{ muscle: 'Спина', mass: 88 },
			{ muscle: 'Ноги', mass: 95 },
			{ muscle: 'Плечи', mass: 80 },
			{ muscle: 'Руки', mass: 76 },
		]

		const maxMass = Math.max(...muscleData.map(d => d.mass))
		const minMass = Math.min(...muscleData.map(d => d.mass))
		const range = maxMass - minMass

		return (
			<View style={styles.chartContainer}>
				<View style={styles.chartYAxis}>
					<Text style={styles.chartYLabel}>{maxMass}</Text>
					<Text style={styles.chartYLabel}>
						{((maxMass + minMass) / 2).toFixed(0)}
					</Text>
					<Text style={styles.chartYLabel}>{minMass}</Text>
				</View>
				<View style={styles.chartContent}>
					{muscleData.map((item, index) => {
						const height = ((item.mass - minMass) / range) * 150
						return (
							<View key={index} style={styles.chartColumn}>
								<View
									style={[
										styles.chartBar,
										{
											height,
											backgroundColor: '#FF9500',
										},
									]}
								/>
								<Text style={styles.chartXLabel}>{item.muscle}</Text>
								<Text style={styles.chartValue}>{item.mass}</Text>
							</View>
						)
					})}
				</View>
			</View>
		)
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<View>
						<Text style={styles.greeting}>Статистика прогресса</Text>
						<Text style={styles.subtitle}>
							Вся информация о ваших результатах
						</Text>
					</View>
				</View>

				{/* Переключатель графиков */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Аналитика</Text>
						<View style={styles.metricSelector}>
							<TouchableOpacity
								style={[
									styles.metricButton,
									selectedMetric === 'weight' && styles.activeMetricButton,
								]}
								onPress={() => setSelectedMetric('weight')}
							>
								<Text
									style={[
										styles.metricText,
										selectedMetric === 'weight' && styles.activeMetricText,
									]}
								>
									Вес
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.metricButton,
									selectedMetric === 'fat' && styles.activeMetricButton,
								]}
								onPress={() => setSelectedMetric('fat')}
							>
								<Text
									style={[
										styles.metricText,
										selectedMetric === 'fat' && styles.activeMetricText,
									]}
								>
									Жир
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.metricButton,
									selectedMetric === 'muscle' && styles.activeMetricButton,
								]}
								onPress={() => setSelectedMetric('muscle')}
							>
								<Text
									style={[
										styles.metricText,
										selectedMetric === 'muscle' && styles.activeMetricText,
									]}
								>
									Мышцы
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.currentValueIndicator}>
						<Text style={styles.currentValueText}>
							{selectedMetric === 'weight'
								? '75.2 кг'
								: selectedMetric === 'fat'
								? '18.5%'
								: 'Средний рост: 12%'}
						</Text>
						<View style={styles.trendIndicator}>
							<Ionicons name='arrow-down' size={12} color='#34C759' />
							<Text style={styles.trendText}>
								{selectedMetric === 'weight'
									? '-3.7 кг'
									: selectedMetric === 'fat'
									? '-4.0%'
									: '+15% за год'}
							</Text>
						</View>
					</View>
					<View style={styles.chartWrapper}>
						{selectedMetric === 'weight' && renderWeightChart()}
						{selectedMetric === 'fat' && renderFatChart()}
						{selectedMetric === 'muscle' && renderMuscleChart()}
					</View>
				</View>

				{/* Быстрая статистика */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Общие показатели</Text>
					</View>
					<View style={styles.measurementsGrid}>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.statsContainer}
						>
							{PROGRESS_STATS.map(stat => (
								<View key={stat.id} style={styles.statCard}>
									<View style={styles.statHeader}>
										<Ionicons
											name={stat.icon as any}
											size={24}
											color='#34C759'
										/>
										<Text style={styles.statTitle}>{stat.title}</Text>
									</View>
									<Text style={styles.statValue}>{stat.value}</Text>
									<Text style={styles.statSubtitle}>{stat.subtitle}</Text>
								</View>
							))}
						</ScrollView>
					</View>
				</View>

				{/* Замеры тела */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Замеры тела</Text>
						<TouchableOpacity
							onPress={() => router.push('/(auth)/statistics/measurements')}
						>
							<Text style={styles.seeAll}>История</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.measurementsGrid}>
						{BODY_MEASUREMENTS.map(item => (
							<View key={item.id} style={styles.measurementGridItem}>
								<View style={styles.measurementHeader}>
									<Text style={styles.measurementName}>{item.name}</Text>
									<Ionicons
										name={
											item.trend === 'up'
												? 'arrow-up'
												: item.trend === 'down'
												? 'arrow-down'
												: 'remove'
										}
										size={16}
										color={
											item.trend === 'up'
												? '#34C759'
												: item.trend === 'down'
												? '#FF3B30'
												: '#8E8E93'
										}
									/>
								</View>
								<Text style={styles.measurementValue}>
									{item.current} {item.unit}
								</Text>
								<Text
									style={[
										styles.measurementChange,
										item.trend === 'up'
											? { color: '#34C759' }
											: item.trend === 'down'
											? { color: '#FF3B30' }
											: { color: '#8E8E93' },
									]}
								>
									{item.trend === 'up' ? '+' : ''}
									{item.current - item.previous} {item.unit}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Личные рекорды */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Личные рекорды</Text>
						<TouchableOpacity
							onPress={() => router.push('/(auth)/statistics/records')}
						>
							<Text style={styles.seeAll}>Все рекорды</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.recordsGrid}>
						{RECORDS.map(record => (
							<View key={record.id} style={styles.recordCard}>
								<View style={styles.recordHeader}>
									<Text style={styles.recordExercise}>{record.exercise}</Text>
									<View style={styles.recordWeightBadge}>
										<Text style={styles.recordWeight}>{record.weight}</Text>
									</View>
								</View>
								<View style={styles.recordFooter}>
									<Text style={styles.recordDate}>{record.date}</Text>
									<View
										style={[
											styles.trendBadge,
											record.trend === 'up'
												? { backgroundColor: '#34C759' }
												: record.trend === 'stable'
												? { backgroundColor: '#8E8E93' }
												: { backgroundColor: '#FF3B30' },
										]}
									>
										<Ionicons
											name={
												record.trend === 'up'
													? 'arrow-up'
													: record.trend === 'stable'
													? 'remove'
													: 'arrow-down'
											}
											size={16}
											color='#FFFFFF'
										/>
									</View>
								</View>
							</View>
						))}
					</View>
				</View>

				{/* История тренировок */}
				<View style={{ ...styles.section, marginBottom: 10 }}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>История тренировок</Text>
						<TouchableOpacity
							onPress={() => router.push('/(auth)/workout/history')}
						>
							<Text style={styles.seeAll}>Полная история</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.workoutHistory}>
						{WORKOUT_HISTORY.map(workout => (
							<View key={workout.id} style={styles.workoutItem}>
								<View style={styles.workoutInfo}>
									<Text style={styles.workoutDate}>{workout.date}</Text>
									<Text style={styles.workoutType}>{workout.type}</Text>
								</View>
								<View style={styles.workoutStats}>
									<View style={styles.workoutStat}>
										<Text style={styles.workoutStatValue}>
											{workout.duration}
										</Text>
										<Text style={styles.workoutStatLabel}>длительность</Text>
									</View>
									<View style={styles.workoutStat}>
										<Text style={styles.workoutStatValue}>
											{workout.calories}
										</Text>
										<Text style={styles.workoutStatLabel}>ккал</Text>
									</View>
								</View>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#121212',
		paddingBottom: -50,
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
		color: '#FFFFFF',
	},
	subtitle: {
		fontSize: 16,
		color: '#B0B0B0',
		marginTop: 4,
	},
	addButton: {
		padding: 4,
	},
	section: {
		marginTop: 24,
		paddingHorizontal: 20,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	seeAll: {
		fontSize: 14,
		color: '#34C759',
		fontWeight: '600',
	},
	metricSelector: {
		flexDirection: 'row',
		backgroundColor: '#1E1E1E',
		borderRadius: 20,
		padding: 4,
	},
	metricButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	activeMetricButton: {
		backgroundColor: '#34C759',
	},
	metricText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#B0B0B0',
	},
	activeMetricText: {
		color: '#FFFFFF',
	},
	chartWrapper: {
		backgroundColor: '#1E1E1E',
		borderRadius: 16,
		padding: 16,
		position: 'relative',
	},
	chartContainer: {
		flexDirection: 'row',
	},
	chartYAxis: {
		justifyContent: 'space-between',
		marginRight: 10,
		paddingVertical: 10,
	},
	chartYLabel: {
		fontSize: 10,
		color: '#8E8E93',
	},
	chartContent: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'flex-end',
		borderLeftWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#2C2C2E',
		paddingBottom: 20,
		paddingLeft: 10,
	},
	chartColumn: {
		alignItems: 'center',
		flex: 1,
	},
	chartBar: {
		width: 20,
		backgroundColor: '#34C759',
		borderRadius: 4,
		marginBottom: 8,
	},
	chartXLabel: {
		fontSize: 12,
		color: '#8E8E93',
		marginTop: 4,
	},
	chartValue: {
		fontSize: 10,
		color: '#B0B0B0',
		marginTop: 2,
	},
	currentValueIndicator: {
		backgroundColor: 'rgba(30, 30, 30, 0.9)',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 12,
		marginBottom: 10,
		alignItems: 'center',
	},
	currentValueText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	trendIndicator: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 2,
	},
	trendText: {
		fontSize: 12,
		color: '#34C759',
		fontWeight: '600',
		marginLeft: 4,
	},
	statsContainer: {
		paddingRight: 20,
	},
	statCard: {
		width: 160,
		backgroundColor: '#1E1E1E',
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
	},
	statHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	statTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		marginLeft: 8,
	},
	statValue: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#34C759',
		marginBottom: 4,
	},
	statSubtitle: {
		fontSize: 14,
		color: '#B0B0B0',
	},
	measurementsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	measurementGridItem: {
		width: '48%',
		backgroundColor: '#1E1E1E',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	measurementHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	measurementName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	measurementValue: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 4,
	},
	measurementChange: {
		fontSize: 12,
		fontWeight: '500',
	},
	recordsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	recordCard: {
		width: '48%',
		backgroundColor: '#1E1E1E',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
	},
	recordHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	recordExercise: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		flex: 1,
	},
	recordWeightBadge: {
		backgroundColor: '#34C759',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 12,
		marginLeft: 8,
	},
	recordWeight: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	recordFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	recordDate: {
		fontSize: 14,
		color: '#B0B0B0',
	},
	trendBadge: {
		width: 28,
		height: 28,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	workoutHistory: {
		backgroundColor: '#1E1E1E',
		borderRadius: 16,
		padding: 16,
	},
	workoutItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#2C2C2E',
	},
	workoutInfo: {
		flex: 1,
	},
	workoutDate: {
		fontSize: 14,
		color: '#B0B0B0',
		marginBottom: 4,
	},
	workoutType: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	workoutStats: {
		flexDirection: 'row',
	},
	workoutStat: {
		marginLeft: 16,
		alignItems: 'flex-end',
	},
	workoutStatValue: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#34C759',
	},
	workoutStatLabel: {
		fontSize: 12,
		color: '#8E8E93',
		marginTop: 2,
	},
	progressChartsContainer: {
		flexDirection: 'row',
	},
	progressChartWrapper: {
		flex: 2,
		backgroundColor: '#1E1E1E',
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
		justifyContent: 'center',
	},
	progressChartContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	progressChartRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginBottom: 20,
	},
	progressCircleContainer: {
		alignItems: 'center',
	},
	progressCircleOuter: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#2C2C2E',
		justifyContent: 'flex-end',
		overflow: 'hidden',
		marginBottom: 8,
	},
	progressCircleInner: {
		width: '100%',
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	progressCircleLabel: {
		fontSize: 12,
		color: '#B0B0B0',
		marginBottom: 2,
	},
	progressCircleValue: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	progressSummary: {
		flex: 1,
		justifyContent: 'space-around',
	},
	summaryItem: {
		backgroundColor: '#1E1E1E',
		borderRadius: 12,
		padding: 16,
	},
	summaryLabel: {
		fontSize: 14,
		color: '#B0B0B0',
		marginBottom: 4,
	},
	summaryValue: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
})
