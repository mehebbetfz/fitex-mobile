// src/contexts/DatabaseProvider.tsx
import LoadingScreen from '@/src/components/Loading' // поправь путь
import { initDatabase } from '@/src/database'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface DatabaseContextType {
	isInitialized: boolean
	error: string | null
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
	undefined
)

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isInitialized, setIsInitialized] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const initialize = async () => {
			const success = await initDatabase()
			if (success) {
				setIsInitialized(true)
			} else {
				setError('Не удалось инициализировать базу данных')
			}
		}

		initialize()
	}, [])

	// Пока БД не готова — показываем лоадер
	if (!isInitialized && !error) {
		return <LoadingScreen message='Инициализация базы данных...' />
	}

	// Если ошибка — можно показать экран ошибки или fallback
	if (error) {
		return (
			<LoadingScreen
				message={`Ошибка базы данных: ${error}`}
				// Можно добавить кнопку "Повторить"
			/>
		)
	}

	return (
		<DatabaseContext.Provider value={{ isInitialized, error }}>
			{children}
		</DatabaseContext.Provider>
	)
}

export const useDatabaseContext = (): DatabaseContextType => {
	const context = useContext(DatabaseContext)
	if (!context) {
		throw new Error('useDatabaseContext must be used within DatabaseProvider')
	}
	return context
}
