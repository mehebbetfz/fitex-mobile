import { useDatabase } from '@/app/contexts/database-context'
import ExerciseHistoryModal from '@/app/modals/exercise-history-modal'
import { CachedVideo } from '@/components/cached-video'
import ManBackSvg from '@/components/man-back-svg'
import ManFrontSvg from '@/components/man-front-svg'
import {
	manBackMuscleGroupParts,
	manFrontMuscleGroupParts,
} from '@/constants/images'
import { muscle_groups } from '@/constants/muscle-groups'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Haptics from 'expo-haptics'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useVideoPlayer } from 'expo-video'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	Alert,
	Animated,
	AppState,
	Dimensions,
	FlatList,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const WORKOUT_START_TIME_KEY = '@workout_start_time'
const WORKOUT_ACTIVE_KEY = '@workout_active'

const COLORS = {
	green: '#1cd22eff',
	primary: '#34C759',
	primaryDark: '#2CAE4E',
	background: '#000',
	card: '#1C1C1E',
	cardLight: '#2C2C2E',
	border: '#3A3A3C',
	text: '#FFFFFF',
	textSecondary: '#8E8E93',
	error: '#FF3B30',
	warning: '#FF9500',
	success: '#34C759',
	info: '#5AC8FA',
} as const

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface ExerciseSet {
	id?: number
	setNumber: number
	weight: number
	reps: number
	completed: boolean
}

interface Exercise {
	id?: number
	name: string
	muscleGroup: string
	sets: ExerciseSet[]
	collapsed: boolean
	order_index: number
}

interface ExerciseDetail {
	id: string
	name: string
	description: string
	image: any
	imagePosition?: any
	images?: any[]
	videoUrl?: string
	primaryMuscles: string[]
	secondaryMuscles: string[]
	primaryFrontMuscles: string[]
	secondaryFrontMuscles: string[]
	primaryBackMuscles: string[]
	secondaryBackMuscles: string[]
	tips: string[]
	equipment: string[]
	difficulty: 'Начинающий' | 'Средний' | 'Продвинутый'
}

interface MuscleSubgroup {
	id: string
	name: string
	image: any
	exercises: ExerciseDetail[]
}

interface MuscleGroup {
	id: string
	name: string
	image: any
	imagePosition?: any
	subgroups: MuscleSubgroup[]
}

const MUSCLE_GROUPS: MuscleGroup[] = muscle_groups

interface ExerciseSelectionModalProps {
	visible: boolean
	onClose: () => void
	onSelectExercise: (exercise: { name: string; muscleGroup: string }) => void
}

const MUSCLE_FRONT_DATA = [
	{
		id: 'chest',
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
		id: 'press',
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
		id: 'arms',
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
		id: 'deltoids',
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
		id: 'legs',
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
]

const MUSCLE_BACK_DATA = [
	{
		id: 'spine',
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
			'leftLowerTrapezius',
			'leftUpperTrapezius',
			'rightLowerTrapezius',
			'rightUpperTrapezius',
			'rightThoracolumbarFascia',
		],
		icon: manBackMuscleGroupParts.deltoidFull,
	},
]

// ─────────────────────────────────────────────
// Стили заголовка подгруппы
// ─────────────────────────────────────────────
const subgroupHeaderStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 20,
		marginHorizontal: 4,
	},
	line: {
		flex: 1,
		height: 1,
		backgroundColor: COLORS.border,
	},
	title: {
		fontSize: 11,
		fontWeight: '700',
		color: COLORS.textSecondary,
		textTransform: 'uppercase',
		letterSpacing: 1.2,
		marginHorizontal: 12,
	},
})

