import * as SQLite from 'expo-sqlite'

// Типы данных
export interface DatabaseRecord {
	id: string
	created_at: string
	updated_at: string
}

export interface Workout extends DatabaseRecord {
	name: string
	type?: string
	date: string
	duration?: number
	notes?: string
	status: 'planned' | 'in_progress' | 'completed'
	muscle_groups: string
	exercises_count: number
	sets_count: number
	total_volume?: number
}

export interface Exercise extends DatabaseRecord {
	workout_id: string
	name: string
	muscle_group?: string
	order_index: number
	notes?: string
}

export interface ExerciseSet extends DatabaseRecord {
	exercise_id: string
	set_number: number
	weight: number
	reps: number
	completed: boolean
	rest_time?: number
	notes?: string
}

export interface Measurement extends DatabaseRecord {
	date: string
	weight?: number
	body_fat?: number
	chest?: number
	waist?: number
	hips?: number
	arms?: number
	thighs?: number
	calves?: number
	neck?: number
	notes?: string
}

export interface PersonalRecord extends DatabaseRecord {
	exercise_name: string
	weight: number
	reps?: number
	date: string
	notes?: string
}

class SimplifiedDatabaseService {
	private static instance: SimplifiedDatabaseService
	private db: SQLite.SQLiteDatabase | null = null
	private dbName = 'fitex_simple.db'

	private constructor() {}

	static getInstance(): SimplifiedDatabaseService {
		if (!SimplifiedDatabaseService.instance) {
			SimplifiedDatabaseService.instance = new SimplifiedDatabaseService()
		}
		return SimplifiedDatabaseService.instance
	}

	async init(): Promise<void> {
		try {
			this.db = SQLite.openDatabaseSync(this.dbName)

			await this.executeSql('PRAGMA foreign_keys = ON;')
			await this.executeSql('PRAGMA journal_mode = WAL;')

			await this.createTables()

			console.log('✅ Simplified database initialized')
		} catch (error) {
			console.error('❌ Database initialization failed:', error)
			throw error
		}
	}

	private async createTables(): Promise<void> {
		try {
			// Тренировки
			await this.executeSql(`
        CREATE TABLE IF NOT EXISTS workouts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT,
          date DATETIME NOT NULL,
          duration INTEGER,
          notes TEXT,
          status TEXT DEFAULT 'completed',
          muscle_groups TEXT,
          exercises_count INTEGER DEFAULT 0,
          sets_count INTEGER DEFAULT 0,
          total_volume REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `)

			// Упражнения
			await this.executeSql(`
        CREATE TABLE IF NOT EXISTS exercises (
          id TEXT PRIMARY KEY,
          workout_id TEXT NOT NULL,
          name TEXT NOT NULL,
          muscle_group TEXT,
          order_index INTEGER DEFAULT 0,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
        );
      `)

			// Подходы
			await this.executeSql(`
        CREATE TABLE IF NOT EXISTS sets (
          id TEXT PRIMARY KEY,
          exercise_id TEXT NOT NULL,
          set_number INTEGER NOT NULL,
          weight REAL NOT NULL,
          reps INTEGER NOT NULL,
          completed BOOLEAN DEFAULT 1,
          rest_time INTEGER,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
        );
      `)

			// Замеры тела
			await this.executeSql(`
        CREATE TABLE IF NOT EXISTS measurements (
          id TEXT PRIMARY KEY,
          date DATETIME NOT NULL,
          weight REAL,
          body_fat REAL,
          chest REAL,
          waist REAL,
          hips REAL,
          arms REAL,
          thighs REAL,
          calves REAL,
          neck REAL,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `)

			// Личные рекорды
			await this.executeSql(`
        CREATE TABLE IF NOT EXISTS personal_records (
          id TEXT PRIMARY KEY,
          exercise_name TEXT NOT NULL,
          weight REAL NOT NULL,
          reps INTEGER,
          date DATETIME NOT NULL,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `)

			// Индексы
			await this.executeSql(
				'CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);'
			)
			await this.executeSql(
				'CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);'
			)
			await this.executeSql(
				'CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON sets(exercise_id);'
			)
			await this.executeSql(
				'CREATE INDEX IF NOT EXISTS idx_measurements_date ON measurements(date);'
			)
		} catch (error) {
			console.error('❌ Failed to create tables:', error)
			throw error
		}
	}

