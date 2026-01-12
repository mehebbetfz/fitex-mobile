// contexts/DatabaseContext.tsx
import {
	addActiveExercise,
	addActiveSet,
	BodyMeasurement,
	completeActiveWorkout,
	createActiveWorkout,
	deleteActiveExercise,
	deleteActiveSet,
	getActiveExercisesFromDb,
	getActiveSetsFromDb,
	getActiveWorkouts,
	getBodyMeasurements,
	getFullWorkoutDetails,
	getPersonalRecords,
	getRecoveryData,
	getUserProfile,
	getWorkouts,
	initActiveWorkoutTables,
	initDatabase,
	PersonalRecord,
	RecoveryData,
	updateActiveSet,
	updateActiveWorkout,
	UserProfile,
	Workout,
	WorkoutStats,
} from '@/scripts/database'
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

interface DatabaseContextType {
	isInitialized: boolean
	workouts: Workout[]
	stats: WorkoutStats | null
	personalRecords: PersonalRecord[]
	bodyMeasurements: BodyMeasurement[]
	recoveryData: RecoveryData[]
	userProfile: UserProfile | null
	activeWorkouts: any[]
	isLoading: boolean

	// Методы для работы с тренировками
	refreshWorkouts: (filter?: string) => Promise<void>
	createNewWorkout: (name: string) => Promise<number>
	completeWorkout: (id: number) => Promise<number>
	getWorkoutDetails: (id: number) => Promise<any>
	deleteWorkout: (id: number) => Promise<boolean>

	// Методы для активных тренировок
	refreshActiveWorkouts: () => Promise<void>
	addExerciseToWorkout: (workoutId: number, exercise: any) => Promise<number>
	addSetToExercise: (exerciseId: number, set: any) => Promise<number>
	updateSet: (setId: number, updates: any) => Promise<boolean>
	deleteSet: (setId: number) => Promise<boolean>
	deleteExercise: (exerciseId: number) => Promise<boolean>
	updateWorkout: (workoutId: number, updates: any) => Promise<boolean>
	getWorkoutExercises: (workoutId: number) => Promise<any[]>
	getExerciseSets: (exerciseId: number) => Promise<any[]>

	// Методы для статистики
	refreshStats: () => Promise<void>
	refreshPersonalRecords: () => Promise<void>
	refreshBodyMeasurements: () => Promise<void>
	refreshRecoveryData: () => Promise<void>
	refreshUserProfile: () => Promise<void>

