import * as SQLite from 'expo-sqlite'

export interface ActiveWorkout {
	id?: number
	name: string
	date: string
	start_time: string
	time: string
	end_time?: string
	duration: number // в секундах
	status: 'active' | 'paused' | 'completed'
	muscle_groups: string
	exercises_count: number
	sets_count: number
	volume: number
	notes?: string
	rating?: number
}

export interface ActiveExercise {
	id?: number
	workout_id: number
	name: string
	muscle_group: string
	order_index: number
	collapsed: boolean
	created_at?: string
}

export interface ActiveSet {
	id?: number
	exercise_id: number
	set_number: number
	weight: number
	reps: number
	completed: boolean
	created_at?: string
}

// Типы данных
export interface Workout {
	id?: number
	date: string
	time: string
	duration: number // в минутах
	type: string
	muscle_groups: string
	exercises_count: number
	sets_count: number
	volume: number
	notes?: string
	rating?: number
	created_at?: string
}

export interface Exercise {
	id?: number
	workout_id: number
	name: string
	muscle_group: string
	volume: number
	one_rep_max?: number
	notes?: string
	order_index: number
}

export interface ExerciseSet {
	id?: number
	exercise_id: number
	set_number: number
	weight: number
	reps: number
	completed: boolean
}

export interface BodyMeasurement {
	id?: number
	name: string
	value: number
	unit: string
	date: string
	trend: 'up' | 'down' | 'stable'
	goal?: number
	created_at?: string
}

export interface PersonalRecord {
	id?: number
	exercise: string
	weight: string
	date: string
	trend: 'up' | 'down' | 'stable'
	category: 'strength' | 'cardio' | 'endurance'
	notes?: string
	previous_record?: string
	improvement?: string
	created_at?: string
}

export interface RecoveryData {
	id?: number
	muscle_name: string
	status: 'recovered' | 'recovering' | 'needs_rest'
	recovery: number // процент
	last_trained: string
	updated_at?: string
}

export interface UserStats {
	id?: number
	date: string
	total_workouts: number
	total_sets: number
	streak_days: number
	created_at?: string
}

// Открытие базы данных
export const openDatabase = () => {
	const db = SQLite.openDatabaseSync('fitex.db')
	return db
}

// Инициализация базы данных
export const initDatabase = async () => {
	const db = openDatabase()

	try {
		await db.execAsync(`

			DROP TABLE IF EXISTS workouts;
			DROP TABLE IF EXISTS exercises;
			DROP TABLE IF EXISTS exercise_sets;
			DROP TABLE IF EXISTS body_measurements;
			DROP TABLE IF EXISTS personal_records;

      CREATE TABLE  workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT,
        duration INTEGER NOT NULL,
        type TEXT NOT NULL,
        muscle_groups TEXT NOT NULL,
        exercises_count INTEGER NOT NULL,
        sets_count INTEGER NOT NULL,
        volume REAL NOT NULL,
        notes TEXT,
        rating INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        muscle_group TEXT NOT NULL,
        volume REAL NOT NULL,
        one_rep_max REAL,
        notes TEXT,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS exercise_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER NOT NULL,
        set_number INTEGER NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        completed BOOLEAN DEFAULT 1,
        FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS body_measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        date TEXT NOT NULL,
        trend TEXT NOT NULL,
        goal REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS personal_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise TEXT NOT NULL,
        weight TEXT NOT NULL,
        date TEXT NOT NULL,
        trend TEXT NOT NULL,
        category TEXT NOT NULL,
        notes TEXT,
        previous_record TEXT,
        improvement TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS recovery_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        muscle_name TEXT NOT NULL,
        status TEXT NOT NULL,
        recovery INTEGER NOT NULL,
        last_trained TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS user_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        total_workouts INTEGER DEFAULT 0,
        total_sets INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

		console.log('Database initialized successfully')
		return true
	} catch (error) {
		console.error('Error initializing database:', error)
		throw error
	}
}

// ========== РАБОТА С ТРЕНИРОВКАМИ ==========

export const addWorkout = async (
	workout: Omit<Workout, 'id'>
): Promise<number> => {
	const db = openDatabase()

	try {
		const result = await db.runAsync(
			`INSERT INTO workouts 
       (date, time, duration, type, muscle_groups, exercises_count, sets_count, volume, notes, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				workout.date,
				workout.time,
				workout.duration,
				workout.type,
				workout.muscle_groups,
				workout.exercises_count,
				workout.sets_count,
				workout.volume,
				workout.notes || null,
				workout.rating || null,
			]
		)
		return result.lastInsertRowId as number
	} catch (error) {
		console.error('Error adding workout:', error)
		throw error
	}
}

