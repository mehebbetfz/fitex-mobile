import { database, Measurement, PersonalRecord } from './DatabaseService';
import { v4 as uuidv4 } from 'uuid';

export class ProgressRepository {
  private static instance: ProgressRepository;

  static getInstance(): ProgressRepository {
    if (!ProgressRepository.instance) {
      ProgressRepository.instance = new ProgressRepository();
    }
    return ProgressRepository.instance;
  }

  // Замеры тела
  async createMeasurement(measurementData: Partial<Measurement>): Promise<string> {
    const id = uuidv4();
    const measurement: Measurement = {
      id,
      local_id: id,
      user_id: measurementData.user_id!,
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
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    };

    return await database.insert('measurements', measurement);
  }

  async getUserMeasurements(
    userId: string,
    limit: number = 100
  ): Promise<Measurement[]> {
    const sql = `
      SELECT * FROM measurements 
      WHERE user_id = ? AND deleted = 0 
      ORDER BY date DESC 
      LIMIT ?
    `;
    return await database.query(sql, [userId, limit]);
  }

  async getMeasurementHistory(
    userId: string,
    metric: keyof Measurement,
    days: number = 30
  ): Promise<Array<{ date: string; value: number }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sql = `
      SELECT date, ${metric} as value 
      FROM measurements 
      WHERE user_id = ? 
        AND ${metric} IS NOT NULL 
        AND date >= ?
        AND deleted = 0
      ORDER BY date ASC
    `;

    return await database.query(sql, [userId, startDate.toISOString()]);
  }

  async getLatestMeasurement(
    userId: string
  ): Promise<Measurement | null> {
    const sql = `
      SELECT * FROM measurements 
      WHERE user_id = ? AND deleted = 0 
      ORDER BY date DESC 
      LIMIT 1
    `;
    const [measurement] = await database.query(sql, [userId]);
    return measurement || null;
  }

  // Личные рекорды
  async createPersonalRecord(recordData: Partial<PersonalRecord>): Promise<string> {
    const id = uuidv4();
    const record: PersonalRecord = {
      id,
      local_id: id,
      user_id: recordData.user_id!,
      exercise_name: recordData.exercise_name!,
      weight: recordData.weight!,
      reps: recordData.reps,
      date: recordData.date || new Date().toISOString(),
      notes: recordData.notes,
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    };

    return await database.insert('personal_records', record);
  }

  async getUserPersonalRecords(userId: string): Promise<PersonalRecord[]> {
    const sql = `
      SELECT * FROM personal_records 
      WHERE user_id = ? AND deleted = 0 
      ORDER BY weight DESC, date DESC
    `;
    return await database.query(sql, [userId]);
  }

  async getExercisePersonalRecords(
    userId: string,
    exerciseName: string
  ): Promise<PersonalRecord[]> {
    const sql = `
      SELECT * FROM personal_records 
      WHERE user_id = ? 
        AND exercise_name = ? 
        AND deleted = 0 
      ORDER BY date DESC
    `;
    return await database.query(sql, [userId, exerciseName]);
  }

  // Статистика прогресса
  async getUserProgressStats(userId: string): Promise<{
    weightChange: number;
    bodyFatChange: number;
    muscleGain: number;
    totalMeasurements: number;
    totalRecords: number;
  }> {
    // Получаем первое и последнее измерение веса
    const weightStats = await database.query(`
      SELECT 
        (SELECT weight FROM measurements 
         WHERE user_id = ? AND weight IS NOT NULL AND deleted = 0 
         ORDER BY date ASC LIMIT 1) as first_weight,
        (SELECT weight FROM measurements 
         WHERE user_id = ? AND weight IS NOT NULL AND deleted = 0 
         ORDER BY date DESC LIMIT 1) as last_weight
    `, [userId, userId]);

    // Получаем первое и последнее измерение жира
    const fatStats = await database.query(`
      SELECT 
        (SELECT body_fat FROM measurements 
         WHERE user_id = ? AND body_fat IS NOT NULL AND deleted = 0 
         ORDER BY date ASC LIMIT 1) as first_fat,
        (SELECT body_fat FROM measurements 
         WHERE user_id = ? AND body_fat IS NOT NULL AND deleted = 0 
         ORDER BY date DESC LIMIT 1) as last_fat
    `, [userId, userId]);

    // Общее количество замеров
    const measurementCount = await database.query(`
      SELECT COUNT(*) as count FROM measurements 
      WHERE user_id = ? AND deleted = 0
    `, [userId]);

    // Общее количество рекордов
    const recordCount = await database.query(`
      SELECT COUNT(*) as count FROM personal_records 
      WHERE user_id = ? AND deleted = 0
    `, [userId]);

    const firstWeight = weightStats[0]?.first_weight || 0;
    const lastWeight = weightStats[0]?.last_weight || 0;
    const firstFat = fatStats[0]?.first_fat || 0;
    const lastFat = fatStats[0]?.last_fat || 0;

    return {
      weightChange: lastWeight - firstWeight,
      bodyFatChange: lastFat - firstFat,
      muscleGain: (lastWeight * (1 - lastFat/100)) - (firstWeight * (1 - firstFat/100)),
      totalMeasurements: measurementCount[0]?.count || 0,
      totalRecords: recordCount[0]?.count || 0,
    };
  }

  // Рекомендации на основе прогресса
  async getProgressRecommendations(userId: string): Promise<string[]> {
    const recommendations: string[] = [];
    
    // Получаем последние измерения
    const latestMeasurement = await this.getLatestMeasurement(userId);
    const personalRecords = await this.getUserPersonalRecords(userId);
    
    if (latestMeasurement) {
      // Рекомендации по весу
      if (latestMeasurement.weight && latestMeasurement.weight > 100) {
        recommendations.push('Рассмотрите кардио тренировки для снижения веса');
      }
      
      // Рекомендации по жиру
      if (latestMeasurement.body_fat && latestMeasurement.body_fat > 20) {
        recommendations.push('Увеличьте интенсивность тренировок для снижения процента жира');
      }
    }
    
    // Рекомендации по рекордам
    const recentRecords = personalRecords.filter(record => {
      const recordDate = new Date(record.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDate > thirtyDaysAgo;
    });
    
    if (recentRecords.length === 0) {
      recommendations.push('Попробуйте побить личные рекорды на следующей тренировке');
    }
    
    return recommendations;
  }
}

export const progressRepository = ProgressRepository.getInstance();