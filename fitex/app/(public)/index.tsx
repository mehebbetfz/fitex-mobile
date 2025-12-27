import { useAuth } from '@/src/auth/useAuth'
import { useRouter } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PublicHome() {
	const router = useRouter()
	const { signInWithGoogle } = useAuth()

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Image
					source={require('@/assets/images/logo.png')}
					style={styles.logo}
					resizeMode='contain'
				/>
				<Text style={styles.subtitle}>Твой персональный тренер</Text>
			</View>

			<View style={styles.buttons}>
				<TouchableOpacity
					style={styles.primaryButton}
					onPress={signInWithGoogle}
				>
					<Text style={styles.primaryButtonText}>Войти через Google</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.secondaryButton}
					onPress={() => router.push('/(public)/subscription')}
				>
					<Text style={styles.secondaryButtonText}>О подписке</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	logo: {
		width: 200,
		height: 200,
		marginBottom: 20,
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 18,
		color: '#666',
		marginBottom: 40,
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
	featureText: {
		fontSize: 14,
		color: '#666',
	},
	buttons: {
		padding: 20,
		gap: 12,
	},
	primaryButton: {
		backgroundColor: '#007AFF',
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
	},
	primaryButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryButton: {
		backgroundColor: '#f0f0f0',
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
	},
	secondaryButtonText: {
		color: '#666',
		fontSize: 16,
		fontWeight: '500',
	},
})
