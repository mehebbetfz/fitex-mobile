import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
	Alert,
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
		},
	])

	const [timer, setTimer] = useState(0)
	const [isTimerRunning, setIsTimerRunning] = useState(false)

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

	const totalCompleted = exercises.reduce(
		(sum, ex) => sum + ex.sets.filter(set => set.completed).length,
		0
	)
	const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0)

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<Ionicons name='close' size={28} color='#666' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Тренировка</Text>
				<TouchableOpacity onPress={handleFinishWorkout}>
					<Text style={styles.finishButton}>Готово</Text>
				</TouchableOpacity>
			</View>

			<ScrollView>
				<View style={styles.workoutInfo}>
					<TextInput
						style={styles.workoutName}
						value={workoutName}
						onChangeText={setWorkoutName}
						placeholder='Название тренировки'
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
							color='#007AFF'
						/>
						<Text style={styles.timerButtonText}>
							{isTimerRunning ? 'Пауза' : 'Старт'}
						</Text>
					</TouchableOpacity>
				</View>

				{exercises.map((exercise, exerciseIndex) => (
					<View key={exercise.id} style={styles.exerciseCard}>
						<View style={styles.exerciseHeader}>
							<View>
								<Text style={styles.exerciseName}>{exercise.name}</Text>
								<Text style={styles.exerciseMuscle}>
									{exercise.muscleGroup}
								</Text>
							</View>
							<TouchableOpacity>
								<Ionicons name='ellipsis-vertical' size={20} color='#666' />
							</TouchableOpacity>
						</View>

						<View style={styles.setsHeader}>
							<Text style={styles.setHeaderText}>Подход</Text>
							<Text style={styles.setHeaderText}>Вес (кг)</Text>
							<Text style={styles.setHeaderText}>Повторения</Text>
							<Text style={styles.setHeaderText}>✓</Text>
						</View>

						{exercise.sets.map(set => (
							<View key={set.id} style={styles.setRow}>
								<Text style={styles.setNumber}>{set.setNumber}</Text>

								<TextInput
									style={[styles.input, set.completed && styles.inputCompleted]}
									value={set.weight.toString()}
									onChangeText={value =>
										handleUpdateSet(exercise.id, set.id, 'weight', value)
									}
									keyboardType='numeric'
									editable={!set.completed}
								/>

								<TextInput
									style={[styles.input, set.completed && styles.inputCompleted]}
									value={set.reps.toString()}
									onChangeText={value =>
										handleUpdateSet(exercise.id, set.id, 'reps', value)
									}
									keyboardType='numeric'
									editable={!set.completed}
								/>

								<TouchableOpacity
									style={[
										styles.checkbox,
										set.completed && styles.checkboxCompleted,
									]}
									onPress={() => handleSetComplete(exercise.id, set.id)}
								>
									{set.completed && (
										<Ionicons name='checkmark' size={16} color='#fff' />
									)}
								</TouchableOpacity>
							</View>
						))}

						<TouchableOpacity
							style={styles.addSetButton}
							onPress={() => {
								const newSetNumber = exercise.sets.length + 1
								const newSet: ExerciseSet = {
									id: `${exercise.id}-${newSetNumber}`,
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
							<Ionicons name='add' size={20} color='#007AFF' />
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
					</View>
				))}

				<TouchableOpacity
					style={styles.addExerciseButton}
					onPress={() => {
						Alert.alert('Добавить упражнение', 'Функция в разработке')
					}}
				>
					<Ionicons name='add-circle-outline' size={24} color='#007AFF' />
					<Text style={styles.addExerciseText}>Добавить упражнение</Text>
				</TouchableOpacity>

				<View style={styles.notesSection}>
					<Text style={styles.notesTitle}>Заметки</Text>
					<TextInput
						style={styles.notesInput}
						placeholder='Добавьте заметки к тренировке...'
						multiline
						numberOfLines={4}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5ea',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1a1a1a',
	},
	finishButton: {
		fontSize: 16,
		fontWeight: '600',
		color: '#007AFF',
	},
	workoutInfo: {
		backgroundColor: '#fff',
		padding: 20,
		marginBottom: 12,
	},
	workoutName: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 16,
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 16,
	},
	stat: {
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#007AFF',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: '#666',
	},
	timerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#E3F2FD',
		paddingVertical: 12,
		borderRadius: 12,
	},
	timerButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#007AFF',
		marginLeft: 8,
	},
	exerciseCard: {
		backgroundColor: '#fff',
		marginBottom: 12,
		padding: 16,
	},
	exerciseHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	exerciseName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	exerciseMuscle: {
		fontSize: 14,
		color: '#666',
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
		borderBottomColor: '#f5f5f5',
	},
	setNumber: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1a1a1a',
		width: 60,
		textAlign: 'center',
	},
	input: {
		width: 60,
		height: 40,
		borderWidth: 1,
		borderColor: '#e5e5ea',
		borderRadius: 8,
		textAlign: 'center',
		fontSize: 16,
		color: '#1a1a1a',
	},
	inputCompleted: {
		backgroundColor: '#f5f5f5',
		color: '#8E8E93',
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#e5e5ea',
		alignItems: 'center',
		justifyContent: 'center',
	},
	checkboxCompleted: {
		backgroundColor: '#34C759',
		borderColor: '#34C759',
	},
	addSetButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		marginTop: 8,
	},
	addSetText: {
		fontSize: 14,
		color: '#007AFF',
		fontWeight: '600',
		marginLeft: 8,
	},
	restTimer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFF3CD',
		padding: 12,
		borderRadius: 8,
		marginTop: 16,
	},
	restText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#856404',
	},
	restButton: {
		backgroundColor: '#FFCC00',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	restButtonText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#856404',
	},
	addExerciseButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		padding: 16,
		marginBottom: 12,
	},
	addExerciseText: {
		fontSize: 16,
		color: '#007AFF',
		fontWeight: '600',
		marginLeft: 8,
	},
	notesSection: {
		backgroundColor: '#fff',
		padding: 20,
		marginBottom: 20,
	},
	notesTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1a1a1a',
		marginBottom: 12,
	},
	notesInput: {
		borderWidth: 1,
		borderColor: '#e5e5ea',
		borderRadius: 8,
		padding: 12,
		fontSize: 14,
		color: '#1a1a1a',
		minHeight: 100,
		textAlignVertical: 'top',
	},
})
