import ManBackSvg from '@/components/man-back-svg'
import ManFrontSvg from '@/components/man-front-svg'
import {
	manBackMuscleGroupParts,
	manFrontMuscleGroupParts,
} from '@/constants/images'
import { Image } from 'expo-image'
import { useRef, useState } from 'react'
import {
	Animated,
	Dimensions,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const MUSCLE_FRONT_DATA = [
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
		icon: manFrontMuscleGroupParts.rectoralFull,
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
		icon: manFrontMuscleGroupParts.pressFull,
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
		icon: manFrontMuscleGroupParts.bicepsFull,
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
		],
		icon: manFrontMuscleGroupParts.deltoidsFull,
	},
	{
		id: '5',
		name: 'Трапеции',
		status: 'recovered',
		recovery: 100,
		color: '#96CEB4',
		lastTrained: '5 дней назад',
		muscleImages: ['leftUpperTrapezius', 'rightUpperTrapezius'],
		icon: manFrontMuscleGroupParts.rectoralFull,
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
		icon: manFrontMuscleGroupParts.upperLegFull,
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
		icon: manFrontMuscleGroupParts.forearmFull,
	},
	{
		id: '8',
		name: 'Шея',
		status: 'recovered',
		recovery: 100,
		color: '#96CEB4',
		lastTrained: '5 дней назад',
		muscleImages: ['leftScalenes', 'rightScalenes'],
		icon: manFrontMuscleGroupParts.rectoralFull,
	},
]

const MUSCLE_BACK_DATA = [
	{
		id: '1',
		name: 'Ноги',
		status: 'recovering',
		recovery: 65,
		color: '#FF6B6B',
		lastTrained: '2 дня назад',
		muscleImages: [
			'leftBiceosFemoris',
			'leftGastrocnemius',
			'leftSemitendinosus',
			'rightBiceosFemoris',
			'rightGastrocnemius',
			'rightSemitendinosus',
		],
		icon: manBackMuscleGroupParts.deltoidFull,
	},
	{
		id: '2',
		name: 'Предплечья',
		status: 'recovered',
		recovery: 100,
		color: '#4ECDC4',
		lastTrained: '4 дня назад',
		muscleImages: [
			'leftFlexorDigitorumProfundus',
			'leftFlexorPollicisLongus',
			'rightFlexorDigitorumProfundus',
			'rightFlexorPollicisLongus',
		],
		icon: manBackMuscleGroupParts.internalOblique, // ← наиболее близко к прессу (косые)
	},
	{
		id: '3',
		name: 'Ягодицы',
		status: 'recovering',
		recovery: 80,
		color: '#45B7D1',
		lastTrained: '3 дня назад',
		muscleImages: [
			'leftGluteusMaximus',
			'leftGluteusMedius',
			'leftInternalOblique',
			'rightGluteusMaximus',
			'rightGluteusMedius',
			'rightInternalOblique',
		],
		icon: manBackMuscleGroupParts.forearmFull, // ← часто бицепс рисуют вместе с предплечьем на таких схемах
	},
	{
		id: '4',
		name: 'Спина',
		status: 'recovered',
		recovery: 100,
		color: '#96CEB4',
		lastTrained: '5 дней назад',
		muscleImages: [
			'leftIntraspinatus',
			'leftLatissimusDorsi',
			'leftThoracolumbarFascia',
			'rightIntraspinatus',
			'rightLatissimusDorsi',
			'rightThoracolumbarFascia',
		],
		icon: manBackMuscleGroupParts.deltoidFull, // ← detroid → дельтовидные (плечи)
	},
	{
		id: '5',
		name: 'Трапеции',
		status: 'recovered',
		recovery: 100,
		color: '#96CEB4',
		lastTrained: '5 дней назад',
		muscleImages: [
			'leftLowerTrapezius',
			'leftUpperTrapezius',
			'rightLowerTrapezius',
			'rightUpperTrapezius',
		],
		icon: manBackMuscleGroupParts.trapeziusFull, // ← идеально подходит
	},
	{
		id: '6',
		name: 'Плечи',
		status: 'needs_rest',
		recovery: 25,
		color: '#FFEAA7',
		lastTrained: '1 день назад',
		muscleImages: ['leftRearDeltoid', 'rightRearDeltoid'],
		icon: manBackMuscleGroupParts.upperLegFull, // ← ноги (верхняя часть) + ягодицы
	},

	{
		id: '7',
		name: 'Трицепс',
		status: 'needs_rest',
		recovery: 25,
		color: '#FFEAA7',
		lastTrained: '1 день назад',
		muscleImages: ['leftTriceps', 'rightTriceps'],
		icon: manBackMuscleGroupParts.triceps, // ← идеально для предплечий
	},
]

