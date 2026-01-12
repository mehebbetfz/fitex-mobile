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

interface Record {
	id: string
	exercise: string
	weight: string
	date: string
	trend: 'up' | 'down' | 'stable'
	category: 'strength' | 'cardio' | 'endurance'
	notes?: string
	previousRecord?: string
	improvement?: string
}

const RECORDS_DATA: Record[] = [
	{
		id: '1',
		exercise: 'Жим лежа',
		weight: '120 кг',
		date: '15.12.2024',
		trend: 'up',
		category: 'strength',
		previousRecord: '115 кг',
		improvement: '+5 кг',
		notes: '3 подхода по 5 повторений',
	},
	{
		id: '2',
		exercise: 'Приседания',
		weight: '160 кг',
		date: '14.12.2024',
		trend: 'up',
		category: 'strength',
		previousRecord: '155 кг',
		improvement: '+5 кг',
		notes: 'С правильной техникой',
	},
	{
		id: '3',
		exercise: 'Становая тяга',
		weight: '180 кг',
		date: '12.12.2024',
		trend: 'stable',
		category: 'strength',
		previousRecord: '180 кг',
		improvement: '0 кг',
		notes: 'Максимальная нагрузка',
	},
	{
		id: '4',
		exercise: 'Подтягивания с весом',
		weight: '+30 кг',
		date: '10.12.2024',
		trend: 'up',
		category: 'strength',
		previousRecord: '+25 кг',
		improvement: '+5 кг',
		notes: '8 повторений',
	},
	{
		id: '5',
		exercise: 'Бег 5 км',
		weight: '22:15',
		date: '08.12.2024',
		trend: 'up',
		category: 'cardio',
		previousRecord: '23:45',
		improvement: '-1:30',
		notes: 'Личный рекорд по времени',
	},
	{
		id: '6',
		exercise: 'Отжимания',
		weight: '45 раз',
		date: '05.12.2024',
		trend: 'up',
		category: 'endurance',
		previousRecord: '40 раз',
		improvement: '+5 раз',
		notes: 'Без остановки',
	},
	{
		id: '7',
		exercise: 'Жим штанги стоя',
		weight: '70 кг',
		date: '01.12.2024',
		trend: 'up',
		category: 'strength',
		previousRecord: '65 кг',
		improvement: '+5 кг',
		notes: '3 подхода по 8',
	},
	{
		id: '8',
		exercise: 'Планка',
		weight: '5:30',
		date: '28.11.2024',
		trend: 'up',
		category: 'endurance',
		previousRecord: '4:45',
		improvement: '+45 сек',
		notes: 'Максимальное время',
	},
]

const CATEGORIES = [
	{ id: 'all', name: 'Все', icon: 'list' },
	{ id: 'strength', name: 'Сила', icon: 'barbell' },
	{ id: 'cardio', name: 'Кардио', icon: 'heart' },
	{ id: 'endurance', name: 'Выносливость', icon: 'time' },
]