// ─────────────────────────────────────────────
// ExerciseSelectionModal
// ─────────────────────────────────────────────
const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({
	visible,
	onClose,
	onSelectExercise,
}) => {
	const [currentScreen, setCurrentScreen] = useState<
		'groups' | 'exercises' | 'detail'
	>('groups')
	const [selectedMuscleGroup, setSelectedMuscleGroup] =
		useState<MuscleGroup | null>(null)
	const [selectedExercise, setSelectedExercise] =
		useState<ExerciseDetail | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [activeTab, setActiveTab] = useState<'groups' | 'search'>('groups')
	const [favorites, setFavorites] = useState<string[]>([])
	const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
	const [modalVisible, setModalVisible] = useState(false)

	const getSideAndColorsForGroup = (
		groupName: string,
	): { side: 'front' | 'back'; colors: { [key: string]: string } } => {
		const frontGroup = MUSCLE_FRONT_DATA.find(g => g.id === groupName)
		if (frontGroup) {
			const colors: { [key: string]: string } = {}
			frontGroup.muscleImages.forEach(key => {
				colors[key] = COLORS.green
			})
			return { side: 'front', colors }
		}

		const backGroup = MUSCLE_BACK_DATA.find(g => g.id === groupName)
		if (backGroup) {
			const colors: { [key: string]: string } = {}
			backGroup.muscleImages.forEach(key => {
				colors[key] = COLORS.green
			})
			return { side: 'back', colors }
		}

		return { side: 'front', colors: {} }
	}

	useEffect(() => {
		if (visible) {
			setModalVisible(true)
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
		} else {
			Animated.timing(slideAnim, {
				toValue: SCREEN_HEIGHT,
				duration: 250,
				useNativeDriver: true,
			}).start(() => {
				setModalVisible(false)
				setCurrentScreen('groups')
				setSelectedMuscleGroup(null)
				setSelectedExercise(null)
				setSearchQuery('')
			})
		}
	}, [visible])

	const toggleFavorite = (exerciseId: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

		setFavorites(prev =>
			prev.includes(exerciseId)
				? prev.filter(id => id !== exerciseId)
				: [...prev, exerciseId],
		)
	}

	// ── handleBack: убран шаг subgroups ──
	const handleBack = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		if (currentScreen === 'groups') {
			onClose()
		} else if (currentScreen === 'exercises') {
			setCurrentScreen('groups')
			setSelectedMuscleGroup(null)
		} else if (currentScreen === 'detail') {
			setCurrentScreen('exercises')
			setSelectedExercise(null)
		}
	}

	const handleSelectExercise = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

		if (selectedExercise) {
			onSelectExercise({
				name: selectedExercise.name,
				muscleGroup: selectedMuscleGroup?.name || '',
			})
			onClose()
		}
	}

	const getTintColor = (percent: number): string => {
		const p = Math.max(0, Math.min(100, percent)) / 100
		const r = 255
		const g = Math.round(255 * (1 - p))
		const b = 0
		const hexR = r.toString(16).padStart(2, '0')
		const hexG = g.toString(16).padStart(2, '0')
		const hexB = b.toString(16).padStart(2, '0')
		return `#${hexR}${hexG}${hexB}`
	}

	const getFrontMuscleColors = (exercise: any) => {
		const { primaryFrontMuscles, secondaryFrontMuscles } = exercise
		const muscleColors: { [key: string]: string } = {}
		MUSCLE_FRONT_DATA.forEach(muscle => {
			muscle.muscleImages.forEach(imageKey => {
				if (primaryFrontMuscles.includes(imageKey))
					muscleColors[imageKey] = getTintColor(100)
				if (secondaryFrontMuscles.includes(imageKey))
					muscleColors[imageKey] = getTintColor(50)
			})
		})
		return muscleColors
	}

	const getBackMuscleColors = (exercise: any) => {
		const { primaryBackMuscles, secondaryBackMuscles } = exercise
		const muscleColors: { [key: string]: string } = {}
		MUSCLE_BACK_DATA.forEach(muscle => {
			muscle.muscleImages.forEach(imageKey => {
				if (primaryBackMuscles.includes(imageKey))
					muscleColors[imageKey] = getTintColor(100)
				if (secondaryBackMuscles.includes(imageKey))
					muscleColors[imageKey] = getTintColor(50)
			})
		})
		return muscleColors
	}

	const filteredExercises = useMemo(() => {
		if (!searchQuery) return []
		const query = searchQuery.toLowerCase()
		return MUSCLE_GROUPS.flatMap(group =>
			group.subgroups.flatMap(subgroup =>
				subgroup.exercises.filter(
					exercise =>
						exercise.name.toLowerCase().includes(query) ||
						exercise.description.toLowerCase().includes(query) ||
						exercise.primaryMuscles.some(muscle =>
							muscle.toLowerCase().includes(query),
						),
				),
			),
		)
	}, [searchQuery])

	const renderHeader = () => {
		let title = 'Выберите упражнение'
		if (currentScreen === 'exercises') title = selectedMuscleGroup?.name || ''
		if (currentScreen === 'detail') title = selectedExercise?.name || ''

		return (
			<View style={modalStyles.header}>
				<TouchableOpacity
					style={modalStyles.backButton}
					onPress={handleBack}
					activeOpacity={0.7}
				>
					<Ionicons
						name={currentScreen === 'groups' ? 'close' : 'arrow-back'}
						size={24}
						color={COLORS.text}
					/>
				</TouchableOpacity>
				<Text style={modalStyles.headerTitle} numberOfLines={1}>
					{title}
				</Text>

				{selectedExercise && (
					<TouchableOpacity onPress={() => toggleFavorite(selectedExercise.id)}>
						<Ionicons
							name={
								favorites.includes(selectedExercise.id)
									? 'star'
									: 'star-outline'
							}
							size={24}
							color={
								favorites.includes(selectedExercise.id)
									? COLORS.primary
									: COLORS.textSecondary
							}
						/>
					</TouchableOpacity>
				)}
			</View>
		)
	}

	const renderTabs = () => (
		<View style={modalStyles.tabsContainer}>
			<TouchableOpacity
				style={[
					modalStyles.tab,
					activeTab === 'groups' && modalStyles.activeTab,
				]}
				onPress={() => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
					setActiveTab('groups')
				}}
			>
				<Ionicons
					name='apps-outline'
					size={20}
					color={activeTab === 'groups' ? COLORS.primary : COLORS.textSecondary}
				/>
				<Text
					style={[
						modalStyles.tabText,
						activeTab === 'groups' && modalStyles.activeTabText,
					]}
				>
					Группы
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					modalStyles.tab,
					activeTab === 'search' && modalStyles.activeTab,
				]}
				onPress={() => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
					setActiveTab('search')
					setSearchQuery('')
				}}
			>
				<Ionicons
					name='search-outline'
					size={20}
					color={activeTab === 'search' ? COLORS.primary : COLORS.textSecondary}
				/>
				<Text
					style={[
						modalStyles.tabText,
						activeTab === 'search' && modalStyles.activeTabText,
					]}
				>
					Поиск
				</Text>
			</TouchableOpacity>
		</View>
	)

	const renderSearch = () => (
		<View style={modalStyles.searchContainer}>
			<View style={modalStyles.searchInner}>
				<Ionicons name='search' size={20} color={COLORS.textSecondary} />
				<TextInput
					style={modalStyles.searchInput}
					placeholder='Поиск упражнений...'
					placeholderTextColor={COLORS.textSecondary}
					value={searchQuery}
					onChangeText={setSearchQuery}
					autoFocus={activeTab === 'search'}
				/>
				{searchQuery.length > 0 && (
					<TouchableOpacity onPress={() => setSearchQuery('')}>
						<Ionicons
							name='close-circle'
							size={20}
							color={COLORS.textSecondary}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	)

	// ── Карточки групп мышц: нажатие → сразу exercises ──
	const renderMuscleGroups = () => (
		<FlatList
			data={MUSCLE_GROUPS}
			keyExtractor={item => item.id}
			numColumns={2}
			columnWrapperStyle={modalStyles.columnWrapper}
			contentContainerStyle={modalStyles.muscleGroupsGrid}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => {
				const { side, colors } = getSideAndColorsForGroup(item.id)
				return (
					<TouchableOpacity
						style={modalStyles.muscleGroupCard}
						onPress={() => {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
							setSelectedMuscleGroup(item)
							setCurrentScreen('exercises') // ← сразу в список
						}}
						activeOpacity={0.7}
					>
						<View style={modalStyles.muscleGroupImageContainer}>
							{side === 'front' ? (
								<View
									style={{
										...detailModalStyles.bodyImageContainer,
										position: 'absolute',
										top: item.imagePosition ? item.imagePosition.top : 0,
									}}
								>
									<ManFrontSvg muscleColors={colors} />
								</View>
							) : (
								<View
									style={{
										...detailModalStyles.bodyImageContainer,
										position: 'absolute',
										top: item.imagePosition ? item.imagePosition.top : 0,
									}}
								>
									<ManBackSvg muscleColors={colors} />
								</View>
							)}
						</View>
						<View
							style={{
								backgroundColor: COLORS.cardLight,
								borderBottomLeftRadius: 12,
								borderBottomRightRadius: 12,
							}}
						>
							<Text style={modalStyles.muscleGroupName}>{item.name}</Text>
							<Text style={modalStyles.muscleGroupCount}>
								{item.subgroups.reduce(
									(acc, sg) => acc + sg.exercises.length,
									0,
								)}{' '}
								упражнений
							</Text>
						</View>
					</TouchableOpacity>
				)
			}}
		/>
	)

	// ── Один элемент списка упражнений ──
	const renderExerciseListItem = (item: ExerciseDetail) => (
		<TouchableOpacity
			key={item.id}
			style={modalStyles.exerciseListItem}
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
				setSelectedExercise(item)
				setCurrentScreen('detail')
			}}
			activeOpacity={0.7}
		>
			<View style={modalStyles.exerciseListImage}>
				<Image
					transition={200}
					source={item.image}
					style={{
						position: 'absolute',
						width: item.imagePosition ? item.imagePosition.width : '100%',
						height: '100%',
						left: item.imagePosition ? item.imagePosition.left : 0,
						transform: [
							{ scaleX: item.imagePosition ? item.imagePosition.scaleX : 1 },
						],
					}}
				/>
			</View>

			<View style={modalStyles.exerciseListContent}>
				<View style={modalStyles.exerciseListHeader}>
					<Text style={modalStyles.exerciseListName} numberOfLines={1}>
						{item.name}
					</Text>
					<TouchableOpacity
						onPress={e => {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
							e.stopPropagation()
							toggleFavorite(item.id)
						}}
					>
						<Ionicons
							name={favorites.includes(item.id) ? 'star' : 'star-outline'}
							size={22}
							color={
								favorites.includes(item.id)
									? COLORS.primary
									: COLORS.textSecondary
							}
						/>
					</TouchableOpacity>
				</View>
				<Text style={modalStyles.exerciseListDescription} numberOfLines={2}>
					{item.description}
				</Text>
				<View style={modalStyles.exerciseListTags}>
					<View style={modalStyles.difficultyTag}>
						<Text style={modalStyles.difficultyText}>{item.difficulty}</Text>
					</View>
					<View style={modalStyles.equipmentTag}>
						<Text style={modalStyles.equipmentText}>
							{item.equipment.length > 1
								? `${item.equipment[0]} +${item.equipment.length - 1}`
								: item.equipment[0]}
						</Text>
					</View>
				</View>
			</View>
			<Ionicons name='chevron-forward' size={20} color={COLORS.textSecondary} />
		</TouchableOpacity>
	)

	// ── Список упражнений: сгруппированный по подгруппам или поиск ──
	const renderExercisesList = () => {
		// Режим поиска — плоский список
		if (activeTab === 'search' || !selectedMuscleGroup) {
			return (
				<FlatList
					data={filteredExercises}
					keyExtractor={item => item.id}
					contentContainerStyle={modalStyles.exercisesList}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => renderExerciseListItem(item)}
					ListEmptyComponent={
						<View style={modalStyles.emptyState}>
							<Ionicons
								name='search-outline'
								size={64}
								color={COLORS.textSecondary}
							/>
							<Text style={modalStyles.emptyStateTitle}>Ничего не найдено</Text>
						</View>
					}
				/>
			)
		}

		// Группируем по подгруппам
		const sections = selectedMuscleGroup.subgroups
			.map(subgroup => ({ subgroup, exercises: subgroup.exercises }))
			.filter(s => s.exercises.length > 0)

		return (
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					modalStyles.exercisesList,
					{ paddingBottom: 40 },
				]}
			>
				{sections.map(({ subgroup, exercises }, sectionIndex) => (
					<View key={subgroup.id}>
						{/* Заголовок подгруппы */}
						<View style={subgroupHeaderStyles.container}>
							<View style={subgroupHeaderStyles.line} />
							<Text style={subgroupHeaderStyles.title}>{subgroup.name}</Text>
							<View style={subgroupHeaderStyles.line} />
						</View>
						{/* Упражнения подгруппы */}
						{exercises.map(item => renderExerciseListItem(item))}
					</View>
				))}
			</ScrollView>
		)
	}

	const player = useVideoPlayer({ uri: selectedExercise?.videoUrl }, player => {
		player.loop = true
		player.play()
		player.muted = true
	})

	const renderExerciseDetail = () => {
		if (!selectedExercise) return null

		return (
			<View style={{ flex: 1, backgroundColor: COLORS.background }}>
				<ScrollView
					style={modalStyles.exerciseDetailContainer}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 120 }}
					keyboardShouldPersistTaps='handled'
				>
					<View style={modalStyles.exerciseDetailContent}>
						<View style={modalStyles.exerciseHeader}>
							<View style={modalStyles.exerciseTitleContainer}>
								<Text style={modalStyles.exerciseDetailTitle}>
									{selectedExercise.name}
								</Text>
							</View>

							{selectedExercise.videoUrl && (
								<CachedVideo
									remoteUrl={selectedExercise?.videoUrl}
									videoId={selectedExercise?.id ?? ''}
									style={styles.video}
									autoPlay={true}
									loop={true}
									muted={true}
								/>
							)}

							{selectedExercise.images &&
								selectedExercise.images.length > 0 && (
									<ImageGallery images={selectedExercise.images} />
								)}

							{!selectedExercise.videoUrl &&
								(!selectedExercise.images ||
									selectedExercise.images.length === 0) && (
									<View style={detailModalStyles.exerciseImageContainer}>
										<Image
											transition={200}
											source={selectedExercise.image}
											style={detailModalStyles.exerciseMainImage}
										/>
									</View>
								)}

							{!selectedExercise.videoUrl && (
								<View style={detailModalStyles.exerciseImageContainer}>
									<Image
										transition={200}
										source={selectedExercise.image}
										style={detailModalStyles.exerciseMainImage}
									/>
								</View>
							)}

							<Text style={modalStyles.exerciseDetailDescriptionFull}>
								{selectedExercise.description}
							</Text>

							<View style={modalStyles.detailStats}>
								<View style={modalStyles.detailStat}>
									<View style={modalStyles.detailStatIcon}>
										<Ionicons name='barbell' size={18} color={COLORS.primary} />
									</View>
									<View>
										<Text style={modalStyles.detailStatLabel}>Сложность</Text>
										<Text style={modalStyles.detailStatValue}>
											{selectedExercise.difficulty}
										</Text>
									</View>
								</View>
								<View style={modalStyles.detailStat}>
									<View style={modalStyles.detailStatIcon}>
										<Ionicons
											name='construct'
											size={18}
											color={COLORS.primary}
										/>
									</View>
									<View>
										<Text style={modalStyles.detailStatLabel}>
											Оборудование
										</Text>
										<Text style={modalStyles.detailStatValue}>
											{selectedExercise.equipment.join(', ')}
										</Text>
									</View>
								</View>
							</View>
						</View>

						<View style={modalStyles.section}>
							<Text style={modalStyles.sectionTitle}>Работающие мышцы</Text>
							<View style={modalStyles.muscleGroupsGridDetail}>
								<View style={modalStyles.muscleGroupItem}>
									<View style={modalStyles.muscleGroupHeader}>
										<Ionicons name='star' size={16} color={COLORS.primary} />
										<Text style={modalStyles.muscleGroupLabel}>Основные:</Text>
									</View>
									{selectedExercise.primaryMuscles.map((muscle, index) => (
										<View key={index} style={modalStyles.muscleItem}>
											<View style={modalStyles.muscleDot} />
											<Text style={modalStyles.muscleText}>{muscle}</Text>
										</View>
									))}
								</View>

								{selectedExercise.secondaryMuscles.length > 0 && (
									<View style={modalStyles.muscleGroupItem}>
										<View style={modalStyles.muscleGroupHeader}>
											<Ionicons
												name='star-outline'
												size={16}
												color={COLORS.textSecondary}
											/>
											<Text style={modalStyles.muscleGroupLabel}>
												Второстепенные:
											</Text>
										</View>
										{selectedExercise.secondaryMuscles.map((muscle, index) => (
											<View key={index} style={modalStyles.muscleItem}>
												<View style={modalStyles.muscleDotSecondary} />
												<Text style={modalStyles.muscleTextSecondary}>
													{muscle}
												</Text>
											</View>
										))}
									</View>
								)}
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={styles.bodyImageContainer}>
									<ManBackSvg
										muscleColors={getBackMuscleColors(selectedExercise)}
									/>
								</View>
								<View style={styles.bodyImageContainer}>
									<ManFrontSvg
										muscleColors={getFrontMuscleColors(selectedExercise)}
									/>
								</View>
							</View>
						</View>

						<View style={modalStyles.section}>
							<Text style={modalStyles.sectionTitle}>Техника выполнения</Text>
							<View style={modalStyles.tipsList}>
								{selectedExercise.tips.map((tip, index) => (
									<View
										key={index}
										style={{
											...modalStyles.tipItem,
											borderBottomWidth:
												index !== selectedExercise.tips.length - 1 ? 1 : 0,
											borderBottomColor: COLORS.border,
										}}
									>
										<View style={modalStyles.tipNumber}>
											<Text style={modalStyles.tipNumberText}>{index + 1}</Text>
										</View>
										<Text style={modalStyles.tipText}>{tip}</Text>
									</View>
								))}
							</View>
						</View>

						<View style={modalStyles.spacer} />
					</View>
				</ScrollView>

				<View style={modalStyles.fixedBottomButtonContainer}>
					<TouchableOpacity
						style={modalStyles.confirmButton}
						onPress={handleSelectExercise}
						activeOpacity={0.7}
					>
						<Text style={modalStyles.confirmButtonText}>
							Добавить в тренировку
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	if (!modalVisible) return null

	return (
		<Modal
			transparent
			visible={modalVisible}
			animationType='none'
			onRequestClose={onClose}
		>
			<View style={modalStyles.modalOverlay}>
				<TouchableOpacity
					style={modalStyles.modalBackdrop}
					activeOpacity={1}
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

						onClose()
					}}
				/>
				<Animated.View
					style={[
						modalStyles.modalContainer,
						{ transform: [{ translateY: slideAnim }] },
					]}
				>
					{renderHeader()}

					<View style={modalStyles.content}>
						{currentScreen === 'groups' && (
							<>
								{renderTabs()}
								{activeTab === 'search' && renderSearch()}
								{activeTab === 'groups' && renderMuscleGroups()}
								{activeTab === 'search' && renderExercisesList()}
							</>
						)}

						{/* Убран блок subgroups — его больше нет */}

						{currentScreen === 'exercises' && renderExercisesList()}

						{currentScreen === 'detail' && renderExerciseDetail()}
					</View>
				</Animated.View>
			</View>
		</Modal>
	)
}