	async executeSql(sql: string, params: any[] = []): Promise<void> {
		if (!this.db) {
			throw new Error('Database not initialized')
		}

		try {
			// expo-sqlite's execSync accepts only a single SQL string, so interpolate params into SQL.
			// Note: this simple interpolation is intended for local app use; avoid using with untrusted input.
			const finalSql =
				params && params.length
					? (() => {
							let idx = 0
							return sql.replace(/\?/g, () => {
								const val = params[idx++]
								if (val === null || val === undefined) return 'NULL'
								if (typeof val === 'number') return String(val)
								if (typeof val === 'boolean') return val ? '1' : '0'
								// escape single quotes for strings
								return `'${String(val).replace(/'/g, "''")}'`
							})
					  })()
					: sql

			this.db.execSync(finalSql)
		} catch (error) {
			console.error('SQL Error:', error, 'SQL:', sql, 'Params:', params)
			throw error
		}
	}

	async query(sql: string, params: any[] = []): Promise<any[]> {
		if (!this.db) {
			throw new Error('Database not initialized')
		}

		try {
			const result = this.db.getAllSync(sql, params)
			return result || []
		} catch (error) {
			console.error('Query Error:', error)
			return []
		}
	}

	async insert(table: string, data: any): Promise<string> {
		const id = this.generateId()
		const now = new Date().toISOString()

		const record = {
			...data,
			id,
			created_at: now,
			updated_at: now,
		}

		const columns = Object.keys(record)
		const placeholders = columns.map(() => '?').join(',')
		const values = columns.map(col => record[col])

		const sql = `INSERT OR REPLACE INTO ${table} (${columns.join(
			','
		)}) VALUES (${placeholders})`

		await this.executeSql(sql, values)
		return id
	}

