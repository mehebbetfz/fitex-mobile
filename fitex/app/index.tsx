import { initActiveWorkoutTables, initDatabase } from '@/scripts/database'
import { Redirect } from 'expo-router'
import { useEffect } from 'react'

export default function Index() {
	// if (isLoading) {
	// 	return <LoadingScreen />
	// }

	// if (!user) {
	//   return <Redirect href="/(public)" />;
	// }

	useEffect(() => {
		const initializeApp = async () => {
			try {
				await initDatabase()
				await initActiveWorkoutTables()
				console.log('Database initialized')
			} catch (error) {
				console.error('Failed to initialize database:', error)
			}
		}

		initializeApp()
	}, [])

	return <Redirect href='/(auth)/(tabs)' />
}