	getActiveWorkout: (id: number) => Promise<any>
	getActiveExercises: (workoutId: number) => Promise<any[]>
	getActiveSets: (exerciseId: number) => Promise<any[]>
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
	undefined
)

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isInitialized, setIsInitialized] = useState(false)
	const [workouts, setWorkouts] = useState<Workout[]>([])
	const [stats, setStats] = useState<WorkoutStats | null>(null)
	const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([])
	const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(
		[]
	)
	const [recoveryData, setRecoveryData] = useState<RecoveryData[]>([])
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
	const [activeWorkouts, setActiveWorkouts] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [currentFilter, setCurrentFilter] = useState<string>('all')

	// Инициализация базы данных
	const initializeDatabase = useCallback(async () => {
		try {
			setIsLoading(true)
			await initDatabase()
			await initActiveWorkoutTables()
			setIsInitialized(true)
		} catch (error) {
			console.error('Error initializing database:', error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Обновление всех данных
	const refreshAllData = useCallback(async () => {
		try {
			await Promise.all([
				// refreshWorkouts(),
				refreshStats(),
				refreshPersonalRecords(),
				refreshBodyMeasurements(),
				refreshRecoveryData(),
				refreshUserProfile(),
				refreshActiveWorkouts(),
			])
		} catch (error) {
			console.error('Error refreshing all data:', error)
		}
	}, [])

	// Методы для тренировок
	const refreshWorkouts = useCallback(async (filter?: string) => {
		try {
			if (filter) setCurrentFilter(filter)

			const data = await getWorkouts(
				undefined,
				filter === 'all' ? undefined : filter
			)
			setWorkouts(data)
			return data
		} catch (error) {
			console.error('Error refreshing workouts:', error)
			throw error
		}
	}, [])

	const getActiveWorkout = useCallback(async (id: number) => {
		try {
			return await getActiveWorkout(id)
		} catch (error) {
			console.error('Error getting active workout:', error)
			throw error
		}
	}, [])

	const getActiveExercises = useCallback(async (workoutId: number) => {
		try {
			return await getActiveExercisesFromDb(workoutId)
		} catch (error) {
			console.error('Error getting active exercises:', error)
			throw error
		}
	}, [])

	const getActiveSets = useCallback(async (exerciseId: number) => {
		try {
			return await getActiveSetsFromDb(exerciseId)
		} catch (error) {
			console.error('Error getting active sets:', error)
			throw error
		}
	}, [])

	const createNewWorkout = useCallback(async (name: string) => {
		try {
			const id = await createActiveWorkout(name)
			await refreshActiveWorkouts()
			return id
		} catch (error) {
			console.error('Error creating workout:', error)
			throw error
		}
	}, [])

	const completeWorkout = useCallback(async (id: number) => {
		try {
			const workoutId = await completeActiveWorkout(id)
			await refreshAllData()
			return workoutId
		} catch (error) {
			console.error('Error completing workout:', error)
			throw error
		}
	}, [])

	const getWorkoutDetails = useCallback(async (id: number) => {
		try {
			return await getFullWorkoutDetails(id)
		} catch (error) {
			console.error('Error getting workout details:', error)
			throw error
		}
	}, [])

	const deleteWorkout = useCallback(async (id: number) => {
		try {
			// Здесь нужно добавить функцию deleteWorkout в database.ts
			// Пока что это заглушка
			await refreshAllData()
			return true
		} catch (error) {
			console.error('Error deleting workout:', error)
			throw error
		}
	}, [])

	// Методы для активных тренировок
	const refreshActiveWorkouts = useCallback(async () => {
		try {
			const data = await getActiveWorkouts()
			setActiveWorkouts(data)
		} catch (error) {
			console.error('Error refreshing active workouts:', error)
			throw error
		}
	}, [])

	const addExerciseToWorkout = useCallback(
		async (workoutId: number, exercise: any) => {
			try {
				const id = await addActiveExercise(workoutId, exercise)
				await refreshActiveWorkouts()
				return id
			} catch (error) {
				console.error('Error adding exercise:', error)
				throw error
			}
		},
		[]
	)

	const addSetToExercise = useCallback(async (exerciseId: number, set: any) => {
		try {
			const id = await addActiveSet(exerciseId, set)
			console.log('ID IN: ' + id)
			return id
		} catch (error) {
			console.error('Error adding set:', error)
			throw error
		}
	}, [])

	const updateSet = useCallback(async (setId: number, updates: any) => {
		try {
			return await updateActiveSet(setId, updates)
		} catch (error) {
			console.error('Error updating set:', error)
			throw error
		}
	}, [])

	const deleteSet = useCallback(async (setId: number) => {
		try {
			return await deleteActiveSet(setId)
		} catch (error) {
			console.error('Error deleting set:', error)
			throw error
		}
	}, [])

	const deleteExercise = useCallback(async (exerciseId: number) => {
		try {
			return await deleteActiveExercise(exerciseId)
		} catch (error) {
			console.error('Error deleting exercise:', error)
			throw error
		}
	}, [])

	const updateWorkout = useCallback(async (workoutId: number, updates: any) => {
		try {
			return await updateActiveWorkout(workoutId, updates)
		} catch (error) {
			console.error('Error updating workout:', error)
			throw error
		}
	}, [])

	const getWorkoutExercises = useCallback(async (workoutId: number) => {
		try {
			return await getActiveExercises(workoutId)
		} catch (error) {
			console.error('Error getting exercises:', error)
			throw error
		}
	}, [])

	const getExerciseSets = useCallback(async (exerciseId: number) => {
		try {
			return await getActiveSets(exerciseId)
		} catch (error) {
			console.error('Error getting sets:', error)
			throw error
		}
	}, [])

	// Методы для статистики
	const refreshStats = useCallback(async () => {
		try {
			// Нужно добавить функцию getWorkoutStats в database.ts
			// Пока что это заглушка
			const statsData = {
				total_workouts: workouts.length,
				total_sets: workouts.reduce((sum, w) => sum + w.sets_count, 0),
				total_volume: workouts.reduce((sum, w) => sum + w.volume, 0),
				streak_days: 7,
				avg_duration:
					Math.round(
						workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length
					) || 0,
			}
			setStats(statsData)
		} catch (error) {
			console.error('Error refreshing stats:', error)
			throw error
		}
	}, [workouts])

	const refreshPersonalRecords = useCallback(async () => {
		try {
			const data = await getPersonalRecords()
			setPersonalRecords(data)
		} catch (error) {
			console.error('Error refreshing personal records:', error)
			throw error
		}
	}, [])

	const refreshBodyMeasurements = useCallback(async () => {
		try {
			const data = await getBodyMeasurements()
			setBodyMeasurements(data)
		} catch (error) {
			console.error('Error refreshing body measurements:', error)
			throw error
		}
	}, [])

	const refreshRecoveryData = useCallback(async () => {
		try {
			const data = await getRecoveryData()
			setRecoveryData(data)
		} catch (error) {
			console.error('Error refreshing recovery data:', error)
			throw error
		}
	}, [])

	const refreshUserProfile = useCallback(async () => {
		try {
			const data = await getUserProfile()
			setUserProfile(data)
		} catch (error) {
			console.error('Error refreshing user profile:', error)
			throw error
		}
	}, [])

	// Инициализация при монтировании
	useEffect(() => {
		initializeDatabase()
	}, [initializeDatabase])

	// Обновляем статистику при изменении тренировок
	useEffect(() => {
		if (workouts.length > 0) {
			refreshStats()
		}
	}, [workouts, refreshStats])

	const value = {
		isInitialized,
		workouts,
		stats,
		personalRecords,
		bodyMeasurements,
		recoveryData,
		userProfile,
		activeWorkouts,
		isLoading,

		// Методы
		refreshWorkouts,
		createNewWorkout,
		completeWorkout,
		getWorkoutDetails,
		deleteWorkout,

		refreshActiveWorkouts,
		addExerciseToWorkout,
		addSetToExercise,
		updateSet,
		deleteSet,
		deleteExercise,
		updateWorkout,
		getWorkoutExercises,
		getExerciseSets,

		refreshStats,
		refreshPersonalRecords,
		refreshBodyMeasurements,
		refreshRecoveryData,
		refreshUserProfile,

		getActiveWorkout,
		getActiveExercises,
		getActiveSets,
	}

	return (
		<DatabaseContext.Provider value={value}>
			{children}
		</DatabaseContext.Provider>
	)
}

export const useDatabase = () => {
	const context = useContext(DatabaseContext)
	if (!context) {
		throw new Error('useDatabase must be used within DatabaseProvider')
	}
	return context
}
