import { useAuth } from '@/src/auth/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path } from 'react-native-svg'

const { width } = Dimensions.get('window')

const MUSCLE_DATA = [
	{
		id: '1',
		name: 'Грудь',
		status: 'recovering',
		recovery: 65,
		color: '#FF6B6B',
		lastTrained: '2 дня назад',
	},
	{
		id: '2',
		name: 'Спина',
		status: 'recovered',
		recovery: 100,
		color: '#4ECDC4',
		lastTrained: '4 дня назад',
	},
	{
		id: '3',
		name: 'Ноги',
		status: 'needs_rest',
		recovery: 25,
		color: '#45B7D1',
		lastTrained: '1 день назад',
	},
	{
		id: '4',
		name: 'Плечи',
		status: 'recovered',
		recovery: 100,
		color: '#96CEB4',
		lastTrained: '5 дней назад',
	},
	{
		id: '5',
		name: 'Бицепс',
		status: 'recovering',
		recovery: 80,
		color: '#FFEAA7',
		lastTrained: '3 дня назад',
	},
	{
		id: '6',
		name: 'Трицепс',
		status: 'recovering',
		recovery: 70,
		color: '#DDA0DD',
		lastTrained: '2 дня назад',
	},
]

export default function RecoveryTab() {
	const { isSubscribed } = useAuth()
	const [selectedDay, setSelectedDay] = useState(0)
	const [overallRecovery, setOverallRecovery] = useState(73)

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'recovered':
				return '#34C759'
			case 'recovering':
				return '#FFCC00'
			case 'needs_rest':
				return '#FF3B30'
			default:
				return '#8E8E93'
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case 'recovered':
				return 'Восстановлено'
			case 'recovering':
				return 'Восстанавливается'
			case 'needs_rest':
				return 'Требуется отдых'
			default:
				return 'Не тренировалась'
		}
	}

	const BodyDiagram = () => (
		<View style={styles.diagramContainer}>
			<Svg width={width - 40} height={300} viewBox='0 0 200 300'>
				{/* Тело */}
				<Path
					d='M 80 45 Q 100 60 120 45 L 120 150 Q 100 170 80 150 Z'
					fill='#e0e0e0'
					stroke='#ccc'
					strokeWidth='1'
				/>

				{/* Голова */}
				<Circle
					cx='100'
					cy='30'
					r='15'
					fill='#e0e0e0'
					stroke='#ccc'
					strokeWidth='1'
				/>

				{/* Руки */}
				<Path
					d='M 60 80 L 40 120 L 60 160'
					stroke='#ccc'
					strokeWidth='8'
					fill='none'
				/>
				<Path
					d='M 140 80 L 160 120 L 140 160'
					stroke='#ccc'
					strokeWidth='8'
					fill='none'
				/>

				{/* Ноги */}
				<Path
					d='M 80 150 L 70 220 L 80 250'
					stroke='#ccc'
					strokeWidth='8'
					fill='none'
				/>
				<Path
					d='M 120 150 L 130 220 L 120 250'
					stroke='#ccc'
					strokeWidth='8'
					fill='none'
				/>

				{/* Подсветка мышц */}
				{MUSCLE_DATA.map((muscle, index) => {
					let path = ''
					let fillColor = getStatusColor(muscle.status)

					switch (muscle.name) {
						case 'Грудь':
							path = 'M 85 70 Q 100 90 115 70 L 115 100 Q 100 120 85 100 Z'
							break
						case 'Спина':
							path = 'M 85 45 Q 100 65 115 45 L 115 85 Q 100 105 85 85 Z'
							break
						case 'Ноги':
							path = 'M 70 150 Q 100 180 130 150 L 130 200 Q 100 220 70 200 Z'
							break
						case 'Плечи':
							path =
								'M 60 80 Q 80 70 100 75 Q 120 70 140 80 L 140 100 Q 120 110 100 105 Q 80 110 60 100 Z'
							break
						case 'Бицепс':
							path =
								'M 40 120 Q 50 130 60 130 Q 70 125 60 115 Q 50 115 40 120 Z'
							break
						case 'Трицепс':
							path =
								'M 140 120 Q 150 130 160 130 Q 170 125 160 115 Q 150 115 140 120 Z'
							break
						default:
							return null
					}

					return (
						<Path
							key={index}
							d={path}
							fill={fillColor}
							opacity={0.7}
							stroke='#fff'
							strokeWidth='0.5'
						/>
					)
				})}
			</Svg>
		</View>
	)

	if (!isSubscribed) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.subscriptionRequired}>
					<Ionicons name='lock-closed' size={64} color='#8E8E93' />
					<Text style={styles.subscriptionTitle}>Требуется подписка</Text>
					<Text style={styles.subscriptionText}>
						Для доступа к мониторингу восстановления мышц требуется подписка
					</Text>
					<TouchableOpacity style={styles.subscribeButton}>
						<Text style={styles.subscribeButtonText}>Перейти к подписке</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>Восстановление</Text>
						<Text style={styles.subtitle}>Отслеживайте состояние мышц</Text>
					</View>
					<TouchableOpacity style={styles.statsButton}>
						<Ionicons name='stats-chart' size={24} color='#007AFF' />
					</TouchableOpacity>
				</View>

				<View style={styles.overviewCard}>
					<Text style={styles.overviewTitle}>
						Общий прогресс восстановления
					</Text>
					<View style={styles.progressContainer}>
						<View style={styles.progressCircle}>
							<Text style={styles.progressText}>{overallRecovery}%</Text>
						</View>
						<View style={styles.overviewStats}>
							<View style={styles.statRow}>
								<View
									style={[styles.statusDot, { backgroundColor: '#34C759' }]}
								/>
								<Text style={styles.statText}>Восстановлено: 3</Text>
							</View>
							<View style={styles.statRow}>
								<View
									style={[styles.statusDot, { backgroundColor: '#FFCC00' }]}
								/>
								<Text style={styles.statText}>Восстанавливается: 3</Text>
							</View>
							<View style={styles.statRow}>
								<View
									style={[styles.statusDot, { backgroundColor: '#FF3B30' }]}
								/>
								<Text style={styles.statText}>Требует отдыха: 1</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Модель тела</Text>
					<BodyDiagram />
					<View style={styles.legend}>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendColor, { backgroundColor: '#34C759' }]}
							/>
							<Text style={styles.legendText}>Восстановлено</Text>
						</View>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendColor, { backgroundColor: '#FFCC00' }]}
							/>
							<Text style={styles.legendText}>Восстанавливается</Text>
						</View>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendColor, { backgroundColor: '#FF3B30' }]}
							/>
							<Text style={styles.legendText}>Требует отдыха</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Детали по мышцам</Text>
					{MUSCLE_DATA.map(muscle => (
						<TouchableOpacity key={muscle.id} style={styles.muscleItem}>
							<View style={styles.muscleInfo}>
								<View
									style={[styles.muscleIcon, { backgroundColor: muscle.color }]}
								>
									<Text style={styles.muscleIconText}>
										{muscle.name.charAt(0)}
									</Text>
								</View>
								<View>
									<Text style={styles.muscleName}>{muscle.name}</Text>
									<Text style={styles.lastTrained}>{muscle.lastTrained}</Text>
								</View>
							</View>

							<View style={styles.muscleStatus}>
								<View style={styles.recoveryBar}>
									<View
										style={[
											styles.recoveryFill,
											{
												width: `${muscle.recovery}%`,
												backgroundColor: getStatusColor(muscle.status),
											},
										]}
									/>
								</View>
								<Text
									style={[
										styles.statusText,
										{ color: getStatusColor(muscle.status) },
									]}
								>
									{getStatusText(muscle.status)}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Рекомендации</Text>
					<View style={styles.recommendationCard}>
						<Ionicons name='bulb' size={24} color='#FFCC00' />
						<View style={styles.recommendationContent}>
							<Text style={styles.recommendationTitle}>
								Сегодня лучше всего
							</Text>
							<Text style={styles.recommendationText}>
								Тренируйте спину и плечи - они полностью восстановились
							</Text>
						</View>
					</View>
					<View style={styles.recommendationCard}>
						<Ionicons name='warning' size={24} color='#FF3B30' />
						<View style={styles.recommendationContent}>
							<Text style={styles.recommendationTitle}>Дайте отдых ногам</Text>
							<Text style={styles.recommendationText}>
								Ноги требуют еще 1-2 дня отдыха для полного восстановления
							</Text>
						</View>
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
	subscriptionRequired: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 40,
	},
	subscriptionTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginTop: 20,
		marginBottom: 12,
	},
	subscriptionText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 24,
	},
	subscribeButton: {
		backgroundColor: '#007AFF',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 12,
	},
	subscribeButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginTop: 4,
	},
	statsButton: {
		padding: 8,
	},
	overviewCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginTop: 10,
		borderRadius: 16,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	overviewTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1a1a1a',
		marginBottom: 16,
	},
	progressContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	progressCircle: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 8,
		borderColor: '#34C759',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 20,
	},
	progressText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	overviewStats: {
		flex: 1,
	},
	statRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	statusDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	statText: {
		fontSize: 14,
		color: '#666',
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
	diagramContainer: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 16,
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	legend: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 16,
		paddingHorizontal: 20,
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	legendColor: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 6,
	},
	legendText: {
		fontSize: 12,
		color: '#666',
	},
	muscleItem: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginBottom: 8,
		borderRadius: 12,
		padding: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	muscleInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	muscleIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	muscleIconText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
	muscleName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1a1a1a',
	},
	lastTrained: {
		fontSize: 12,
		color: '#8E8E93',
		marginTop: 2,
	},
	muscleStatus: {
		alignItems: 'flex-end',
	},
	recoveryBar: {
		width: 100,
		height: 6,
		backgroundColor: '#e5e5ea',
		borderRadius: 3,
		marginBottom: 4,
		overflow: 'hidden',
	},
	recoveryFill: {
		height: '100%',
		borderRadius: 3,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
	},
	recommendationCard: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginBottom: 8,
		borderRadius: 12,
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
	},
	recommendationContent: {
		flex: 1,
		marginLeft: 12,
	},
	recommendationTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1a1a1a',
		marginBottom: 4,
	},
	recommendationText: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20,
	},
})
