// app/index.tsx
import { Redirect } from 'expo-router'
import { useAuth } from './contexts/auth-context'

export default function Index() {
	const { user, isLoading } = useAuth()

	if (isLoading) {
		return null
	}

	if (user) {
		return <Redirect href='/(tabs)' />
	}

	return <Redirect href='/(auth)/login' />
}