// Создание новой активной тренировки
export const createActiveWorkout = async (name: string): Promise<number> => {
	const db = openDatabase()

	try {
		const currentDate = getCurrentDate()
		const currentTime = getCurrentTime()

		const result = await db.runAsync(
			`INSERT INTO active_workouts 
       (name, date, start_time, duration, status, muscle_groups, exercises_count, sets_count, volume, notes, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[name, currentDate, currentTime, 0, 'active', '', 0, 0, 0, null, null]
		)
		return result.lastInsertRowId as number
	} catch (error) {
		console.error('Error creating active workout:', error)
		throw error
	}
}

// Получение активной тренировки
export const getActiveWorkout = async (
	id: number
): Promise<ActiveWorkout | null> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM active_workouts WHERE id = ?',
			id
		)
		if (results.length > 0) {
			return results[0] as ActiveWorkout
		} else {
			return null
		}
	} catch (error) {
		console.error('Error getting active workout:', error)
		throw error
	}
}

// Обновление активной тренировки
export const updateActiveWorkout = async (
	id: number,
	updates: Partial<ActiveWorkout>
): Promise<boolean> => {
	const db = openDatabase()

	try {
		const workout = await getActiveWorkout(id)
		if (!workout) return false

		const updatedWorkout = { ...workout, ...updates }

		await db.runAsync(
			`UPDATE active_workouts 
       SET name = ?, date = ?, start_time = ?, end_time = ?, duration = ?, 
           status = ?, muscle_groups = ?, exercises_count = ?, sets_count = ?, 
           volume = ?, notes = ?, rating = ?
       WHERE id = ?`,
			[
				updatedWorkout.name,
				updatedWorkout.date,
				updatedWorkout.start_time,
				updatedWorkout.end_time || null,
				updatedWorkout.duration,
				updatedWorkout.status,
				updatedWorkout.muscle_groups,
				updatedWorkout.exercises_count,
				updatedWorkout.sets_count,
				updatedWorkout.volume,
				updatedWorkout.notes || null,
				updatedWorkout.rating || null,
				id,
			]
		)

		return true
	} catch (error) {
		console.error('Error updating active workout:', error)
		throw error
	}
}

// Добавление упражнения в активную тренировку
export const addActiveExercise = async (
	workoutId: number,
	exercise: Omit<ActiveExercise, 'id' | 'workout_id' | 'created_at'>
): Promise<number> => {
	const db = openDatabase()

	try {
		// Получаем текущее максимальное значение order_index
		const existingExercises: any = await db.getAllAsync(
			'SELECT order_index FROM active_exercises WHERE workout_id = ? ORDER BY order_index DESC',
			workoutId
		)

		const maxOrderIndex =
			existingExercises.length > 0 ? existingExercises[0].order_index : 0

		const result = await db.runAsync(
			`INSERT INTO active_exercises (workout_id, name, muscle_group, order_index, collapsed)
       VALUES (?, ?, ?, ?, ?)`,
			[
				workoutId,
				exercise.name,
				exercise.muscle_group,
				maxOrderIndex + 1,
				exercise.collapsed ? 1 : 0,
			]
		)

		return result.lastInsertRowId as number
	} catch (error) {
		console.error('Error adding active exercise:', error)
		throw error
	}
}

// Добавление подхода в активное упражнение
export const addActiveSet = async (
	exerciseId: number,
	set: Omit<ActiveSet, 'id' | 'exercise_id' | 'created_at'>
): Promise<number> => {
	try {
		const db = openDatabase()

		// Добавьте проверку
		if (!db) {
			throw new Error('Database is not initialized')
		}

		console.log('Database opened successfully')
		console.log('Inserting set for exercise:', exerciseId, set)
		const result = await db.runAsync(
			`INSERT INTO active_sets (exercise_id, set_number, weight, reps, completed)
       VALUES (?, ?, ?, ?, ?)`,
			[exerciseId, set.set_number, set.weight, set.reps, set.completed ? 1 : 0]
		)

		console.log(result)

		return result.lastInsertRowId as number
	} catch (error) {
		console.error('Error adding active set:', error)
		throw error
	}
}

// Получение упражнений активной тренировки
export const getActiveExercisesFromDb = async (
	workoutId: number
): Promise<ActiveExercise[]> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM active_exercises WHERE workout_id = ? ORDER BY order_index',
			workoutId
		)

		return results.map((ex: any) => ({
			...ex,
			collapsed: ex.collapsed === 1,
		})) as ActiveExercise[]
	} catch (error) {
		console.error('Error getting active exercises:', error)
		throw error
	}
}

// Получение подходов активного упражнения
export const getActiveSetsFromDb = async (
	exerciseId: number
): Promise<ActiveSet[]> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM active_sets WHERE exercise_id = ? ORDER BY set_number',
			exerciseId
		)

		return results.map((set: any) => ({
			...set,
			completed: set.completed === 1,
		})) as ActiveSet[]
	} catch (error) {
		console.error('Error getting active sets:', error)
		throw error
	}
}

// Обновление активного подхода
export const updateActiveSet = async (
	setId: number,
	updates: Partial<Omit<ActiveSet, 'id' | 'exercise_id'>>
): Promise<boolean> => {
	const db = openDatabase()

	try {
		console.log(setId, updates)
		const completed =
			updates.completed !== undefined ? (updates.completed ? 1 : 0) : undefined

		let query = 'UPDATE active_sets SET '
		const params: any[] = []
		const updatesArray = []

		if (updates.set_number !== undefined) {
			updatesArray.push('set_number = ?')
			params.push(updates.set_number)
		}
		if (updates.weight !== undefined) {
			updatesArray.push('weight = ?')
			params.push(updates.weight)
		}
		if (updates.reps !== undefined) {
			updatesArray.push('reps = ?')
			params.push(updates.reps)
		}
		if (completed !== undefined) {
			updatesArray.push('completed = ?')
			params.push(completed)
		}

		if (updatesArray.length === 0) return true

		query += updatesArray.join(', ') + ' WHERE id = ?'
		params.push(setId)

		await db.runAsync(query, ...params)
		return true
	} catch (error) {
		console.error('Error updating active set:', error)
		throw error
	}
}

// Удаление активного подхода
export const deleteActiveSet = async (setId: number): Promise<boolean> => {
	const db = openDatabase()

	try {
		await db.runAsync('DELETE FROM active_sets WHERE id = ?', setId)
		return true
	} catch (error) {
		console.error('Error deleting active set:', error)
		throw error
	}
}

// Удаление активного упражнения (каскадно удаляет подходы)
export const deleteActiveExercise = async (
	exerciseId: number
): Promise<boolean> => {
	const db = openDatabase()

	try {
		await db.runAsync('DELETE FROM active_exercises WHERE id = ?', exerciseId)
		return true
	} catch (error) {
		console.error('Error deleting active exercise:', error)
		throw error
	}
}

// Завершение тренировки и сохранение в историю
// В database.ts, исправим функцию completeActiveWorkout
export const completeActiveWorkout = async (
	workoutId: number
): Promise<number> => {
	const db = openDatabase()

	try {
		// Получаем активную тренировку
		const workout = await getActiveWorkout(workoutId)
		if (!workout) throw new Error('Workout not found')

		// Получаем упражнения и подходы
		const exercises = await getActiveExercisesFromDb(workoutId)

		// Рассчитываем итоговую статистику
		let totalVolume = 0
		let totalSets = 0
		const muscleGroupsSet = new Set<string>()

		for (const exercise of exercises) {
			if (!exercise.id) continue // Пропускаем если нет id

			muscleGroupsSet.add(exercise.muscle_group)
			const sets = await getActiveSetsFromDb(exercise.id)

			for (const set of sets) {
				totalVolume += set.weight * set.reps
			}
			totalSets += sets.length
		}

		const muscleGroups = Array.from(muscleGroupsSet).join(',')

		// Обновляем активную тренировку
		await updateActiveWorkout(workoutId, {
			end_time: getCurrentTime(),
			status: 'completed',
			muscle_groups: muscleGroups,
			exercises_count: exercises.length,
			sets_count: totalSets,
			volume: totalVolume,
		})

		// Получаем обновленную тренировку
		const completedWorkout = await getActiveWorkout(workoutId)
		if (!completedWorkout) throw new Error('Workout not found after completion')

		console.log('Completed Workout:', completedWorkout)

		const cols = await getWorkouts()

		console.log('Active Exercises Columns:', cols)

		// Создаем запись в основной таблице
		const workoutRecordId = await addWorkout({
			date: completedWorkout.date,
			time: completedWorkout.time,
			duration: Math.floor(completedWorkout.duration / 60), // конвертируем секунды в минуты
			type: completedWorkout.name,
			muscle_groups: completedWorkout.muscle_groups,
			exercises_count: completedWorkout.exercises_count,
			sets_count: completedWorkout.sets_count,
			volume: completedWorkout.volume,
			notes: completedWorkout.notes,
			rating: completedWorkout.rating,
		})

		// Переносим упражнения и подходы
		for (const exercise of exercises) {
			if (!exercise.id) continue

			const sets = await getActiveSetsFromDb(exercise.id)
			const exerciseVolume = sets.reduce(
				(sum, set) => sum + set.weight * set.reps,
				0
			)

			// Добавляем упражнение
			const exerciseResult = await db.runAsync(
				`INSERT INTO exercises (workout_id, name, muscle_group, volume, one_rep_max, notes, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[
					workoutRecordId,
					exercise.name,
					exercise.muscle_group,
					exerciseVolume,
					0,
					'',
					exercise.order_index,
				]
			)
			const savedExerciseId = exerciseResult.lastInsertRowId as number

			// Добавляем подходы
			for (const set of sets) {
				await db.runAsync(
					`INSERT INTO exercise_sets (exercise_id, set_number, weight, reps, completed)
           VALUES (?, ?, ?, ?, ?)`,
					[
						savedExerciseId,
						set.set_number,
						set.weight,
						set.reps,
						set.completed ? 1 : 0,
					]
				)
			}
		}

		// Удаляем активную тренировку и связанные данные (каскадно)
		await db.runAsync('DELETE FROM active_workouts WHERE id = ?', workoutId)

		return workoutRecordId
	} catch (error) {
		console.error('Error completing workout:', error)
		throw error
	}
}

