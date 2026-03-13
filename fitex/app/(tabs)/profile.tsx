import { useDatabase } from '@/app/contexts/database-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	Animated,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../contexts/auth-context'

const COLORS = {
	primary: '#34C759',
	background: '#121212',
	card: '#1C1C1E',
	cardLight: '#2C2C2E',
	border: '#2C2C2E',
	text: '#FFFFFF',
	textSecondary: '#8E8E93',
	accent: '#FF9500',
	error: '#FF3B30',
} as const

// ─────────────────────────────────────────────
// Shimmer (identical to RecoveryTab)
// ─────────────────────────────────────────────
const useShimmer = () => {
	const anim = useRef(new Animated.Value(0)).current
	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(anim, {
					toValue: 1,
					duration: 750,
					useNativeDriver: true,
				}),
				Animated.timing(anim, {
					toValue: 0,
					duration: 750,
					useNativeDriver: true,
				}),
			]),
		)
		loop.start()
		return () => loop.stop()
	}, [])
	return anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] })
}

const ShimmerBlock = ({ style }: { style: any }) => {
	const opacity = useShimmer()
	return <Animated.View style={[style, { opacity }]} />
}

// ─────────────────────────────────────────────
// FadeIn (identical to RecoveryTab)
// ─────────────────────────────────────────────
const FadeIn = ({
	show,
	children,
}: {
	show: boolean
	children: React.ReactNode
}) => {
	const anim = useRef(new Animated.Value(0)).current
	useEffect(() => {
		if (show) {
			Animated.timing(anim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
	}, [show])
	return <Animated.View style={{ opacity: anim }}>{children}</Animated.View>
}

// ─────────────────────────────────────────────
// Skeleton blocks
// ─────────────────────────────────────────────
const UserCardSkeleton = () => (
	<View style={[styles.userCard, { borderColor: COLORS.border }]}>
		<ShimmerBlock
			style={{
				width: 70,
				height: 70,
				borderRadius: 35,
				backgroundColor: COLORS.cardLight,
				marginRight: 16,
			}}
		/>
		<View style={{ flex: 1, gap: 10 }}>
			<ShimmerBlock
				style={{
					height: 18,
					width: 130,
					borderRadius: 6,
					backgroundColor: COLORS.cardLight,
				}}
			/>
			<ShimmerBlock
				style={{
					height: 13,
					width: 180,
					borderRadius: 4,
					backgroundColor: COLORS.cardLight,
				}}
			/>
		</View>
	</View>
)

const PremiumBlockSkeleton = () => (
	<View style={[styles.premiumStatusBlock, { borderColor: COLORS.border }]}>
		<View
			style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
		>
			<ShimmerBlock
				style={{
					width: 24,
					height: 24,
					borderRadius: 12,
					backgroundColor: COLORS.cardLight,
				}}
			/>
			<ShimmerBlock
				style={{
					height: 16,
					width: 120,
					borderRadius: 5,
					backgroundColor: COLORS.cardLight,
					marginLeft: 10,
				}}
			/>
		</View>
		<View style={{ paddingLeft: 34, gap: 10 }}>
			<ShimmerBlock
				style={{
					height: 13,
					width: '80%',
					borderRadius: 4,
					backgroundColor: COLORS.cardLight,
				}}
			/>
			<ShimmerBlock
				style={{
					height: 38,
					width: 140,
					borderRadius: 30,
					backgroundColor: COLORS.cardLight,
				}}
			/>
		</View>
	</View>
)

const SettingsItemSkeleton = () => (
	<View style={[styles.settingsItem, { marginBottom: 8 }]}>
		<ShimmerBlock
			style={{
				width: 44,
				height: 44,
				borderRadius: 22,
				backgroundColor: COLORS.cardLight,
				marginRight: 12,
			}}
		/>
		<View style={{ flex: 1, gap: 8 }}>
			<ShimmerBlock
				style={{
					height: 14,
					width: 150,
					borderRadius: 4,
					backgroundColor: COLORS.cardLight,
				}}
			/>
			<ShimmerBlock
				style={{
					height: 11,
					width: 110,
					borderRadius: 4,
					backgroundColor: COLORS.cardLight,
				}}
			/>
		</View>
		<ShimmerBlock
			style={{
				width: 20,
				height: 20,
				borderRadius: 4,
				backgroundColor: COLORS.cardLight,
			}}
		/>
	</View>
)

// ─────────────────────────────────────────────
// SettingsItem (unchanged from original)
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function ProfileScreen() {
	const { user, signOut } = useAuth()
	const { syncWithServer, isLoading: dbLoading } = useDatabase()
	const [syncing, setSyncing] = useState(false)
	const [signingOut, setSigningOut] = useState(false)
	const [loading, setLoading] = useState(true)

	// Simulate auth data resolving — remove the delay if useAuth already guards
	useEffect(() => {
		if (user !== undefined) {
			const timer = setTimeout(() => setLoading(false), 300)
			return () => clearTimeout(timer)
		}
	}, [user])

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

	const handleUpgrade = () => router.push('/(auth)/subscription')
	const userInitial = user?.firstName?.[0] || user?.email?.[0] || '?'

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Header — always visible, avatar pill shimmer while loading */}
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>Профиль</Text>
						<Text style={styles.subtitle}>Управляйте аккаунтом</Text>
					</View>
					{loading ? (
						<ShimmerBlock
							style={{
								height: 34,
								width: 80,
								borderRadius: 20,
								backgroundColor: COLORS.cardLight,
							}}
						/>
					) : (
						<FadeIn show={!loading}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: user?.isPremium
										? 'rgba(52,199,89,0.1)'
										: 'rgba(142,142,147,0.1)',
									borderRadius: 20,
									paddingHorizontal: 12,
									paddingVertical: 6,
									borderWidth: 1,
									borderColor: user?.isPremium
										? 'rgba(52,199,89,0.2)'
										: 'rgba(142,142,147,0.2)',
									gap: 6,
								}}
							>
								<View
									style={{
										width: 7,
										height: 7,
										borderRadius: 3.5,
										backgroundColor: user?.isPremium
											? COLORS.primary
											: COLORS.textSecondary,
									}}
								/>
								<Text
									style={{
										fontSize: 13,
										fontWeight: '600',
										color: user?.isPremium
											? COLORS.primary
											: COLORS.textSecondary,
									}}
								>
									{user?.isPremium ? 'Премиум' : 'Базовый'}
								</Text>
							</View>
						</FadeIn>
					)}
				</View>

				{/* User card */}
				{loading ? (
					<UserCardSkeleton />
				) : (
					<FadeIn show={!loading}>
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
					</FadeIn>
				)}

				{/* Premium status block */}
				{loading ? (
					<PremiumBlockSkeleton />
				) : (
					<FadeIn show={!loading}>
						<View style={styles.premiumStatusBlock}>
							<View style={styles.premiumStatusHeader}>
								<Ionicons
									name={user?.isPremium ? 'diamond' : 'diamond-outline'}
									size={24}
									color={
										user?.isPremium ? COLORS.primary : COLORS.textSecondary
									}
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
					</FadeIn>
				)}

				{/* Sync section (premium only) */}
				{loading ? (
					<>
						<ShimmerBlock
							style={{
								height: 16,
								width: 60,
								borderRadius: 4,
								backgroundColor: COLORS.cardLight,
								marginLeft: 8,
								marginBottom: 12,
								marginTop: 10,
							}}
						/>
						<SettingsItemSkeleton />
					</>
				) : user?.isPremium ? (
					<FadeIn show={!loading}>
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
					</FadeIn>
				) : null}

				{/* Sign out */}
				{loading ? (
					<>
						<ShimmerBlock
							style={{
								height: 16,
								width: 50,
								borderRadius: 4,
								backgroundColor: COLORS.cardLight,
								marginLeft: 8,
								marginBottom: 12,
								marginTop: 10,
							}}
						/>
						<SettingsItemSkeleton />
					</>
				) : (
					<FadeIn show={!loading}>
						<Text style={styles.sectionTitle}>Выход</Text>
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
					</FadeIn>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.background },
	scrollContent: { paddingBottom: 40 },
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingTop: 20,
		paddingBottom: 16,
	},
	title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
	subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 4 },
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
	avatarText: { fontSize: 30, fontWeight: 'bold', color: COLORS.text },
	userInfo: { flex: 1 },
	userName: { fontSize: 20, fontWeight: '600', color: COLORS.text },
	userEmail: { fontSize: 15, color: COLORS.textSecondary, marginTop: 2 },
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
	premiumStatusBody: { paddingLeft: 34 },
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
	upgradeButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
	section: { marginTop: 10 },
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
	settingsContent: { flex: 1 },
	settingsTitle: { fontSize: 16, fontWeight: '500', color: COLORS.text },
	settingsSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
})
