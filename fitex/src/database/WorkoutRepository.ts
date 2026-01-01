import { database, Workout, Exercise, ExerciseSet } from './DatabaseService';
import { v4 as uuidv4 } from 'uuid';

export class WorkoutRepository {
  private static instance: WorkoutRepository;

  static getInstance(): WorkoutRepository {
    if (!WorkoutRepository.instance) {
      WorkoutRepository.instance = new WorkoutRepository();
    }
    return WorkoutRepository.instance;
  }

  // Тренировки
  async createWorkout(workoutData: Partial<Workout>): Promise<string> {
    const id = uuidv4();
    const workout: Workout = {
      id,
      local_id: id,
      user_id: workoutData.user_id!,
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
      sync_status: 'pending',
      server_version: 0,
      local_version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    };

    return await database.insert('workouts', workout);
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    return await database.getById('workouts', id);
  }

  async getUserWorkouts(userId: string, limit: number = 50): Promise<Workout[]> {
    return await database.getAll(
      'workouts',
      'user_id = ?',
      [userId]
    );
  }

  async getWorkoutsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Workout[]> {
    const sql = `
      SELECT * FROM workouts 
      WHERE user_id = ? 
        AND date BETWEEN ? AND ?
        AND deleted = 0
      ORDER BY date DESC
    `;
    return await database.query(sql, [userId, startDate, endDate]);
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<void> {
    if (updates.muscle_groups && Array.isArray(updates.muscle_groups)) {
      updates.muscle_groups = JSON.stringify(updates.muscle_groups);
    }
    await database.update('workouts', id, updates);
  }

  async deleteWorkout(id: string): Promise<void> {
    await database.delete('workouts', id);
  }

  // Упражнения
  async createExercise(exerciseData: Partial<Exercise>): Promise<string> {
    const id = uuidv4();
    const exercise: Exercise = {
      id,
      local_id: id,
      workout_id: exerciseData.workout_id!,
      name: exerciseData.name!,
      muscle_group: exerciseData.muscle_group,
      order_index: exerciseData.order_index || 0,
      notes: exerciseData.notes,
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    };

    const exerciseId = await database.insert('exercises', exercise);
    
    // Обновляем счетчик упражнений в тренировке
    await this.updateWorkoutExerciseCount(exerciseData.workout_id!);

    return exerciseId;
  }

  async getWorkoutExercises(workoutId: string): Promise<Exercise[]> {
    return await database.getAll(
      'exercises',
      'workout_id = ?',
      [workoutId]
    );
  }

  async updateWorkoutExerciseCount(workoutId: string): Promise<void> {
    const sql = `
      UPDATE workouts 
      SET exercises_count = (
        SELECT COUNT(*) FROM exercises 
        WHERE workout_id = ? AND deleted = 0
      )
      WHERE id = ?
    `;
    await database.executeSql(sql, [workoutId, workoutId]);
  }

  // Подходы
  async createSet(setData: Partial<ExerciseSet>): Promise<string> {
    const id = uuidv4();
    const set: ExerciseSet = {
      id,
      local_id: id,
      exercise_id: setData.exercise_id!,
      set_number: setData.set_number!,
      weight: setData.weight || 0,
      reps: setData.reps || 0,
      completed: setData.completed !== undefined ? setData.completed : true,
      rest_time: setData.rest_time,
      notes: setData.notes,
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    };

    const setId = await database.insert('sets', set);
    
    // Обновляем счетчик подходов в тренировке
    await this.updateWorkoutSetCount(setData.exercise_id!);

    return setId;
  }

  async getExerciseSets(exerciseId: string): Promise<ExerciseSet[]> {
    return await database.getAll(
      'sets',
      'exercise_id = ?',
      [exerciseId]
    );
  }

  async updateWorkoutSetCount(exerciseId: string): Promise<void> {
    // Находим workout_id через exercise_id
    const exercise = await database.getById('exercises', exerciseId);
    if (!exercise) return;

    const sql = `
      UPDATE workouts 
      SET sets_count = (
        SELECT COUNT(*) FROM sets 
        WHERE exercise_id IN (
          SELECT id FROM exercises WHERE workout_id = ? AND deleted = 0
        ) AND deleted = 0
      )
      WHERE id = ?
    `;
    await database.executeSql(sql, [exercise.workout_id, exercise.workout_id]);
  }

  // Полная тренировка с упражнениями и подходами
  async getFullWorkout(workoutId: string): Promise<any> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout) return null;

