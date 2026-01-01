import { Redirect } from 'expo-router'

export default function Index() {
	// if (isLoading) {
	// 	return <LoadingScreen />
	// }

	// if (!user) {
	//   return <Redirect href="/(public)" />;
	// }

	return <Redirect href='/(auth)/(tabs)' />
}