// ─────────────────────────────────────────────
// SetRow
// ─────────────────────────────────────────────
interface SetRowProps {
	set: ExerciseSet
	exerciseId: number
	onComplete: (exerciseId: number, setId: number) => void
	onUpdate: (
		exerciseId: number,
		setId: number,
		field: 'weight' | 'reps',
		value: string,
	) => void
	onRemove: (exerciseId: number, setId: number) => void
}

const SetRow: React.FC<SetRowProps> = React.memo(
	({ set, exerciseId, onComplete, onUpdate, onRemove }) => {
		return (
			<View style={styles.setRow}>
				<View style={styles.setNumberContainer}>
					<Text style={styles.setNumber}>{set.setNumber}</Text>
				</View>

				<View style={styles.setInputContainer}>
					<TextInput
						style={[
							styles.input,
							set.completed && styles.inputCompleted,
							styles.weightInput,
						]}
						value={set.weight === 0 ? '' : set.weight.toString()}
						onChangeText={value => {
							if (set.id) onUpdate(exerciseId, set.id, 'weight', value)
						}}
						keyboardType='numeric'
						placeholder='0'
						placeholderTextColor={COLORS.textSecondary}
					/>
					<Text style={styles.inputLabel}>кг</Text>
				</View>

				<View style={styles.setInputContainer}>
					<TextInput
						style={[
							styles.input,
							set.completed && styles.inputCompleted,
							styles.repsInput,
						]}
						value={set.reps === 0 ? '' : set.reps.toString()}
						onChangeText={value => {
							if (set.id) onUpdate(exerciseId, set.id, 'reps', value)
						}}
						keyboardType='numeric'
						placeholder='0'
						placeholderTextColor={COLORS.textSecondary}
					/>
				</View>

				<TouchableOpacity
					style={[styles.checkbox, set.completed && styles.checkboxCompleted]}
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
						if (set.id) onComplete(exerciseId, set.id)
					}}
					activeOpacity={0.6}
				>
					{set.completed && (
						<Ionicons name='checkmark' size={16} color={COLORS.background} />
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.deleteButton}
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

						if (set.id) onRemove(exerciseId, set.id)
					}}
					activeOpacity={0.6}
				>
					<Ionicons name='close' size={18} color={COLORS.error} />
				</TouchableOpacity>
			</View>
		)
	},
)