// Получение всех активных тренировок
export const getActiveWorkouts = async (): Promise<ActiveWorkout[]> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM active_workouts WHERE status = "active" ORDER BY created_at DESC'
		)
		return results as ActiveWorkout[]
	} catch (error) {
		console.error('Error getting active workouts:', error)
		throw error
	}
}

// Инициализация таблиц для активных тренировок
export const initActiveWorkoutTables = async () => {
	const db = openDatabase()

	try {
		await db.execAsync(`
      CREATE TABLE IF NOT EXISTS active_workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT,
        duration INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        muscle_groups TEXT DEFAULT '',
        exercises_count INTEGER DEFAULT 0,
        sets_count INTEGER DEFAULT 0,
        volume REAL DEFAULT 0,
        notes TEXT,
        rating INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS active_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        muscle_group TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        collapsed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES active_workouts (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS active_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER NOT NULL,
        set_number INTEGER NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exercise_id) REFERENCES active_exercises (id) ON DELETE CASCADE
      );
    `)

		console.log('Active workout tables initialized')
	} catch (error) {
		console.error('Error initializing active workout tables:', error)
		throw error
	}
}

export const getWorkouts = async (
	limit?: number,
	muscleGroup?: string
): Promise<Workout[]> => {
	const db = openDatabase()

	try {
		let query = 'SELECT * FROM workouts ORDER BY date DESC, time DESC'
		const params: any[] = []

		if (muscleGroup && muscleGroup !== 'all') {
			query =
				'SELECT * FROM workouts WHERE muscle_groups LIKE ? ORDER BY date DESC, time DESC'
			params.push(`%${muscleGroup}%`)
		}

		if (limit) {
			query += ` LIMIT ${limit}`
		}

		const results = await db.getAllAsync(query, ...params)
		return results as Workout[]
	} catch (error) {
		console.error('Error getting workouts:', error)
		throw error
	}
}

export const getWorkoutById = async (id: number): Promise<Workout | null> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM workouts WHERE id = ?',
			id
		)
		if (results.length > 0) {
			return results[0] as Workout
		} else {
			return null
		}
	} catch (error) {
		console.error('Error getting workout by id:', error)
		throw error
	}
}

export const deleteWorkout = async (id: number): Promise<boolean> => {
	const db = openDatabase()

	try {
		const result = await db.runAsync('DELETE FROM workouts WHERE id = ?', id)
		return result.changes > 0
	} catch (error) {
		console.error('Error deleting workout:', error)
		throw error
	}
}

// ========== РАБОТА С УПРАЖНЕНИЯМИ И ПОДХОДАМИ ==========

