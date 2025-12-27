import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SubscriptionPage() {
	const router = useRouter()

	const plans = [
		{
			name: 'Бесплатно',
			price: '0 ₽',
			period: 'навсегда',
			features: ['Базовые тренировки', 'История 7 дней', 'Ручное отслеживание'],
			limitations: [
				'Без синхронизации',
				'Нет анализа восстановления',
				'Ограниченная статистика',
			],
			color: '#8E8E93',
		},
		{
			name: 'Премиум',
			price: '299 ₽',
			period: 'в месяц',
			features: [
				'Все тренировки',
				'Полная история',
				'Автосинхронизация',
				'Анализ восстановления',
				'Подробная статистика',
				'Экспорт данных',
			],
			popular: true,
			color: '#FF9500',
		},
		{
			name: 'Годовая',
			price: '2 990 ₽',
			period: 'в год',
			features: [
				'Все функции Премиум',
				'Сохранение 30%',
				'Приоритетная поддержка',
				'Кастомизация тем',
			],
			color: '#007AFF',
		},
	]

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<Ionicons name='close' size={28} color='#666' />
				</TouchableOpacity>
				<Text style={styles.title}>Подписка</Text>
				<View style={{ width: 28 }} />
			</View>

			<ScrollView style={styles.content}>
				<View style={styles.hero}>
					<Text style={styles.heroTitle}>
						Превратите тренировки в образ жизни
					</Text>
					<Text style={styles.heroText}>
						Синхронизация данных, продвинутая аналитика и персональные
						рекомендации
					</Text>
				</View>

				{plans.map((plan, index) => (
					<View
						key={index}
						style={[styles.planCard, plan.popular && styles.popularCard]}
					>
						{plan.popular && (
							<View style={styles.popularBadge}>
								<Text style={styles.popularText}>ПОПУЛЯРНЫЙ</Text>
							</View>
						)}

						<View style={styles.planHeader}>
							<Text style={[styles.planName, { color: plan.color }]}>
								{plan.name}
							</Text>
							<View style={styles.priceContainer}>
								<Text style={styles.price}>{plan.price}</Text>
								<Text style={styles.period}>/{plan.period}</Text>
							</View>
						</View>

						<View style={styles.features}>
							{plan.features.map((feature, idx) => (
								<View key={idx} style={styles.featureRow}>
									<Ionicons name='checkmark-circle' size={20} color='#34C759' />
									<Text style={styles.featureText}>{feature}</Text>
								</View>
							))}
							{plan.limitations?.map((limitation, idx) => (
								<View key={idx} style={styles.featureRow}>
									<Ionicons name='close-circle' size={20} color='#FF3B30' />
									<Text style={styles.limitationText}>{limitation}</Text>
								</View>
							))}
						</View>

						<TouchableOpacity
							style={[styles.subscribeButton, { backgroundColor: plan.color }]}
							onPress={() => {
								// Обработка подписки
								alert(`Выбрана подписка: ${plan.name}`)
							}}
						>
							<Text style={styles.subscribeButtonText}>
								{plan.name === 'Бесплатно' ? 'Начать бесплатно' : 'Оформить'}
							</Text>
						</TouchableOpacity>
					</View>
				))}

				<View style={styles.faq}>
					<Text style={styles.faqTitle}>Частые вопросы</Text>

					<View style={styles.faqItem}>
						<Text style={styles.faqQuestion}>Можно ли отменить подписку?</Text>
						<Text style={styles.faqAnswer}>
							Да, подписку можно отменить в любой момент в настройках
							приложения.
						</Text>
					</View>

					<View style={styles.faqItem}>
						<Text style={styles.faqQuestion}>Что происходит после отмены?</Text>
						<Text style={styles.faqAnswer}>
							Вы сохраняете доступ до конца оплаченного периода, затем
							переходите на бесплатный тариф.
						</Text>
					</View>

					<View style={styles.faqItem}>
						<Text style={styles.faqQuestion}>Доступны ли пробные периоды?</Text>
						<Text style={styles.faqAnswer}>
							Да, для новых пользователей доступен 7-дневный пробный период
							Премиум.
						</Text>
					</View>
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5ea',
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1a1a1a',
	},
	content: {
		flex: 1,
	},
	hero: {
		padding: 20,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	heroTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
		textAlign: 'center',
		marginBottom: 8,
	},
	heroText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	planCard: {
		margin: 16,
		marginTop: 8,
		padding: 20,
		backgroundColor: '#fff',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#e5e5ea',
	},
	popularCard: {
		borderColor: '#FF9500',
		borderWidth: 2,
	},
	popularBadge: {
		position: 'absolute',
		top: -12,
		alignSelf: 'center',
		backgroundColor: '#FF9500',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
	},
	popularText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: 'bold',
	},
	planHeader: {
		alignItems: 'center',
		marginBottom: 20,
	},
	planName: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	price: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	period: {
		fontSize: 16,
		color: '#666',
		marginLeft: 4,
	},
	features: {
		marginBottom: 20,
	},
	featureRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	featureText: {
		marginLeft: 8,
		fontSize: 16,
		color: '#1a1a1a',
		flex: 1,
	},
	limitationText: {
		marginLeft: 8,
		fontSize: 16,
		color: '#8E8E93',
		textDecorationLine: 'line-through',
		flex: 1,
	},
	subscribeButton: {
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
	},
	subscribeButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	faq: {
		padding: 20,
		backgroundColor: '#fff',
		marginTop: 16,
	},
	faqTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 16,
	},
	faqItem: {
		marginBottom: 20,
	},
	faqQuestion: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1a1a1a',
		marginBottom: 4,
	},
	faqAnswer: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20,
	},
})
