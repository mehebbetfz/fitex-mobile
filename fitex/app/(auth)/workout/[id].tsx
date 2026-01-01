import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
	Alert,
	FlatList,
	Image,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ExerciseSet {
	id: string
	setNumber: number
	weight: number
	reps: number
	completed: boolean
}

interface Exercise {
	id: string
	name: string
	muscleGroup: string
	sets: ExerciseSet[]
	collapsed: boolean
}

// Данные для модального окна
const MUSCLE_GROUPS = [
	{
		id: 'chest',
		name: 'Грудь',
		image: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
		exercises: [
			'Жим лежа',
			'Жим на наклонной',
			'Разведение гантелей',
			'Бабочка',
			'Отжимания',
		],
	},
	{
		id: 'back',
		name: 'Спина',
		image: 'https://cdn-icons-png.flaticon.com/512/3062/3062647.png',
		exercises: [
			'Тяга верхнего блока',
			'Тяга штанги в наклоне',
			'Тяга гантели',
			'Подтягивания',
			'Гиперэкстензия',
		],
	},
	{
		id: 'legs',
		name: 'Ноги',
		image: 'https://cdn-icons-png.flaticon.com/512/3062/3062653.png',
		exercises: [
			'Приседания',
			'Жим ногами',
			'Выпады',
			'Разгибания ног',
			'Сгибания ног',
		],
	},
	{
		id: 'shoulders',
		name: 'Плечи',
		image: 'https://cdn-icons-png.flaticon.com/512/3062/3062645.png',
		exercises: [
			'Жим штанги стоя',
			'Махи гантелями',
			'Тяга к подбородку',
			'Разведение в наклоне',
		],
	},
	{
		id: 'arms',
		name: 'Руки',
		image: 'https://cdn-icons-png.flaticon.com/512/3062/3062636.png',
		exercises: [
			'Сгибания рук со штангой',
			'Французский жим',
			'Молотки',
			'Разгибания на блоке',
		],
	},
	{
		id: 'core',
		name: 'Пресс',
		image: 'https://cdn-icons-png.flaticon.com/512/3062/3062639.png',
		exercises: ['Скручивания', 'Планка', 'Подъемы ног', 'Русский твист'],
	},
]

interface MuscleGroup {
	id: string
	name: string
	image: string
	exercises: string[]
}

