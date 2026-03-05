import * as db from '@/scripts/database'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react' // Добавлен useCallback
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
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

// Предустановленные замеры
const DEFAULT_MEASUREMENTS = [
	{ name: 'Вес', unit: 'кг' },
	{ name: 'Грудь', unit: 'см' },
	{ name: 'Талия', unit: 'см' },
	{ name: 'Бедра', unit: 'см' },
	{ name: 'Бицепс', unit: 'см' },
	{ name: 'Шея', unit: 'см' },
]

export default function StatisticsTab() {
	const router = useRouter()
	const [selectedMetric, setSelectedMetric] = useState('weight')

	// Состояния для данных
	const [weightHistoryData, setWeightHistoryData] = useState<any[]>([])
	const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(
		[],
	)
	const [progressStats, setProgressStats] = useState<ProgressStat[]>([])
	const [personalRecords, setPersonalRecords] = useState<any[]>([])
	const [loading, setLoading] = useState({
		measurements: true,
		stats: true,
		records: true,
		weight: true,
	})

	// Состояния для модального окна замеров
	const [measurementModalVisible, setMeasurementModalVisible] = useState(false)
	const [currentMeasurements, setCurrentMeasurements] = useState<
		Array<{ name: string; value: string; unit: string }>
	>(DEFAULT_MEASUREMENTS.map(m => ({ ...m, value: '' })))

	// Загрузка данных при фокусе на странице
	useFocusEffect(
		useCallback(() => {
			loadAllData()
			checkMeasurementReminder()

			// Очистка при размонтировании (опционально)
			return () => {
				// Здесь можно выполнить очистку, если нужно
			}
		}, []),
	)

	// Проверка, нужно ли показывать напоминание о замерах
	const checkMeasurementReminder = async () => {
		try {
			const lastReminderDate = await AsyncStorage.getItem(
				'lastMeasurementReminder',
			)
			const lastMeasurementDate = await AsyncStorage.getItem(
				'lastMeasurementDate',
			)
			const today = new Date().toISOString().split('T')[0]

			// Проверяем, сегодня ли воскресенье (0 - воскресенье)
			const isSunday = new Date().getDay() === 0

			if (isSunday && lastMeasurementDate !== today) {
				// Проверяем, показывали ли уже напоминание сегодня
				if (lastReminderDate !== today) {
					setMeasurementModalVisible(true)
					await AsyncStorage.setItem('lastMeasurementReminder', today)
				}
			}
		} catch (error) {
			console.error('Error checking measurement reminder:', error)
		}
	}

	// Расчет роста мышц на основе замеров тела
	const calculateMuscleGrowth = (
		measurements: BodyMeasurement[],
	): {
		value: string
		subtitle: string
		trend: 'positive' | 'negative' | 'neutral'
	} => {
		if (measurements.length === 0) {
			return {
				value: '0 кг',
				subtitle: 'нет данных',
				trend: 'neutral',
			}
		}

		// Ищем замеры мышц (грудь, бицепс, бедра)
		const muscleMeasurements = measurements.filter(m =>
			['Грудь', 'Бицепс', 'Бедра', 'Шея'].includes(m.name),
		)

		if (muscleMeasurements.length === 0) {
			return {
				value: '0 кг',
				subtitle: 'нет замеров мышц',
				trend: 'neutral',
			}
		}

		// Для простоты берем среднее изменение (в реальности нужна более сложная логика)
		const totalChange = muscleMeasurements.reduce((sum, m) => {
			// Предполагаем, что в previous хранится предыдущее значение
			// В текущей структуре нужно получить предыдущие замеры
			return sum + (m.trend === 'up' ? 0.5 : m.trend === 'down' ? -0.5 : 0)
		}, 0)

		const avgChange = totalChange / muscleMeasurements.length

		if (avgChange > 0) {
			return {
				value: `+${avgChange.toFixed(1)} кг`,
				subtitle: 'рост мышечной массы',
				trend: 'positive',
			}
		} else if (avgChange < 0) {
			return {
				value: `${avgChange.toFixed(1)} кг`,
				subtitle: 'снижение массы',
				trend: 'negative',
			}
		} else {
			return {
				value: '0 кг',
				subtitle: 'без изменений',
				trend: 'neutral',
			}
		}
	}

	// Расчет прогресса силы на основе рекордов
	const calculateStrengthProgress = async (): Promise<{
		value: string
		subtitle: string
		trend: 'positive' | 'negative' | 'neutral'
	}> => {
		try {
			const records = await db.getPersonalRecords()
			if (records.length === 0) {
				return {
					value: '0%',
					subtitle: 'нет рекордов',
					trend: 'neutral',
				}
			}

			// Берем только силовые рекорды
			const strengthRecords = records.filter(r => r.category === 'strength')

			if (strengthRecords.length === 0) {
				return {
					value: '0%',
					subtitle: 'нет силовых рекордов',
					trend: 'neutral',
				}
			}

			// Анализируем тренды
			const positiveTrends = strengthRecords.filter(
				r => r.trend === 'up',
			).length
			const totalRecords = strengthRecords.length
			const progressPercent = Math.round((positiveTrends / totalRecords) * 100)

			if (progressPercent > 50) {
				return {
					value: `+${progressPercent}%`,
					subtitle: `улучшение ${positiveTrends}/${totalRecords}`,
					trend: 'positive',
				}
			} else if (progressPercent < 30) {
				return {
					value: `${progressPercent}%`,
					subtitle: `ухудшение ${positiveTrends}/${totalRecords}`,
					trend: 'negative',
				}
			} else {
				return {
					value: `${progressPercent}%`,
					subtitle: `стабильно ${positiveTrends}/${totalRecords}`,
					trend: 'neutral',
				}
			}
		} catch (error) {
			console.error('Error calculating strength progress:', error)
			return {
				value: '0%',
				subtitle: 'ошибка расчета',
				trend: 'neutral',
			}
		}
	}

	// Расчет выносливости на основе тренировок
	const calculateEnduranceProgress = (
		workouts: any[],
	): {
		value: string
		subtitle: string
		trend: 'positive' | 'negative' | 'neutral'
	} => {
		if (workouts.length === 0) {
			return {
				value: '0%',
				subtitle: 'нет тренировок',
				trend: 'neutral',
			}
		}

		// Берем последние 10 тренировок для анализа
		const recentWorkouts = workouts.slice(0, 10)

		// Рассчитываем среднюю продолжительность тренировок
		const avgDuration =
			recentWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) /
			recentWorkouts.length

		// Рассчитываем изменение продолжительности
		if (recentWorkouts.length >= 2) {
			const firstWorkout = recentWorkouts[recentWorkouts.length - 1]
			const lastWorkout = recentWorkouts[0]
			const durationChange =
				((lastWorkout.duration - firstWorkout.duration) /
					firstWorkout.duration) *
				100

			if (durationChange > 10) {
				return {
					value: `+${Math.round(durationChange)}%`,
					subtitle: 'рост выносливости',
					trend: 'positive',
				}
			} else if (durationChange < -10) {
				return {
					value: `${Math.round(durationChange)}%`,
					subtitle: 'снижение выносливости',
					trend: 'negative',
				}
			} else {
				return {
					value: `${Math.round(durationChange)}%`,
					subtitle: 'стабильная выносливость',
					trend: 'neutral',
				}
			}
		}

		return {
			value: `${Math.round(avgDuration)} мин`,
			subtitle: 'средняя продолжительность',
			trend: avgDuration > 60 ? 'positive' : 'neutral',
		}
	}

	const loadAllData = async () => {
		try {
			// Сбросить состояния загрузки
			setLoading({
				measurements: true,
				stats: true,
				records: true,
				weight: true,
			})

			// Загружаем замеры тела - последние 10 уникальных
			const measurements = await db.getBodyMeasurements()
			// Группируем по имени и берем последний замер для каждого
			const groupedMeasurements = new Map()
			measurements.forEach(m => {
				if (
					!groupedMeasurements.has(m.name) ||
					new Date(m.date) > new Date(groupedMeasurements.get(m.name).date)
				) {
					groupedMeasurements.set(m.name, m)
				}
			})
			// Берем последние 10 уникальных замеров
			const latestMeasurements = Array.from(groupedMeasurements.values())
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
				.slice(0, 10)

			const formattedMeasurements = latestMeasurements.map((m, index) => {
				let trend: 'up' | 'down' | 'stable' = 'stable'
				if (m.trend === 'up' || m.trend === 'down' || m.trend === 'stable') {
					trend = m.trend
				}

				return {
					id: m.id?.toString() || index.toString(),
					name: m.name,
					current: m.value,
					previous: m.value, // В реальности нужно получить предыдущее значение
					unit: m.unit,
					trend,
				}
			})
			setBodyMeasurements(formattedMeasurements)
			setLoading(prev => ({ ...prev, measurements: false }))

			// Загружаем историю веса
			const weightMeasurements = measurements.filter(m =>
				m.name.toLowerCase().includes('вес'),
			)

			// Форматируем для графика
			const formattedWeightHistory = weightMeasurements.map((m, index) => {
				const date = new Date(m.date)
				const months = [
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
				return {
					month: months[date.getMonth()],
					weight: m.value,
				}
			})
			setWeightHistoryData(formattedWeightHistory.slice(0, 6))
			setLoading(prev => ({ ...prev, weight: false }))

			// Загружаем рекорды
			const records = await db.getPersonalRecords()
			const formattedRecords = records.map((r, index) => {
				let trend: 'up' | 'down' | 'stable' = 'stable'
				if (r.trend === 'up' || r.trend === 'down' || r.trend === 'stable') {
					trend = r.trend
				}

				return {
					id: r.id?.toString() || index.toString(),
					exercise: r.exercise,
					weight: r.weight,
					date: db.formatDate(r.date) || r.date,
					trend,
				}
			})
			setPersonalRecords(formattedRecords.slice(0, 6))
			setLoading(prev => ({ ...prev, records: false }))

			// Загружаем статистику тренировок
			const stats = await db.getWorkoutStats()
			const allWorkouts = await db.getWorkouts()

			// Рассчитываем реальные показатели
			const muscleGrowth = calculateMuscleGrowth(bodyMeasurements)
			const strengthProgress = await calculateStrengthProgress()
			const enduranceProgress = calculateEnduranceProgress(allWorkouts)
			const totalVolume = stats.total_volume
				? `${(stats.total_volume / 1000).toFixed(1)} т`
				: '0 т'

			// Форматируем статистику прогресса
			const formattedStats: ProgressStat[] = [
				{
					id: '1',
					title: 'Общий вес',
					value: totalVolume,
					subtitle: 'общий тоннаж',
					icon: 'scale',
					trend: 'positive',
				},
				{
					id: '2',
					title: 'Мышцы',
					value: muscleGrowth.value,
					subtitle: muscleGrowth.subtitle,
					icon: 'fitness',
					trend: muscleGrowth.trend,
				},
				{
					id: '3',
					title: 'Сила',
					value: strengthProgress.value,
					subtitle: strengthProgress.subtitle,
					icon: 'barbell',
					trend: strengthProgress.trend,
				},
				{
					id: '4',
					title: 'Выносливость',
					value: enduranceProgress.value,
					subtitle: enduranceProgress.subtitle,
					icon: 'speedometer',
					trend: enduranceProgress.trend,
				},
			]
			setProgressStats(formattedStats)
			setLoading(prev => ({ ...prev, stats: false }))
		} catch (error) {
			console.error('Error loading statistics data:', error)
			// В случае ошибки тоже сбрасываем состояния загрузки
			setLoading({
				measurements: false,
				stats: false,
				records: false,
				weight: false,
			})
		}
	}

	const handleAddMeasurement = () => {
		router.push('/(auth)/statistics/add')
	}

	const handleRedirectToRecordsHistory = () => {
		router.push({
			pathname: '/(routes)/records-history',
		})
	}

	const handleRedirectToMeasurementsHistory = () => {
		router.push({
			pathname: '/(routes)/measurements-history',
		})
	}

	// Сохранение замеров
	const handleSaveMeasurements = async () => {
		try {
			const today = new Date().toISOString().split('T')[0]

			for (const measurement of currentMeasurements) {
				if (measurement.value.trim()) {
					// Рассчитываем тренд на основе предыдущих значений
					const previousMeasurement = await db
						.getBodyMeasurements()
						.then(
							measurements =>
								measurements
									.filter(m => m.name === measurement.name)
									.sort(
										(a, b) =>
											new Date(b.date).getTime() - new Date(a.date).getTime(),
									)[0],
						)

					let trend: 'up' | 'down' | 'stable' = 'stable'
					if (previousMeasurement) {
						const currentValue = parseFloat(measurement.value)
						if (currentValue > previousMeasurement.value) {
							trend = 'up'
						} else if (currentValue < previousMeasurement.value) {
							trend = 'down'
						}
					}

					await db.addBodyMeasurement({
						name: measurement.name,
						value: parseFloat(measurement.value),
						unit: measurement.unit,
						date: today,
						trend,
					})
				}
			}

			await AsyncStorage.setItem('lastMeasurementDate', today)
			setMeasurementModalVisible(false)
			setCurrentMeasurements(
				DEFAULT_MEASUREMENTS.map(m => ({ ...m, value: '' })),
			)
			Alert.alert('Успех', 'Замеры сохранены!')
			// Перезагружаем данные
			loadAllData()
		} catch (error) {
			console.error('Error saving measurements:', error)
			Alert.alert('Ошибка', 'Не удалось сохранить замеры')
		}
	}

	const handleSkipMeasurements = async () => {
		const today = new Date().toISOString().split('T')[0]
		await AsyncStorage.setItem('lastMeasurementReminder', today)
		setMeasurementModalVisible(false)
	}

	// Простая визуализация графика веса
	const renderWeightChart = () => {
		if (weightHistoryData.length === 0) {
			return (
				<View style={styles.emptyChart}>
					<Ionicons name='stats-chart' size={48} color='#8E8E93' />
					<Text style={styles.emptyChartText}>Нет данных о весе</Text>
					<Text style={styles.emptyChartSubtext}>Добавьте замеры веса</Text>
				</View>
			)
		}

		const maxWeight = Math.max(...weightHistoryData.map(d => d.weight))
		const minWeight = Math.min(...weightHistoryData.map(d => d.weight))
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
					{weightHistoryData.map((item, index) => {
						const height =
							range > 0 ? ((item.weight - minWeight) / range) * 150 : 75
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

	const calculateCurrentWeight = () => {
		if (weightHistoryData.length === 0) return '0 кг'
		return `${weightHistoryData[0].weight} кг`
	}

	const calculateWeightChange = () => {
		if (weightHistoryData.length < 2) return '0 кг'
		const current = weightHistoryData[0].weight
		const previous = weightHistoryData[weightHistoryData.length - 1].weight
		const change = current - previous
		return `${change > 0 ? '+' : ''}${change.toFixed(1)} кг`
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
							{/* <TouchableOpacity
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
							</TouchableOpacity> */}
						</View>
					</View>
					<View style={styles.currentValueIndicator}>
						<Text style={styles.currentValueText}>
							{selectedMetric === 'weight'
								? calculateCurrentWeight()
								: 'Средний рост: 12%'}
						</Text>
						<View style={styles.trendIndicator}>
							<Ionicons name='arrow-down' size={12} color='#34C759' />
							<Text style={styles.trendText}>
								{selectedMetric === 'weight'
									? calculateWeightChange()
									: '+15% за год'}
							</Text>
						</View>
					</View>
					<View style={styles.chartWrapper}>
						{selectedMetric === 'weight' && renderWeightChart()}
					</View>
				</View>

				{/* Быстрая статистика */}
				{/* <View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Общие показатели</Text>
					</View>
					<View style={styles.measurementsGrid}>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.statsContainer}
						>
							{loading.stats ? (
								<View style={styles.loadingContainer}>
									<ActivityIndicator size='small' color='#34C759' />
								</View>
							) : (
								progressStats.map(stat => (
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
								))
							)}
						</ScrollView>
					</View>
				</View> */}

				{/* Замеры тела */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Замеры тела</Text>
						<TouchableOpacity onPress={handleRedirectToMeasurementsHistory}>
							<Text style={styles.seeAll}>История</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.measurementsGrid}>
						{loading.measurements ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size='small' color='#34C759' />
							</View>
						) : bodyMeasurements.length === 0 ? (
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyText}>Нет замеров</Text>
							</View>
						) : (
							bodyMeasurements.map(item => (
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
								</View>
							))
						)}
					</View>
				</View>

				{/* Личные рекорды */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Личные рекорды</Text>
						<TouchableOpacity onPress={handleRedirectToRecordsHistory}>
							<Text style={styles.seeAll}>Все рекорды</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.recordsGrid}>
						{loading.records ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size='small' color='#34C759' />
							</View>
						) : personalRecords.length === 0 ? (
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyText}>Нет рекордов</Text>
							</View>
						) : (
							personalRecords.map(record => (
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
							))
						)}
					</View>
				</View>
			</ScrollView>

			{/* Модальное окно для еженедельных замеров */}
			<Modal
				animationType='slide'
				transparent={true}
				visible={measurementModalVisible}
				onRequestClose={() => setMeasurementModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Еженедельные замеры</Text>
							<Text style={styles.modalSubtitle}>
								Пришло время для еженедельных замеров тела
							</Text>
						</View>

						<ScrollView style={styles.measurementsInputContainer}>
							{currentMeasurements.map((measurement, index) => (
								<View key={index} style={styles.measurementInputRow}>
									<Text style={styles.measurementLabel}>
										{measurement.name} ({measurement.unit})
									</Text>
									<TextInput
										style={styles.measurementInput}
										value={measurement.value}
										onChangeText={text => {
											const newMeasurements = [...currentMeasurements]
											newMeasurements[index].value = text
											setCurrentMeasurements(newMeasurements)
										}}
										placeholder='Введите значение'
										placeholderTextColor='#8E8E93'
										keyboardType='numeric'
									/>
								</View>
							))}
						</ScrollView>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[styles.modalButton, styles.skipButton]}
								onPress={handleSkipMeasurements}
							>
								<Text style={styles.skipButtonText}>Пропустить</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.saveButton]}
								onPress={handleSaveMeasurements}
							>
								<Text style={styles.saveButtonText}>Сохранить</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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
		paddingHorizontal: 10,
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
	section: {
		marginTop: 24,
		paddingHorizontal: 10,
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
		width: 180,
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
	recordsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	recordCard: {
		width: '100%',
		backgroundColor: '#1E1E1E',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
	},
	recordHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
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
	emptyChart: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	emptyChartText: {
		fontSize: 16,
		color: '#FFFFFF',
		marginTop: 12,
	},
	emptyChartSubtext: {
		fontSize: 14,
		color: '#8E8E93',
		marginTop: 4,
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	emptyContainer: {
		width: '100%',
		alignItems: 'center',
		padding: 20,
	},
	emptyText: {
		color: '#8E8E93',
		fontSize: 14,
	},
	// Стили для модального окна
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalContent: {
		backgroundColor: '#1E1E1E',
		borderRadius: 20,
		padding: 20,
		width: '100%',
		maxHeight: '80%',
	},
	modalHeader: {
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 8,
	},
	modalSubtitle: {
		fontSize: 16,
		color: '#B0B0B0',
	},
	measurementsInputContainer: {
		maxHeight: 300,
		marginBottom: 20,
	},
	measurementInputRow: {
		marginBottom: 16,
	},
	measurementLabel: {
		fontSize: 16,
		color: '#FFFFFF',
		marginBottom: 8,
	},
	measurementInput: {
		backgroundColor: '#2C2C2E',
		borderRadius: 8,
		padding: 12,
		color: '#FFFFFF',
		fontSize: 16,
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	modalButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	skipButton: {
		backgroundColor: 'transparent',
		marginRight: 8,
		borderWidth: 1,
		borderColor: '#8E8E93',
	},
	saveButton: {
		backgroundColor: '#34C759',
		marginLeft: 8,
	},
	skipButtonText: {
		color: '#8E8E93',
		fontSize: 16,
		fontWeight: '600',
	},
	saveButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
	},
})
