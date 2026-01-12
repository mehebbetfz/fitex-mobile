import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
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
	current: number
	previous: number
	unit: string
	trend: 'up' | 'down' | 'stable'
	date: string
	change: number
	goal?: number
	progress?: number
}

const MEASUREMENTS_DATA: Measurement[] = [
	{
		id: '1',
		name: 'Грудь',
		current: 102,
		previous: 104,
		unit: 'см',
		trend: 'down',
		date: '15.12.2024',
		change: -2,
		goal: 98,
		progress: 85,
	},
	{
		id: '2',
		name: 'Талия',
		current: 84,
		previous: 87,
		unit: 'см',
		trend: 'down',
		date: '15.12.2024',
		change: -3,
		goal: 80,
		progress: 90,
	},
	{
		id: '3',
		name: 'Бедра',
		current: 95,
		previous: 93,
		unit: 'см',
		trend: 'up',
		date: '15.12.2024',
		change: 2,
		goal: 97,
		progress: 40,
	},
	{
		id: '4',
		name: 'Бицепс',
		current: 38,
		previous: 36,
		unit: 'см',
		trend: 'up',
		date: '15.12.2024',
		change: 2,
		goal: 40,
		progress: 95,
	},
	{
		id: '5',
		name: 'Трицепс',
		current: 35,
		previous: 33,
		unit: 'см',
		trend: 'up',
		date: '15.12.2024',
		change: 2,
		goal: 36,
		progress: 80,
	},
	{
		id: '6',
		name: 'Шея',
		current: 40,
		previous: 41,
		unit: 'см',
		trend: 'down',
		date: '15.12.2024',
		change: -1,
		goal: 38,
		progress: 60,
	},
	{
		id: '7',
		name: 'Икры',
		current: 42,
		previous: 40,
		unit: 'см',
		trend: 'up',
		date: '15.12.2024',
		change: 2,
		goal: 45,
		progress: 70,
	},
	{
		id: '8',
		name: 'Плечо',
		current: 45,
		previous: 43,
		unit: 'см',
		trend: 'up',
		date: '15.12.2024',
		change: 2,
		goal: 48,
		progress: 75,
	},
]

const HISTORY_DATA = [
	{
		id: '1',
		date: '15.12.2024',
		measurements: [
			{ name: 'Вес', value: '75.2 кг', change: '-0.5 кг' },
			{ name: 'Талия', value: '84 см', change: '-1 см' },
			{ name: 'Грудь', value: '102 см', change: '0 см' },
		],
	},
	{
		id: '2',
		date: '01.12.2024',
		measurements: [
			{ name: 'Вес', value: '75.7 кг', change: '-0.8 кг' },
			{ name: 'Талия', value: '85 см', change: '-2 см' },
			{ name: 'Грудь', value: '102 см', change: '-1 см' },
		],
	},
	{
		id: '3',
		date: '15.11.2024',
		measurements: [
			{ name: 'Вес', value: '76.5 кг', change: '-1.2 кг' },
			{ name: 'Талия', value: '87 см', change: '-3 см' },
			{ name: 'Грудь', value: '103 см', change: '-1 см' },
		],
	},
	{
		id: '4',
		date: '01.11.2024',
		measurements: [
			{ name: 'Вес', value: '77.7 кг', change: '+0.5 кг' },
			{ name: 'Талия', value: '90 см', change: '+1 см' },
			{ name: 'Грудь', value: '104 см', change: '0 см' },
		],
	},
]