export default function WorkoutScreen() {
	const router = useRouter()
	const params = useLocalSearchParams()
	const workoutId = params.id as string

	const [workoutName, setWorkoutName] = useState('Силовая тренировка груди')
	const [startTime] = useState(new Date())
	const [exercises, setExercises] = useState<Exercise[]>([
		{
			id: '1',
			name: 'Жим лежа',
			muscleGroup: 'Грудь',
			sets: [
				{ id: '1-1', setNumber: 1, weight: 60, reps: 12, completed: true },
				{ id: '1-2', setNumber: 2, weight: 70, reps: 10, completed: true },
				{ id: '1-3', setNumber: 3, weight: 80, reps: 8, completed: false },
				{ id: '1-4', setNumber: 4, weight: 85, reps: 6, completed: false },
			],
			collapsed: false,
		},
		{
			id: '2',
			name: 'Разведение гантелей',
			muscleGroup: 'Грудь',
			sets: [
				{ id: '2-1', setNumber: 1, weight: 12, reps: 15, completed: false },
				{ id: '2-2', setNumber: 2, weight: 14, reps: 12, completed: false },
				{ id: '2-3', setNumber: 3, weight: 16, reps: 10, completed: false },
			],
			collapsed: false,
		},
		{
			id: '3',
			name: 'Отжимания на брусьях',
			muscleGroup: 'Грудь, Трицепс',
			sets: [
				{ id: '3-1', setNumber: 1, weight: 0, reps: 15, completed: false },
				{ id: '3-2', setNumber: 2, weight: 0, reps: 12, completed: false },
				{ id: '3-3', setNumber: 3, weight: 10, reps: 10, completed: false },
			],
			collapsed: false,
		},
	])

	const [timer, setTimer] = useState(0)
	const [isTimerRunning, setIsTimerRunning] = useState(false)

	// Состояния для модального окна
	const [showAddExerciseModal, setShowAddExerciseModal] = useState(false)
	const [selectedMuscleGroup, setSelectedMuscleGroup] =
		useState<MuscleGroup | null>(null)
	const [selectedExercise, setSelectedExercise] = useState<string | null>(null)

	useEffect(() => {
		let interval: NodeJS.Timeout
		if (isTimerRunning) {
			interval = setInterval(() => {
				setTimer(prev => prev + 1)
			}, 1000)
		}
		return () => clearInterval(interval)
	}, [isTimerRunning])

	const formatTime = (seconds: number) => {
		const hrs = Math.floor(seconds / 3600)
		const mins = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60
		return `${hrs.toString().padStart(2, '0')}:${mins
			.toString()
			.padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}

	const toggleExerciseCollapse = (exerciseId: string) => {
		setExercises(prev =>
			prev.map(exercise =>
				exercise.id === exerciseId
					? { ...exercise, collapsed: !exercise.collapsed }
					: exercise
			)
		)
	}

	const handleSetComplete = (exerciseId: string, setId: string) => {
		setExercises(prev =>
			prev.map(exercise =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.map(set =>
								set.id === setId ? { ...set, completed: !set.completed } : set
							),
					  }
					: exercise
			)
		)
	}

	const handleUpdateSet = (
		exerciseId: string,
		setId: string,
		field: string,
		value: string
	) => {
		const numValue = parseFloat(value) || 0
		setExercises(prev =>
			prev.map(exercise =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.map(set =>
								set.id === setId ? { ...set, [field]: numValue } : set
							),
					  }
					: exercise
			)
		)
	}

	const handleRemoveSet = (exerciseId: string, setId: string) => {
		setExercises(prev =>
			prev.map(exercise =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets
								.filter(set => set.id !== setId)
								.map((set, index) => ({ ...set, setNumber: index + 1 })),
					  }
					: exercise
			)
		)
	}

	const handleFinishWorkout = () => {
		const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
		const completedSets = exercises.reduce(
			(sum, ex) => sum + ex.sets.filter(set => set.completed).length,
			0
		)

		Alert.alert(
			'Завершить тренировку?',
			`Выполнено ${completedSets} из ${totalSets} подходов`,
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Завершить',
					onPress: () => {
						Alert.alert('Успех', 'Тренировка сохранена!')
						router.back()
					},
				},
			]
		)
	}

	const handleAddExercise = () => {
		if (selectedExercise) {
			const newExercise: Exercise = {
				id: Date.now().toString(),
				name: selectedExercise,
				muscleGroup: selectedMuscleGroup?.name || '',
				sets: [
					{
						id: `${Date.now()}-1`,
						setNumber: 1,
						weight: 0,
						reps: 0,
						completed: false,
					},
				],
				collapsed: false,
			}

			setExercises(prev => [...prev, newExercise])
			setShowAddExerciseModal(false)
			setSelectedMuscleGroup(null)
			setSelectedExercise(null)
		}
	}

	const totalCompleted = exercises.reduce(
		(sum, ex) => sum + ex.sets.filter(set => set.completed).length,
		0
	)
	const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0)

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Ionicons name='close' size={28} color='#8E8E93' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Тренировка</Text>
				<TouchableOpacity
					onPress={handleFinishWorkout}
					style={styles.finishButton}
				>
					<Text style={styles.finishButtonText}>Готово</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.workoutInfo}>
					<TextInput
						style={styles.workoutName}
						value={workoutName}
						onChangeText={setWorkoutName}
						placeholder='Название тренировки'
						placeholderTextColor='#8E8E93'
					/>

					<View style={styles.statsRow}>
						<View style={styles.stat}>
							<Text style={styles.statNumber}>{formatTime(timer)}</Text>
							<Text style={styles.statLabel}>Время</Text>
						</View>
						<View style={styles.stat}>
							<Text style={styles.statNumber}>
								{totalCompleted}/{totalSets}
							</Text>
							<Text style={styles.statLabel}>Подходы</Text>
						</View>
						<View style={styles.stat}>
							<Text style={styles.statNumber}>{exercises.length}</Text>
							<Text style={styles.statLabel}>Упражнения</Text>
						</View>
					</View>

					<TouchableOpacity
						style={styles.timerButton}
						onPress={() => setIsTimerRunning(!isTimerRunning)}
					>
						<Ionicons
							name={isTimerRunning ? 'pause' : 'play'}
							size={24}
							color='#34C759'
						/>
						<Text style={styles.timerButtonText}>
							{isTimerRunning ? 'Пауза' : 'Старт'}
						</Text>
					</TouchableOpacity>
				</View>

				{exercises.map((exercise, exerciseIndex) => (
					<View key={exercise.id} style={styles.exerciseCard}>
						<TouchableOpacity
							style={styles.exerciseHeader}
							onPress={() => toggleExerciseCollapse(exercise.id)}
						>
							<View style={styles.exerciseHeaderContent}>
								<Ionicons
									name={exercise.collapsed ? 'chevron-down' : 'chevron-up'}
									size={20}
									color='#34C759'
									style={styles.collapseIcon}
								/>
								<View>
									<Text style={styles.exerciseName}>{exercise.name}</Text>
									<Text style={styles.exerciseMuscle}>
										{exercise.muscleGroup}
									</Text>
								</View>
							</View>
							<TouchableOpacity>
								<Ionicons name='ellipsis-vertical' size={20} color='#8E8E93' />
							</TouchableOpacity>
						</TouchableOpacity>

						{!exercise.collapsed && (
							<>
								<View style={styles.setsHeader}>
									<Text style={styles.setHeaderText}>Подход</Text>
									<Text style={styles.setHeaderText}>Вес (кг)</Text>
									<Text style={styles.setHeaderText}>Повторения</Text>
									<Text style={styles.setHeaderText}>✓</Text>
									<Text style={styles.setHeaderText}>✕</Text>
								</View>

								{exercise.sets.map(set => (
									<View key={set.id} style={styles.setRow}>
										<Text style={styles.setNumber}>{set.setNumber}</Text>

										<TextInput
											style={[
												styles.input,
												set.completed && styles.inputCompleted,
											]}
											value={set.weight.toString()}
											onChangeText={value =>
												handleUpdateSet(exercise.id, set.id, 'weight', value)
											}
											keyboardType='numeric'
											editable={!set.completed}
											placeholderTextColor='#8E8E93'
										/>

										<TextInput
											style={[
												styles.input,
												set.completed && styles.inputCompleted,
											]}
											value={set.reps.toString()}
											onChangeText={value =>
												handleUpdateSet(exercise.id, set.id, 'reps', value)
											}
											keyboardType='numeric'
											editable={!set.completed}
											placeholderTextColor='#8E8E93'
										/>

										<TouchableOpacity
											style={[
												styles.checkbox,
												set.completed && styles.checkboxCompleted,
											]}
											onPress={() => handleSetComplete(exercise.id, set.id)}
										>
											{set.completed && (
												<Ionicons name='checkmark' size={16} color='#000' />
											)}
										</TouchableOpacity>

										<TouchableOpacity
											style={styles.deleteButton}
											onPress={() => handleRemoveSet(exercise.id, set.id)}
										>
											<Ionicons
												name='trash-outline'
												size={18}
												color='#FF3B30'
											/>
										</TouchableOpacity>
									</View>
								))}

								<TouchableOpacity
									style={styles.addSetButton}
									onPress={() => {
										const newSetNumber = exercise.sets.length + 1
										const newSet: ExerciseSet = {
											id: `${exercise.id}-${Date.now()}`,
											setNumber: newSetNumber,
											weight: 0,
											reps: 0,
											completed: false,
										}
										setExercises(prev =>
											prev.map(ex =>
												ex.id === exercise.id
													? { ...ex, sets: [...ex.sets, newSet] }
													: ex
											)
										)
									}}
								>
									<Ionicons name='add' size={20} color='#34C759' />
									<Text style={styles.addSetText}>Добавить подход</Text>
								</TouchableOpacity>

								{exerciseIndex < exercises.length - 1 && (
									<View style={styles.restTimer}>
										<Text style={styles.restText}>Отдых: 90 сек</Text>
										<TouchableOpacity style={styles.restButton}>
											<Text style={styles.restButtonText}>Пропустить</Text>
										</TouchableOpacity>
									</View>
								)}
							</>
						)}
					</View>
				))}

				<TouchableOpacity
					style={styles.addExerciseButton}
					onPress={() => setShowAddExerciseModal(true)}
				>
					<Ionicons name='add-circle-outline' size={24} color='#34C759' />
					<Text style={styles.addExerciseText}>Добавить упражнение</Text>
				</TouchableOpacity>

				<View style={styles.notesSection}>
					<Text style={styles.notesTitle}>Заметки</Text>
					<TextInput
						style={styles.notesInput}
						placeholder='Добавьте заметки к тренировке...'
						placeholderTextColor='#8E8E93'
						multiline
						numberOfLines={4}
					/>
				</View>
			</ScrollView>

			{/* Модальное окно добавления упражнения */}
			<Modal
				visible={showAddExerciseModal}
				animationType='slide'
				transparent={true}
				onRequestClose={() => setShowAddExerciseModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								{selectedMuscleGroup
									? selectedExercise
										? 'Выберите упражнение'
										: `Упражнения для ${selectedMuscleGroup.name}`
									: 'Выберите группу мышц'}
							</Text>
							<TouchableOpacity
								onPress={() => {
									if (selectedExercise) {
										setSelectedExercise(null)
									} else if (selectedMuscleGroup) {
										setSelectedMuscleGroup(null)
									} else {
										setShowAddExerciseModal(false)
									}
								}}
								style={styles.modalCloseButton}
							>
								<Ionicons name='close' size={24} color='#8E8E93' />
							</TouchableOpacity>
						</View>

						{!selectedMuscleGroup ? (
							// Шаг 1: Выбор группы мышц
							<FlatList
								data={MUSCLE_GROUPS}
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={styles.muscleGroupsList}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={styles.muscleGroupCard}
										onPress={() => setSelectedMuscleGroup(item)}
									>
										<View style={styles.muscleGroupImageContainer}>
											<Image
												source={{ uri: item.image }}
												style={styles.muscleGroupImage}
											/>
										</View>
										<Text style={styles.muscleGroupName}>{item.name}</Text>
										<Text style={styles.muscleGroupExercisesCount}>
											{item.exercises.length} упражнений
										</Text>
									</TouchableOpacity>
								)}
								keyExtractor={item => item.id}
							/>
						) : !selectedExercise ? (
							// Шаг 2: Выбор упражнения для выбранной группы мышц
							<FlatList
								data={selectedMuscleGroup.exercises}
								contentContainerStyle={styles.exercisesList}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={styles.exerciseItem}
										onPress={() => setSelectedExercise(item)}
									>
										<Text style={styles.exerciseItemName}>{item}</Text>
										<Ionicons
											name='chevron-forward'
											size={20}
											color='#8E8E93'
										/>
									</TouchableOpacity>
								)}
								keyExtractor={item => item}
							/>
						) : (
							// Шаг 3: Подтверждение выбора
							<View style={styles.confirmationContainer}>
								<Text style={styles.confirmationTitle}>Вы выбрали:</Text>
								<View style={styles.selectedExerciseCard}>
									<Text style={styles.selectedExerciseName}>
										{selectedExercise}
									</Text>
									<Text style={styles.selectedExerciseGroup}>
										Группа: {selectedMuscleGroup?.name}
									</Text>
								</View>

								<TouchableOpacity
									style={styles.confirmButton}
									onPress={handleAddExercise}
								>
									<Text style={styles.confirmButtonText}>
										Добавить упражнение
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	scrollView: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: '#1C1C1E',
		borderBottomWidth: 1,
		borderBottomColor: '#2C2C2E',
	},
	backButton: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	finishButton: {
		padding: 8,
	},
	finishButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#34C759',
	},
	workoutInfo: {
		backgroundColor: '#1C1C1E',
		padding: 20,
		marginBottom: 12,
		marginTop: 8,
		borderRadius: 16,
		marginHorizontal: 16,
	},
	workoutName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 20,
		backgroundColor: '#2C2C2E',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#3A3A3C',
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 20,
	},
	stat: {
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#34C759',
		marginBottom: 6,
	},
	statLabel: {
		fontSize: 12,
		color: '#8E8E93',
	},
	timerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(52, 199, 89, 0.2)',
	},
	timerButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#34C759',
		marginLeft: 8,
	},
	exerciseCard: {
		backgroundColor: '#1C1C1E',
		marginBottom: 12,
		padding: 16,
		marginHorizontal: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#2C2C2E',
	},
	exerciseHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	exerciseHeaderContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	collapseIcon: {
		marginRight: 12,
	},
	exerciseName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	exerciseMuscle: {
		fontSize: 14,
		color: '#8E8E93',
		marginTop: 4,
	},
	setsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 8,
		marginBottom: 12,
	},
	setHeaderText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#8E8E93',
		width: 60,
		textAlign: 'center',
	},
	setRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#2C2C2E',
	},
	setNumber: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		width: 60,
		textAlign: 'center',
	},
	input: {
		width: 60,
		height: 40,
		borderWidth: 1,
		borderColor: '#3A3A3C',
		borderRadius: 8,
		textAlign: 'center',
		fontSize: 16,
		color: '#FFFFFF',
		backgroundColor: '#2C2C2E',
	},
	inputCompleted: {
		backgroundColor: '#1C1C1E',
		color: '#8E8E93',
		borderColor: '#34C759',
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#3A3A3C',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2C2C2E',
	},
	checkboxCompleted: {
		backgroundColor: '#34C759',
		borderColor: '#34C759',
	},
	deleteButton: {
		width: 60,
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
		color: '#34C759',
		fontWeight: '600',
		marginLeft: 8,
	},
	restTimer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 204, 0, 0.1)',
		padding: 12,
		borderRadius: 8,
		marginTop: 16,
		borderWidth: 1,
		borderColor: 'rgba(255, 204, 0, 0.2)',
	},
	restText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFCC00',
	},
	restButton: {
		backgroundColor: 'rgba(255, 204, 0, 0.2)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	restButtonText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#FFCC00',
	},
	addExerciseButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1C1C1E',
		padding: 16,
		marginBottom: 12,
		marginHorizontal: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#2C2C2E',
	},
	addExerciseText: {
		fontSize: 16,
		color: '#34C759',
		fontWeight: '600',
		marginLeft: 8,
	},
	notesSection: {
		backgroundColor: '#1C1C1E',
		padding: 20,
		marginBottom: 20,
		marginHorizontal: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#2C2C2E',
	},
	notesTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 12,
	},
	notesInput: {
		borderWidth: 1,
		borderColor: '#3A3A3C',
		borderRadius: 12,
		padding: 16,
		fontSize: 14,
		color: '#FFFFFF',
		minHeight: 100,
		textAlignVertical: 'top',
		backgroundColor: '#2C2C2E',
	},
	// Стили для модального окна
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: '#1C1C1E',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 20,
		maxHeight: '80%',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFFFFF',
		flex: 1,
	},
	modalCloseButton: {
		padding: 4,
	},
	muscleGroupsList: {
		paddingVertical: 10,
	},
	muscleGroupCard: {
		width: 120,
		backgroundColor: '#2C2C2E',
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#3A3A3C',
	},
	muscleGroupImageContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
		overflow: 'hidden',
	},
	muscleGroupImage: {
		width: 40,
		height: 40,
		tintColor: '#34C759',
	},
	muscleGroupName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 4,
		textAlign: 'center',
	},
	muscleGroupExercisesCount: {
		fontSize: 12,
		color: '#8E8E93',
		textAlign: 'center',
	},
	exercisesList: {
		paddingVertical: 10,
	},
	exerciseItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: '#2C2C2E',
		borderRadius: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#3A3A3C',
	},
	exerciseItemName: {
		fontSize: 16,
		color: '#FFFFFF',
		flex: 1,
	},
	confirmationContainer: {
		padding: 20,
		alignItems: 'center',
	},
	confirmationTitle: {
		fontSize: 18,
		color: '#FFFFFF',
		marginBottom: 20,
	},
	selectedExerciseCard: {
		backgroundColor: '#2C2C2E',
		borderRadius: 16,
		padding: 20,
		width: '100%',
		borderWidth: 1,
		borderColor: '#34C759',
		marginBottom: 30,
	},
	selectedExerciseName: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#34C759',
		marginBottom: 8,
		textAlign: 'center',
	},
	selectedExerciseGroup: {
		fontSize: 14,
		color: '#8E8E93',
		textAlign: 'center',
	},
	confirmButton: {
		backgroundColor: '#34C759',
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 12,
		width: '100%',
		alignItems: 'center',
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000',
	},
})