// ─────────────────────────────────────────────
// ExerciseItem
// ─────────────────────────────────────────────
interface ExerciseItemProps {
	exercise: Exercise
	onToggleCollapse: (id: number) => void
	onSetComplete: (exerciseId: number, setId: number) => void
	onUpdateSet: (
		exerciseId: number,
		setId: number,
		field: 'weight' | 'reps',
		value: string,
	) => void
	onRemoveSet: (exerciseId: number, setId: number) => void
	onAddSet: (exerciseId: number) => void
	onRemoveExercise: (exerciseId: number) => void
	onShowHistory?: () => void
	onShowExerciseDetails: (exerciseName: string) => ExerciseDetail | null
}

const ExerciseItem: React.FC<ExerciseItemProps> = React.memo(
	({
		exercise,
		onToggleCollapse,
		onSetComplete,
		onUpdateSet,
		onRemoveSet,
		onAddSet,
		onRemoveExercise,
		onShowHistory,
		onShowExerciseDetails,
	}) => {
		const [showHistoryModal, setShowHistoryModal] = useState(false)
		const [showDetailsModal, setShowDetailsModal] = useState(false)
		const [exerciseDetail, setExerciseDetail] = useState<ExerciseDetail | null>(
			null,
		)

		const completedSets = exercise.sets.filter(set => set.completed).length
		const totalSets = exercise.sets.length

		const handleShowDetails = () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

			const detail = onShowExerciseDetails(exercise.name)
			setExerciseDetail(detail)
			setShowDetailsModal(true)
		}

		return (
			<View style={styles.exerciseCard}>
				<View style={styles.exerciseHeader}>
					<TouchableOpacity
						style={styles.exerciseHeaderLeft}
						onPress={() => {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

							if (exercise.id) onToggleCollapse(exercise.id)
						}}
						activeOpacity={0.7}
					>
						<Ionicons
							name={exercise.collapsed ? 'chevron-down' : 'chevron-up'}
							size={20}
							color={COLORS.primary}
						/>
						<View style={styles.exerciseInfo}>
							<Text style={styles.exerciseName}>{exercise.name}</Text>
							<View style={styles.exerciseMeta}>
								<View style={{ flexDirection: 'row' }}>
									<View style={styles.muscleGroupTag}>
										<Text style={styles.muscleGroupText}>
											{exercise.muscleGroup}
										</Text>
									</View>
									<View style={styles.setsIndicator}>
										<Ionicons
											name='barbell-outline'
											size={12}
											color={COLORS.textSecondary}
										/>
										<Text style={styles.setsText}>
											{completedSets}/{totalSets}
										</Text>
									</View>
								</View>

								<View style={styles.exerciseHeaderRight}>
									<TouchableOpacity
										style={styles.infoButton}
										onPress={handleShowDetails}
										activeOpacity={0.7}
									>
										<Ionicons
											name='information-circle-outline'
											size={23}
											color={COLORS.warning}
										/>
									</TouchableOpacity>

									{exercise.sets.length > 0 && (
										<TouchableOpacity
											style={styles.historyButton}
											onPress={() => {
												Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

												setShowHistoryModal(true)
											}}
											activeOpacity={0.7}
										>
											<Ionicons
												name='time-outline'
												size={20}
												color={COLORS.textSecondary}
											/>
										</TouchableOpacity>
									)}

									<TouchableOpacity
										style={styles.deleteExerciseButton}
										onPress={() => {
											Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

											if (exercise.id) {
												Alert.alert(
													'Удалить упражнение?',
													'Все подходы также будут удалены',
													[
														{ text: 'Отмена', style: 'cancel' },
														{
															text: 'Удалить',
															style: 'destructive',
															onPress: () => {
																Haptics.impactAsync(
																	Haptics.ImpactFeedbackStyle.Medium,
																)

																onRemoveExercise(exercise.id!)
															},
														},
													],
												)
											}
										}}
										activeOpacity={0.7}
									>
										<Ionicons
											name='trash-outline'
											size={20}
											color={COLORS.error}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>

				<ExerciseHistoryModal
					visible={showHistoryModal}
					onClose={() => setShowHistoryModal(false)}
					exerciseName={exercise.name}
					currentSets={exercise.sets}
				/>

				{showDetailsModal && (
					<ExerciseDetailModal
						visible={showDetailsModal}
						onClose={() => setShowDetailsModal(false)}
						exerciseDetail={exerciseDetail}
					/>
				)}

				{!exercise.collapsed && (
					<>
						<View style={styles.setsContainer}>
							<View style={styles.setsHeader}>
								<Text
									style={{
										...styles.setHeaderText,
										...styles.setNumberContainer,
										width: 30,
									}}
								>
									#
								</Text>
								<Text style={{ ...styles.setHeaderText, width: 70 }}>Вес</Text>
								<Text style={{ ...styles.setHeaderText, width: 30 }}></Text>
								<Text style={{ ...styles.setHeaderText, width: 70 }}>
									Повт.
								</Text>
								<Text style={{ ...styles.setHeaderText, width: 40 }}>✓</Text>
								<Text style={{ ...styles.setHeaderText, width: 20 }}>x</Text>
							</View>

							{exercise.sets.map(set => (
								<SetRow
									key={set.id || `${exercise.id}-${set.setNumber}`}
									set={set}
									exerciseId={exercise.id!}
									onComplete={onSetComplete}
									onUpdate={onUpdateSet}
									onRemove={onRemoveSet}
								/>
							))}
						</View>

						<TouchableOpacity
							style={styles.addSetButton}
							onPress={() => {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

								if (exercise.id) {
									onAddSet(exercise.id)
								}
							}}
							activeOpacity={0.7}
						>
							<Ionicons
								name='add-circle-outline'
								size={20}
								color={COLORS.primary}
							/>
							<Text style={styles.addSetText}>Добавить подход</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		)
	},
)

// ─────────────────────────────────────────────
// CreateWorkoutScreen (main)
// ─────────────────────────────────────────────
export default function CreateWorkoutScreen() {
	const router = useRouter()
	const { completeWorkout } = useDatabase()

	const [exercises, setExercises] = useState<Exercise[]>([])
	const [workoutName, setWorkoutName] = useState('Моя тренировка')
	const [timer, setTimer] = useState(0)
	const [isWorkoutActive, setIsWorkoutActive] = useState(false)
	const [isTimerRunning, setIsTimerRunning] = useState(false)
	const [notes, setNotes] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [showExerciseSelection, setShowExerciseSelection] = useState(false)
	const [workoutDuration, setWorkoutDuration] = useState(0)

	useEffect(() => {
		loadWorkoutState()
		const appStateSubscription = AppState.addEventListener(
			'change',
			handleAppStateChange,
		)
		return () => {
			appStateSubscription.remove()
		}
	}, [])

	const loadWorkoutState = async () => {
		try {
			const [startTimeStr, isActiveStr] = await Promise.all([
				AsyncStorage.getItem(WORKOUT_START_TIME_KEY),
				AsyncStorage.getItem(WORKOUT_ACTIVE_KEY),
			])
			const isActive = isActiveStr === 'true'
			setIsWorkoutActive(isActive)
			if (isActive && startTimeStr) {
				const startTime = parseInt(startTimeStr, 10)
				const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
				setWorkoutDuration(elapsedSeconds)
			}
		} catch (error) {
			console.error('Error loading workout state:', error)
		}
	}

	const handleAppStateChange = async (nextAppState: string) => {
		if (nextAppState === 'active' && isWorkoutActive) {
			await updateWorkoutDuration()
		}
	}

	const updateWorkoutDuration = async () => {
		try {
			const startTimeStr = await AsyncStorage.getItem(WORKOUT_START_TIME_KEY)
			if (startTimeStr) {
				const startTime = parseInt(startTimeStr, 10)
				const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
				setWorkoutDuration(elapsedSeconds)
			}
		} catch (error) {
			console.error('Error updating workout duration:', error)
		}
	}

	useEffect(() => {
		let interval: NodeJS.Timeout
		if (isWorkoutActive) {
			interval = setInterval(() => {
				setWorkoutDuration(prev => prev + 1)
			}, 1000)
		}
		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isWorkoutActive])

	useEffect(() => {
		let interval: NodeJS.Timeout
		if (isTimerRunning) {
			interval = setInterval(() => {
				setTimer(prev => prev + 1)
			}, 1000)
		}
		return () => clearInterval(interval)
	}, [isTimerRunning])

	const startWorkoutTimer = async () => {
		try {
			const startTime = Date.now()
			await Promise.all([
				AsyncStorage.setItem(WORKOUT_START_TIME_KEY, startTime.toString()),
				AsyncStorage.setItem(WORKOUT_ACTIVE_KEY, 'true'),
			])
			setIsWorkoutActive(true)
			setWorkoutDuration(0)
		} catch (error) {
			console.error('Error starting workout timer:', error)
		}
	}

	const stopWorkoutTimer = async () => {
		try {
			await Promise.all([
				AsyncStorage.removeItem(WORKOUT_START_TIME_KEY),
				AsyncStorage.removeItem(WORKOUT_ACTIVE_KEY),
			])
			setIsWorkoutActive(false)
		} catch (error) {
			console.error('Error stopping workout timer:', error)
		}
	}

	const { totalCompleted, totalSets, totalVolume } = useMemo(() => {
		let totalSets = 0
		let totalCompleted = 0
		let totalVolume = 0
		exercises.forEach(exercise => {
			exercise.sets.forEach(set => {
				totalSets++
				if (set.completed) totalCompleted++
				totalVolume += set.weight * set.reps
			})
		})
		return { totalCompleted, totalSets, totalVolume }
	}, [exercises])

	const formatTime = useCallback((seconds: number) => {
		const hrs = Math.floor(seconds / 3600)
		const mins = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60
		if (hrs > 0) {
			return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
		}
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}, [])

	const toggleExerciseCollapse = (exerciseId: number) => {
		setExercises(prev =>
			prev.map(exercise =>
				exercise.id === exerciseId
					? { ...exercise, collapsed: !exercise.collapsed }
					: exercise,
			),
		)
	}

	const handleSetComplete = (exerciseId: number, setId: number) => {
		setExercises(prevExercises =>
			prevExercises.map(exercise => {
				if (exercise.id === exerciseId) {
					const updatedSets = exercise.sets.map(set =>
						set.id === setId ? { ...set, completed: !set.completed } : set,
					)
					return { ...exercise, sets: updatedSets }
				}
				return exercise
			}),
		)
	}

	const handleUpdateSet = (
		exerciseId: number,
		setId: number,
		field: 'weight' | 'reps',
		value: string,
	) => {
		const numValue = value === '' ? 0 : parseFloat(value) || 0
		const validatedValue = Math.min(Math.max(numValue, 0), 999)
		setExercises(prev =>
			prev.map(exercise =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.map(set =>
								set.id === setId ? { ...set, [field]: validatedValue } : set,
							),
						}
					: exercise,
			),
		)
	}

	const handleRemoveSet = (exerciseId: number, setId: number) => {
		Alert.alert('Удалить подход?', 'Это действие нельзя отменить', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Удалить',
				style: 'destructive',
				onPress: () => {
					setExercises(prev =>
						prev.map(exercise =>
							exercise.id === exerciseId
								? {
										...exercise,
										sets: exercise.sets.filter(set => set.id !== setId),
									}
								: exercise,
						),
					)
				},
			},
		])
	}

	const handleAddSet = (exerciseId: number) => {
		setExercises(prev =>
			prev.map(exercise => {
				if (exercise.id === exerciseId) {
					const maxSetNumber = exercise.sets.reduce(
						(max, set) => Math.max(max, set.setNumber),
						0,
					)
					const tempId = Date.now() + Math.random()
					return {
						...exercise,
						sets: [
							...exercise.sets,
							{
								id: tempId,
								setNumber: maxSetNumber + 1,
								weight: 0,
								reps: 0,
								completed: false,
							},
						],
					}
				}
				return exercise
			}),
		)
	}

	const handleRemoveExercise = (exerciseId: number) => {
		Alert.alert('Удалить упражнение?', 'Все подходы также будут удалены', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Удалить',
				style: 'destructive',
				onPress: () => {
					setExercises(prev => {
						const newExercises = prev.filter(ex => ex.id !== exerciseId)
						if (newExercises.length === 0 && prev.length > 0) stopWorkoutTimer()
						return newExercises
					})
				},
			},
		])
	}

	const handleExerciseSelect = (exercise: {
		name: string
		muscleGroup: string
	}) => {
		const tempId = Date.now() + Math.random()
		const newExercise: Exercise = {
			id: tempId,
			name: exercise.name,
			muscleGroup: exercise.muscleGroup,
			sets: [],
			collapsed: false,
			order_index: exercises.length,
		}

		setExercises(prev => {
			const newExercises = [...prev, newExercise]
			if (prev.length === 0 && newExercises.length === 1) startWorkoutTimer()
			return newExercises
		})
	}

	const handleFinishWorkout = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

		if (!workoutName.trim()) {
			Alert.alert('Ошибка', 'Введите название тренировки')
			return
		}
		if (exercises.length === 0) {
			Alert.alert('Ошибка', 'Добавьте хотя бы одно упражнение')
			return
		}

		Alert.alert(
			'Завершить тренировку?',
			`Вы выполнили ${exercises.length} упражнений, ${totalSets} подходов\nОбщий объем: ${totalVolume} кг\nВремя: ${formatTime(workoutDuration)}`,
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Завершить',
					onPress: async () => {
						setIsSaving(true)
						try {
							const workoutData = {
								name: workoutName,
								duration: workoutDuration,
								notes: notes,
								exercises: exercises.map((exercise, index) => ({
									name: exercise.name,
									muscle_group: exercise.muscleGroup,
									order_index: index,
									sets: exercise.sets.map(set => ({
										set_number: set.setNumber,
										weight: set.weight,
										reps: set.reps,
										completed: set.completed,
									})),
								})),
							}

							await completeWorkout(workoutData)
							await stopWorkoutTimer()

							Alert.alert('Успех!', 'Тренировка сохранена в историю', [
								{ text: 'OK', onPress: () => router.push('/') },
							])
						} catch (error) {
							console.error('Error saving workout:', error)
							Alert.alert('Ошибка', 'Не удалось сохранить тренировку')
						} finally {
							setIsSaving(false)
						}
					},
				},
			],
		)
	}

	const handleDiscardWorkout = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

		if (
			exercises.length > 0 ||
			workoutDuration > 0 ||
			notes.trim().length > 0
		) {
			Alert.alert(
				'Отменить тренировку?',
				'Все данные будут удалены без сохранения',
				[
					{ text: 'Продолжить', style: 'cancel' },
					{
						text: 'Отменить',
						style: 'destructive',
						onPress: async () => {
							await stopWorkoutTimer()
							router.back()
						},
					},
				],
			)
		} else {
			router.back()
		}
	}

	const getExerciseDetails = useCallback(
		(exerciseName: string): ExerciseDetail | null => {
			for (const group of MUSCLE_GROUPS) {
				for (const subgroup of group.subgroups) {
					const found = subgroup.exercises.find(ex => ex.name === exerciseName)
					if (found) return found
				}
			}
			return null
		},
		[],
	)

	if (isSaving) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<View style={styles.loadingSpinner}>
						<Ionicons name='barbell' size={48} color={COLORS.primary} />
					</View>
					<Text style={styles.loadingText}>Сохранение тренировки...</Text>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={handleDiscardWorkout}
					style={styles.headerButton}
					activeOpacity={0.7}
				>
					<Ionicons name='arrow-back' size={24} color={COLORS.text} />
				</TouchableOpacity>

				<View style={styles.headerCenter}>
					<TextInput
						style={styles.workoutNameInput}
						value={workoutName}
						onChangeText={setWorkoutName}
						placeholder='Название тренировки'
						placeholderTextColor={COLORS.textSecondary}
					/>
				</View>

				<TouchableOpacity
					onPress={handleFinishWorkout}
					style={styles.finishButton}
					activeOpacity={0.7}
				>
					<Text style={styles.finishButtonText}>Готово</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.contentContainer}
			>
				<View style={styles.statsCard}>
					<View style={styles.statsRow}>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>
								{totalCompleted}/{totalSets}
							</Text>
							<Text style={styles.statLabel}>Подходы</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{exercises.length}</Text>
							<Text style={styles.statLabel}>Упражнения</Text>
						</View>
						{isWorkoutActive && (
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>
									{formatTime(workoutDuration)}
								</Text>
								<Text style={styles.statLabel}>Время</Text>
							</View>
						)}
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{totalVolume}</Text>
							<Text style={styles.statLabel}>Объем</Text>
						</View>
					</View>
				</View>

				<View style={styles.exercisesSection}>
					<View style={styles.sectionHeader}>
						<Text style={{ ...styles.sectionTitle, paddingHorizontal: 16 }}>
							Упражнения
						</Text>
						<Text style={{ ...styles.sectionSubtitle, paddingHorizontal: 16 }}>
							{exercises.length} упражнений
						</Text>
					</View>

					{exercises.length === 0 ? (
						<View style={styles.emptyExercises}>
							<View style={styles.emptyIcon}>
								<Ionicons
									name='barbell-outline'
									size={48}
									color={COLORS.textSecondary}
								/>
							</View>
							<Text style={styles.emptyTitle}>Нет упражнений</Text>
							<Text style={styles.emptySubtitle}>
								Добавьте первое упражнение, чтобы начать тренировку
							</Text>
							<TouchableOpacity
								style={styles.addFirstExerciseButton}
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

									setShowExerciseSelection(true)
								}}
								activeOpacity={0.7}
							>
								<Ionicons name='add' size={20} color={COLORS.background} />
								<Text style={styles.addFirstExerciseText}>
									Добавить упражнение
								</Text>
							</TouchableOpacity>
						</View>
					) : (
						<>
							{exercises.map(exercise => (
								<ExerciseItem
									key={exercise.id}
									exercise={exercise}
									onToggleCollapse={toggleExerciseCollapse}
									onSetComplete={handleSetComplete}
									onUpdateSet={handleUpdateSet}
									onRemoveSet={handleRemoveSet}
									onAddSet={handleAddSet}
									onRemoveExercise={handleRemoveExercise}
									onShowExerciseDetails={getExerciseDetails}
								/>
							))}

							<TouchableOpacity
								style={styles.addExerciseCard}
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

									setShowExerciseSelection(true)
								}}
								activeOpacity={0.7}
							>
								<View style={styles.addExerciseIcon}>
									<Ionicons name='add' size={24} color={COLORS.primary} />
								</View>
								<Text style={styles.addExerciseCardText}>
									Добавить упражнение
								</Text>
							</TouchableOpacity>
						</>
					)}
				</View>

				<View style={styles.notesSection}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Заметки</Text>
						<Ionicons
							name='create-outline'
							size={20}
							color={COLORS.textSecondary}
						/>
					</View>
					<TextInput
						style={styles.notesInput}
						placeholder='Добавьте заметки к тренировке...'
						placeholderTextColor={COLORS.textSecondary}
						multiline
						numberOfLines={4}
						textAlignVertical='top'
						value={notes}
						onChangeText={setNotes}
					/>
				</View>

				<View style={styles.spacer} />
			</ScrollView>

			<ExerciseSelectionModal
				visible={showExerciseSelection}
				onClose={() => setShowExerciseSelection(false)}
				onSelectExercise={handleExerciseSelect}
			/>
		</SafeAreaView>
	)
}