export default function MeasurementsHistoryScreen() {
	const router = useRouter()
	const [selectedTab, setSelectedTab] = useState<'current' | 'history'>(
		'current'
	)
	const [selectedMeasurement, setSelectedMeasurement] =
		useState<Measurement | null>(null)
	const [modalVisible, setModalVisible] = useState(false)

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
						{item.change > 0 ? '+' : ''}
						{item.change} {item.unit}
					</Text>
				</View>
			</View>

			<View style={styles.valuesContainer}>
				<View style={styles.valueColumn}>
					<Text style={styles.valueLabel}>Текущий</Text>
					<Text style={styles.currentValue}>
						{item.current} {item.unit}
					</Text>
				</View>
				<View style={styles.valueColumn}>
					<Text style={styles.valueLabel}>Предыдущий</Text>
					<Text style={styles.previousValue}>
						{item.previous} {item.unit}
					</Text>
				</View>
			</View>

			{item.goal && (
				<View style={styles.goalContainer}>
					<View style={styles.goalInfo}>
						<Text style={styles.goalLabel}>Цель: {item.goal} {item.unit}</Text>
						{item.progress && (
							<Text
								style={[
									styles.progressText,
									{ color: getProgressColor(item.progress) },
								]}
							>
								{item.progress}%
							</Text>
						)}
					</View>
					{item.progress && (
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
					)}
				</View>
			)}

			<Text style={styles.dateText}>Измерено: {item.date}</Text>
		</TouchableOpacity>
	)

	const renderHistoryItem = ({ item }: { item: typeof HISTORY_DATA[0] }) => (
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
								color: measurement.change.includes('-')
									? '#34C759'
									: measurement.change.includes('+')
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
				<TouchableOpacity style={styles.addButton}>
					<Ionicons name='add' size={24} color='#34C759' />
				</TouchableOpacity>
			</View>

			{/* Табы */}
			<View style={styles.tabsContainer}>
				<TouchableOpacity
					style={[
						styles.tab,
						selectedTab === 'current' && styles.activeTab,
					]}
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
					style={[
						styles.tab,
						selectedTab === 'history' && styles.activeTab,
					]}
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
					<Text style={styles.statValue}>-3.7 кг</Text>
					<Text style={styles.statLabel}>Изменение веса</Text>
				</View>
				<View style={styles.statCard}>
					<View style={styles.statIconContainer}>
						<Ionicons name='body' size={20} color='#FF9500' />
					</View>
					<Text style={styles.statValue}>8</Text>
					<Text style={styles.statLabel}>Параметров</Text>
				</View>
				<View style={styles.statCard}>
					<View style={styles.statIconContainer}>
						<Ionicons name='calendar' size={20} color='#5856D6' />
					</View>
					<Text style={styles.statValue}>30</Text>
					<Text style={styles.statLabel}>Дней назад</Text>
				</View>
			</View>

			{/* Контент в зависимости от выбранного таба */}
			{selectedTab === 'current' ? (
				<FlatList
					data={MEASUREMENTS_DATA}
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
					data={HISTORY_DATA}
					renderItem={renderHistoryItem}
					keyExtractor={item => item.id}
					contentContainerStyle={styles.historyListContainer}
					showsVerticalScrollIndicator={false}
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
												{selectedMeasurement.current} {selectedMeasurement.unit}
											</Text>
										</View>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Предыдущий</Text>
											<Text style={styles.modalStatValue}>
												{selectedMeasurement.previous} {selectedMeasurement.unit}
											</Text>
										</View>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Изменение</Text>
											<View style={styles.changeContainer}>
												<Ionicons
													name={
														getTrendIcon(selectedMeasurement.trend)
															.name as any
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
													{selectedMeasurement.change > 0 ? '+' : ''}
													{selectedMeasurement.change} {selectedMeasurement.unit}
												</Text>
											</View>
										</View>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Дата</Text>
											<Text style={styles.modalStatValue}>
												{selectedMeasurement.date}
											</Text>
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
																		selectedMeasurement.progress
																	),
																},
															]}
														>
															{selectedMeasurement.progress}%
														</Text>
													)}
												</View>
												{selectedMeasurement.progress && (
													<View style={styles.progressBar}>
														<View
															style={[
																styles.progressFill,
																{
																	width: `${Math.min(
																		selectedMeasurement.progress,
																		100
																	)}%`,
																	backgroundColor: getProgressColor(
																		selectedMeasurement.progress
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
										<TouchableOpacity style={styles.editButton}>
											<Ionicons name='create' size={20} color='#FFFFFF' />
											<Text style={styles.editButtonText}>Редактировать</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.deleteButton}>
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
			<TouchableOpacity style={styles.fab} onPress={() => {}}>
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
		paddingHorizontal: 20,
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
		paddingHorizontal: 20,
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
		paddingHorizontal: 20,
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
		paddingHorizontal: 20,
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
	previousValue: {
		fontSize: 20,
		color: '#8E8E93',
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
		paddingHorizontal: 20,
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
		paddingHorizontal: 20,
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
		paddingHorizontal: 20,
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