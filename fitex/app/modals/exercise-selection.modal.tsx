import { CachedVideo } from '@/components/cached-video'
import ManBackSvg from '@/components/man-back-svg'
import ManFrontSvg from '@/components/man-front-svg'
import {
	manBackMuscleGroupParts,
	manFrontMuscleGroupParts,
} from '@/constants/images'
import { muscle_groups } from '@/constants/muscle-groups'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Image } from 'expo-image'
import React, { useEffect, useRef, useState } from 'react'
import {
	ActivityIndicator,
	Animated,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

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
		name: 'Руки',
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
		name: 'Дельты',
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
		id: '4',
		name: 'Спина',
		position: {
			left: '-100%',
			top: '-180%',
		},
		muscleImages: [
			'leftIntraspinatus',
			'leftLatissimusDorsi',
			'leftThoracolumbarFascia',
			'rightIntraspinatus',
			'rightLatissimusDorsi',
			'rightThoracolumbarFascia',
			'leftLowerTrapezius',
			'leftUpperTrapezius',
			'rightLowerTrapezius',
			'rightUpperTrapezius',
		],
		icon: manBackMuscleGroupParts.deltoidFull,
	},
]

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
	position: any
	subgroups: MuscleSubgroup[]
}

const MUSCLE_GROUPS: MuscleGroup[] = muscle_groups

interface ExerciseSelectionModalProps {
	visible: boolean
	onClose: () => void
	onSelectExercise: (exercise: { name: string; muscleGroup: string }) => void
}

// Константы для пагинации
const EXERCISES_PAGE_SIZE = 10

// Хук для анимации shimmer
const useShimmer = () => {
	const anim = useRef(new Animated.Value(0)).current
	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(anim, {
					toValue: 1,
					duration: 750,
					useNativeDriver: true,
				}),
				Animated.timing(anim, {
					toValue: 0,
					duration: 750,
					useNativeDriver: true,
				}),
			]),
		)
		loop.start()
		return () => loop.stop()
	}, [])
	return anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] })
}

const ShimmerBlock = ({ style }: { style: any }) => {
	const opacity = useShimmer()
	return (
		<Animated.View
			style={[style, { opacity, backgroundColor: COLORS.cardLight }]}
		/>
	)
}

// Скелетон для карточки упражнения
const ExerciseCardSkeleton = () => (
	<View style={modalStyles.exerciseListItem}>
		<ShimmerBlock
			style={[modalStyles.exerciseListImage, { width: 80, height: 100 }]}
		/>
		<View style={modalStyles.exerciseListContent}>
			<View style={modalStyles.exerciseListHeader}>
				<ShimmerBlock style={{ width: 120, height: 20 }} />
				<ShimmerBlock style={{ width: 24, height: 24, borderRadius: 12 }} />
			</View>
			<ShimmerBlock style={{ width: '100%', height: 32, marginBottom: 8 }} />
			<View style={modalStyles.exerciseListTags}>
				<ShimmerBlock style={{ width: 80, height: 24, borderRadius: 6 }} />
				<ShimmerBlock style={{ width: 60, height: 24, borderRadius: 6 }} />
			</View>
		</View>
		<ShimmerBlock style={{ width: 20, height: 20 }} />
	</View>
)

// Скелетон для списка упражнений
const ExercisesListSkeleton = () => (
	<View style={{ padding: 8 }}>
		{[1, 2, 3, 4, 5].map(item => (
			<ExerciseCardSkeleton key={item} />
		))}
	</View>
)

// Компонент для подгрузки в конце списка
const LoadingFooter = () => (
	<View style={modalStyles.loadingFooter}>
		<ActivityIndicator size='small' color={COLORS.primary} />
		<Text style={modalStyles.loadingFooterText}>Загрузка упражнений...</Text>
	</View>
)

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

