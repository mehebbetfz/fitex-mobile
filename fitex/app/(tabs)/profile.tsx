import { useDatabase } from '@/app/contexts/database-context'
import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../contexts/auth-context'

// Единая цветовая схема
const COLORS = {
	primary: '#34C759',
	background: '#121212',
	card: '#1C1C1E',
	border: '#2C2C2E',
	text: '#FFFFFF',
	textSecondary: '#8E8E93',
	accent: '#FF9500',
	error: '#FF3B30',
} as const

// Переиспользуемый компонент для пункта меню
interface SettingsItemProps {
	icon: keyof typeof Ionicons.glyphMap
	title: string
	subtitle?: string
	onPress?: () => void
	showChevron?: boolean
	rightElement?: React.ReactNode
	iconColor?: string
}

const SettingsItem: React.FC<SettingsItemProps> = ({
	icon,
	title,
	subtitle,
	onPress,
	showChevron = true,
	rightElement,
	iconColor = COLORS.primary,
}) => (
	<TouchableOpacity
		style={styles.settingsItem}
		onPress={onPress}
		disabled={!onPress}
		activeOpacity={0.7}
	>
		<View style={[styles.settingsIcon, { backgroundColor: `${iconColor}20` }]}>
			<Ionicons name={icon} size={24} color={iconColor} />
		</View>
		<View style={styles.settingsContent}>
			<Text style={styles.settingsTitle}>{title}</Text>
			{subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
		</View>
		{rightElement}
		{showChevron && !rightElement && (
			<Ionicons name='chevron-forward' size={20} color={COLORS.textSecondary} />
		)}
	</TouchableOpacity>
)

export default function ProfileScreen() {
	const { user, signOut } = useAuth()
	const { syncWithServer, isLoading: dbLoading } = useDatabase()
	const [syncing, setSyncing] = useState(false)
	const [signingOut, setSigningOut] = useState(false)

	// Синхронизация (только для премиум)
	const handleSync = async () => {
		if (!user?.isPremium) {
			router.push('/(auth)/subscription')
			return
		}

		setSyncing(true)
		try {
			await syncWithServer(user?.isPremium)
		} catch (error) {
			Alert.alert('Ошибка', 'Не удалось синхронизировать данные: ' + error)
		} finally {
			setSyncing(false)
		}
	}

	// Выход из аккаунта
	const handleSignOut = () => {
		Alert.alert('Выход', 'Вы действительно хотите выйти из аккаунта?', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Выйти',
				style: 'destructive',
				onPress: async () => {
					setSigningOut(true)
					try {
						await signOut()
						router.replace('/(auth)/login')
					} catch (err) {
						Alert.alert('Ошибка', 'Не удалось выйти')
					} finally {
						setSigningOut(false)
					}
				},
			},
		])
	}

	// Переход на экран подписки
	const handleUpgrade = () => {
		router.push('/(auth)/subscription')
	}

	// Заглушки для будущих настроек
	const handleOpenSettings = (section: string) => {
		Alert.alert('Настройки', `Раздел "${section}" в разработке`)
	}

	const appVersion = Constants.expoConfig?.version || '1.0.0'

	// Получаем инициалы для аватара
	const userInitial = user?.firstName?.[0] || user?.email?.[0] || '?'

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Заголовок */}
				<View style={styles.header}>
					<Text style={styles.title}>Профиль</Text>
					<Text style={styles.subtitle}>
						Управляйте аккаунтом и настройками
					</Text>
				</View>

				{/* Карточка пользователя (без статуса) */}
				<View style={styles.userCard}>
					<View style={styles.avatarContainer}>
						<Text style={styles.avatarText}>{userInitial}</Text>
					</View>
					<View style={styles.userInfo}>
						<Text style={styles.userName}>
							{user?.firstName
								? `${user.firstName} ${user.lastName || ''}`
								: 'Пользователь'}
						</Text>
						<Text style={styles.userEmail}>{user?.email || '—'}</Text>
					</View>
				</View>

				{/* Отдельный блок статуса премиума */}
				<View style={styles.premiumStatusBlock}>
					<View style={styles.premiumStatusHeader}>
						<Ionicons
							name={user?.isPremium ? 'diamond' : 'diamond-outline'}
							size={24}
							color={user?.isPremium ? COLORS.primary : COLORS.textSecondary}
						/>
						<Text style={styles.premiumStatusTitle}>Премиум статус</Text>
					</View>
					<View style={styles.premiumStatusBody}>
						<Text style={styles.premiumStatusText}>
							{user?.isPremium
								? 'Ваш Премиум аккаунт активен'
								: 'Бесплатный аккаунт с ограниченным функционалом'}
						</Text>
						{!user?.isPremium && (
							<TouchableOpacity
								style={styles.upgradeButton}
								onPress={handleUpgrade}
							>
								<Text style={styles.upgradeButtonText}>Купить Премиум</Text>
								<Ionicons
									name='arrow-forward'
									size={18}
									color={COLORS.primary}
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>

				{/* Секция синхронизации (только для премиум) */}
				{user?.isPremium && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Облако</Text>
						<SettingsItem
							icon='cloud-upload-outline'
							title='Синхронизировать данные'
							subtitle='Обновить данные на сервере'
							onPress={handleSync}
							showChevron={false}
							rightElement={
								syncing || dbLoading ? (
									<ActivityIndicator size='small' color={COLORS.primary} />
								) : null
							}
						/>
					</View>
				)}

				<Text style={styles.sectionTitle}>Выход</Text>

				{/* Кнопка выхода */}
				<SettingsItem
					icon='log-out-outline'
					title='Выйти из аккаунта'
					subtitle='Завершить текущую сессию'
					onPress={handleSignOut}
					iconColor={COLORS.error}
					showChevron={false}
					rightElement={
						signingOut ? (
							<ActivityIndicator size='small' color={COLORS.error} />
						) : null
					}
				/>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	header: {
		paddingHorizontal: 10,
		paddingTop: 20,
		paddingBottom: 16,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: COLORS.text,
	},
	subtitle: {
		fontSize: 15,
		color: COLORS.textSecondary,
		marginTop: 4,
	},
	// Карточка пользователя (только аватар, имя, email)
	userCard: {
		flexDirection: 'row',
		backgroundColor: COLORS.card,
		borderRadius: 20,
		padding: 20,
		marginHorizontal: 10,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
		alignItems: 'center',
	},
	avatarContainer: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: COLORS.primary,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	avatarText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: COLORS.text,
	},
	userInfo: {
		flex: 1,
	},
	userName: {
		fontSize: 20,
		fontWeight: '600',
		color: COLORS.text,
	},
	userEmail: {
		fontSize: 15,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	// Новый блок статуса премиума
	premiumStatusBlock: {
		backgroundColor: COLORS.card,
		borderRadius: 20,
		padding: 20,
		marginHorizontal: 10,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	premiumStatusHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	premiumStatusTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
		marginLeft: 10,
	},
	premiumStatusBody: {
		paddingLeft: 34, // выравнивание под иконку
	},
	premiumStatusText: {
		fontSize: 15,
		color: COLORS.textSecondary,
		marginBottom: 12,
	},
	upgradeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		backgroundColor: 'rgba(52, 199, 89, 0.15)',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 30,
		gap: 8,
	},
	upgradeButtonText: {
		color: COLORS.primary,
		fontSize: 15,
		fontWeight: '600',
	},
	section: {
		marginTop: 10,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
		marginBottom: 12,
		marginLeft: 8,
	},
	settingsItem: {
		flexDirection: 'row',
		backgroundColor: COLORS.card,
		borderRadius: 16,
		padding: 16,
		marginBottom: 8,
		marginHorizontal: 10,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	settingsIcon: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	settingsContent: {
		flex: 1,
	},
	settingsTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: COLORS.text,
	},
	settingsSubtitle: {
		fontSize: 13,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	// Остальные стили оставляем без изменений
})