export const addExerciseWithSets = async (
	workoutId: number,
	exercise: Omit<Exercise, 'id' | 'workout_id'>,
	sets: Omit<ExerciseSet, 'id' | 'exercise_id'>[]
): Promise<number> => {
	const db = openDatabase()

	try {
		let exerciseId: number

		// Используем транзакцию для атомарности
		await db.withTransactionAsync(async () => {
			// Вставляем упражнение
			const exerciseResult = await db.runAsync(
				`INSERT INTO exercises (workout_id, name, muscle_group, volume, one_rep_max, notes, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[
					workoutId,
					exercise.name,
					exercise.muscle_group,
					exercise.volume,
					exercise.one_rep_max || null,
					exercise.notes || null,
					exercise.order_index,
				]
			)
			exerciseId = exerciseResult.lastInsertRowId as number

			// Вставляем подходы
			for (const set of sets) {
				await db.runAsync(
					`INSERT INTO exercise_sets (exercise_id, set_number, weight, reps, completed)
           VALUES (?, ?, ?, ?, ?)`,
					[
						exerciseId,
						set.set_number,
						set.weight,
						set.reps,
						set.completed ? 1 : 0,
					]
				)
			}
		})

		return exerciseId
	} catch (error) {
		console.error('Error adding exercise with sets:', error)
		throw error
	}
}

export const getExercisesByWorkoutId = async (
	workoutId: number
): Promise<Exercise[]> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM exercises WHERE workout_id = ? ORDER BY order_index',
			workoutId
		)
		return results as Exercise[]
	} catch (error) {
		console.error('Error getting exercises by workout id:', error)
		throw error
	}
}

export const getSetsByExerciseId = async (
	exerciseId: number
): Promise<ExerciseSet[]> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM exercise_sets WHERE exercise_id = ? ORDER BY set_number',
			exerciseId
		)
		const sets = results.map((set: any) => ({
			...set,
			completed: set.completed === 1,
		}))
		return sets as ExerciseSet[]
	} catch (error) {
		console.error('Error getting sets by exercise id:', error)
		throw error
	}
}

export const getFullWorkoutDetails = async (
	workoutId: number
): Promise<{
	workout: Workout
	exercises: Array<Exercise & { sets: ExerciseSet[] }>
}> => {
	const db = openDatabase()

	try {
		// Получаем тренировку
		const workoutResults = await db.getAllAsync(
			'SELECT * FROM workouts WHERE id = ?',
			workoutId
		)
		if (workoutResults.length === 0) {
			throw new Error('Workout not found')
		}

		const workout = workoutResults[0] as Workout

		// Получаем упражнения
		const exercises = await getExercisesByWorkoutId(workoutId)

		// Для каждого упражнения получаем подходы
		const exercisesWithSets = await Promise.all(
			exercises.map(async exercise => {
				const sets = await getSetsByExerciseId(exercise.id!)
				return {
					...exercise,
					sets,
				}
			})
		)

		return {
			workout,
			exercises: exercisesWithSets,
		}
	} catch (error) {
		console.error('Error getting full workout details:', error)
		throw error
	}
}

// ========== РАБОТА С ЗАМЕРАМИ ТЕЛА ==========

export const addBodyMeasurement = async (
	measurement: Omit<BodyMeasurement, 'id'>
): Promise<number> => {
	const db = openDatabase()

	try {
		const result = await db.runAsync(
			`INSERT INTO body_measurements (name, value, unit, date, trend, goal)
       VALUES (?, ?, ?, ?, ?, ?)`,
			[
				measurement.name,
				measurement.value,
				measurement.unit,
				measurement.date,
				measurement.trend,
				measurement.goal || null,
			]
		)
		return result.lastInsertRowId as number
	} catch (error) {
		console.error('Error adding body measurement:', error)
		throw error
	}
}

export const getBodyMeasurements = async (): Promise<BodyMeasurement[]> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM body_measurements ORDER BY date DESC'
		)
		return results as BodyMeasurement[]
	} catch (error) {
		console.error('Error getting body measurements:', error)
		throw error
	}
}

export const getLatestBodyMeasurements = async (): Promise<
	BodyMeasurement[]
> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			`SELECT b1.* 
       FROM body_measurements b1
       INNER JOIN (
         SELECT name, MAX(date) as max_date
         FROM body_measurements
         GROUP BY name
       ) b2 ON b1.name = b2.name AND b1.date = b2.max_date
       ORDER BY b1.name`
		)
		return results as BodyMeasurement[]
	} catch (error) {
		console.error('Error getting latest body measurements:', error)
		throw error
	}
}

export const getBodyMeasurementHistory = async (
	name?: string
): Promise<BodyMeasurement[]> => {
	const db = openDatabase()

	try {
		if (name) {
			const results = await db.getAllAsync(
				'SELECT * FROM body_measurements WHERE name = ? ORDER BY date DESC',
				name
			)
			return results as BodyMeasurement[]
		} else {
			// Группируем по дате
			const results = await db.getAllAsync(
				`SELECT date, 
                GROUP_CONCAT(name || ': ' || value || unit) as measurements
         FROM body_measurements
         GROUP BY date
         ORDER BY date DESC`
			)
			// Преобразуем в формат для отображения
			return results.map((row: any) => ({
				date: row.date,
				measurements: row.measurements.split(',').map((m: string) => {
					const [nameValue, ...rest] = m.split(':')
					return {
						name: nameValue.trim(),
						value: rest.join(':').trim(),
					}
				}),
			})) as any
		}
	} catch (error) {
		console.error('Error getting body measurement history:', error)
		throw error
	}
}

// ========== РАБОТА С РЕКОРДАМИ ==========

export const addPersonalRecord = async (
	record: Omit<PersonalRecord, 'id'>
): Promise<number> => {
	const db = openDatabase()

	try {
		const result = await db.runAsync(
			`INSERT INTO personal_records (exercise, weight, date, trend, category, notes, previous_record, improvement)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				record.exercise,
				record.weight,
				record.date,
				record.trend,
				record.category,
				record.notes || null,
				record.previous_record || null,
				record.improvement || null,
			]
		)
		return result.lastInsertRowId as number
	} catch (error) {
		console.error('Error adding personal record:', error)
		throw error
	}
}

export const getPersonalRecords = async (
	category?: string
): Promise<PersonalRecord[]> => {
	const db = openDatabase()

	try {
		if (category && category !== 'all') {
			const results = await db.getAllAsync(
				'SELECT * FROM personal_records WHERE category = ? ORDER BY date DESC',
				category
			)
			return results as PersonalRecord[]
		} else {
			const results = await db.getAllAsync(
				'SELECT * FROM personal_records ORDER BY date DESC'
			)
			return results as PersonalRecord[]
		}
	} catch (error) {
		console.error('Error getting personal records:', error)
		throw error
	}
}

export const getRecordById = async (
	id: number
): Promise<PersonalRecord | null> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM personal_records WHERE id = ?',
			id
		)
		if (results.length > 0) {
			return results[0] as PersonalRecord
		} else {
			return null
		}
	} catch (error) {
		console.error('Error getting record by id:', error)
		throw error
	}
}

// ========== РАБОТА С ДАННЫМИ ВОССТАНОВЛЕНИЯ ==========

