import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../database/DatabaseService'

interface AppContextType {
  isLoading: boolean;
  workouts: any[];
  measurements: any[];
  personalRecords: any[];
  refreshData: () => Promise<void>;
  addWorkout: (workout: any) => Promise<string>;
  updateWorkout: (id: string, updates: any) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  addMeasurement: (measurement: any) => Promise<string>;
  addPersonalRecord: (record: any) => Promise<string>;
  getWorkoutDetails: (id: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [personalRecords, setPersonalRecords] = useState<any[]>([]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Инициализируем базу данных
      await database.init();
      
      // Загружаем демо данные
      await database.seedInitialData();
      
      // Загружаем все данные
      await refreshData();
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [workoutsData, measurementsData, recordsData] = await Promise.all([
        database.getWorkouts(),
        database.getMeasurements(),
        database.getPersonalRecords(),
      ]);

      setWorkouts(workoutsData);
      setMeasurements(measurementsData);
      setPersonalRecords(recordsData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const addWorkout = async (workoutData: any): Promise<string> => {
    const id = await database.addWorkout(workoutData);
    await refreshData();
    return id;
  };

  const updateWorkout = async (id: string, updates: any): Promise<void> => {
    await database.update('workouts', id, updates);
    await refreshData();
  };

  const deleteWorkout = async (id: string): Promise<void> => {
    await database.delete('workouts', id);
    await refreshData();
  };

  const addMeasurement = async (measurementData: any): Promise<string> => {
    const id = await database.addMeasurement(measurementData);
    await refreshData();
    return id;
  };

  const addPersonalRecord = async (recordData: any): Promise<string> => {
    const id = await database.addPersonalRecord(recordData);
    await refreshData();
    return id;
  };

  const getWorkoutDetails = async (id: string): Promise<any> => {
    return await database.getWorkoutWithExercises(id);
  };

  const value: AppContextType = {
    isLoading,
    workouts,
    measurements,
    personalRecords,
    refreshData,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addMeasurement,
    addPersonalRecord,
    getWorkoutDetails,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};