    const exercises = await this.getWorkoutExercises(workoutId);
    
    const exercisesWithSets = await Promise.all(
      exercises.map(async (exercise) => {
        const sets = await this.getExerciseSets(exercise.id);
        return {
          ...exercise,
          muscle_group: exercise.muscle_group,
          sets: sets.map(set => ({
            ...set,
            completed: Boolean(set.completed),
          })),
        };
      })
    );

    return {
      ...workout,
      muscle_groups: JSON.parse(workout.muscle_groups || '[]'),
      exercises: exercisesWithSets,
    };
  }

  // Статистика тренировок
  async getUserWorkoutStats(userId: string): Promise<{
    totalWorkouts: number;
    totalExercises: number;
    totalSets: number;
    totalVolume: number;
    streakDays: number;
    lastWorkoutDate: string | null;
  }> {
    const statsSql = `
      SELECT 
        COUNT(*) as total_workouts,
        SUM(exercises_count) as total_exercises,
        SUM(sets_count) as total_sets,
        SUM(total_volume) as total_volume,
        MAX(date) as last_workout_date
      FROM workouts 
      WHERE user_id = ? AND deleted = 0
    `;

    const [stats] = await database.query(statsSql, [userId]);

    // Рассчитываем streak (дней подряд)
    const streakSql = `
      WITH RECURSIVE dates AS (
        SELECT date(date) as workout_date
        FROM workouts 
        WHERE user_id = ? AND deleted = 0
        GROUP BY date(date)
      ),
      grouped AS (
        SELECT 
          workout_date,
          julianday(workout_date) - julianday(LAG(workout_date) OVER (ORDER BY workout_date)) as diff
        FROM dates
      ),
      streaks AS (
        SELECT 
          workout_date,
          CASE WHEN diff = 1 THEN 1 ELSE 0 END as is_consecutive
        FROM grouped
      )
      SELECT MAX(streak_length) as max_streak
      FROM (
        SELECT 
          workout_date,
          SUM(is_consecutive) OVER (ORDER BY workout_date) as streak_length
        FROM streaks
      )
    `;

    const [streakResult] = await database.query(streakSql, [userId]);

    return {
      totalWorkouts: stats?.total_workouts || 0,
      totalExercises: stats?.total_exercises || 0,
      totalSets: stats?.total_sets || 0,
      totalVolume: stats?.total_volume || 0,
      streakDays: streakResult?.max_streak || 0,
      lastWorkoutDate: stats?.last_workout_date || null,
    };
  }

  // Календарь тренировок
  async getWorkoutCalendar(
    userId: string,
    year: number,
    month: number
  ): Promise<Array<{ date: string; hasWorkout: boolean; workoutCount: number }>> {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();

    const sql = `
      SELECT 
        date(date) as workout_date,
        COUNT(*) as workout_count
      FROM workouts 
      WHERE user_id = ? 
        AND date BETWEEN ? AND ?
        AND deleted = 0
      GROUP BY date(date)
    `;

    const results = await database.query(sql, [userId, startDate, endDate]);
    
    // Создаем карту дат с тренировками
    const workoutMap = new Map();
    results.forEach((row: any) => {
      workoutMap.set(row.workout_date, row.workout_count);
    });

    // Генерируем массив для всего месяца
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = date.toISOString().split('T')[0];
      const hasWorkout = workoutMap.has(dateStr);
      
      calendar.push({
        date: dateStr,
        hasWorkout,
        workoutCount: hasWorkout ? workoutMap.get(dateStr) : 0,
      });
    }

    return calendar;
  }
}

export const workoutRepository = WorkoutRepository.getInstance();