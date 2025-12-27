import { useAuth } from '@/src/auth/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileTab() {
	const router = useRouter()
	const { user, isSubscribed, signOut, syncData } = useAuth()

	const [settings, setSettings] = useState({
		notifications: true,
		darkMode: false,
		autoSync: true,
		metricSystem: true,
	})

	const toggleSetting = (key: string) => {
		setSettings(prev => ({
			...prev,
			[key]: !prev[key as keyof typeof settings],
		}))
	}

	const menuItems = [
		{
			icon: 'person',
			label: 'Редактировать профиль',
			onPress: () => router.push('/(auth)/profile/edit'),
		},
		{
			icon: 'stats-chart',
			label: 'Статистика',
			onPress: () => router.push('/(auth)/stats'),
			premium: true,
		},
		{
			icon: 'download',
			label: 'Экспорт данных',
			onPress: () => Alert.alert('Экспорт', 'Экспорт данных в разработке'),
			premium: true,
		},
		{
			icon: 'sync',
			label: 'Синхронизация',
			onPress: syncData,
		},
		{
			icon: 'settings',
			label: 'Настройки',
			onPress: () => router.push('/(auth)/settings'),
		},
		{
			icon: 'help-circle',
			label: 'Помощь',
			onPress: () => router.push('/(auth)/help'),
		},
		{
			icon: 'shield-checkmark',
			label: 'Конфиденциальность',
			onPress: () => router.push('/(auth)/privacy'),
		},
		{
			icon: 'document-text',
			label: 'Условия использования',
			onPress: () => router.push('/(auth)/terms'),
		},
	]

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<TouchableOpacity onPress={() => router.push('/(auth)/profile/edit')}>
						<Image
							source={{
								uri:
									user?.avatar ||
									'https://ui-avatars.com/api/?name=' + user?.firstName,
							}}
							style={styles.avatar}
						/>
					</TouchableOpacity>

					<View style={styles.userInfo}>
						<Text style={styles.userName}>
							{user?.firstName} {user?.lastName}
						</Text>
						<Text style={styles.userEmail}>{user?.email}</Text>

						<View style={styles.subscriptionStatus}>
							<View
								style={[
									styles.statusDot,
									{ backgroundColor: isSubscribed ? '#34C759' : '#FF3B30' },
								]}
							/>
							<Text style={styles.statusText}>
								{isSubscribed ? 'Премиум активен' : 'Бесплатная версия'}
							</Text>
						</View>
					</View>
				</View>

				{!isSubscribed && (
					<TouchableOpacity
						style={styles.upgradeCard}
						onPress={() => router.push('/(public)/subscription')}
					>
						<View style={styles.upgradeContent}>
							<Ionicons name='sparkles' size={24} color='#FFCC00' />
							<View style={styles.upgradeText}>
								<Text style={styles.upgradeTitle}>Обновите до Премиум</Text>
								<Text style={styles.upgradeDescription}>
									Откройте все возможности приложения
								</Text>
							</View>
						</View>
						<Ionicons name='chevron-forward' size={24} color='#8E8E93' />
					</TouchableOpacity>
				)}

				<View style={styles.statsCard}>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>24</Text>
						<Text style={styles.statLabel}>Тренировок</Text>
					</View>
					<View style={styles.divider} />
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>156</Text>
						<Text style={styles.statLabel}>Подходов</Text>
					</View>
					<View style={styles.divider} />
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>7</Text>
						<Text style={styles.statLabel}>Дней подряд</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Настройки</Text>
					<View style={styles.settingsCard}>
						<View style={styles.settingItem}>
							<View style={styles.settingLeft}>
								<Ionicons name='notifications' size={22} color='#666' />
								<Text style={styles.settingLabel}>Уведомления</Text>
							</View>
							<Switch
								value={settings.notifications}
								onValueChange={() => toggleSetting('notifications')}
								trackColor={{ false: '#e5e5ea', true: '#34C759' }}
							/>
						</View>

						<View style={styles.settingItem}>
							<View style={styles.settingLeft}>
								<Ionicons name='moon' size={22} color='#666' />
								<Text style={styles.settingLabel}>Темная тема</Text>
							</View>
							<Switch
								value={settings.darkMode}
								onValueChange={() => toggleSetting('darkMode')}
								trackColor={{ false: '#e5e5ea', true: '#34C759' }}
							/>
						</View>

						<View style={styles.settingItem}>
							<View style={styles.settingLeft}>
								<Ionicons name='sync' size={22} color='#666' />
								<Text style={styles.settingLabel}>Автосинхронизация</Text>
							</View>
							<Switch
								value={settings.autoSync}
								onValueChange={() => toggleSetting('autoSync')}
								trackColor={{ false: '#e5e5ea', true: '#34C759' }}
							/>
						</View>

						<View style={styles.settingItem}>
							<View style={styles.settingLeft}>
								<Ionicons name='speedometer' size={22} color='#666' />
								<Text style={styles.settingLabel}>Метрическая система</Text>
							</View>
							<Switch
								value={settings.metricSystem}
								onValueChange={() => toggleSetting('metricSystem')}
								trackColor={{ false: '#e5e5ea', true: '#34C759' }}
							/>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Меню</Text>
					<View style={styles.menuCard}>
						{menuItems.map((item, index) => (
							<TouchableOpacity
								key={index}
								style={styles.menuItem}
								onPress={item.onPress}
								disabled={item.premium && !isSubscribed}
							>
								<View style={styles.menuLeft}>
									<Ionicons
										name={item.icon as any}
										size={22}
										color={item.premium && !isSubscribed ? '#8E8E93' : '#666'}
									/>
									<Text
										style={[
											styles.menuLabel,
											item.premium && !isSubscribed && styles.menuLabelDisabled,
										]}
									>
										{item.label}
										{item.premium && !isSubscribed && ' (Премиум)'}
									</Text>
								</View>
								<Ionicons name='chevron-forward' size={20} color='#8E8E93' />
							</TouchableOpacity>
						))}
					</View>
				</View>

				<TouchableOpacity
					style={styles.logoutButton}
					onPress={() => {
						Alert.alert('Выход', 'Вы уверены, что хотите выйти из аккаунта?', [
							{ text: 'Отмена', style: 'cancel' },
							{ text: 'Выйти', onPress: signOut, style: 'destructive' },
						])
					}}
				>
					<Ionicons name='log-out-outline' size={22} color='#FF3B30' />
					<Text style={styles.logoutText}>Выйти из аккаунта</Text>
				</TouchableOpacity>

				<View style={styles.footer}>
					<Text style={styles.version}>Версия 1.0.0</Text>
					<Text style={styles.copyright}>
						© 2024 Fitex. Все права защищены.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 30,
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginRight: 16,
	},
	userInfo: {
		flex: 1,
	},
	userName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 4,
	},
	userEmail: {
		fontSize: 14,
		color: '#666',
		marginBottom: 8,
	},
	subscriptionStatus: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 6,
	},
	statusText: {
		fontSize: 14,
		color: '#666',
	},
	upgradeCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginTop: -15,
		borderRadius: 16,
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	upgradeContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	upgradeText: {
		marginLeft: 12,
	},
	upgradeTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 4,
	},
	upgradeDescription: {
		fontSize: 14,
		color: '#666',
	},
	statsCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginTop: 20,
		borderRadius: 16,
		padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	statItem: {
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#007AFF',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: '#666',
	},
	divider: {
		width: 1,
		height: 40,
		backgroundColor: '#e5e5ea',
	},
	section: {
		marginTop: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1a1a1a',
		marginLeft: 20,
		marginBottom: 12,
	},
	settingsCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 16,
		paddingHorizontal: 16,
	},
	settingItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
	},
	settingLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	settingLabel: {
		fontSize: 16,
		color: '#1a1a1a',
		marginLeft: 12,
	},
	menuCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 16,
		overflow: 'hidden',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
	},
	menuLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	menuLabel: {
		fontSize: 16,
		color: '#1a1a1a',
		marginLeft: 12,
	},
	menuLabelDisabled: {
		color: '#8E8E93',
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginTop: 24,
		marginBottom: 20,
		paddingVertical: 16,
		borderRadius: 16,
	},
	logoutText: {
		fontSize: 16,
		color: '#FF3B30',
		fontWeight: '600',
		marginLeft: 8,
	},
	footer: {
		alignItems: 'center',
		paddingVertical: 20,
		paddingHorizontal: 20,
	},
	version: {
		fontSize: 14,
		color: '#8E8E93',
		marginBottom: 4,
	},
	copyright: {
		fontSize: 12,
		color: '#8E8E93',
	},
})