export const updateRecoveryData = async (
	recoveryData: Omit<RecoveryData, 'id'>[]
): Promise<void> => {
	const db = openDatabase()

	try {
		await db.withTransactionAsync(async () => {
			// Удаляем старые данные
			await db.runAsync('DELETE FROM recovery_data')

			// Вставляем новые данные
			for (const data of recoveryData) {
				await db.runAsync(
					`INSERT INTO recovery_data (muscle_name, status, recovery, last_trained)
           VALUES (?, ?, ?, ?)`,
					[data.muscle_name, data.status, data.recovery, data.last_trained]
				)
			}
		})
	} catch (error) {
		console.error('Error updating recovery data:', error)
		throw error
	}
}

export const getRecoveryData = async (): Promise<RecoveryData[]> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM recovery_data ORDER BY muscle_name'
		)
		return results as RecoveryData[]
	} catch (error) {
		console.error('Error getting recovery data:', error)
		throw error
	}
}

export const updateMuscleRecovery = async (
	muscleName: string,
	status: 'recovered' | 'recovering' | 'needs_rest',
	recovery: number,
	lastTrained: string
): Promise<void> => {
	const db = openDatabase()

	try {
		await db.runAsync(
			`INSERT OR REPLACE INTO recovery_data (muscle_name, status, recovery, last_trained)
       VALUES (?, ?, ?, ?)`,
			[muscleName, status, recovery, lastTrained]
		)
	} catch (error) {
		console.error('Error updating muscle recovery:', error)
		throw error
	}
}

// ========== РАБОТА СО СТАТИСТИКОЙ ==========

export const updateUserStats = async (
	stats: Omit<UserStats, 'id'>
): Promise<number> => {
	const db = openDatabase()

	try {
		// Проверяем, есть ли запись за сегодня
		const existing = await db.getAllAsync(
			'SELECT id FROM user_stats WHERE date = ?',
			stats.date
		)

		if (existing.length > 0) {
			// Обновляем существующую запись
			const result = await db.runAsync(
				`UPDATE user_stats 
         SET total_workouts = ?, total_sets = ?, streak_days = ?
         WHERE date = ?`,
				[stats.total_workouts, stats.total_sets, stats.streak_days, stats.date]
			)
			return existing[0].id
		} else {
			// Создаем новую запись
			const result = await db.runAsync(
				`INSERT INTO user_stats (date, total_workouts, total_sets, streak_days)
         VALUES (?, ?, ?, ?)`,
				[stats.date, stats.total_workouts, stats.total_sets, stats.streak_days]
			)
			return result.lastInsertRowId as number
		}
	} catch (error) {
		console.error('Error updating user stats:', error)
		throw error
	}
}

export const getTodayStats = async (): Promise<UserStats | null> => {
	const db = openDatabase()
	const today = new Date().toISOString().split('T')[0]

	try {
		const results = await db.getAllAsync(
			'SELECT * FROM user_stats WHERE date = ?',
			today
		)
		if (results.length > 0) {
			return results[0] as UserStats
		} else {
			return null
		}
	} catch (error) {
		console.error('Error getting today stats:', error)
		throw error
	}
}

