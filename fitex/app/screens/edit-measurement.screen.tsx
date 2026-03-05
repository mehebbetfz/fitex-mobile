import * as db from '@/scripts/database'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const MEASUREMENT_TYPES = [
	{ name: 'Вес', unit: 'кг', icon: 'scale' },
	{ name: 'Грудь', unit: 'см', icon: 'body' },
	{ name: 'Талия', unit: 'см', icon: 'body' },
	{ name: 'Бедра', unit: 'см', icon: 'body' },
	{ name: 'Бицепс', unit: 'см', icon: 'body' },
	{ name: 'Шея', unit: 'см', icon: 'body' },
	{ name: 'Икры', unit: 'см', icon: 'body' },
	{ name: 'Плечо', unit: 'см', icon: 'body' },
	{ name: 'Жир', unit: '%', icon: 'water' },
	{ name: 'Мышцы', unit: 'кг', icon: 'fitness' },
]

export default function EditMeasurementScreen() {
	const router = useRouter()
	const { id } = useLocalSearchParams<{ id: string }>()

	const [selectedType, setSelectedType] = useState(MEASUREMENT_TYPES[0])
	const [value, setValue] = useState('')
	const [date, setDate] = useState('')
	const [goal, setGoal] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (id) {
			loadMeasurementData()
		}
	}, [id])

	const loadMeasurementData = async () => {
		try {
			setLoading(true)
			// Здесь должна быть функция getMeasurementById
			// Пока используем заглушку
			// const measurement = await db.getMeasurementById(parseInt(id))

			// Для примера загружаем все замеры и находим нужный
			const measurements = await db.getBodyMeasurements()
			const measurement = measurements.find(m => m.id?.toString() === id)

			if (measurement) {
				setValue(measurement.value.toString())
				setDate(measurement.date)
				setGoal(measurement.goal?.toString() || '')

				// Находим соответствующий тип
				const type = MEASUREMENT_TYPES.find(t => t.name === measurement.name)
				if (type) {
					setSelectedType(type)
				}
			}
		} catch (error) {
			console.error('Error loading measurement:', error)
			Alert.alert('Ошибка', 'Не удалось загрузить данные замера')
		} finally {
			setLoading(false)
		}
	}

	const handleUpdate = async () => {
		if (!value.trim()) {
			Alert.alert('Ошибка', 'Введите значение измерения')
			return
		}

		try {
			const measurementId = parseInt(id)

			// Рассчитываем тренд на основе предыдущих значений
			const measurements = await db.getBodyMeasurements()
			const previousForType = measurements
				.filter(m => m.name === selectedType.name && m.id !== measurementId)
				.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
				)[0]

			let trend: 'up' | 'down' | 'stable' = 'stable'
			if (previousForType) {
				const currentValue = parseFloat(value)
				if (currentValue > previousForType.value) {
					trend = 'up'
				} else if (currentValue < previousForType.value) {
					trend = 'down'
				}
			}

			await db.updateBodyMeasurement(measurementId, {
				name: selectedType.name,
				value: parseFloat(value),
				unit: selectedType.unit,
				date: date,
				trend,
				goal: goal ? parseFloat(goal) : undefined,
			})

			Alert.alert('Успех', 'Замер обновлен!', [
				{ text: 'OK', onPress: () => router.back() },
			])
		} catch (error) {
			console.error('Error updating measurement:', error)
			Alert.alert('Ошибка', 'Не удалось обновить замер')
		}
	}

	const handleDelete = async () => {
		Alert.alert('Удаление', 'Вы уверены, что хотите удалить этот замер?', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Удалить',
				style: 'destructive',
				onPress: async () => {
					try {
						const measurementId = parseInt(id)
						// Здесь должна быть функция deleteBodyMeasurement
						// await db.deleteBodyMeasurement(measurementId)

						Alert.alert('Успех', 'Замер удален!', [
							{ text: 'OK', onPress: () => router.back() },
						])
					} catch (error) {
						console.error('Error deleting measurement:', error)
						Alert.alert('Ошибка', 'Не удалось удалить замер')
					}
				},
			},
		])
	}

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color='#34C759' />
					<Text style={styles.loadingText}>Загрузка данных...</Text>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Заголовок */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Ionicons name='arrow-back' size={24} color='#FFFFFF' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Редактировать замер</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Выбор типа замера */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Тип замера</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.typesScroll}
					>
						<View style={styles.typesContainer}>
							{MEASUREMENT_TYPES.map((type, index) => (
								<TouchableOpacity
									key={index}
									style={[
										styles.typeButton,
										selectedType.name === type.name &&
											styles.selectedTypeButton,
									]}
									onPress={() => setSelectedType(type)}
								>
									<Ionicons
										name={type.icon as any}
										size={24}
										color={
											selectedType.name === type.name ? '#FFFFFF' : '#8E8E93'
										}
									/>
									<Text
										style={[
											styles.typeText,
											selectedType.name === type.name &&
												styles.selectedTypeText,
										]}
									>
										{type.name}
									</Text>
									<Text style={styles.typeUnit}>{type.unit}</Text>
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
				</View>

				{/* Ввод значения */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Значение</Text>
					<View style={styles.valueContainer}>
						<TextInput
							style={styles.valueInput}
							value={value}
							onChangeText={setValue}
							placeholder='Введите значение'
							placeholderTextColor='#8E8E93'
							keyboardType='numeric'
							autoFocus
						/>
						<Text style={styles.unitText}>{selectedType.unit}</Text>
					</View>
				</View>

				{/* Дата */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Дата замера</Text>
					<TextInput
						style={styles.dateInput}
						value={date}
						onChangeText={setDate}
						placeholder='YYYY-MM-DD'
						placeholderTextColor='#8E8E93'
					/>
					<Text style={styles.dateHint}>Формат: ГГГГ-ММ-ДД</Text>
				</View>

				{/* Цель */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Цель</Text>
					<View style={styles.valueContainer}>
						<TextInput
							style={styles.valueInput}
							value={goal}
							onChangeText={setGoal}
							placeholder='Целевое значение'
							placeholderTextColor='#8E8E93'
							keyboardType='numeric'
						/>
						<Text style={styles.unitText}>{selectedType.unit}</Text>
					</View>
				</View>

				{/* Кнопки */}
				<View style={styles.buttonsContainer}>
					<TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
						<Text style={styles.updateButtonText}>Обновить замер</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
						<Ionicons name='trash' size={20} color='#FF3B30' />
						<Text style={styles.deleteButtonText}>Удалить замер</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#121212',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 12,
		color: '#FFFFFF',
		fontSize: 16,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#2C2C2E',
	},
	backButton: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	placeholder: {
		width: 32,
	},
	content: {
		padding: 20,
		paddingBottom: 40,
	},
	section: {
		marginBottom: 30,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 12,
	},
	typesScroll: {
		marginHorizontal: -20,
	},
	typesContainer: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		gap: 12,
	},
	typeButton: {
		backgroundColor: '#1E1E1E',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		minWidth: 100,
	},
	selectedTypeButton: {
		backgroundColor: '#34C759',
	},
	typeText: {
		fontSize: 14,
		color: '#8E8E93',
		marginTop: 8,
		marginBottom: 4,
	},
	selectedTypeText: {
		color: '#FFFFFF',
	},
	typeUnit: {
		fontSize: 12,
		color: '#8E8E93',
	},
	valueContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1E1E1E',
		borderRadius: 12,
		paddingHorizontal: 16,
	},
	valueInput: {
		flex: 1,
		paddingVertical: 16,
		fontSize: 24,
		color: '#FFFFFF',
	},
	unitText: {
		fontSize: 24,
		color: '#8E8E93',
		marginLeft: 8,
	},
	dateInput: {
		backgroundColor: '#1E1E1E',
		borderRadius: 12,
		padding: 16,
		fontSize: 16,
		color: '#FFFFFF',
		marginBottom: 8,
	},
	dateHint: {
		fontSize: 12,
		color: '#8E8E93',
		marginLeft: 4,
	},
	buttonsContainer: {
		marginTop: 20,
		gap: 12,
	},
	updateButton: {
		backgroundColor: '#34C759',
		borderRadius: 12,
		paddingVertical: 18,
		alignItems: 'center',
	},
	updateButtonText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	deleteButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#FF3B30',
		borderRadius: 12,
		paddingVertical: 18,
		gap: 8,
	},
	deleteButtonText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FF3B30',
	},
})