	async update(table: string, id: string, data: any): Promise<void> {
		const now = new Date().toISOString()
		const updates = { ...data, updated_at: now }

		const setClause = Object.keys(updates)
			.map(key => `${key} = ?`)
			.join(', ')
		const values = [...Object.values(updates), id]

		const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`
		await this.executeSql(sql, values)
	}

	async delete(table: string, id: string): Promise<void> {
		const sql = `DELETE FROM ${table} WHERE id = ?`
		await this.executeSql(sql, [id])
	}

	async getById(table: string, id: string): Promise<any> {
		const sql = `SELECT * FROM ${table} WHERE id = ? LIMIT 1`
		const result = await this.query(sql, [id])
		return result[0] || null
	}

	async getAll(
		table: string,
		where: string = '1=1',
		params: any[] = []
	): Promise<any[]> {
		const sql = `SELECT * FROM ${table} WHERE ${where} ORDER BY created_at DESC`
		return await this.query(sql, params)
	}

	async getWorkouts(): Promise<Workout[]> {
		return await this.getAll('workouts')
	}

	async getWorkoutWithExercises(id: string): Promise<any> {
		const workout = await this.getById('workouts', id)
		if (!workout) return null

		const exercises = await this.getAll('exercises', 'workout_id = ?', [id])

		const exercisesWithSets = await Promise.all(
			exercises.map(async exercise => {
				const sets = await this.getAll('sets', 'exercise_id = ?', [exercise.id])
				return {
					...exercise,
					sets: sets.map(set => ({
						...set,
						completed: Boolean(set.completed),
					})),
				}
			})
		)

		return {
			...workout,
			muscle_groups: JSON.parse(workout.muscle_groups || '[]'),
			exercises: exercisesWithSets,
		}
	}

	async addWorkout(workoutData: Partial<Workout>): Promise<string> {
		const workout: Partial<Workout> = {
			name: workoutData.name!,
			type: workoutData.type || 'Силовая',
			date: workoutData.date || new Date().toISOString(),
			duration: workoutData.duration || 0,
			notes: workoutData.notes,
			status: workoutData.status || 'completed',
			muscle_groups: JSON.stringify(workoutData.muscle_groups || []),
			exercises_count: 0,
			sets_count: 0,
			total_volume: 0,
		}

		return await this.insert('workouts', workout)
	}

	async addExercise(
		workoutId: string,
		exerciseData: Partial<Exercise>
	): Promise<string> {
		const exercise: Partial<Exercise> = {
			workout_id: workoutId,
			name: exerciseData.name!,
			muscle_group: exerciseData.muscle_group,
			order_index: exerciseData.order_index || 0,
			notes: exerciseData.notes,
		}

		const exerciseId = await this.insert('exercises', exercise)

		// Обновляем счетчик упражнений
		await this.updateWorkoutCounts(workoutId)

		return exerciseId
	}

	async addSet(
		exerciseId: string,
		setData: Partial<ExerciseSet>
	): Promise<string> {
		const set: Partial<ExerciseSet> = {
			exercise_id: exerciseId,
			set_number: setData.set_number!,
			weight: setData.weight || 0,
			reps: setData.reps || 0,
			completed: setData.completed !== undefined ? setData.completed : true,
			rest_time: setData.rest_time,
			notes: setData.notes,
		}

		const setId = await this.insert('sets', set)

		// Находим workout_id и обновляем счетчики
		const exercise = await this.getById('exercises', exerciseId)
		if (exercise) {
			await this.updateWorkoutCounts(exercise.workout_id)
		}

		return setId
	}

	async updateWorkoutCounts(workoutId: string): Promise<void> {
		// Считаем упражнения
		const exercises = await this.getAll('exercises', 'workout_id = ?', [
			workoutId,
		])
		const exercisesCount = exercises.length

		// Считаем подходы
		let setsCount = 0
		for (const exercise of exercises) {
			const sets = await this.getAll('sets', 'exercise_id = ?', [exercise.id])
			setsCount += sets.length
		}

		// Считаем общий объем
		const sets = await this.query(
			`
      SELECT s.weight, s.reps 
      FROM sets s
      JOIN exercises e ON s.exercise_id = e.id
      WHERE e.workout_id = ? AND s.completed = 1
    `,
			[workoutId]
		)

		const totalVolume = sets.reduce(
			(sum, set) => sum + set.weight * set.reps,
			0
		)

		await this.update('workouts', workoutId, {
			exercises_count: exercisesCount,
			sets_count: setsCount,
			total_volume: totalVolume,
		})
	}

	async getRecentWorkouts(limit: number = 10): Promise<Workout[]> {
		const sql = `SELECT * FROM workouts ORDER BY date DESC LIMIT ?`
		return await this.query(sql, [limit])
	}

	async getWorkoutsByMonth(year: number, month: number): Promise<Workout[]> {
		const startDate = new Date(year, month - 1, 1).toISOString()
		const endDate = new Date(year, month, 0).toISOString()

		const sql = `
      SELECT * FROM workouts 
      WHERE date BETWEEN ? AND ?
      ORDER BY date ASC
    `
		return await this.query(sql, [startDate, endDate])
	}

	async addMeasurement(measurementData: Partial<Measurement>): Promise<string> {
		const measurement: Partial<Measurement> = {
			date: measurementData.date || new Date().toISOString(),
			weight: measurementData.weight,
			body_fat: measurementData.body_fat,
			chest: measurementData.chest,
			waist: measurementData.waist,
			hips: measurementData.hips,
			arms: measurementData.arms,
			thighs: measurementData.thighs,
			calves: measurementData.calves,
			neck: measurementData.neck,
			notes: measurementData.notes,
		}

		return await this.insert('measurements', measurement)
	}

	async getMeasurements(limit: number = 100): Promise<Measurement[]> {
		const sql = `SELECT * FROM measurements ORDER BY date DESC LIMIT ?`
		return await this.query(sql, [limit])
	}

	async addPersonalRecord(
		recordData: Partial<PersonalRecord>
	): Promise<string> {
		const record: Partial<PersonalRecord> = {
			exercise_name: recordData.exercise_name!,
			weight: recordData.weight!,
			reps: recordData.reps,
			date: recordData.date || new Date().toISOString(),
			notes: recordData.notes,
		}

		return await this.insert('personal_records', record)
	}

	async getPersonalRecords(): Promise<PersonalRecord[]> {
		const sql = `SELECT * FROM personal_records ORDER BY weight DESC, date DESC`
		return await this.query(sql)
	}

	async seedInitialData(): Promise<void> {
		try {
			// Проверяем, есть ли уже данные
			const workouts = await this.getWorkouts()
			if (workouts.length > 0) {
				console.log('Data already exists, skipping seed')
				return
			}

			console.log('Seeding initial data...')

			// Добавляем демо тренировки
			const workout1 = await this.addWorkout({
				name: 'Силовая тренировка груди',
				type: 'Силовая',
				date: new Date().toISOString(),
				duration: 60,
				status: 'completed',
				muscle_groups: JSON.stringify(['Грудь', 'Трицепс']),
			})

			// Добавляем упражнения к первой тренировке
			const exercise1 = await this.addExercise(workout1, {
				name: 'Жим лежа',
				muscle_group: 'Грудь',
				order_index: 1,
			})

			await this.addSet(exercise1, { set_number: 1, weight: 60, reps: 12 })
			await this.addSet(exercise1, { set_number: 2, weight: 70, reps: 10 })
			await this.addSet(exercise1, { set_number: 3, weight: 80, reps: 8 })

			const exercise2 = await this.addExercise(workout1, {
				name: 'Разведение гантелей',
				muscle_group: 'Грудь',
				order_index: 2,
			})

			await this.addSet(exercise2, { set_number: 1, weight: 12, reps: 15 })
			await this.addSet(exercise2, { set_number: 2, weight: 14, reps: 12 })

			// Добавляем вторую тренировку
			const workout2 = await this.addWorkout({
				name: 'Тренировка ног',
				type: 'Силовая',
				date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Вчера
				duration: 75,
				status: 'completed',
				muscle_groups: JSON.stringify(['Ноги', 'Ягодицы']),
			})

			const exercise3 = await this.addExercise(workout2, {
				name: 'Приседания',
				muscle_group: 'Ноги',
				order_index: 1,
			})

			await this.addSet(exercise3, { set_number: 1, weight: 70, reps: 10 })
			await this.addSet(exercise3, { set_number: 2, weight: 80, reps: 8 })
			await this.addSet(exercise3, { set_number: 3, weight: 90, reps: 6 })

			// Добавляем демо замеры
			await this.addMeasurement({
				date: new Date().toISOString(),
				weight: 75.5,
				body_fat: 18.5,
				chest: 102,
				waist: 84,
				hips: 95,
				arms: 38,
			})

			// Добавляем демо рекорды
			await this.addPersonalRecord({
				exercise_name: 'Жим лежа',
				weight: 120,
				reps: 1,
				date: new Date().toISOString(),
			})

			await this.addPersonalRecord({
				exercise_name: 'Приседания',
				weight: 160,
				reps: 1,
				date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
			})

			console.log('✅ Initial data seeded successfully')
		} catch (error) {
			console.error('❌ Failed to seed initial data:', error)
		}
	}

	private generateId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	}

	async close(): Promise<void> {
		if (this.db) {
			this.db.closeSync()
			this.db = null
		}
	}
}

export const database = SimplifiedDatabaseService.getInstance()