// Обновленная функция getWorkoutStats
export const getWorkoutStats = async (): Promise<WorkoutStats> => {
	const db = openDatabase()

	try {
		// Основная статистика
		const statsResult: any[] = await db.getAllAsync(
			`SELECT 
        COUNT(*) as total_workouts,
        COALESCE(SUM(sets_count), 0) as total_sets,
        COALESCE(SUM(volume), 0) as total_volume,
        COALESCE(AVG(duration), 0) as avg_duration
       FROM workouts`
		)

		// Расчет серии тренировок подряд
		const streakResult: any[] = await db.getAllAsync(
			`SELECT date FROM workouts 
       ORDER BY date DESC`
		)

		let streak = 0
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		if (streakResult.length > 0) {
			// Преобразуем даты и сортируем по убыванию
			const workoutDates = streakResult
				.map(row => new Date(row.date))
				.sort((a, b) => b.getTime() - a.getTime())

			let currentStreak = 0
			let lastDate: Date | null = null

			for (let i = 0; i < workoutDates.length; i++) {
				const workoutDate = new Date(workoutDates[i])
				workoutDate.setHours(0, 0, 0, 0)

				if (i === 0) {
					// Проверяем, была ли тренировка сегодня или вчера
					const diffDays = Math.floor(
						(today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
					)

					if (diffDays === 0 || diffDays === 1) {
						currentStreak = 1
						lastDate = workoutDate
					} else {
						break
					}
				} else if (lastDate) {
					const diffDays = Math.floor(
						(lastDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
					)

					if (diffDays === 1) {
						currentStreak++
						lastDate = workoutDate
					} else {
						break
					}
				}
			}

			streak = currentStreak
		}

		const stats = statsResult[0] || {
			total_workouts: 0,
			total_sets: 0,
			total_volume: 0,
			avg_duration: 0,
		}

		return {
			total_workouts: stats.total_workouts || 0,
			total_sets: stats.total_sets || 0,
			total_volume: stats.total_volume || 0,
			avg_duration: Math.round(stats.avg_duration) || 0,
			streak_days: streak,
		}
	} catch (error) {
		console.error('Error getting workout stats:', error)
		return {
			total_workouts: 0,
			total_sets: 0,
			total_volume: 0,
			avg_duration: 0,
			streak_days: 0,
		}
	}
}

// ========== РАБОТА С НАСТРОЙКАМИ ==========

export const saveSetting = async (
	key: string,
	value: string
): Promise<void> => {
	const db = openDatabase()

	try {
		await db.runAsync(
			`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
			[key, value]
		)
	} catch (error) {
		console.error('Error saving setting:', error)
		throw error
	}
}

export const getSetting = async (key: string): Promise<string | null> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync(
			'SELECT value FROM settings WHERE key = ?',
			key
		)
		if (results.length > 0) {
			return results[0].value as string
		} else {
			return null
		}
	} catch (error) {
		console.error('Error getting setting:', error)
		throw error
	}
}

export const getAllSettings = async (): Promise<Record<string, string>> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync('SELECT key, value FROM settings')
		const settings: Record<string, string> = {}

		results.forEach((row: any) => {
			settings[row.key] = row.value
		})

		return settings
	} catch (error) {
		console.error('Error getting all settings:', error)
		throw error
	}
}

// ========== РАБОТА С ПРОФИЛЕМ ПОЛЬЗОВАТЕЛЯ ==========

export interface UserProfile {
	id?: number
	first_name: string
	last_name: string
	email: string
	avatar_url?: string
	created_at?: string
}

export const saveUserProfile = async (
	profile: Omit<UserProfile, 'id'>
): Promise<number> => {
	const db = openDatabase()

	try {
		// Удаляем старый профиль (у нас будет только один профиль)
		await db.runAsync('DELETE FROM user_profile')

		// Вставляем новый профиль
		const result = await db.runAsync(
			`INSERT INTO user_profile (first_name, last_name, email, avatar_url)
       VALUES (?, ?, ?, ?)`,
			[
				profile.first_name,
				profile.last_name,
				profile.email,
				profile.avatar_url || null,
			]
		)
		return result.lastInsertRowId as number
	} catch (error) {
		console.error('Error saving user profile:', error)
		throw error
	}
}

export const getUserProfile = async (): Promise<UserProfile> => {
	const db = openDatabase()

	try {
		const results = await db.getAllAsync('SELECT * FROM user_profile LIMIT 1')
		if (results.length > 0) {
			return results[0] as UserProfile
		} else {
			// Возвращаем профиль по умолчанию
			return {
				first_name: 'Алексей',
				last_name: 'Иванов',
				email: 'alexey@example.com',
				avatar_url:
					'https://ui-avatars.com/api/?name=Алексей+Иванов&background=4CAF50&color=fff',
			}
		}
	} catch (error) {
		console.error('Error getting user profile:', error)
		throw error
	}
}

// ========== ЭКСПОРТ/ИМПОРТ ДАННЫХ ==========

export const exportDatabase = async (): Promise<string> => {
	const db = openDatabase()

	try {
		const data: any = {}

		// Собираем все данные из таблиц
		const tables = [
			'workouts',
			'exercises',
			'exercise_sets',
			'body_measurements',
			'personal_records',
			'recovery_data',
			'user_stats',
			'settings',
			'user_profile',
		]

		for (const table of tables) {
			const results = await db.getAllAsync(`SELECT * FROM ${table}`)
			data[table] = results
		}

		return JSON.stringify(data, null, 2)
	} catch (error) {
		console.error('Error exporting database:', error)
		throw error
	}
}

export const importDatabase = async (jsonData: string): Promise<void> => {
	const data = JSON.parse(jsonData)
	const db = openDatabase()

	try {
		await db.withTransactionAsync(async () => {
			// Удаляем все существующие данные
			await db.runAsync('DELETE FROM workouts')
			await db.runAsync('DELETE FROM exercises')
			await db.runAsync('DELETE FROM exercise_sets')
			await db.runAsync('DELETE FROM body_measurements')
			await db.runAsync('DELETE FROM personal_records')
			await db.runAsync('DELETE FROM recovery_data')
			await db.runAsync('DELETE FROM user_stats')
			await db.runAsync('DELETE FROM settings')
			await db.runAsync('DELETE FROM user_profile')

			// Восстанавливаем данные для каждой таблицы
			const insertData = async (table: string, records: any[]) => {
				if (!records || records.length === 0) return

				for (const record of records) {
					// Создаем динамический запрос INSERT
					const keys = Object.keys(record).filter(key => key !== 'id')
					const placeholders = keys.map(() => '?').join(', ')
					const values = keys.map(key => record[key])

					const query = `INSERT INTO ${table} (${keys.join(
						', '
					)}) VALUES (${placeholders})`
					await db.runAsync(query, ...values)
				}
			}

			for (const [table, records] of Object.entries(data)) {
				await insertData(table, records as any[])
			}
		})
	} catch (error) {
		console.error('Error importing database:', error)
		throw error
	}
}

// ========== СБРОС БАЗЫ ДАННЫХ ==========

export const resetDatabase = async (): Promise<void> => {
	const db = openDatabase()

	try {
		await db.withTransactionAsync(async () => {
			await db.runAsync('DROP TABLE IF EXISTS workouts')
			await db.runAsync('DROP TABLE IF EXISTS exercises')
			await db.runAsync('DROP TABLE IF EXISTS exercise_sets')
			await db.runAsync('DROP TABLE IF EXISTS body_measurements')
			await db.runAsync('DROP TABLE IF EXISTS personal_records')
			await db.runAsync('DROP TABLE IF EXISTS recovery_data')
			await db.runAsync('DROP TABLE IF EXISTS user_stats')
			await db.runAsync('DROP TABLE IF EXISTS settings')
			await db.runAsync('DROP TABLE IF EXISTS user_profile')
		})

		// Пересоздаем таблицы
		await initDatabase()
	} catch (error) {
		console.error('Error resetting database:', error)
		throw error
	}
}

// ========== УТИЛИТЫ ==========

export const formatDate = (date: string): string => {
	const now = new Date()
	const workoutDate = new Date(date)
	const diffDays = Math.floor(
		(now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
	)

	if (diffDays === 0) return 'Сегодня'
	if (diffDays === 1) return 'Вчера'
	if (diffDays < 7) return `${diffDays} дня назад`
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`

	return workoutDate.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

export const getCurrentDate = (): string => {
	return new Date().toISOString().split('T')[0]
}

export const getCurrentTime = (): string => {
	return new Date().toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	})
}

// Инициализация начальных данных
export const initializeDefaultData = async () => {
	try {
		// Проверяем, есть ли уже данные
		const workouts = await getWorkouts(1)

		if (workouts.length === 0) {
			console.log('Initializing default data...')

			// Добавляем пример тренировки
			const workoutId = await addWorkout({
				date: getCurrentDate(),
				time: getCurrentTime(),
				duration: 45,
				type: 'Силовая',
				muscle_groups: 'Грудь,Трицепс',
				exercises_count: 4,
				sets_count: 16,
				volume: 4800,
				notes: 'Хорошая тренировка, прогресс по жиму лежа',
				rating: 4,
			})

			// Пример начальных замеров
			const measurements: Omit<BodyMeasurement, 'id'>[] = [
				{
					name: 'Грудь',
					value: 102,
					unit: 'см',
					date: getCurrentDate(),
					trend: 'down',
					goal: 98,
				},
				{
					name: 'Талия',
					value: 84,
					unit: 'см',
					date: getCurrentDate(),
					trend: 'down',
					goal: 80,
				},
				{
					name: 'Бедра',
					value: 95,
					unit: 'см',
					date: getCurrentDate(),
					trend: 'up',
					goal: 97,
				},
				{
					name: 'Бицепс',
					value: 38,
					unit: 'см',
					date: getCurrentDate(),
					trend: 'up',
					goal: 40,
				},
			]

			for (const measurement of measurements) {
				await addBodyMeasurement(measurement)
			}

			// Пример начальных рекордов
			const records: Omit<PersonalRecord, 'id'>[] = [
				{
					exercise: 'Жим лежа',
					weight: '120 кг',
					date: getCurrentDate(),
					trend: 'up',
					category: 'strength',
					previous_record: '115 кг',
					improvement: '+5 кг',
				},
				{
					exercise: 'Присед',
					weight: '160 кг',
					date: getCurrentDate(),
					trend: 'up',
					category: 'strength',
					previous_record: '155 кг',
					improvement: '+5 кг',
				},
			]

			for (const record of records) {
				await addPersonalRecord(record)
			}

			// Начальные данные восстановления
			const recoveryData: Omit<RecoveryData, 'id'>[] = [
				{
					muscle_name: 'Грудь',
					status: 'recovering',
					recovery: 65,
					last_trained: '2 дня назад',
				},
				{
					muscle_name: 'Пресс',
					status: 'recovered',
					recovery: 100,
					last_trained: '4 дня назад',
				},
				{
					muscle_name: 'Бицепс',
					status: 'recovering',
					recovery: 80,
					last_trained: '3 дня назад',
				},
			]

			await updateRecoveryData(recoveryData)

			console.log('Default data initialized')
		}
	} catch (error) {
		console.error('Error initializing default data:', error)
	}
}

// Добавьте этот интерфейс в раздел типов данных
export interface WorkoutStats {
	total_workouts: number
	total_sets: number
	total_volume: number
	streak_days: number
	avg_duration: number
}

// Также добавьте эту функцию для получения расширенной статистики
export interface ExtendedWorkoutStats extends WorkoutStats {
	total_exercises: number
	most_trained_muscle: string
	workout_frequency: number // тренировок в неделю
	best_exercise: string
	total_weight_lifted: number
}

export const getExtendedWorkoutStats =
	async (): Promise<ExtendedWorkoutStats> => {
		const db = openDatabase()

		try {
			// Основная статистика
			const basicStats = await getWorkoutStats()

			// Дополнительная статистика
			const extendedStats: any[] = await db.getAllAsync(
				`SELECT 
        COALESCE(SUM(exercises_count), 0) as total_exercises,
        (
          SELECT muscle_group 
          FROM (
            SELECT 
              muscle_group,
              COUNT(*) as count
            FROM exercises
            GROUP BY muscle_group
            ORDER BY count DESC
            LIMIT 1
          )
        ) as most_trained_muscle,
        (
          SELECT name
          FROM (
            SELECT 
              e.name,
              SUM(es.weight * es.reps) as total_volume
            FROM exercises e
            JOIN exercise_sets es ON e.id = es.exercise_id
            GROUP BY e.name
            ORDER BY total_volume DESC
            LIMIT 1
          )
        ) as best_exercise,
        COALESCE(SUM(volume), 0) as total_weight_lifted
       FROM workouts`
			)

			// Расчет частоты тренировок (среднее количество тренировок в неделю)
			const frequencyResult: any[] = await db.getAllAsync(
				`SELECT 
        COUNT(*) as workout_count,
        MIN(date) as first_date,
        MAX(date) as last_date
       FROM workouts`
			)

			let workout_frequency = 0
			if (
				frequencyResult.length > 0 &&
				frequencyResult[0].first_date &&
				frequencyResult[0].last_date
			) {
				const firstDate = new Date(frequencyResult[0].first_date)
				const lastDate = new Date(frequencyResult[0].last_date)
				const diffWeeks = Math.max(
					1,
					(lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
				)
				workout_frequency = parseFloat(
					(frequencyResult[0].workout_count / diffWeeks).toFixed(1)
				)
			}

			const extended = extendedStats[0] || {
				total_exercises: 0,
				most_trained_muscle: '-',
				best_exercise: '-',
				total_weight_lifted: 0,
			}

			return {
				...basicStats,
				total_exercises: extended.total_exercises || 0,
				most_trained_muscle: extended.most_trained_muscle || '-',
				best_exercise: extended.best_exercise || '-',
				total_weight_lifted: extended.total_weight_lifted || 0,
				workout_frequency,
			}
		} catch (error) {
			console.error('Error getting extended workout stats:', error)
			return {
				...basicStats,
				total_exercises: 0,
				most_trained_muscle: '-',
				best_exercise: '-',
				total_weight_lifted: 0,
				workout_frequency: 0,
			}
		}
	}

// Добавьте эти функции для аналитики
export interface WorkoutAnalytics {
	weekly_data: {
		week: string
		workouts: number
		volume: number
		sets: number
	}[]
	monthly_data: {
		month: string
		workouts: number
		volume: number
	}[]
	muscle_group_distribution: {
		muscle_group: string
		count: number
		percentage: number
	}[]
}

export const getWorkoutAnalytics = async (): Promise<WorkoutAnalytics> => {
	const db = openDatabase()

	try {
		// Еженедельные данные (последние 8 недель)
		const weeklyData: any[] = await db.getAllAsync(
			`SELECT 
        strftime('%Y-%W', date) as week,
        COUNT(*) as workouts,
        COALESCE(SUM(volume), 0) as volume,
        COALESCE(SUM(sets_count), 0) as sets
       FROM workouts
       WHERE date >= date('now', '-56 days')
       GROUP BY week
       ORDER BY week DESC
       LIMIT 8`
		)

		// Ежемесячные данные (последние 6 месяцев)
		const monthlyData: any[] = await db.getAllAsync(
			`SELECT 
        strftime('%Y-%m', date) as month,
        COUNT(*) as workouts,
        COALESCE(SUM(volume), 0) as volume
       FROM workouts
       WHERE date >= date('now', '-180 days')
       GROUP BY month
       ORDER BY month DESC
       LIMIT 6`
		)

		// Распределение по группам мышц
		const muscleDistribution: any[] = await db.getAllAsync(
			`SELECT 
        muscle_group,
        COUNT(*) as count
       FROM (
         SELECT 
           TRIM(value) as muscle_group
         FROM workouts, 
           json_each('["' || replace(muscle_groups, ',', '","') || '"]')
         WHERE muscle_groups != ''
       )
       WHERE muscle_group != ''
       GROUP BY muscle_group
       ORDER BY count DESC`
		)

		const totalMuscleWorkouts = muscleDistribution.reduce(
			(sum, item) => sum + item.count,
			0
		)

		const muscle_group_distribution = muscleDistribution.map(item => ({
			muscle_group: item.muscle_group,
			count: item.count,
			percentage:
				totalMuscleWorkouts > 0
					? Math.round((item.count / totalMuscleWorkouts) * 100)
					: 0,
		}))

		return {
			weekly_data: weeklyData.map(item => ({
				week: item.week,
				workouts: item.workouts,
				volume: item.volume,
				sets: item.sets,
			})),
			monthly_data: monthlyData.map(item => ({
				month: item.month,
				workouts: item.workouts,
				volume: item.volume,
			})),
			muscle_group_distribution,
		}
	} catch (error) {
		console.error('Error getting workout analytics:', error)
		return {
			weekly_data: [],
			monthly_data: [],
			muscle_group_distribution: [],
		}
	}
}

// Функция для получения прогресса по тренировкам
export interface WorkoutProgress {
	current_streak: number
	longest_streak: number
	weekly_completion: number
	monthly_goal_progress: number
	volume_trend: 'up' | 'down' | 'stable'
}

export const getWorkoutProgress = async (): Promise<WorkoutProgress> => {
	const db = openDatabase()

	try {
		// Текущая серия
		const stats = await getWorkoutStats()

		// Самая длинная серия
		const streakResult: any[] = await db.getAllAsync(
			`WITH RECURSIVE dates AS (
        SELECT 
          date,
          LAG(date) OVER (ORDER BY date) as prev_date
        FROM workouts
        ORDER BY date
      ),
      streaks AS (
        SELECT 
          date,
          CASE 
            WHEN prev_date IS NULL OR julianday(date) - julianday(prev_date) > 1 THEN 1
            ELSE 0
          END as streak_start
        FROM dates
      ),
      numbered AS (
        SELECT 
          date,
          SUM(streak_start) OVER (ORDER BY date) as streak_id
        FROM streaks
      )
      SELECT 
        streak_id,
        COUNT(*) as streak_length
      FROM numbered
      GROUP BY streak_id
      ORDER BY streak_length DESC
      LIMIT 1`
		)

		const longest_streak =
			streakResult.length > 0 ? streakResult[0].streak_length : 0

		// Прогресс за неделю (количество тренировок / цель)
		const weeklyWorkouts: any[] = await db.getAllAsync(
			`SELECT COUNT(*) as count
       FROM workouts
       WHERE date >= date('now', '-7 days')`
		)

		const weekly_completion = Math.min(
			(weeklyWorkouts[0]?.count / 3) * 100,
			100
		) // Цель: 3 тренировки в неделю

		// Прогресс за месяц
		const monthlyWorkouts: any[] = await db.getAllAsync(
			`SELECT COUNT(*) as count
       FROM workouts
       WHERE date >= date('now', '-30 days')`
		)

		const monthly_goal_progress = Math.min(
			(monthlyWorkouts[0]?.count / 12) * 100,
			100
		) // Цель: 12 тренировок в месяц

		// Тренд объема (сравнение с предыдущим периодом)
		const volumeTrend: any[] = await db.getAllAsync(
			`SELECT 
        SUM(CASE WHEN date >= date('now', '-14 days') THEN volume ELSE 0 END) as recent_volume,
        SUM(CASE WHEN date < date('now', '-14 days') AND date >= date('now', '-28 days') THEN volume ELSE 0 END) as previous_volume
       FROM workouts`
		)

		const recent = volumeTrend[0]?.recent_volume || 0
		const previous = volumeTrend[0]?.previous_volume || 0
		let volume_trend: 'up' | 'down' | 'stable' = 'stable'

		if (previous > 0) {
			const change = ((recent - previous) / previous) * 100
			if (change > 10) volume_trend = 'up'
			else if (change < -10) volume_trend = 'down'
		}

		return {
			current_streak: stats.streak_days,
			longest_streak,
			weekly_completion,
			monthly_goal_progress,
			volume_trend,
		}
	} catch (error) {
		console.error('Error getting workout progress:', error)
		return {
			current_streak: 0,
			longest_streak: 0,
			weekly_completion: 0,
			monthly_goal_progress: 0,
			volume_trend: 'stable',
		}
	}
}

export async function showWorkoutsColumns() {
	const db = await SQLite.openDatabaseAsync('fitex.db')

	try {
		const columns = await db.getAllAsync(`PRAGMA table_info(workouts)`)

		if (columns.length === 0) {
			console.log('Таблица workouts не существует')
			return
		}

		console.log('┌───────────────────────────────┐')
		console.log('│ Столбцы таблицы workouts      │')
		console.log('├─────┬──────────────┬───────────┤')
		console.log('│ cid │ name         │ type      │')
		console.log('├─────┼──────────────┼───────────┤')

		columns.forEach((col: any) => {
			const notNull = col.notnull ? 'NOT NULL' : 'NULL'
			const pk = col.pk ? 'PK' : '  '
			const defaultVal = col.dflt_value ? `default ${col.dflt_value}` : ''

			console.log(
				`│ ${String(col.cid).padEnd(3)} │ ${col.name.padEnd(
					12
				)} │ ${col.type.padEnd(9)} │ ${notNull} ${pk} ${defaultVal}`
			)
		})

		console.log('└─────┴──────────────┴───────────┘')

		// Или в более читаемом виде:
		console.log('\nСписок столбцов:')
		columns.forEach((col: any) => {
			console.log(
				`• ${col.name}  ${col.type}` +
					`${col.notnull ? ' NOT NULL' : ''}` +
					`${col.pk ? ' PRIMARY KEY' : ''}` +
					`${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`
			)
		})
	} catch (error) {
		console.error('Ошибка при получении структуры таблицы:', error)
	} finally {
		// db.closeAsync(); // необязательно в большинстве случаев
	}
}