export default function RecordsHistoryScreen() {
	const router = useRouter()
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
	const [modalVisible, setModalVisible] = useState(false)

	const filteredRecords = RECORDS_DATA.filter(
		record => selectedCategory === 'all' || record.category === selectedCategory
	)

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'strength':
				return '#FF9500'
			case 'cardio':
				return '#FF2D55'
			case 'endurance':
				return '#5856D6'
			default:
				return '#34C759'
		}
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

	const renderRecordItem = ({ item }: { item: Record }) => (
		<TouchableOpacity
			style={styles.recordItem}
			onPress={() => {
				setSelectedRecord(item)
				setModalVisible(true)
			}}
		>
			<View style={styles.recordHeader}>
				<View style={styles.exerciseInfo}>
					<View
						style={[
							styles.categoryIndicator,
							{ backgroundColor: getCategoryColor(item.category) },
						]}
					/>
					<Text style={styles.exerciseName}>{item.exercise}</Text>
				</View>
				<View style={styles.weightContainer}>
					<Text style={styles.weightText}>{item.weight}</Text>
				</View>
			</View>

			<View style={styles.recordDetails}>
				<View style={styles.dateContainer}>
					<Ionicons name='calendar' size={14} color='#8E8E93' />
					<Text style={styles.dateText}>{item.date}</Text>
				</View>

				<View style={styles.improvementContainer}>
					<Ionicons
						name={getTrendIcon(item.trend).name as any}
						size={14}
						color={getTrendIcon(item.trend).color}
					/>
					<Text
						style={[
							styles.improvementText,
							{ color: getTrendIcon(item.trend).color },
						]}
					>
						{item.improvement}
					</Text>
				</View>
			</View>

			{item.notes && (
				<Text style={styles.notesText} numberOfLines={1}>
					{item.notes}
				</Text>
			)}
		</TouchableOpacity>
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
				<Text style={styles.headerTitle}>История рекордов</Text>
				<TouchableOpacity style={styles.addButton}>
					<Ionicons name='add' size={24} color='#34C759' />
				</TouchableOpacity>
			</View>

			{/* Фильтры по категориям */}
			<View style={styles.categoriesContainer}>
				<FlatList
					data={CATEGORIES}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.categoriesList}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={[
								styles.categoryButton,
								selectedCategory === item.id && styles.activeCategoryButton,
							]}
							onPress={() => setSelectedCategory(item.id)}
						>
							<Ionicons
								name={item.icon as any}
								size={16}
								color={selectedCategory === item.id ? '#FFFFFF' : '#8E8E93'}
							/>
							<Text
								style={[
									styles.categoryText,
									selectedCategory === item.id && styles.activeCategoryText,
								]}
							>
								{item.name}
							</Text>
						</TouchableOpacity>
					)}
					keyExtractor={item => item.id}
				/>
			</View>

			{/* Статистика */}
			<View style={styles.statsContainer}>
				<View style={styles.statCard}>
					<Text style={styles.statValue}>{RECORDS_DATA.length.toString()}</Text>
					<Text style={styles.statLabel}>Всего рекордов</Text>
				</View>
				<View style={styles.statCard}>
					<Text style={[styles.statValue, { color: '#34C759' }]}>
						{RECORDS_DATA.filter(r => r.trend === 'up').length.toString()}
					</Text>
					<Text style={styles.statLabel}>Улучшено</Text>
				</View>
				<View style={styles.statCard}>
					<Text style={[styles.statValue, { color: '#FF9500' }]}>
						{RECORDS_DATA.filter(
							r => r.category === 'strength'
						).length.toString()}
					</Text>
					<Text style={styles.statLabel}>Силовых</Text>
				</View>
			</View>

			{/* Список рекордов */}
			<FlatList
				data={filteredRecords}
				renderItem={renderRecordItem}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.listContainer}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Ionicons name='trophy' size={64} color='#2C2C2E' />
						<Text style={styles.emptyText}>Нет рекордов</Text>
						<Text style={styles.emptySubtext}>Добавьте свой первый рекорд</Text>
					</View>
				}
			/>

			{/* Модальное окно с деталями */}
			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						{selectedRecord && (
							<>
								<View style={styles.modalHeader}>
									<Text style={styles.modalTitle}>
										{selectedRecord.exercise}
									</Text>
									<TouchableOpacity
										onPress={() => setModalVisible(false)}
										style={styles.closeButton}
									>
										<Ionicons name='close' size={24} color='#8E8E93' />
									</TouchableOpacity>
								</View>

								<View style={styles.modalBody}>
									<View style={styles.modalStatRow}>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Текущий рекорд</Text>
											<Text style={styles.modalStatValue}>
												{selectedRecord.weight}
											</Text>
										</View>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Предыдущий</Text>
											<Text style={styles.modalStatValue}>
												{selectedRecord.previousRecord}
											</Text>
										</View>
									</View>

									<View style={styles.modalStatRow}>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Улучшение</Text>
											<View style={styles.improvementBadge}>
												<Ionicons
													name={getTrendIcon(selectedRecord.trend).name as any}
													size={16}
													color={getTrendIcon(selectedRecord.trend).color}
												/>
												<Text
													style={[
														styles.improvementText,
														{
															color: getTrendIcon(selectedRecord.trend).color,
														},
													]}
												>
													{selectedRecord.improvement}
												</Text>
											</View>
										</View>
										<View style={styles.modalStat}>
											<Text style={styles.modalStatLabel}>Дата</Text>
											<View style={styles.dateBadge}>
												<Ionicons name='calendar' size={16} color='#8E8E93' />
												<Text style={styles.dateText}>
													{selectedRecord.date}
												</Text>
											</View>
										</View>
									</View>

									{selectedRecord.notes && (
										<View style={styles.notesContainer}>
											<Text style={styles.notesLabel}>Заметки</Text>
											<Text style={styles.notesContent}>
												{selectedRecord.notes}
											</Text>
										</View>
									)}

									<View style={styles.modalActions}>
										<TouchableOpacity
											style={styles.editButton}
											onPress={() => {
												setModalVisible(false)
												// Здесь будет навигация на редактирование
											}}
										>
											<Ionicons name='create' size={20} color='#FFFFFF' />
											<Text style={styles.editButtonText}>Редактировать</Text>
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
	categoriesContainer: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#2C2C2E',
	},
	categoriesList: {
		paddingHorizontal: 20,
		gap: 8,
	},
	categoryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1E1E1E',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		gap: 6,
	},
	activeCategoryButton: {
		backgroundColor: '#34C759',
	},
	categoryText: {
		fontSize: 14,
		color: '#8E8E93',
		fontWeight: '500',
	},
	activeCategoryText: {
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
	statValue: {
		fontSize: 24,
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
	recordItem: {
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
	exerciseInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	categoryIndicator: {
		width: 4,
		height: 24,
		borderRadius: 2,
		marginRight: 12,
	},
	exerciseName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	weightContainer: {
		backgroundColor: '#2C2C2E',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	weightText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	recordDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	dateText: {
		fontSize: 14,
		color: '#8E8E93',
	},
	improvementContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	improvementText: {
		fontSize: 14,
		fontWeight: '600',
	},
	notesText: {
		fontSize: 14,
		color: '#B0B0B0',
		fontStyle: 'italic',
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
	modalStatRow: {
		flexDirection: 'row',
		gap: 16,
		marginBottom: 24,
	},
	modalStat: {
		flex: 1,
	},
	modalStatLabel: {
		fontSize: 14,
		color: '#8E8E93',
		marginBottom: 8,
	},
	modalStatValue: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	improvementBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#2C2C2E',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 12,
		gap: 6,
		alignSelf: 'flex-start',
	},
	dateBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#2C2C2E',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 12,
		gap: 6,
		alignSelf: 'flex-start',
	},
	notesContainer: {
		marginBottom: 32,
	},
	notesLabel: {
		fontSize: 14,
		color: '#8E8E93',
		marginBottom: 8,
	},
	notesContent: {
		fontSize: 16,
		color: '#FFFFFF',
		lineHeight: 24,
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
