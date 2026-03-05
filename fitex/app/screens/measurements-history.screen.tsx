import * as db from '@/scripts/database'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
	Alert,
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Measurement {
	id: string
	name: string
	value: number
	unit: string
	trend: 'up' | 'down' | 'stable'
	date: string
	change?: number
	goal?: number
	progress?: number
}

interface HistoryEntry {
	id: string
	date: string
	measurements: Array<{
		name: string
		value: string
		change: string
	}>
}

export default function MeasurementsHistoryScreen() {
	const router = useRouter()
	const [selectedTab, setSelectedTab] = useState<'current' | 'history'>(
		'current',
	)
	const [selectedMeasurement, setSelectedMeasurement] =
		useState<Measurement | null>(null)
	const [modalVisible, setModalVisible] = useState(false)

	const [currentMeasurements, setCurrentMeasurements] = useState<Measurement[]>(
		[],
	)
	const [historyData, setHistoryData] = useState<HistoryEntry[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			setLoading(true)

			// Загружаем текущие замеры
			const latestMeasurements = await db.getLatestBodyMeasurements()
			const formattedCurrentMeasurements: Measurement[] =
				latestMeasurements.map((m, index) => {
					// Находим предыдущее значение для расчета изменения
					const previousValue = 0 // В реальном приложении нужно получать предыдущее значение
					const change = m.value - previousValue

					return {
						id: m.id?.toString() || index.toString(),
						name: m.name,
						value: m.value,
						unit: m.unit,
						trend: m.trend,
						date: m.date,
						change,
						goal: m.goal,
						progress: m.goal ? (m.value / m.goal) * 100 : undefined,
					}
				})
			setCurrentMeasurements(formattedCurrentMeasurements)

			// Загружаем историю замеров
			const allMeasurements = await db.getBodyMeasurements()

			// Группируем измерения по дате
			const groupedByDate: Record<
				string,
				Array<{ name: string; value: number; unit: string }>
			> = {}

			allMeasurements.forEach(m => {
				if (!groupedByDate[m.date]) {
					groupedByDate[m.date] = []
				}
				groupedByDate[m.date].push({
					name: m.name,
					value: m.value,
					unit: m.unit,
				})
			})

			// Форматируем для отображения
			const formattedHistory: HistoryEntry[] = Object.entries(groupedByDate)
				.sort(
					([dateA], [dateB]) =>
						new Date(dateB).getTime() - new Date(dateA).getTime(),
				)
				.map(([date, measurements], index) => {
					// Находим предыдущие измерения для расчета изменений
					const previousDate = Object.keys(groupedByDate)[index + 1]
					const previousMeasurements = previousDate
						? groupedByDate[previousDate]
						: []

					const formattedMeasurements = measurements.map(m => {
						const previous = previousMeasurements.find(pm => pm.name === m.name)
						const change = previous ? m.value - previous.value : 0

						return {
							name: m.name,
							value: `${m.value} ${m.unit}`,
							change: `${change > 0 ? '+' : ''}${change.toFixed(1)} ${m.unit}`,
						}
					})

					return {
						id: index.toString(),
						date: formatDate(date),
						measurements: formattedMeasurements,
					}
				})

			setHistoryData(formattedHistory)
		} catch (error) {
			console.error('Error loading measurements:', error)
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${day}.${month}.${year}`
	}

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case 'up':
				return { name: 'arrow-up', color: '#34C759' }
			case 'down':
				return { name: 'arrow-down', color: '#FF3B30' }
			default:
				return { name: 'remove', color: '#8E8E93' }
		}
	}

	const getProgressColor = (progress?: number) => {
		if (!progress) return '#8E8E93'
		if (progress >= 80) return '#34C759'
		if (progress >= 50) return '#FF9500'
		return '#FF3B30'
	}

	const renderMeasurementItem = ({ item }: { item: Measurement }) => (
		<TouchableOpacity
			style={styles.measurementItem}
			onPress={() => {
				setSelectedMeasurement(item)
				setModalVisible(true)
			}}
		>
			<View style={styles.measurementHeader}>
				<Text style={styles.measurementName}>{item.name}</Text>
				<View style={styles.trendBadge}>
					<Ionicons
						name={getTrendIcon(item.trend).name as any}
						size={16}
						color={getTrendIcon(item.trend).color}
					/>
					<Text
						style={[
							styles.changeText,
							{ color: getTrendIcon(item.trend).color },
						]}
					>
						{item.change && item.change > 0 ? '+' : ''}
						{item.change?.toFixed(1)} {item.unit}
					</Text>
				</View>
			</View>

			<View style={styles.valuesContainer}>
				<View style={styles.valueColumn}>
					<Text style={styles.valueLabel}>Текущий</Text>
					<Text style={styles.currentValue}>
						{item.value} {item.unit}
					</Text>
				</View>
				{item.goal && (
					<View style={styles.valueColumn}>
						<Text style={styles.valueLabel}>Цель</Text>
						<Text style={styles.goalValue}>
							{item.goal} {item.unit}
						</Text>
					</View>
				)}
			</View>

			{item.goal && item.progress && (
				<View style={styles.goalContainer}>
					<View style={styles.goalInfo}>
						<Text style={styles.goalLabel}>
							Прогресс: {item.progress.toFixed(1)}%
						</Text>
					</View>
					<View style={styles.progressBar}>
						<View
							style={[
								styles.progressFill,
								{
									width: `${Math.min(item.progress, 100)}%`,
									backgroundColor: getProgressColor(item.progress),
								},
							]}
						/>
					</View>
				</View>
			)}

			<Text style={styles.dateText}>Измерено: {formatDate(item.date)}</Text>
		</TouchableOpacity>
	)

	const renderHistoryItem = ({ item }: { item: HistoryEntry }) => (
		<View style={styles.historyItem}>
			<View style={styles.historyHeader}>
				<View style={styles.historyDateContainer}>
					<Ionicons name='calendar' size={18} color='#34C759' />
					<Text style={styles.historyDate}>{item.date}</Text>
				</View>
			</View>

			{item.measurements.map((measurement, index) => (
				<View key={index} style={styles.historyMeasurement}>
					<Text style={styles.historyName}>{measurement.name}</Text>
					<Text style={styles.historyValue}>{measurement.value}</Text>
					<Text
						style={[
							styles.historyChange,
							{
								color: measurement.change.includes('+')
									? '#34C759'
									: measurement.change.includes('-')
										? '#FF3B30'
										: '#8E8E93',
							},
						]}
					>
						{measurement.change}
					</Text>
				</View>
			))}
		</View>
	)

	useFocusEffect(
		useCallback(() => {
			// Очистка при размонтировании (опционально)
			loadData()
			return () => {
				// Здесь можно выполнить очистку, если нужно
			}
		}, []),
	)

	const handleAddMeasurement = () => {
		router.push('/(routes)/add-measurement')
	}

	const handleEditMeasurement = (id: string) => {
		router.push(`/(routes)/edit-measurement/${id}`)
	}

	const handleDeleteMeasurement = async (id: string) => {
		if (!(await confirmDelete())) return

		try {
			await db.deleteBodyMeasurement(Number(id))
			await loadData()
		} catch (err) {
			console.error(err)
		}
	}

	// Вспомогательная функция подтверждения (можно вынести)
	const confirmDelete = async (): Promise<boolean> => {
		return new Promise(resolve => {
			Alert.alert(
				'Удалить?',
				'Действие нельзя отменить',
				[
					{ text: 'Отмена', onPress: () => resolve(false) },
					{
						text: 'Удалить',
						style: 'destructive',
						onPress: () => resolve(true),
					},
				],
				{ cancelable: true },
			)
		})
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Заголовок */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Ionicons name='arrow-back' size={24} color='#FFFFFF' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>История замеров</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={handleAddMeasurement}
				>
					<Ionicons name='add' size={24} color='#34C759' />
				</TouchableOpacity>
			</View>

			{/* Табы */}
			<View style={styles.tabsContainer}>
				<TouchableOpacity
					style={[styles.tab, selectedTab === 'current' && styles.activeTab]}
					onPress={() => setSelectedTab('current')}
				>
					<Text
						style={[
							styles.tabText,
							selectedTab === 'current' && styles.activeTabText,
						]}
					>
						Текущие замеры
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
					onPress={() => setSelectedTab('history')}
				>
					<Text
						style={[
							styles.tabText,
							selectedTab === 'history' && styles.activeTabText,
						]}
					>
						История
					</Text>
				</TouchableOpacity>
			</View>

			{/* Статистика */}
			<View style={styles.statsContainer}>
				<View style={styles.statCard}>
					<View style={styles.statIconContainer}>
						<Ionicons name='trending-down' size={20} color='#34C759' />
					</View>
					<Text style={styles.statValue}>
						{currentMeasurements.length > 0
							? `${currentMeasurements.find(m => m.name.includes('Вес'))?.change?.toFixed(1) || '0'} кг`
							: '0 кг'}
					</Text>
					<Text style={styles.statLabel}>Изменение веса</Text>
				</View>
				<View style={styles.statCard}>
					<View style={styles.statIconContainer}>
						<Ionicons name='body' size={20} color='#FF9500' />
					</View>
					<Text style={styles.statValue}>{currentMeasurements.length}</Text>
					<Text style={styles.statLabel}>Параметров</Text>
				</View>
				<View style={styles.statCard}>
					<View style={styles.statIconContainer}>
						<Ionicons name='calendar' size={20} color='#5856D6' />
					</View>
					<Text style={styles.statValue}>
						{currentMeasurements.length > 0
							? Math.floor(
									(new Date().getTime() -
										new Date(currentMeasurements[0].date).getTime()) /
										(1000 * 60 * 60 * 24),
								)
							: '0'}
					</Text>
					<Text style={styles.statLabel}>Дней назад</Text>
				</View>
			</View>

			{/* Контент в зависимости от выбранного таба */}
			{selectedTab === 'current' ? (
				<FlatList
					data={currentMeasurements}
					renderItem={renderMeasurementItem}
					keyExtractor={item => item.id}
					contentContainerStyle={styles.listContainer}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Ionicons name='body' size={64} color='#2C2C2E' />
							<Text style={styles.emptyText}>Нет замеров</Text>
							<Text style={styles.emptySubtext}>
								Добавьте свой первый замер
							</Text>
						</View>
					}
				/>
			) : (
				<FlatList
					data={historyData}
					renderItem={renderHistoryItem}
					keyExtractor={item => item.id}
					contentContainerStyle={styles.historyListContainer}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Ionicons name='calendar' size={64} color='#2C2C2E' />
							<Text style={styles.emptyText}>Нет истории</Text>
							<Text style={styles.emptySubtext}>
								Добавьте замеры для просмотра истории
							</Text>
						</View>
					}
				/>
			)}

			{/* Модальное окно с деталями */}
			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						{selectedMeasurement && (
							<>
								<View style={styles.modalHeader}>
									<Text style={styles.modalTitle}>
										{selectedMeasurement.name}
									</Text>
									<TouchableOpacity
										onPress={() => setModalVisible(false)}
										style={styles.closeButton}
									>
										<Ionicons name='close' size={24} color='#8E8E93' />
									</TouchableOpacity>
								</View>

								<View style={styles.modalBody}>
									<View style={styles.modalStatsGrid}>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Текущий</Text>
											<Text style={styles.modalStatValue}>
												{selectedMeasurement.value} {selectedMeasurement.unit}
											</Text>
										</View>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Дата</Text>
											<Text style={styles.modalStatValue}>
												{formatDate(selectedMeasurement.date)}
											</Text>
										</View>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Изменение</Text>
											<View style={styles.changeContainer}>
												<Ionicons
													name={
														getTrendIcon(selectedMeasurement.trend).name as any
													}
													size={16}
													color={getTrendIcon(selectedMeasurement.trend).color}
												/>
												<Text
													style={[
														styles.changeText,
														{
															color: getTrendIcon(selectedMeasurement.trend)
																.color,
														},
													]}
												>
													{selectedMeasurement.change &&
													selectedMeasurement.change > 0
														? '+'
														: ''}
													{selectedMeasurement.change?.toFixed(1)}{' '}
													{selectedMeasurement.unit}
												</Text>
											</View>
										</View>
									</View>

									{selectedMeasurement.goal && (
										<View style={styles.goalSection}>
											<Text style={styles.sectionTitle}>Прогресс цели</Text>
											<View style={styles.goalProgress}>
												<View style={styles.goalHeader}>
													<Text style={styles.goalText}>
														Цель: {selectedMeasurement.goal}{' '}
														{selectedMeasurement.unit}
													</Text>
													{selectedMeasurement.progress && (
														<Text
															style={[
																styles.progressPercent,
																{
																	color: getProgressColor(
																		selectedMeasurement.progress,
																	),
																},
															]}
														>
															{selectedMeasurement.progress.toFixed(1)}%
														</Text>
													)}
												</View>
												{selectedMeasurement.progress && (
													<View style={styles.progressBar}>
														<View
															style={[
																styles.progressFill,
																{
																	width: `${Math.min(selectedMeasurement.progress, 100)}%`,
																	backgroundColor: getProgressColor(
																		selectedMeasurement.progress,
																	),
																},
															]}
														/>
													</View>
												)}
											</View>
										</View>
									)}

									<View style={styles.modalActions}>
										<TouchableOpacity
											style={styles.editButton}
											onPress={() => {
												;(setModalVisible(false),
													handleEditMeasurement(selectedMeasurement.id))
											}}
										>
											<Ionicons name='create' size={20} color='#FFFFFF' />
											<Text style={styles.editButtonText}>Редактировать</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.deleteButton}
											onPress={() => {
												;(handleDeleteMeasurement(selectedMeasurement.id),
													setModalVisible(false))
											}}
										>
											<Ionicons name='trash' size={20} color='#FF3B30' />
											<Text style={styles.deleteButtonText}>Удалить</Text>
										</TouchableOpacity>
									</View>
								</View>
							</>
						)}
					</View>
				</View>
			</Modal>

			{/* Кнопка добавления */}
			<TouchableOpacity style={styles.fab} onPress={handleAddMeasurement}>
				<Ionicons name='add' size={24} color='#FFFFFF' />
			</TouchableOpacity>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#121212',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#2C2C2E',
	},
	backButton: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	addButton: {
		padding: 4,
	},
	tabsContainer: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#2C2C2E',
	},
	tab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: 'center',
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#34C759',
	},
	tabText: {
		fontSize: 16,
		color: '#8E8E93',
		fontWeight: '500',
	},
	activeTabText: {
		color: '#FFFFFF',
	},
	statsContainer: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 16,
		gap: 12,
	},
	statCard: {
		flex: 1,
		backgroundColor: '#1E1E1E',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
	},
	statIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#2C2C2E',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	statValue: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: '#8E8E93',
	},
	listContainer: {
		paddingHorizontal: 10,
		paddingTop: 8,
		paddingBottom: 100,
	},
	measurementItem: {
		backgroundColor: '#1E1E1E',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
	},
	measurementHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	measurementName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	trendBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#2C2C2E',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
		gap: 6,
	},
	changeText: {
		fontSize: 14,
		fontWeight: '600',
	},
	valuesContainer: {
		flexDirection: 'row',
		gap: 16,
		marginBottom: 16,
	},
	valueColumn: {
		flex: 1,
	},
	valueLabel: {
		fontSize: 12,
		color: '#8E8E93',
		marginBottom: 4,
	},
	currentValue: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	goalValue: {
		fontSize: 20,
		color: '#FF9500',
	},
	goalContainer: {
		marginBottom: 12,
	},
	goalInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	goalLabel: {
		fontSize: 14,
		color: '#8E8E93',
	},
	progressText: {
		fontSize: 14,
		fontWeight: '600',
	},
	progressBar: {
		height: 6,
		backgroundColor: '#2C2C2E',
		borderRadius: 3,
		overflow: 'hidden',
	},
	progressFill: {
		height: '100%',
		borderRadius: 3,
	},
	dateText: {
		fontSize: 12,
		color: '#8E8E93',
	},
	historyListContainer: {
		paddingHorizontal: 10,
		paddingTop: 8,
		paddingBottom: 100,
	},
	historyItem: {
		backgroundColor: '#1E1E1E',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
	},
	historyHeader: {
		marginBottom: 12,
	},
	historyDateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	historyDate: {
		fontSize: 16,
		fontWeight: '600',
		color: '#34C759',
	},
	historyMeasurement: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#2C2C2E',
	},
	historyName: {
		fontSize: 14,
		color: '#B0B0B0',
		flex: 2,
	},
	historyValue: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFFFFF',
		flex: 1,
		textAlign: 'center',
	},
	historyChange: {
		fontSize: 14,
		fontWeight: '600',
		flex: 1,
		textAlign: 'right',
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 80,
	},
	emptyText: {
		fontSize: 18,
		color: '#FFFFFF',
		fontWeight: '600',
		marginTop: 16,
		marginBottom: 8,
	},
	emptySubtext: {
		fontSize: 14,
		color: '#8E8E93',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: '#1E1E1E',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 24,
		maxHeight: '80%',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		marginBottom: 24,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFFFFF',
		flex: 1,
	},
	closeButton: {
		padding: 4,
	},
	modalBody: {
		paddingHorizontal: 10,
		paddingBottom: 40,
	},
	modalStatsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
		marginBottom: 32,
	},
	modalStat: {
		width: '48%',
		marginBottom: 16,
	},
	modalStatLabel: {
		fontSize: 14,
		color: '#8E8E93',
		marginBottom: 8,
	},
	modalStatValue: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	changeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	goalSection: {
		marginBottom: 32,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 16,
	},
	goalProgress: {
		backgroundColor: '#2C2C2E',
		borderRadius: 12,
		padding: 16,
	},
	goalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	goalText: {
		fontSize: 14,
		color: '#B0B0B0',
	},
	progressPercent: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	modalActions: {
		flexDirection: 'row',
		gap: 12,
	},
	editButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#34C759',
		paddingVertical: 14,
		borderRadius: 12,
		gap: 8,
	},
	editButtonText: {
		fontSize: 16,
		color: '#FFFFFF',
		fontWeight: '600',
	},
	deleteButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#FF3B30',
		paddingVertical: 14,
		borderRadius: 12,
		gap: 8,
	},
	deleteButtonText: {
		fontSize: 16,
		color: '#FF3B30',
		fontWeight: '600',
	},
	fab: {
		position: 'absolute',
		bottom: 30,
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#34C759',
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
})
