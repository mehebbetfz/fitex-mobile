import { useAuth } from '@/src/auth/useAuth'
import { useAppStyles } from '@/src/theme/use-app-styles'
import { useRouter } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PublicHome() {
	const router = useRouter()
	const { signInWithGoogle } = useAuth()
	const { styles: appStyles, colors } = useAppStyles()

	return (
		<SafeAreaView style={appStyles.safeArea}>
			<View style={styles.container}>
				<View style={styles.content}>
					<Image
						source={require('@/assets/images/logo.png')}
						style={styles.logo}
						resizeMode='contain'
					/>
					<Text style={[appStyles.title, styles.title]}>Fitex</Text>
					<Text style={appStyles.subtitle}>Твой персональный тренер</Text>

					<View style={styles.features}>
						<View style={styles.feature}>
							<Text style={styles.featureIcon}>💪</Text>
							<Text style={appStyles.textSecondary}>Тренировки</Text>
						</View>
						<View style={styles.feature}>
							<Text style={styles.featureIcon}>📊</Text>
							<Text style={appStyles.textSecondary}>Прогресс</Text>
						</View>
						<View style={styles.feature}>
							<Text style={styles.featureIcon}>⚡</Text>
							<Text style={appStyles.textSecondary}>Восстановление</Text>
						</View>
					</View>
				</View>

				<View style={styles.buttons}>
					<TouchableOpacity
						style={appStyles.buttonPrimary}
						onPress={signInWithGoogle}
					>
						<Text style={appStyles.buttonPrimaryText}>Войти через Google</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={appStyles.buttonSecondary}
						onPress={() => router.push('/(public)/subscription')}
					>
						<Text style={appStyles.buttonSecondaryText}>О подписке</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
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