// ─────────────────────────────────────────────
// ExerciseDetailModal
// ─────────────────────────────────────────────
interface ExerciseDetailModalProps {
	visible: boolean
	onClose: () => void
	exerciseDetail: ExerciseDetail | null
}

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
	visible,
	onClose,
	exerciseDetail,
}) => {
	const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
	const [modalVisible, setModalVisible] = useState(false)

	const player = useVideoPlayer({ uri: exerciseDetail?.videoUrl }, player => {
		player.loop = true
		player.play()
		player.muted = false
	})

	useEffect(() => {
		if (visible) {
			setModalVisible(true)
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
		} else {
			Animated.timing(slideAnim, {
				toValue: SCREEN_HEIGHT,
				duration: 250,
				useNativeDriver: true,
			}).start(() => {
				setModalVisible(false)
			})
		}
	}, [visible])

	const close = () => {
		player.pause()
		onClose()
	}

	if (!modalVisible || !exerciseDetail) return null

	const getTintColor = (percent: number): string => {
		const p = Math.max(0, Math.min(100, percent)) / 100
		const r = 255
		const g = Math.round(255 * (1 - p))
		const b = 0
		return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
	}

	const getFrontMuscleColors = () => {
		const muscleColors: { [key: string]: string } = {}
		MUSCLE_FRONT_DATA.forEach(muscle => {
			muscle.muscleImages.forEach(imageKey => {
				if (exerciseDetail.primaryFrontMuscles.includes(imageKey))
					muscleColors[imageKey] = getTintColor(100)
				if (exerciseDetail.secondaryFrontMuscles.includes(imageKey))
					muscleColors[imageKey] = getTintColor(50)
			})
		})
		return muscleColors
	}

	const getBackMuscleColors = () => {
		const muscleColors: { [key: string]: string } = {}
		MUSCLE_BACK_DATA.forEach(muscle => {
			muscle.muscleImages.forEach(imageKey => {
				if (exerciseDetail.primaryBackMuscles.includes(imageKey))
					muscleColors[imageKey] = getTintColor(100)
				if (exerciseDetail.secondaryBackMuscles.includes(imageKey))
					muscleColors[imageKey] = getTintColor(50)
			})
		})
		return muscleColors
	}

	return (
		<Modal
			transparent
			visible={modalVisible}
			animationType='none'
			onRequestClose={close}
		>
			<View style={detailModalStyles.modalOverlay}>
				<TouchableOpacity
					style={detailModalStyles.modalBackdrop}
					activeOpacity={1}
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

						onClose()
					}}
				/>
				<Animated.View
					style={[
						detailModalStyles.modalContainer,
						{ transform: [{ translateY: slideAnim }] },
					]}
				>
					<View style={detailModalStyles.header}>
						<TouchableOpacity
							style={detailModalStyles.backButton}
							onPress={() => {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

								onClose()
							}}
							activeOpacity={0.7}
						>
							<Ionicons name='close' size={24} color={COLORS.text} />
						</TouchableOpacity>
						<Text style={detailModalStyles.headerTitle} numberOfLines={1}>
							{exerciseDetail.name}
						</Text>
					</View>

					<ScrollView
						style={detailModalStyles.content}
						showsVerticalScrollIndicator={false}
					>
						<View style={detailModalStyles.exerciseDetailContent}>
							<View style={modalStyles.exerciseTitleContainer}>
								<Text style={modalStyles.exerciseDetailTitle}>
									{exerciseDetail.name}
								</Text>
							</View>

							{exerciseDetail.videoUrl && (
								<CachedVideo
									remoteUrl={exerciseDetail?.videoUrl}
									videoId={exerciseDetail?.id ?? ''}
									style={styles.video}
									autoPlay={true}
									loop={true}
									muted={true}
								/>
							)}

							{exerciseDetail.images && exerciseDetail.images.length > 0 && (
								<ImageGallery images={exerciseDetail.images} />
							)}

							{!exerciseDetail.videoUrl &&
								(!exerciseDetail.images ||
									exerciseDetail.images.length === 0) && (
									<View style={detailModalStyles.exerciseImageContainer}>
										<Image
											transition={200}
											source={exerciseDetail.image}
											style={detailModalStyles.exerciseMainImage}
										/>
									</View>
								)}

							{!exerciseDetail.videoUrl && (
								<View style={detailModalStyles.exerciseImageContainer}>
									<Image
										transition={200}
										source={exerciseDetail.image}
										style={detailModalStyles.exerciseMainImage}
									/>
								</View>
							)}

							<Text style={detailModalStyles.exerciseDetailDescriptionFull}>
								{exerciseDetail.description}
							</Text>

							<View style={detailModalStyles.detailStats}>
								<View style={detailModalStyles.detailStat}>
									<View style={detailModalStyles.detailStatIcon}>
										<Ionicons name='barbell' size={18} color={COLORS.primary} />
									</View>
									<View>
										<Text style={detailModalStyles.detailStatLabel}>
											Сложность
										</Text>
										<Text style={detailModalStyles.detailStatValue}>
											{exerciseDetail.difficulty}
										</Text>
									</View>
								</View>
								<View style={detailModalStyles.detailStat}>
									<View style={detailModalStyles.detailStatIcon}>
										<Ionicons
											name='construct'
											size={18}
											color={COLORS.primary}
										/>
									</View>
									<View>
										<Text style={detailModalStyles.detailStatLabel}>
											Оборудование
										</Text>
										<Text style={detailModalStyles.detailStatValue}>
											{exerciseDetail.equipment.join(', ')}
										</Text>
									</View>
								</View>
							</View>

							<View style={detailModalStyles.section}>
								<Text style={detailModalStyles.sectionTitle}>
									Работающие мышцы
								</Text>
								<View style={detailModalStyles.muscleGroupsGridDetail}>
									<View style={detailModalStyles.muscleGroupItem}>
										<View style={detailModalStyles.muscleGroupHeader}>
											<Ionicons name='star' size={16} color={COLORS.primary} />
											<Text style={detailModalStyles.muscleGroupLabel}>
												Основные:
											</Text>
										</View>
										{exerciseDetail.primaryMuscles.map((muscle, index) => (
											<View key={index} style={detailModalStyles.muscleItem}>
												<View style={detailModalStyles.muscleDot} />
												<Text style={detailModalStyles.muscleText}>
													{muscle}
												</Text>
											</View>
										))}
									</View>

									{exerciseDetail.secondaryMuscles.length > 0 && (
										<View style={detailModalStyles.muscleGroupItem}>
											<View style={detailModalStyles.muscleGroupHeader}>
												<Ionicons
													name='star-outline'
													size={16}
													color={COLORS.textSecondary}
												/>
												<Text style={detailModalStyles.muscleGroupLabel}>
													Второстепенные:
												</Text>
											</View>
											{exerciseDetail.secondaryMuscles.map((muscle, index) => (
												<View key={index} style={detailModalStyles.muscleItem}>
													<View style={detailModalStyles.muscleDotSecondary} />
													<Text style={detailModalStyles.muscleTextSecondary}>
														{muscle}
													</Text>
												</View>
											))}
										</View>
									)}
								</View>

								<View style={{ flexDirection: 'row', marginTop: 16 }}>
									<View style={detailModalStyles.bodyImageContainer}>
										<ManBackSvg muscleColors={getBackMuscleColors()} />
									</View>
									<View style={detailModalStyles.bodyImageContainer}>
										<ManFrontSvg muscleColors={getFrontMuscleColors()} />
									</View>
								</View>
							</View>

							<View style={detailModalStyles.section}>
								<Text style={detailModalStyles.sectionTitle}>
									Техника выполнения
								</Text>
								<View style={detailModalStyles.tipsList}>
									{exerciseDetail.tips.map((tip, index) => (
										<View
											key={index}
											style={{
												...detailModalStyles.tipItem,
												borderBottomWidth:
													index !== exerciseDetail.tips.length - 1 ? 1 : 0,
												borderBottomColor: COLORS.border,
											}}
										>
											<View style={detailModalStyles.tipNumber}>
												<Text style={detailModalStyles.tipNumberText}>
													{index + 1}
												</Text>
											</View>
											<Text style={detailModalStyles.tipText}>{tip}</Text>
										</View>
									))}
								</View>
							</View>

							<View style={detailModalStyles.spacer} />
						</View>
					</ScrollView>
				</Animated.View>
			</View>
		</Modal>
	)
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const detailModalStyles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: '#121212',
		justifyContent: 'flex-end',
	},
	modalBackdrop: { ...StyleSheet.absoluteFillObject },
	modalContainer: {
		backgroundColor: '#121212',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		height: '95%',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: COLORS.card,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	backButton: { padding: 8 },
	headerTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
		textAlign: 'center',
		marginHorizontal: 8,
	},
	content: { flex: 1 },
	exerciseDetailContent: { padding: 16 },
	exerciseImageContainer: {
		width: '100%',
		height: 240,
		position: 'relative',
		marginBottom: 20,
	},
	exerciseMainImage: { width: '100%', height: '100%', borderRadius: 12 },
	video: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
	exerciseDetailDescriptionFull: {
		fontSize: 15,
		color: COLORS.text,
		lineHeight: 22,
		marginBottom: 20,
	},
	detailStats: { marginBottom: 24 },
	detailStat: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.card,
		padding: 12,
		borderRadius: 12,
		marginBottom: 8,
	},
	detailStatIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	detailStatLabel: {
		fontSize: 11,
		color: COLORS.textSecondary,
		marginBottom: 2,
	},
	detailStatValue: { fontSize: 13, fontWeight: '600', color: COLORS.text },
	section: { marginBottom: 24 },
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 16,
	},
	muscleGroupsGridDetail: {
		backgroundColor: COLORS.card,
		borderRadius: 12,
		overflow: 'hidden',
		marginBottom: 16,
	},
	muscleGroupItem: { padding: 16 },
	muscleGroupHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	muscleGroupLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: COLORS.text,
		marginLeft: 8,
	},
	muscleItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
	muscleDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.primary,
		marginRight: 12,
	},
	muscleText: { fontSize: 14, color: COLORS.text, flex: 1 },
	muscleDotSecondary: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.textSecondary,
		marginRight: 12,
	},
	muscleTextSecondary: { fontSize: 14, color: COLORS.textSecondary, flex: 1 },
	bodyImageContainer: {
		width: '135%',
		height: 400,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tipsList: {
		backgroundColor: COLORS.card,
		borderRadius: 12,
		overflow: 'hidden',
	},
	tipItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
	tipNumber: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		flexShrink: 0,
	},
	tipNumberText: { fontSize: 12, fontWeight: 'bold', color: COLORS.background },
	tipText: { fontSize: 14, color: COLORS.text, flex: 1, lineHeight: 20 },
	spacer: { height: 32 },
})

