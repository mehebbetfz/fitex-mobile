import { manFrontMuscleParts } from '@/constants/images'
import { Ionicons } from '@expo/vector-icons'
import { useRef, useState } from 'react'
import {
	Animated,
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const MUSCLE_DATA = [
	{
		id: '1',
		name: 'Грудь',
		status: 'recovering',
		recovery: 65,
		color: '#FF6B6B',
		lastTrained: '2 дня назад',
		muscleImages: [
			'leftPectoralisMajor',
			'rightPectoralisMajor',
			'leftPectoralisMinor',
			'rightPectoralisMinor',
			'rightSerratusAnterior',
			'leftSerratusAnterior',
		],
	},
	{
		id: '2',
		name: 'Пресс',
		status: 'recovered',
		recovery: 100,
		color: '#4ECDC4',
		lastTrained: '4 дня назад',
		muscleImages: [
			'upperAbs',
			'lowerAbs',
			'upperMiddleAbs',
			'lowerMiddleAbs',
			'leftExternalOblique',
			'rightExternalOblique',
			'leftInternalOblique',
			'rightInternalOblique',
			'leftTransversusAbdominis',
			'rightTransversusAbdominis',
		],
	},
	{
		id: '3',
		name: 'Бицепс',
		status: 'recovering',
		recovery: 80,
		color: '#45B7D1',
		lastTrained: '3 дня назад',
		muscleImages: [
			'leftLongBiceps',
			'rightLongBiceps',
			'leftShortBiceps',
			'rightShortBiceps',
		],
	},
	{
		id: '4',
		name: 'Плечи',
		status: 'recovered',
		recovery: 100,
		color: '#96CEB4',
		lastTrained: '5 дней назад',
		muscleImages: [
			'leftFrontDeltoid',
			'rightFrontDeltoid',
			'leftMiddleDeltoid',
			'rightMiddleDeltoid',
			'leftUpperTrapezius',
			'rightUpperTrapezius',
		],
	},
	{
		id: '5',
		name: 'Трапеции',
		status: 'recovered',
		recovery: 100,
		color: '#96CEB4',
		lastTrained: '5 дней назад',
		muscleImages: ['rightScalenes', 'leftScalenes'],
	},
	{
		id: '6',
		name: 'Ноги',
		status: 'needs_rest',
		recovery: 25,
		color: '#FFEAA7',
		lastTrained: '1 день назад',
		muscleImages: [
			'leftVastusLateralis',
			'rightVastusLateralis',
			'leftVastusMedialis',
			'rightVastusMedialis',
			'leftVastusInternedius',
			'rightVastusInternedius',
			'leftGastrocnemius',
			'rightGastrocnemius',
			'leftTibialisAnterior',
			'rightTibialisAnterior',
			'rightGluteusMedius',
			'leftGluteusMedius',
		],
	},
	{
		id: '7',
		name: 'Предплечья',
		status: 'needs_rest',
		recovery: 25,
		color: '#FFEAA7',
		lastTrained: '1 день назад',
		muscleImages: [
			'rightExtensorDigitorum',
			'leftExtensorDigitorum',
			'rightExtensorCarpiUharis',
			'leftExtensorCarpiUharis',
			'rightExtensorCarpiRadialis',
			'leftExtensorCarpiRadialis',
		],
	},
]

export default function RecoveryTab() {
	const [selectedDay, setSelectedDay] = useState(0)
	const [overallRecovery, setOverallRecovery] = useState(73)
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<'model' | 'list'>('model')
	const scrollX = useRef(new Animated.Value(0)).current
	const flatListRef = useRef<FlatList>(null)

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'recovered':
				return '#34C759'
			case 'recovering':
				return '#FFCC00'
			case 'needs_rest':
				return '#FF3B30'
			default:
				return '#8E8E93'
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case 'recovered':
				return 'Восстановлено'
			case 'recovering':
				return 'Восстанавливается'
			case 'needs_rest':
				return 'Требуется отдых'
			default:
				return 'Не тренировалась'
		}
	}

	const getTintColor = (status: string) => {
		switch (status) {
			case 'recovered':
				return 'rgba(52, 199, 89, 0.7)'
			case 'recovering':
				return 'rgba(255, 204, 0, 0.7)'
			case 'needs_rest':
				return 'rgba(255, 59, 48, 0.7)'
			default:
				return 'rgba(142, 142, 147, 0.7)'
		}
	}

	const handleMuscleSelect = (muscleId: string) => {
		setSelectedMuscle(selectedMuscle === muscleId ? null : muscleId)
		if (activeTab !== 'list') {
			setActiveTab('list')
			setTimeout(() => {
				flatListRef.current?.scrollToOffset({ offset: width, animated: true })
			}, 100)
		}
	}

	const getMuscleImagesToShow = () => {
		const images = []

		if (selectedMuscle) {
			const muscle = MUSCLE_DATA.find(m => m.id === selectedMuscle)
			if (muscle) {
				muscle.muscleImages.forEach(imageKey => {
					const imageSource =
						manFrontMuscleParts[imageKey as keyof typeof manFrontMuscleParts]
					if (imageSource) {
						images.push({
							source: imageSource,
							tintColor: getTintColor(muscle.status),
						})
					}
				})
			}
		} else {
			MUSCLE_DATA.forEach(muscle => {
				muscle.muscleImages.forEach(imageKey => {
					const imageSource =
						manFrontMuscleParts[imageKey as keyof typeof manFrontMuscleParts]
					if (imageSource) {
						images.push({
							source: imageSource,
							tintColor: getTintColor(muscle.status),
						})
					}
				})
			})
		}

		return images
	}

	const muscleImagesToShow = getMuscleImagesToShow()

	const handleTabSelect = (tab: 'model' | 'list') => {
		setActiveTab(tab)
		if (flatListRef.current) {
			const offset = tab === 'model' ? 0 : width
			flatListRef.current.scrollToOffset({ offset, animated: true })
		}
	}

	const renderModelTab = () => (
		<View style={styles.tabContainer}>
			<View style={styles.diagramContainer}>
				<View style={styles.bodyImageContainer}>
					<Image
						style={styles.bodyBackground}
						source={manFrontMuscleParts.background}
						resizeMode='contain'
					/>

					{muscleImagesToShow.map((image, index) => (
						<Image
							key={index}
							style={[styles.muscleImage, { tintColor: image.tintColor }]}
							source={image.source}
							resizeMode='contain'
						/>
					))}
				</View>

				<View style={styles.legend}>
					<View style={styles.legendItem}>
						<View
							style={[styles.legendColor, { backgroundColor: '#34C759' }]}
						/>
						<Text style={styles.legendText}>Восстановлено</Text>
					</View>
					<View style={styles.legendItem}>
						<View
							style={[styles.legendColor, { backgroundColor: '#FFCC00' }]}
						/>
						<Text style={styles.legendText}>Восстанавливается</Text>
					</View>
					<View style={styles.legendItem}>
						<View
							style={[styles.legendColor, { backgroundColor: '#FF3B30' }]}
						/>
						<Text style={styles.legendText}>Требует отдыха</Text>
					</View>
				</View>

				<TouchableOpacity
					style={styles.toggleButton}
					onPress={() => setSelectedMuscle(null)}
				>
					<Text style={styles.toggleButtonText}>
						{selectedMuscle ? 'Показать все мышцы' : 'Смотреть все'}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)

	const renderListTab = () => (
		<View style={styles.tabContainer}>
			<View style={styles.musclesListContainer}>
				<Text style={styles.listTitle}>Детали по мышцам</Text>
				<ScrollView
					style={styles.musclesScrollView}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ flexGrow: 1 }}
				>
					{MUSCLE_DATA.map(muscle => (
						<TouchableOpacity
							key={muscle.id}
							style={[
								styles.muscleItem,
								selectedMuscle === muscle.id && styles.selectedMuscleItem,
							]}
							onPress={() => handleMuscleSelect(muscle.id)}
						>
							<View style={styles.muscleInfo}>
								<View
									style={[styles.muscleIcon, { backgroundColor: muscle.color }]}
								>
									<Text style={styles.muscleIconText}>
										{muscle.name.charAt(0)}
									</Text>
								</View>
								<View style={styles.muscleTextContainer}>
									<Text style={styles.muscleName}>{muscle.name}</Text>
									<Text style={styles.lastTrained}>{muscle.lastTrained}</Text>
								</View>
							</View>

							<View style={styles.muscleStatus}>
								<View style={styles.recoveryBar}>
									<View
										style={[
											styles.recoveryFill,
											{
												width: `${muscle.recovery}%`,
												backgroundColor: getStatusColor(muscle.status),
											},
										]}
									/>
								</View>
								<View style={styles.recoveryInfo}>
									<Text style={styles.recoveryPercent}>{muscle.recovery}%</Text>
									<Text
										style={[
											styles.statusText,
											{ color: getStatusColor(muscle.status) },
										]}
									>
										{getStatusText(muscle.status)}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</View>
	)

	const data = [
		{ id: 'model', component: renderModelTab() },
		{ id: 'list', component: renderListTab() },
	]

	const renderItem = ({ item }: { item: any }) => (
		<View style={{ marginHorizontal: 1 }}>{item.component}</View>
	)

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>Восстановление</Text>
						<Text style={styles.subtitle}>Отслеживайте состояние мышц</Text>
					</View>
				</View>

				<View style={styles.overviewCard}>
					<Text style={styles.overviewTitle}>
						Общий прогресс восстановления
					</Text>
					<View style={styles.progressContainer}>
						<View style={styles.progressCircle}>
							<Text style={styles.progressText}>{overallRecovery}%</Text>
						</View>
						<View style={styles.overviewStats}>
							<View style={styles.statRow}>
								<View
									style={[styles.statusDot, { backgroundColor: '#34C759' }]}
								/>
								<Text style={styles.statText}>Восстановлено: 2</Text>
							</View>
							<View style={styles.statRow}>
								<View
									style={[styles.statusDot, { backgroundColor: '#FFCC00' }]}
								/>
								<Text style={styles.statText}>Восстанавливается: 2</Text>
							</View>
							<View style={styles.statRow}>
								<View
									style={[styles.statusDot, { backgroundColor: '#FF3B30' }]}
								/>
								<Text style={styles.statText}>Требует отдыха: 1</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.modelSection}>
					<View style={styles.tabSelector}>
						<TouchableOpacity
							style={[
								styles.tabButton,
								activeTab === 'model' && styles.activeTabButton,
							]}
							onPress={() => handleTabSelect('model')}
						>
							<Text
								style={[
									styles.tabButtonText,
									activeTab === 'model' && styles.activeTabButtonText,
								]}
							>
								Модель тела
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tabButton,
								activeTab === 'list' && styles.activeTabButton,
							]}
							onPress={() => handleTabSelect('list')}
						>
							<Text
								style={[
									styles.tabButtonText,
									activeTab === 'list' && styles.activeTabButtonText,
								]}
							>
								Список мышц
							</Text>
						</TouchableOpacity>
					</View>

					<FlatList
						ref={flatListRef}
						data={data}
						renderItem={renderItem}
						keyExtractor={item => item.id}
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						scrollEventThrottle={16}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { x: scrollX } } }],
							{ useNativeDriver: false }
						)}
						onMomentumScrollEnd={event => {
							const contentOffsetX = event.nativeEvent.contentOffset.x
							const newIndex = Math.round(contentOffsetX / width)
							setActiveTab(newIndex === 0 ? 'model' : 'list')
						}}
						style={styles.horizontalScrollView}
					/>

					<View style={styles.pagination}>
						{[0, 1].map(i => {
							const opacity = scrollX.interpolate({
								inputRange: [(i - 1) * width, i * width, (i + 1) * width],
								outputRange: [0.3, 1, 0.3],
								extrapolate: 'clamp',
							})

							return (
								<Animated.View
									key={i}
									style={[styles.paginationDot, { opacity }]}
								/>
							)
						})}
					</View>
				</View>

				<View style={{ ...styles.section, marginBottom: 10 }}>
					<Text style={{ ...styles.sectionTitle, marginBottom: 20 }}>
						Рекомендации
					</Text>
					<View style={styles.recommendationCard}>
						<View style={styles.recommendationIcon}>
							<Ionicons name='bulb' size={24} color='#FFCC00' />
						</View>
						<View style={styles.recommendationContent}>
							<Text style={styles.recommendationTitle}>
								Сегодня лучше всего
							</Text>
							<Text style={styles.recommendationText}>
								Тренируйте пресс и плечи - они полностью восстановились
							</Text>
						</View>
					</View>
					<View style={styles.recommendationCard}>
						<View style={styles.recommendationIcon}>
							<Ionicons name='warning' size={24} color='#FF3B30' />
						</View>
						<View style={styles.recommendationContent}>
							<Text style={styles.recommendationTitle}>Дайте отдых ногам</Text>
							<Text style={styles.recommendationText}>
								Ноги требуют еще 1-2 дня отдыха для полного восстановления
							</Text>
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
		backgroundColor: '#121212',
		paddingBottom: -40,
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
	statsButton: {
		padding: 8,
		backgroundColor: '#1C1C1E',
		borderRadius: 12,
	},
	section: {
		marginTop: 24,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	modelSection: {
		marginTop: 24,
		paddingHorizontal: 20,
	},
	tabSelector: {
		flexDirection: 'row',
		backgroundColor: '#1C1C1E',
		borderRadius: 12,
		padding: 4,
		marginBottom: 16,
		alignSelf: 'center',
	},
	tabButton: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: 'center',
	},
	activeTabButton: {
		backgroundColor: '#34C759',
	},
	tabButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#8E8E93',
	},
	activeTabButtonText: {
		color: '#FFFFFF',
	},
	horizontalScrollView: {
		width: width - 40,
		alignSelf: 'center',
	},
	tabContainer: {
		width: width - 40,
		flex: 1,
	},
	diagramContainer: {
		backgroundColor: '#1C1C1E',
		borderRadius: 20,
		paddingHorizontal: 20,
		paddingBottom: 20,
		borderWidth: 1,
		borderColor: '#2C2C2E',
		alignItems: 'center',
	},
	bodyImageContainer: {
		width: '100%',
		height: 500,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
	},
	bodyBackground: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		opacity: 0.6,
	},
	muscleImage: {
		width: '100%',
		height: '100%',
		position: 'absolute',
	},
	legend: {
		justifyContent: 'space-around',
		width: '100%',
		marginTop: 20,
		paddingHorizontal: 10,
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 5,
		marginBottom: 2,
		borderRadius: 5,
		backgroundColor: '#2a2a2aff',
	},
	legendColor: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 6,
	},
	legendText: {
		fontSize: 12,
		color: '#8E8E93',
	},
	toggleButton: {
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: '#2C2C2E',
		borderRadius: 12,
	},
	toggleButtonText: {
		color: '#34C759',
		fontSize: 14,
		fontWeight: '600',
	},
	overviewCard: {
		backgroundColor: '#1C1C1E',
		marginHorizontal: 20,
		marginTop: 24,
		borderRadius: 20,
		padding: 24,
		borderWidth: 1,
		borderColor: '#2C2C2E',
	},
	overviewTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 16,
	},
	progressContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	progressCircle: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 8,
		borderColor: '#34C759',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 20,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
	},
	progressText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	progressLabel: {
		fontSize: 11,
		color: '#8E8E93',
		marginTop: 4,
	},
	overviewStats: {
		flex: 1,
	},
	statRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	statusDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	statText: {
		fontSize: 14,
		color: '#8E8E93',
	},
	musclesListContainer: {
		flex: 1,
		backgroundColor: '#1C1C1E',
		borderRadius: 20,
		padding: 20,
		borderWidth: 1,
		borderColor: '#2C2C2E',
	},
	listTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 16,
	},
	musclesScrollView: {
		height: 600,
	},
	muscleItem: {
		backgroundColor: '#2C2C2E',
		borderRadius: 12,
		padding: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#3A3A3C',
	},
	selectedMuscleItem: {
		borderColor: '#34C759',
		borderWidth: 2,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
	},
	muscleInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	muscleTextContainer: {
		flex: 1,
	},
	muscleIcon: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	muscleIconText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	muscleName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	lastTrained: {
		fontSize: 11,
		color: '#8E8E93',
		marginTop: 2,
	},
	muscleStatus: {
		marginTop: 8,
	},
	recoveryBar: {
		height: 6,
		backgroundColor: '#1C1C1E',
		borderRadius: 3,
		marginBottom: 6,
		overflow: 'hidden',
	},
	recoveryFill: {
		height: '100%',
		width: '100%',
		borderRadius: 3,
	},
	recoveryInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	recoveryPercent: {
		fontSize: 12,
		color: '#FFFFFF',
		fontWeight: '600',
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
	},
	recommendationCard: {
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#2C2C2E',
	},
	recommendationIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(255, 204, 0, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	recommendationContent: {
		flex: 1,
	},
	recommendationTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 4,
	},
	recommendationText: {
		fontSize: 14,
		color: '#8E8E93',
		lineHeight: 20,
	},
	pagination: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: 16,
	},
	paginationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#34C759',
		marginHorizontal: 4,
	},
})