export const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({
	visible,
	onClose,
	onSelectExercise,
}) => {
	const [selectedMuscleGroup, setSelectedMuscleGroup] =
		useState<MuscleGroup | null>()
	const [selectedExercise, setSelectedExercise] =
		useState<ExerciseDetail | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [favorites, setFavorites] = useState<string[]>([])
	const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
	const [modalVisible, setModalVisible] = useState(false)

	// Состояния для пагинации
	const [displayedExercises, setDisplayedExercises] = useState<
		ExerciseDetail[]
	>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [isInitialLoading, setIsInitialLoading] = useState(false)
	const [allExercises, setAllExercises] = useState<ExerciseDetail[]>([])

	const getSideAndColorsForGroup = (
		groupName: string,
	): { side: 'front' | 'back'; colors: { [key: string]: string } } => {
		const frontGroup = MUSCLE_FRONT_DATA.find(g => g.name === groupName)
		if (frontGroup) {
			const colors: { [key: string]: string } = {}
			frontGroup.muscleImages.forEach(key => {
				colors[key] = COLORS.green
			})
			return { side: 'front', colors }
		}

		const backGroup = MUSCLE_BACK_DATA.find(g => g.name === groupName)
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
				setSelectedMuscleGroup(null)
				setSelectedExercise(null)
				setSearchQuery('')
				setCurrentPage(1)
				setDisplayedExercises([])
				setAllExercises([])
			})
		}
	}, [visible])

	useEffect(() => {
		if (visible && MUSCLE_GROUPS.length > 0 && !selectedMuscleGroup) {
			setSelectedMuscleGroup(MUSCLE_GROUPS[0])
		}
	}, [visible, selectedMuscleGroup])

	// Загрузка всех упражнений при выборе группы мышц
	useEffect(() => {
		if (selectedMuscleGroup) {
			setIsInitialLoading(true)
			setCurrentPage(1)

			// Собираем все упражнения из выбранной группы
			const exercises = selectedMuscleGroup.subgroups.flatMap(
				subgroup => subgroup.exercises,
			)
			setAllExercises(exercises)

			// Показываем первую страницу
			setDisplayedExercises(exercises.slice(0, EXERCISES_PAGE_SIZE))
			setHasMore(exercises.length > EXERCISES_PAGE_SIZE)

			// Имитация загрузки для плавности
			setTimeout(() => {
				setIsInitialLoading(false)
			}, 500)
		}
	}, [selectedMuscleGroup])

	// Фильтрация упражнений при поиске
	useEffect(() => {
		if (searchQuery) {
			const query = searchQuery.toLowerCase()
			const filtered = MUSCLE_GROUPS.flatMap(group =>
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
			setAllExercises(filtered)
			setDisplayedExercises(filtered.slice(0, EXERCISES_PAGE_SIZE))
			setHasMore(filtered.length > EXERCISES_PAGE_SIZE)
			setCurrentPage(1)
		}
	}, [searchQuery])

	// Загрузка следующей страницы
	const loadNextPage = () => {
		if (isLoadingMore || !hasMore || !allExercises.length) return

		setIsLoadingMore(true)

		// Имитация задержки сети
		setTimeout(() => {
			const nextPage = currentPage + 1
			const startIndex = currentPage * EXERCISES_PAGE_SIZE
			const endIndex = nextPage * EXERCISES_PAGE_SIZE
			const newExercises = allExercises.slice(0, endIndex)

			setDisplayedExercises(newExercises)
			setCurrentPage(nextPage)
			setHasMore(allExercises.length > endIndex)
			setIsLoadingMore(false)
		}, 500)
	}

	const toggleFavorite = (exerciseId: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

		setFavorites(prev =>
			prev.includes(exerciseId)
				? prev.filter(id => id !== exerciseId)
				: [...prev, exerciseId],
		)
	}

	const handleBack = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		if (selectedExercise) {
			setSelectedExercise(null)
		} else {
			onClose()
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

	const handleSelectMuscleGroup = (group: MuscleGroup) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		setSelectedMuscleGroup(group)
		setSearchQuery('')
		setSelectedExercise(null)
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

	const renderHeader = () => {
		let title = 'Выберите упражнение'
		if (selectedExercise) title = selectedExercise?.name || ''

		return (
			<View style={modalStyles.header}>
				<TouchableOpacity
					style={modalStyles.backButton}
					onPress={handleBack}
					activeOpacity={0.7}
				>
					<Ionicons
						name={selectedExercise ? 'arrow-back' : 'close'}
						size={24}
						color={COLORS.text}
					/>
				</TouchableOpacity>
				<Text style={modalStyles.headerTitle} numberOfLines={1}>
					{title}
				</Text>
			</View>
		)
	}

	const renderMuscleGroupsHorizontal = () => (
		<View style={modalStyles.groupsContainer}>
			<FlatList
				horizontal
				data={MUSCLE_GROUPS}
				keyExtractor={item => item.id}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={modalStyles.groupsList}
				renderItem={({ item }) => {
					const { side, colors } = getSideAndColorsForGroup(item.name)
					const isSelected = selectedMuscleGroup?.id === item.id

					return (
						<TouchableOpacity
							style={[
								modalStyles.groupCard,
								isSelected && modalStyles.groupCardActive,
							]}
							onPress={() => handleSelectMuscleGroup(item)}
							activeOpacity={0.7}
						>
							<View style={modalStyles.groupImageContainer}>
								<View
									style={{
										position: 'absolute',
										left: item.position.left,
										top: item.position.top,
									}}
								>
									{side === 'front' ? (
										<ManFrontSvg
											height={300}
											width={150}
											muscleColors={colors}
										/>
									) : (
										<ManBackSvg
											height={300}
											width={150}
											muscleColors={colors}
										/>
									)}
								</View>
							</View>
							<Text
								style={[
									modalStyles.groupName,
									isSelected && modalStyles.groupNameActive,
								]}
							>
								{item.name}
							</Text>
							<Text style={modalStyles.groupCount}>
								{item.subgroups.reduce(
									(acc, sg) => acc + sg.exercises.length,
									0,
								)}
							</Text>
						</TouchableOpacity>
					)
				}}
			/>
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

	const renderExerciseListItem = (item: ExerciseDetail) => (
		<TouchableOpacity
			key={item.id}
			style={modalStyles.exerciseListItem}
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
				setSelectedExercise(item)
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

	const renderExercisesList = () => {
		if (isInitialLoading) {
			return <ExercisesListSkeleton />
		}

		if (!selectedMuscleGroup && !searchQuery) {
			return (
				<View style={modalStyles.emptyState}>
					<Ionicons
						name='body-outline'
						size={64}
						color={COLORS.textSecondary}
					/>
					<Text style={modalStyles.emptyStateTitle}>Выберите группу мышц</Text>
					<Text style={modalStyles.emptyStateText}>
						Выберите группу мышц сверху или воспользуйтесь поиском
					</Text>
				</View>
			)
		}

		if (displayedExercises.length === 0) {
			return (
				<View style={modalStyles.emptyState}>
					<Ionicons
						name='search-outline'
						size={64}
						color={COLORS.textSecondary}
					/>
					<Text style={modalStyles.emptyStateTitle}>Ничего не найдено</Text>
				</View>
			)
		}

		// Группировка по подгруппам для выбранной группы мышц
		if (selectedMuscleGroup && !searchQuery) {
			const sections = selectedMuscleGroup.subgroups
				.map(subgroup => ({
					subgroup,
					exercises: subgroup.exercises.filter(ex =>
						displayedExercises.some(de => de.id === ex.id),
					),
				}))
				.filter(s => s.exercises.length > 0)

			return (
				<FlatList
					data={sections}
					keyExtractor={item => item.subgroup.id}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={[
						modalStyles.exercisesList,
						{ paddingBottom: 40 },
					]}
					onEndReached={loadNextPage}
					onEndReachedThreshold={0.3}
					ListFooterComponent={hasMore ? <LoadingFooter /> : null}
					renderItem={({ item: section }) => (
						<View>
							{/* <View style={subgroupHeaderStyles.container}>
								<View style={subgroupHeaderStyles.line} />
								<Text style={subgroupHeaderStyles.title}>
									{section.subgroup.name}
								</Text>
								<View style={subgroupHeaderStyles.line} />
							</View> */}
							{section.exercises.map(item => renderExerciseListItem(item))}
						</View>
					)}
				/>
			)
		}

		// Для поиска - плоский список
		return (
			<FlatList
				data={displayedExercises}
				keyExtractor={item => item.id}
				contentContainerStyle={[
					modalStyles.exercisesList,
					{ paddingBottom: 40 },
				]}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => renderExerciseListItem(item)}
				onEndReached={loadNextPage}
				onEndReachedThreshold={0.3}
				ListFooterComponent={hasMore ? <LoadingFooter /> : null}
			/>
		)
	}

	const renderExerciseDetail = () => {
		if (!selectedExercise) return null

		return (
			<View
				style={{
					flex: 1,
					backgroundColor: COLORS.background,
				}}
			>
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
								<View style={{ height: 40 }} />
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

					{selectedExercise && (
						<TouchableOpacity
							style={{ ...modalStyles.favoriteButton }}
							onPress={() => toggleFavorite(selectedExercise.id)}
						>
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
						{!selectedExercise ? (
							<>
								{renderMuscleGroupsHorizontal()}
								{renderSearch()}
								{renderExercisesList()}
							</>
						) : (
							renderExerciseDetail()
						)}
					</View>
				</Animated.View>
			</View>
		</Modal>
	)
}

// ImageGallery component
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

const detailModalStyles = StyleSheet.create({
	bodyImageContainer: {
		width: '135%',
		height: 400,
		alignItems: 'center',
		justifyContent: 'center',
	},
	exerciseImageContainer: {
		width: '100%',
		height: 240,
		position: 'relative',
		marginBottom: 20,
	},
	exerciseMainImage: { width: '100%', height: '100%', borderRadius: 12 },
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
		paddingHorizontal: 8,
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
	groupsContainer: {
		maxHeight: 120,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
		backgroundColor: COLORS.card,
	},
	groupsList: {
		paddingHorizontal: 8,
		paddingVertical: 12,
		gap: 8,
	},
	groupCard: {
		width: 90,
		alignItems: 'center',
		backgroundColor: COLORS.cardLight,
		borderRadius: 12,
		padding: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	groupCardActive: {
		borderColor: COLORS.primary,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
	},
	groupImageContainer: {
		width: 50,
		height: 50,
		marginBottom: 4,
		position: 'relative',
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 10,
		backgroundColor: COLORS.card,
	},
	groupName: {
		fontSize: 11,
		fontWeight: '600',
		color: COLORS.textSecondary,
		textAlign: 'center',
	},
	groupNameActive: {
		color: COLORS.primary,
	},
	groupCount: {
		fontSize: 9,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	searchContainer: {
		paddingHorizontal: 8,
		paddingVertical: 12,
		backgroundColor: COLORS.card,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	searchInner: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.cardLight,
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 12,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: COLORS.text,
		marginLeft: 12,
		marginRight: 8,
	},
	exercisesList: { padding: 8 },
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
	exerciseDetailContainer: {
		flex: 1,
		marginBottom: -80,
		backgroundColor: '#121212',
	},
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
		marginLeft: -3,
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
		flex: 1,
		marginRight: 8,
		marginBottom: 16,
		marginTop: 8,
	},
	favoriteButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 18,
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
	emptyState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 40,
	},
	emptyStateTitle: {
		fontSize: 16,
		color: COLORS.text,
		marginTop: 16,
		textAlign: 'center',
		fontWeight: '600',
	},
	emptyStateText: {
		fontSize: 14,
		color: COLORS.textSecondary,
		marginTop: 8,
		textAlign: 'center',
	},
	fixedBottomButtonContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		display: 'flex',
		flexDirection: 'row',
		paddingHorizontal: 8,
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
	loadingFooter: {
		paddingVertical: 20,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 8,
	},
	loadingFooterText: {
		color: COLORS.textSecondary,
		fontSize: 14,
	},
})

const styles = StyleSheet.create({
	bodyImageContainer: {
		width: '50%',
		height: 450,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
	},
	video: { width: '100%', height: 200, marginVertical: 10, borderRadius: 16 },
	cardIconWrap: {
		width: 50,
		height: 50,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	cardSvgContainer: { width: 180, height: 480 },
})