const modalStyles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: '#121212',
		justifyContent: 'flex-end',
	},
	modalBackdrop: { ...StyleSheet.absoluteFillObject },
	modalContainer: {
		backgroundColor: '#121212',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		height: '95%',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: COLORS.card,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	backButton: { padding: 8 },
	headerTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
		textAlign: 'center',
		marginHorizontal: 8,
	},
	headerRight: { width: 40, alignItems: 'flex-end' },
	content: { flex: 1 },
	tabsContainer: {
		flexDirection: 'row',
		paddingHorizontal: 8,
		paddingVertical: 8,
		backgroundColor: COLORS.card,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	tab: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 10,
		borderRadius: 10,
		marginHorizontal: 4,
	},
	activeTab: { backgroundColor: 'rgba(52, 199, 89, 0.1)' },
	tabText: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginTop: 4,
		fontWeight: '500',
	},
	activeTabText: { color: COLORS.primary, fontWeight: '600' },
	searchContainer: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: COLORS.card,
	},
	searchInner: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.cardLight,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: COLORS.text,
		marginLeft: 12,
		marginRight: 8,
	},
	muscleGroupsGrid: { padding: 12, paddingBottom: 24 },
	columnWrapper: { justifyContent: 'space-between' },
	muscleGroupCard: {
		width: (SCREEN_WIDTH - 36) / 2,
		backgroundColor: COLORS.card,
		borderRadius: 16,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: COLORS.border,
		marginBottom: 12,
	},
	muscleGroupImageContainer: {
		width: '100%',
		height: 150,
		padding: 20,
		position: 'relative',
	},
	muscleGroupImage: { width: '100%', height: '100%', resizeMode: 'contain' },
	muscleGroupName: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		paddingHorizontal: 12,
		paddingTop: 12,
		paddingBottom: 4,
	},
	muscleGroupCount: {
		fontSize: 12,
		color: COLORS.textSecondary,
		paddingHorizontal: 12,
		paddingBottom: 12,
	},
	exercisesList: { padding: 8, paddingBottom: 24 },
	exerciseListItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.card,
		borderRadius: 14,
		padding: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	exerciseListImage: {
		width: 80,
		height: 100,
		borderRadius: 10,
		marginRight: 12,
		overflow: 'hidden',
		position: 'relative',
	},
	exerciseListContent: { flex: 1 },
	exerciseListHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 6,
	},
	exerciseListName: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		flex: 1,
		marginRight: 8,
	},
	exerciseListDescription: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginBottom: 8,
		lineHeight: 16,
	},
	exerciseListTags: { flexDirection: 'row', gap: 8 },
	difficultyTag: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(52, 199, 89, 0.2)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	difficultyText: {
		fontSize: 10,
		color: COLORS.text,
		fontWeight: '600',
		marginLeft: 4,
	},
	equipmentTag: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(142, 142, 147, 0.2)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	equipmentText: {
		fontSize: 10,
		color: COLORS.text,
		fontWeight: '600',
		marginLeft: 4,
	},
	exerciseDetailContainer: { flex: 1, backgroundColor: '#121212' },
	exerciseImageContainer: { width: '100%', height: 240, position: 'relative' },
	exerciseMainImage: { width: '100%', height: '100%' },
	exerciseDetailContent: { padding: 16 },
	exerciseHeader: { marginBottom: 24 },
	exerciseTitleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	exerciseDetailTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: COLORS.text,
		flex: 1,
		marginRight: 8,
	},
	exerciseDetailDescriptionFull: {
		fontSize: 15,
		color: COLORS.text,
		lineHeight: 22,
		marginBottom: 20,
	},
	detailStats: { justifyContent: 'space-between', marginTop: 16 },
	detailStat: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.card,
		padding: 12,
		borderRadius: 12,
		marginVertical: 4,
	},
	detailStatIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	detailStatLabel: {
		fontSize: 11,
		color: COLORS.textSecondary,
		marginBottom: 2,
	},
	detailStatValue: { fontSize: 13, fontWeight: '600', color: COLORS.text },
	section: { marginBottom: 24 },
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 16,
	},
	muscleGroupsGridDetail: {
		backgroundColor: COLORS.card,
		borderRadius: 12,
		overflow: 'hidden',
	},
	muscleGroupItem: { padding: 16 },
	muscleGroupHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	muscleGroupLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: COLORS.text,
		marginLeft: 8,
	},
	muscleItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
	muscleDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.primary,
		marginRight: 12,
	},
	muscleText: { fontSize: 14, color: COLORS.text, flex: 1 },
	muscleDotSecondary: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.textSecondary,
		marginRight: 12,
	},
	muscleTextSecondary: { fontSize: 14, color: COLORS.textSecondary, flex: 1 },
	tipsList: {
		backgroundColor: COLORS.card,
		borderRadius: 12,
		overflow: 'hidden',
	},
	tipItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
	tipNumber: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		flexShrink: 0,
	},
	tipNumberText: { fontSize: 12, fontWeight: 'bold', color: COLORS.background },
	tipText: { fontSize: 14, color: COLORS.text, flex: 1, lineHeight: 20 },
	confirmButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.primary,
		paddingHorizontal: 32,
		paddingVertical: 18,
		borderRadius: 14,
		marginBottom: 16,
		marginTop: 8,
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.card,
		marginLeft: 8,
	},
	spacer: { height: 32 },
	emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
	emptyStateTitle: {
		fontSize: 16,
		color: COLORS.textSecondary,
		marginTop: 16,
		textAlign: 'center',
		fontWeight: '600',
	},
	fixedBottomButtonContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: COLORS.card,
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
		zIndex: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -3 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 8,
	},
})

