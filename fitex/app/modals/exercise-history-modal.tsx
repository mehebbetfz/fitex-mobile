// Создайте новый файл ExerciseHistoryModal.tsx
import { useDatabase } from '@/app/contexts/database-context'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
	Animated,
	Dimensions,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const COLORS = {
	primary: '#34C759',
	primaryDark: '#2CAE4E',
	background: '#000',
	card: '#1C1C1E',
	cardLight: '#2C2C2E',
	border: '#3A3A3C',
	text: '#FFFFFF',
	textSecondary: '#8E8E93',
	error: '#FF3B30',
	success: '#34C759',
	warning: '#FF9500',
	info: '#5AC8FA',
} as const

interface ExerciseHistoryModalProps {
	visible: boolean
	onClose: () => void
	exerciseName: string
	currentSets: Array<{
		setNumber: number
		weight: number
		reps: number
		completed: boolean
	}>
}

const ExerciseHistoryModal: React.FC<ExerciseHistoryModalProps> = ({
	visible,
	onClose,
	exerciseName,
	currentSets,
}) => {
	const insets = useSafeAreaInsets()

	const { fetchExerciseHistory, getExerciseRecords, calculateOneRepMax } =
		useDatabase()
	const [history, setHistory] = useState<any[]>([])
	const [records, setRecords] = useState<any>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [slideAnim] = useState(new Animated.Value(SCREEN_WIDTH))

	useEffect(() => {
		if (visible) {
			loadHistory()
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
		} else {
			Animated.timing(slideAnim, {
				toValue: SCREEN_WIDTH,
				duration: 250,
				useNativeDriver: true,
			}).start()
		}
	}, [visible])

	const loadHistory = async () => {
		setIsLoading(true)
		try {
			const [historyData, recordsData] = await Promise.all([
				fetchExerciseHistory(exerciseName),
				getExerciseRecords(exerciseName),
			])
			setHistory(historyData)
			setRecords(recordsData)
		} catch (error) {
			console.error('Error loading history:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const today = new Date()
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)

		if (date.toDateString() === today.toDateString()) {
			return 'Сегодня'
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Вчера'
		} else {
			const day = date.getDate().toString().padStart(2, '0')
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			return `${day}.${month}`
		}
	}

	const getComparison = (currentSet: any, previousSet: any) => {
		if (!previousSet) return { weightDiff: 0, repsDiff: 0, volumeDiff: 0 }

		const currentVolume = currentSet.weight * currentSet.reps
		const previousVolume = previousSet.weight * previousSet.reps

		return {
			weightDiff: currentSet.weight - previousSet.weight,
			repsDiff: currentSet.reps - previousSet.reps,
			volumeDiff: currentVolume - previousVolume,
			volumePercent:
				previousVolume > 0
					? (((currentVolume - previousVolume) / previousVolume) * 100).toFixed(
							1,
						)
					: '100.0',
		}
	}

	const renderComparisonIcon = (
		value: number,
		type: 'weight' | 'reps' | 'volume',
	) => {
		if (value === 0) return null

		const isPositive = value > 0
		const iconName = isPositive ? 'arrow-up' : 'arrow-down'
		const color = isPositive ? COLORS.success : COLORS.error
		const absoluteValue = Math.abs(value)

		let formattedValue = ''
		if (type === 'weight') {
			formattedValue = `${absoluteValue}кг`
		} else if (type === 'reps') {
			formattedValue = `${absoluteValue}`
		} else {
			formattedValue = `${absoluteValue}кг`
		}

		return (
			<View style={styles.comparisonContainer}>
				<Ionicons name={iconName} size={12} color={color} />
				<Text style={[styles.comparisonText, { color }]}>{formattedValue}</Text>
			</View>
		)
	}

	const renderSetComparison = (setIndex: number, currentSet: any) => {
		const lastWorkoutSets = records?.lastWorkout?.sets || []
		const previousSet = lastWorkoutSets.find(
			(s: any) => s.set_number === setIndex + 1,
		)

		if (!previousSet) return null

		const comparison = getComparison(currentSet, previousSet)

		return (
			<View style={styles.setComparisonRow}>
				<View style={styles.setNumber}>
					<Text style={styles.setNumberText}>{setIndex + 1}</Text>
				</View>

				<View style={styles.comparisonValues}>
					<View style={styles.comparisonItem}>
						<Text style={styles.comparisonLabel}>Прошлый раз:</Text>
						<Text style={styles.comparisonValue}>
							{previousSet.weight}кг × {previousSet.reps}
						</Text>
					</View>

					<View style={styles.comparisonItem}>
						<Text style={styles.comparisonLabel}>Сейчас:</Text>
						<Text style={styles.comparisonValue}>
							{currentSet.weight}кг × {currentSet.reps}
						</Text>
					</View>

					{(comparison.weightDiff !== 0 || comparison.repsDiff !== 0) && (
						<View style={styles.differenceContainer}>
							<Text style={styles.differenceLabel}>Разница:</Text>
							{comparison.weightDiff !== 0 &&
								renderComparisonIcon(comparison.weightDiff, 'weight')}
							{comparison.repsDiff !== 0 &&
								renderComparisonIcon(comparison.repsDiff, 'reps')}
							{comparison.volumeDiff !== 0 && (
								<Text
									style={[
										styles.volumePercent,
										{
											color:
												comparison.volumeDiff > 0
													? COLORS.success
													: COLORS.error,
										},
									]}
								>
									{comparison.volumePercent}%
								</Text>
							)}
						</View>
					)}
				</View>
			</View>
		)
	}

	if (!visible) return null

	return (
		<Modal
			transparent
			visible={visible}
			animationType='none'
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<TouchableOpacity
					style={styles.modalBackdrop}
					activeOpacity={1}
					onPress={onClose}
				/>
				<Animated.View
					style={[
						styles.modalContainer,
						{
							top: insets.top,
						},
						{ transform: [{ translateX: slideAnim }] },
					]}
				>
					<View style={styles.header}>
						<View style={styles.headerLeft}>
							<Ionicons name='barbell' size={24} color={COLORS.primary} />
							<Text style={styles.headerTitle} numberOfLines={1}>
								{exerciseName}
							</Text>
						</View>
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<Ionicons name='close' size={24} color={COLORS.text} />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.content}>
						{isLoading ? (
							<View style={styles.loadingContainer}>
								<Ionicons name='barbell' size={48} color={COLORS.primary} />
								<Text style={styles.loadingText}>Загрузка истории...</Text>
							</View>
						) : (
							<>
								{/* Рекорды */}
								{records?.lastWorkout?.sets?.length && (
									<View style={styles.recordsSection}>
										<Text style={styles.sectionTitle}>Рекорды</Text>
										<View style={styles.recordsGrid}>
											{records.bestSet.weight > 0 && (
												<View style={styles.bestSetCard}>
													<Ionicons
														name='star'
														size={20}
														color={COLORS.warning}
													/>
													<View style={styles.bestSetInfo}>
														<Text style={styles.bestSetText}>
															Лучший подход: {records.bestSet.weight}кг ×{' '}
															{records.bestSet.reps}
														</Text>
														<Text style={styles.bestSetDate}>
															{formatDate(records.bestSet.date)}
														</Text>
													</View>
												</View>
											)}
										</View>
									</View>
								)}

								{/* Сравнение с последней тренировкой */}
								{records?.lastWorkout?.sets?.length > 0 &&
									currentSets.length && (
										<View style={styles.comparisonSection}>
											<View style={styles.sectionHeader}>
												<Text style={styles.sectionTitle}>
													Сравнение ({formatDate(records.lastWorkout.date)})
												</Text>
											</View>

											{currentSets.map((set, index) => (
												<View key={index}>
													{renderSetComparison(index, set)}
												</View>
											))}

											{/* Общее сравнение объема */}
											{currentSets.length > 0 && (
												<View style={styles.totalVolumeComparison}>
													<View style={styles.volumeItem}>
														<Text style={styles.volumeLabel}>
															Прошлый объем:
														</Text>
														<Text style={styles.volumeValue}>
															{records.lastWorkout.totalVolume}кг
														</Text>
													</View>
													<View style={styles.volumeItem}>
														<Text style={styles.volumeLabel}>
															Текущий объем:
														</Text>
														<Text style={styles.volumeValue}>
															{currentSets.reduce(
																(sum, set) => sum + set.weight * set.reps,
																0,
															)}
															кг
														</Text>
													</View>
												</View>
											)}
										</View>
									)}

								{/* История тренировок */}
								{history.length > 0 && (
									<View style={styles.historySection}>
										<Text style={styles.sectionTitle}>История тренировок</Text>
										{history.map((workout, index) => (
											<View key={index} style={styles.historyItem}>
												<View style={styles.historyHeader}>
													<Text style={styles.historyDate}>
														{formatDate(workout.date)} {workout.time}
													</Text>
													<Text style={styles.historyVolume}>
														{workout.totalVolume}кг
													</Text>
												</View>

												<View style={styles.historySets}>
													{workout.sets.map((set: any, setIndex: number) => (
														<View key={setIndex} style={styles.historySet}>
															<Text style={styles.setNumberSmall}>
																{set.set_number}
															</Text>
															<Text style={styles.setDetails}>
																{set.weight}кг × {set.reps}
															</Text>
															<Text style={styles.setVolume}>
																{set.weight * set.reps}кг
															</Text>
														</View>
													))}
												</View>
											</View>
										))}
									</View>
								)}
							</>
						)}
					</ScrollView>
				</Animated.View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalBackdrop: {
		...StyleSheet.absoluteFillObject,
	},
	modalContainer: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		width: SCREEN_WIDTH * 0.9,
		backgroundColor: '#121212',
		borderLeftWidth: 1,
		borderLeftColor: COLORS.border,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: COLORS.card,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
		marginLeft: 12,
		flex: 1,
	},
	closeButton: {
		padding: 4,
	},
	content: {
		flex: 1,
		padding: 16,
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 40,
	},
	loadingText: {
		fontSize: 16,
		color: COLORS.textSecondary,
		marginTop: 16,
	},
	recordsSection: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 12,
	},
	recordsGrid: {
		flexDirection: 'row',
		gap: 12,
	},
	recordCard: {
		width: (SCREEN_WIDTH * 0.9 - 54) / 3,
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	recordValue: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.text,
		marginTop: 8,
		marginBottom: 4,
	},
	recordLabel: {
		fontSize: 12,
		color: COLORS.textSecondary,
	},
	bestSetCard: {
		width: '100%',
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.border,
		marginTop: 8,
	},
	bestSetInfo: {
		marginLeft: 12,
		flex: 1,
	},
	bestSetText: {
		fontSize: 14,
		color: COLORS.text,
		fontWeight: '500',
	},
	bestSetDate: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	comparisonSection: {
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	setComparisonRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255, 255, 255, 0.1)',
	},
	setNumber: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	setNumberText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: COLORS.background,
	},
	comparisonValues: {
		flex: 1,
	},
	comparisonItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 4,
	},
	comparisonLabel: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	comparisonValue: {
		fontSize: 14,
		fontWeight: '500',
		color: COLORS.text,
	},
	differenceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 8,
		flexWrap: 'wrap',
		gap: 8,
	},
	differenceLabel: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginRight: 8,
	},
	comparisonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		gap: 4,
	},
	comparisonText: {
		fontSize: 11,
		fontWeight: '600',
	},
	volumePercent: {
		fontSize: 11,
		fontWeight: '600',
		marginLeft: 8,
	},
	totalVolumeComparison: {},
	volumeItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	volumeLabel: {
		fontSize: 14,
		color: COLORS.text,
	},
	volumeValue: {
		fontSize: 14,
		fontWeight: 'bold',
		color: COLORS.primary,
	},
	historySection: {
		marginBottom: 24,
	},
	historyItem: {
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	historyHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	historyDate: {
		fontSize: 14,
		fontWeight: '500',
		color: COLORS.text,
	},
	historyVolume: {
		fontSize: 14,
		fontWeight: 'bold',
		color: COLORS.primary,
	},
	historySets: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	historySet: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.cardLight,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		marginRight: 8,
		marginBottom: 8,
	},
	setNumberSmall: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginRight: 8,
		fontWeight: '500',
	},
	setDetails: {
		fontSize: 12,
		color: COLORS.text,
		fontWeight: '500',
		marginRight: 8,
	},
	setVolume: {
		fontSize: 12,
		color: COLORS.primary,
		fontWeight: '600',
	},
})

export default ExerciseHistoryModal