export default function RecoveryTab() {
	const [muscleSide, setMuscleSide] = useState<string | null>(null)
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)
	const scrollX = useRef(new Animated.Value(0)).current
	const flatListRef = useRef<FlatList>(null)

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'recovered':
				return '#1fc448ff'
			case 'recovering':
				return '#ffcc00ff'
			case 'needs_rest':
				return '#cd1f16ff'
			default:
				return '#8E8E93'
		}
	}

	const getTintColor = (status: string) => {
		switch (status) {
			case 'recovered':
				return 'rgba(0, 255, 64, 0.7)'
			case 'recovering':
				return 'rgba(255, 204, 0, 1)'
			case 'needs_rest':
				return 'rgba(255, 13, 0, 0.7)'
			default:
				return 'rgba(142, 142, 147, 0.7)'
		}
	}

	const handleMuscleSelect = (muscleId: string, type: string) => {
		setMuscleSide(type)
		setSelectedMuscle(selectedMuscle === muscleId ? null : muscleId)
	}

	const getFrontMuscleColors = () => {
		const muscleColors: { [key: string]: string } = {}

		if (selectedMuscle && muscleSide == 'front') {
			const muscle = MUSCLE_FRONT_DATA.find(m => m.id === selectedMuscle)
			if (muscle) {
				muscle.muscleImages.forEach(imageKey => {
					muscleColors[imageKey] = getTintColor(muscle.status)
				})
			}
		} else {
			MUSCLE_FRONT_DATA.forEach(muscle => {
				muscle.muscleImages.forEach(imageKey => {
					muscleColors[imageKey] = getTintColor(muscle.status)
				})
			})
		}

		return muscleColors
	}

	const getBackMuscleColors = () => {
		const muscleColors: { [key: string]: string } = {}

		if (selectedMuscle && muscleSide == 'back') {
			const muscle = MUSCLE_BACK_DATA.find(m => m.id === selectedMuscle)
			if (muscle) {
				muscle.muscleImages.forEach(imageKey => {
					muscleColors[imageKey] = getTintColor(muscle.status)
				})
			}
		} else {
			MUSCLE_BACK_DATA.forEach(muscle => {
				muscle.muscleImages.forEach(imageKey => {
					muscleColors[imageKey] = getTintColor(muscle.status)
				})
			})
		}

		return muscleColors
	}

	const renderModelTab = () => (
		<View style={styles.tabContainer}>
			<View style={styles.diagramContainer}>
				<Text style={styles.sectionTitle}>Статус мышц</Text>
				<View
					style={{
						flexDirection: 'row',
					}}
				>
					<View style={styles.bodyImageContainer}>
						<ManBackSvg muscleColors={getBackMuscleColors()} />
					</View>
					<View style={styles.bodyImageContainer}>
						<ManFrontSvg muscleColors={getFrontMuscleColors()} />
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

				<View style={styles.legend}>
					<View style={styles.legendItem}>
						<View
							style={[styles.legendColor, { backgroundColor: '#34C759' }]}
						/>
						<Text style={styles.legendText}>Восстановлено</Text>
					</View>
					<View style={{ ...styles.legendItem }}>
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

				<View style={{ width: width - 20 }}>
					<View>
						<View
							style={{
								paddingHorizontal: 10,
								marginTop: 10,
								width: width - 20,
							}}
						>
							<Text style={styles.muscleName}>Front</Text>
						</View>

						<FlatList
							data={MUSCLE_FRONT_DATA}
							keyExtractor={item => item.id.toString()}
							numColumns={1} // или 3, если хочешь больше колонок
							contentContainerStyle={styles.gridContainer}
							scrollEnabled={false}
							renderItem={({ item: muscle }) => (
								<TouchableOpacity
									style={[
										styles.muscleItemGrid,
										selectedMuscle === muscle.id &&
											muscleSide == 'front' &&
											styles.selectedMuscleItemGrid,
									]}
									onPress={() => handleMuscleSelect(muscle.id, 'front')}
								>
									<View style={styles.muscleInfo}>
										<View style={[styles.muscleIcon]}>
											<Image
												transition={200}
												style={styles.bodyBackground}
												source={muscle.icon}
												resizeMode='contain'
											/>
										</View>

										<View style={styles.muscleTextContainer}>
											<Text style={styles.muscleName} numberOfLines={1}>
												{muscle.name}
											</Text>
											<Text style={styles.lastTrained} numberOfLines={1}>
												{muscle.lastTrained}
											</Text>
										</View>

										<View
											style={{
												borderRadius: 10,
												padding: 5,
												backgroundColor: getStatusColor(muscle.status),
											}}
										>
											<Text style={{ color: '#fff' }}>{muscle.recovery}%</Text>
										</View>
									</View>
								</TouchableOpacity>
							)}
						/>
					</View>

					<View
						style={{
							paddingHorizontal: 10,
							marginTop: 10,
							width: width - 20,
						}}
					>
						<Text style={styles.muscleName}>Back</Text>
					</View>

					<FlatList
						data={MUSCLE_BACK_DATA}
						keyExtractor={item => item.id.toString()}
						numColumns={1} // или 3, если хочешь больше колонок
						contentContainerStyle={styles.gridContainer}
						scrollEnabled={false}
						renderItem={({ item: muscle }) => (
							<TouchableOpacity
								style={[
									styles.muscleItemGrid,
									selectedMuscle === muscle.id &&
										muscleSide == 'back' &&
										styles.selectedMuscleItemGrid,
								]}
								onPress={() => handleMuscleSelect(muscle.id, 'back')}
							>
								<View style={styles.muscleInfo}>
									<View style={[styles.muscleIcon]}>
										<Image
											transition={200}
											style={styles.bodyBackground}
											source={muscle.icon}
											resizeMode='contain'
										/>
									</View>

									<View style={styles.muscleTextContainer}>
										<Text style={styles.muscleName} numberOfLines={1}>
											{muscle.name}
										</Text>
										<Text style={styles.lastTrained} numberOfLines={1}>
											{muscle.lastTrained}
										</Text>
									</View>

									<View
										style={{
											borderRadius: 10,
											padding: 5,
											backgroundColor: getStatusColor(muscle.status),
										}}
									>
										<Text style={{ color: '#fff' }}>{muscle.recovery}%</Text>
									</View>
								</View>
							</TouchableOpacity>
						)}
					/>
				</View>
			</View>
		</View>
	)

	const data = [{ id: 'model', component: renderModelTab() }]

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

				<View style={styles.modelSection}>
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
							{ useNativeDriver: false },
						)}
						onMomentumScrollEnd={event => {
							const contentOffsetX = event.nativeEvent.contentOffset.x
							const newIndex = Math.round(contentOffsetX / width)
						}}
						style={styles.horizontalScrollView}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	gridContainer: {
		padding: 5,
	},

	muscleItemGrid: {
		flex: 1,
		margin: 4,
		padding: 12,
		backgroundColor: '#1e1e1e',
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#333',
	},

	selectedMuscleItemGrid: {
		borderColor: '#00ff2aff', // или любой акцентный цвет
		borderWidth: 2,
	},

	muscleInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	muscleIcon: {
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
		backgroundColor: '#333',
		borderRadius: 10,
		overflow: 'hidden',
	},

	muscleIconText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},

	muscleTextContainer: {
		flex: 1,
		justifyContent: 'center',
	},

	muscleName: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},

	lastTrained: {
		color: '#888',
		fontSize: 13,
		marginTop: 2,
	},

	muscleStatus: {
		marginTop: 8,
	},

	recoveryBar: {
		height: 6,
		backgroundColor: '#333',
		borderRadius: 3,
		overflow: 'hidden',
	},

	recoveryFill: {
		height: '100%',
		borderRadius: 3,
	},
	container: {
		flex: 1,
		backgroundColor: '#121212',
		paddingBottom: -40,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingTop: 20,
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
		paddingHorizontal: 10,
	},
	sectionTitle: {
		paddingTop: 10,
		fontSize: 20,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	modelSection: {
		marginTop: 24,
		paddingHorizontal: 10,
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
		paddingHorizontal: 10,
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
		width: width - 20,
		alignSelf: 'center',
	},
	tabContainer: {
		width: width - 20,
		flex: 1,
	},
	diagramContainer: {
		backgroundColor: '#1C1C1E',
		borderRadius: 20,
		paddingHorizontal: 10,
		paddingBottom: 20,
		borderWidth: 1,
		borderColor: '#2C2C2E',
		alignItems: 'center',
	},
	bodyImageContainer: {
		width: '50%',
		height: 450,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
	},
	bodyBackground: {
		width: '180%',
		height: '180%',
		position: 'absolute',
		opacity: 0.6,
	},
	muscleImage: {
		width: '180%',
		height: '180%',
		position: 'absolute',
	},
	legend: {
		width: width - 40,
	},
	legendItem: {
		width: '100%',
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
		fontSize: 10,
		color: '#8E8E93',
	},
	toggleButton: {
		marginBottom: 20,
		paddingVertical: 10,
		paddingHorizontal: 10,
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
		marginHorizontal: 10,
		marginTop: 24,
		borderRadius: 20,
		padding: 10,
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
		borderColor: '#3A3A3C',
		borderWidth: 2,
	},
	selectedMuscleItem: {
		borderColor: '#34C759',
		borderWidth: 2,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
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