const styles = StyleSheet.create({
	infoButton: { padding: 8 },
	bodyImageContainer: {
		width: '50%',
		height: 450,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
	},
	video: { width: '100%', height: 200, marginVertical: 10, borderRadius: 16 },
	container: { flex: 1, backgroundColor: '#121212' },
	loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	loadingSpinner: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: COLORS.card,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},
	loadingText: { fontSize: 16, color: COLORS.textSecondary },
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: COLORS.card,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	headerButton: { padding: 8 },
	headerCenter: { flex: 1, alignItems: 'center', marginHorizontal: 12 },
	workoutNameInput: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
		textAlign: 'center',
		padding: 8,
		minWidth: 200,
	},
	finishButton: {
		backgroundColor: COLORS.primary,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	finishButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.background,
	},
	content: { flex: 1 },
	contentContainer: { paddingBottom: 100 },
	statsCard: {
		backgroundColor: COLORS.card,
		margin: 16,
		marginBottom: 0,
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
	statItem: { alignItems: 'center', flex: 1 },
	statNumber: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.primary,
		marginBottom: 4,
	},
	statLabel: { fontSize: 12, color: COLORS.textSecondary },
	timerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	timerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		paddingHorizontal: 10,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.primary,
		minWidth: 120,
	},
	timerButtonActive: { backgroundColor: COLORS.primary },
	timerButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.primary,
		marginLeft: 8,
	},
	timerButtonTextActive: { color: COLORS.background },
	timerDisplay: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.cardLight,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
	},
	timerText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		marginLeft: 8,
	},
	exercisesSection: { marginTop: 8 },
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
	},
	sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
	sectionSubtitle: { fontSize: 14, color: COLORS.textSecondary },
	emptyExercises: {
		alignItems: 'center',
		padding: 40,
		marginHorizontal: 16,
		backgroundColor: COLORS.card,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
		marginTop: 8,
	},
	emptyIcon: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: COLORS.cardLight,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: COLORS.textSecondary,
		textAlign: 'center',
		marginBottom: 24,
	},
	addFirstExerciseButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.primary,
		paddingHorizontal: 24,
		paddingVertical: 14,
		borderRadius: 12,
	},
	addFirstExerciseText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.background,
		marginLeft: 8,
	},
	exerciseCard: {
		backgroundColor: COLORS.card,
		marginHorizontal: 16,
		marginBottom: 12,
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	exerciseHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	exerciseHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
	exerciseInfo: { flex: 1, marginLeft: 12 },
	exerciseName: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		marginBottom: 4,
	},
	exerciseMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
	},
	muscleGroupTag: {
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	muscleGroupText: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },
	setsIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
	setsText: { fontSize: 12, color: COLORS.textSecondary },
	exerciseHeaderRight: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	deleteExerciseButton: { padding: 4 },
	setsContainer: { marginTop: 8 },
	setsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 8,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
		marginBottom: 4,
		textAlign: 'center',
	},
	setHeaderText: {
		fontSize: 12,
		fontWeight: '600',
		color: COLORS.textSecondary,
		width: 40,
		textAlign: 'center',
	},
	setRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.05)',
	},
	setNumberContainer: {
		width: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	setNumber: { fontSize: 16, fontWeight: '600', color: COLORS.text },
	setInputContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		height: 40,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 8,
		textAlign: 'center',
		fontSize: 16,
		color: COLORS.text,
		backgroundColor: COLORS.cardLight,
	},
	weightInput: { width: 80, marginRight: 4 },
	repsInput: { width: 80, marginRight: 4 },
	inputCompleted: {
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		borderColor: COLORS.primary,
	},
	inputLabel: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 },
	checkbox: {
		width: 32,
		height: 32,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: COLORS.border,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.cardLight,
	},
	checkboxCompleted: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	deleteButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addSetButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		marginTop: 8,
		borderRadius: 8,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		borderWidth: 1,
		borderColor: 'rgba(52, 199, 89, 0.2)',
	},
	addSetText: {
		fontSize: 14,
		color: COLORS.primary,
		fontWeight: '600',
		marginLeft: 8,
	},
	addExerciseCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.card,
		padding: 16,
		marginHorizontal: 16,
		marginBottom: 12,
		borderRadius: 16,
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: COLORS.primary,
	},
	addExerciseIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	addExerciseCardText: {
		fontSize: 16,
		color: COLORS.primary,
		fontWeight: '600',
	},
	notesSection: {
		backgroundColor: COLORS.card,
		margin: 16,
		marginTop: 8,
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	notesInput: {
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 12,
		padding: 16,
		fontSize: 14,
		color: COLORS.text,
		minHeight: 100,
		backgroundColor: COLORS.cardLight,
		marginTop: 8,
	},
	spacer: { height: 20 },
	volumeIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
	volumeText: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },
	historyButton: { padding: 8, marginRight: 8 },
})

