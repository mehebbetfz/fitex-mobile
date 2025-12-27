import { useAuth } from '@/src/auth/useAuth'
import { Redirect } from 'expo-router'

export default function Index() {
	const { user, isLoading } = useAuth()

	// if (isLoading) {
	// 	return <LoadingScreen />
	// }

	// if (!user) {
	//   return <Redirect href="/(public)" />;
	// }

	return <Redirect href='/(auth)/(tabs)' />
}
