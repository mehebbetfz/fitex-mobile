import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PublicHome() {
	const router = useRouter()

	return <SafeAreaView></SafeAreaView>
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	logo: {
		width: 120,
		height: 120,
		marginBottom: 20,
	},
	title: {
		textAlign: 'center',
		marginBottom: 8,
	},
	features: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginTop: 40,
	},
	feature: {
		alignItems: 'center',
	},
	featureIcon: {
		fontSize: 32,
		marginBottom: 8,
	},
	buttons: {
		padding: 20,
		gap: 12,
	},
})