// ─────────────────────────────────────────────
// ImageGallery
// ─────────────────────────────────────────────
const ImageGallery = ({ images }: { images: any[] }) => {
	const [activeIndex, setActiveIndex] = useState(0)

	const onScroll = (event: any) => {
		const slideSize = event.nativeEvent.layoutMeasurement.width
		const index = event.nativeEvent.contentOffset.x / slideSize
		setActiveIndex(Math.round(index))
	}

	return (
		<View style={galleryStyles.container}>
			<FlatList
				data={images}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={onScroll}
				scrollEventThrottle={16}
				renderItem={({ item }) => (
					<View style={galleryStyles.imageContainer}>
						<Image
							source={item}
							style={galleryStyles.image}
							contentFit='cover'
							transition={200}
						/>
					</View>
				)}
				keyExtractor={(_, index) => index.toString()}
			/>
			{images.length > 1 && (
				<View style={galleryStyles.pagination}>
					{images.map((_, index) => (
						<View
							key={index}
							style={[
								galleryStyles.dot,
								index === activeIndex && galleryStyles.activeDot,
							]}
						/>
					))}
				</View>
			)}
		</View>
	)
}

const galleryStyles = StyleSheet.create({
	container: { marginVertical: 16 },
	imageContainer: {
		width: SCREEN_WIDTH - 32,
		height: 200,
		borderRadius: 12,
		overflow: 'hidden',
	},
	image: { width: '100%', height: '100%' },
	pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.textSecondary,
		marginHorizontal: 4,
	},
	activeDot: { backgroundColor: COLORS.primary },
})
