import {
	manBackMuscleGroupParts,
	manFrontMuscleGroupParts,
} from '@/constants/images'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
	Alert,
	Dimensions,
	FlatList,
	Image,
	Linking,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDatabase } from '../contexts/database-context'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Константы для цветов
const COLORS = {
	primary: '#34C759',
	background: '#000',
	card: '#1C1C1E',
	border: '#2C2C2E',
	text: '#FFFFFF',
	textSecondary: '#8E8E93',
	error: '#FF3B30',
	warning: '#FFCC00',
	success: '#34C759',
} as const

// Типы
interface ExerciseDetail {
	id: string
	name: string
	description: string
	image: any
	videoUrl?: string
	primaryMuscles: string[]
	secondaryMuscles: string[]
	tips: string[]
	equipment: string[]
	difficulty: 'Начинающий' | 'Средний' | 'Продвинутый'
}

interface MuscleSubgroup {
	id: string
	name: string
	image: any
	exercises: ExerciseDetail[]
}

interface MuscleGroup {
	id: string
	name: string
	image: any
	subgroups: MuscleSubgroup[]
}

// Данные для выбора упражнений
const MUSCLE_GROUPS: MuscleGroup[] = [
	{
		id: 'chest',
		name: 'Грудь',
		image: manFrontMuscleGroupParts.rectoralFull,
		subgroups: [
			{
				id: 'chest-upper',
				name: 'Верх груди',
				image: manFrontMuscleGroupParts.pectoralisMajor,
				exercises: [
					{
						id: 'incline-bench-press',
						name: 'Жим штанги на наклонной скамье',
						description:
							'Базовое упражнение для развития верхней части грудных мышц. Идеально подходит для формирования верхнего края грудной клетки.',
						image: manFrontMuscleGroupParts.pectoralisMajor,
						videoUrl: 'https://www.youtube.com/watch?v=SrqOu55lrYU',
						primaryMuscles: ['Верх груди'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						tips: [
							'Угол наклона скамьи 30-45 градусов',
							'Сводите лопатки во время выполнения',
							'Опускайте штангу к верхней части груди',
							'Не выгибайте поясницу',
							'Выжимайте штангу по прямой траектории',
						],
						equipment: ['Штанга', 'Наклонная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'incline-dumbbell-press',
						name: 'Жим гантелей на наклонной',
						description:
							'Упражнение для глубокой проработки верхней части грудных мышц с большей амплитудой движения.',
						image: manFrontMuscleGroupParts.pectoralisMajor,
						videoUrl: 'https://www.youtube.com/watch?v=0G2_XV7slIg',
						primaryMuscles: ['Верх груди'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						tips: [
							'Локти под углом 45 градусов к туловищу',
							'Гантели движутся по дуге',
							'В верхней точке сводите гантели вместе',
							'Контролируйте движение в негативной фазе',
						],
						equipment: ['Гантели', 'Наклонная скамья'],
						difficulty: 'Начинающий',
					},
				],
			},
			{
				id: 'chest-middle',
				name: 'Середина груди',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'flat-bench-press',
						name: 'Жим штанги лежа',
						description:
							'Классическое базовое упражнение для развития грудных мышц. Основное упражнение в пауэрлифтинге.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
						primaryMuscles: ['Середина груди'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						tips: [
							'Лопатки сведены и опущены',
							'Ширина хвата чуть шире плеч',
							'Опускайте штангу к середине груди',
							'Ноги плотно упираются в пол',
							'Не отрывайте ягодицы от скамьи',
						],
						equipment: ['Штанга', 'Горизонтальная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'dumbbell-fly',
						name: 'Разведение гантелей лежа',
						description:
							'Изолирующее упражнение для растяжки и детализации грудных мышц.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
						primaryMuscles: ['Середина груди'],
						secondaryMuscles: ['Передние дельты'],
						tips: [
							'Сохраняйте легкий сгиб в локтях',
							'Опускайте гантели до уровня груди',
							'Не используйте слишком большой вес',
							'Фокусируйтесь на растяжении мышц',
						],
						equipment: ['Гантели', 'Горизонтальная скамья'],
						difficulty: 'Начинающий',
					},
				],
			},
			{
				id: 'chest-lower',
				name: 'Низ груди',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'decline-bench-press',
						name: 'Жим штанги на скамье с отрицательным наклоном',
						description:
							'Упражнение для акцентированной проработки нижней части грудных мышц.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=LfyQBUKR8SE',
						primaryMuscles: ['Низ груди'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						tips: [
							'Угол наклона 15-30 градусов',
							'Хват чуть шире плеч',
							'Опускайте штангу к нижней части груди',
							'Надежно закрепляйтесь ногами',
						],
						equipment: ['Штанга', 'Скамья с отрицательным наклоном'],
						difficulty: 'Средний',
					},
					{
						id: 'dips',
						name: 'Отжимания на брусьях',
						description:
							'Эффективное упражнение для развития нижней части груди и трицепсов.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
						primaryMuscles: ['Низ груди', 'Трицепс'],
						secondaryMuscles: ['Передние дельты'],
						tips: [
							'Наклоняйте корпус вперед для акцента на грудь',
							'Опускайтесь до угла 90 градусов в локтях',
							'Не раскачивайтесь',
							'Для груди используйте широкие брусья',
						],
						equipment: ['Брусья'],
						difficulty: 'Продвинутый',
					},
				],
			},
		],
	},
	{
		id: 'shoulders',
		name: 'Плечи',
		image: manFrontMuscleGroupParts.deltoidsFull,
		subgroups: [
			{
				id: 'front-delts',
				name: 'Передние дельты',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'overhead-press',
						name: 'Жим штанги стоя/сидя',
						description: 'Базовое упражнение для развития дельтовидных мышц.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
						primaryMuscles: ['Передние дельты'],
						secondaryMuscles: ['Средние дельты', 'Трицепс', 'Верх груди'],
						tips: [
							'Локти под грифом',
							'Выжимайте штангу над головой',
							'Не прогибайтесь в пояснице',
							'В нижней точке штанга у подбородка',
						],
						equipment: ['Штанга'],
						difficulty: 'Средний',
					},
					{
						id: 'front-raise',
						name: 'Подъемы штанги/гантелей перед собой',
						description: 'Изолирующее упражнение для передних пучков дельт.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=-t7fuZ0KhDA',
						primaryMuscles: ['Передние дельты'],
						secondaryMuscles: ['Средние дельты'],
						tips: [
							'Небольшой сгиб в локтях',
							'Поднимайте до уровня плеч',
							'Не используйте инерцию',
							'Контролируйте опускание',
						],
						equipment: ['Гантели', 'Штанга'],
						difficulty: 'Начинающий',
					},
				],
			},
			{
				id: 'middle-delts',
				name: 'Средние дельты',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'lateral-raise',
						name: 'Разведение гантелей в стороны',
						description: 'Лучшее упражнение для развития ширины плеч.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
						primaryMuscles: ['Средние дельты'],
						secondaryMuscles: ['Передние дельты'],
						tips: [
							'Немного согнутые локти',
							'Поднимайте до уровня плеч',
							'Кисти в нейтральном положении',
							'Не раскачивайте корпус',
							'Используйте умеренный вес',
						],
						equipment: ['Гантели'],
						difficulty: 'Начинающий',
					},
				],
			},
			{
				id: 'rear-delts',
				name: 'Задние дельты',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'face-pull',
						name: 'Тяга к лицу',
						description:
							'Упражнение для развития задних дельт и улучшения осанки.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
						primaryMuscles: ['Задние дельты'],
						secondaryMuscles: ['Трапеции', 'Ромбовидные'],
						tips: [
							'Используйте канатную рукоять',
							'Тяните к переносице',
							'Разводите локти в стороны',
							'Сводите лопатки',
						],
						equipment: ['Верхний блок с канатом'],
						difficulty: 'Начинающий',
					},
				],
			},
		],
	},
	{
		id: 'arms',
		name: 'Руки',
		image: manFrontMuscleGroupParts.armFull,
		subgroups: [
			{
				id: 'biceps',
				name: 'Бицепс',
				image: manFrontMuscleGroupParts.bicepsFull,
				exercises: [
					{
						id: 'bicep-curl',
						name: 'Подъем штанги на бицепс',
						description: 'Классическое упражнение для развития бицепса.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
						primaryMuscles: ['Бицепс'],
						secondaryMuscles: ['Предплечья'],
						tips: [
							'Локти прижаты к туловищу',
							'Поднимайте штангу до уровня плеч',
							'Не раскачивайте корпус',
							'Контролируйте опускание',
						],
						equipment: ['Штанга'],
						difficulty: 'Начинающий',
					},
					{
						id: 'hammer-curl',
						name: 'Молотковые сгибания',
						description: 'Упражнение для развития брахиалиса и предплечий.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=TwD-YGVP4Bk',
						primaryMuscles: ['Брахиалис', 'Бицепс'],
						secondaryMuscles: ['Предплечья'],
						tips: [
							'Нейтральный хват (ладони друг к другу)',
							'Локти неподвижны',
							'Поднимайте гантели до уровня плеч',
							'Не используйте инерцию',
						],
						equipment: ['Гантели'],
						difficulty: 'Начинающий',
					},
				],
			},
			{
				id: 'triceps',
				name: 'Трицепс',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'tricep-pushdown',
						name: 'Разгибания на блоке',
						description: 'Изолирующее упражнение для развития трицепса.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: [],
						tips: [
							'Локти прижаты к туловищу',
							'Разгибайте руки до конца',
							'Не наклоняйтесь вперед',
							'Контролируйте сгибание',
						],
						equipment: ['Верхний блок с прямой рукоятью'],
						difficulty: 'Начинающий',
					},
					{
						id: 'skull-crusher',
						name: 'Французский жим лежа',
						description: 'Упражнение для длинной головки трицепса.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: [],
						tips: [
							'Локти направлены в потолок',
							'Опускайте штангу ко лбу',
							'Не разводите локти в стороны',
							'Используйте умеренный вес',
						],
						equipment: ['Штанга EZ', 'Скамья'],
						difficulty: 'Средний',
					},
				],
			},
		],
	},
	{
		id: 'abs',
		name: 'Пресс',
		image: manFrontMuscleGroupParts.pressFull,
		subgroups: [
			{
				id: 'upper-abs',
				name: 'Верхний пресс',
				image: manFrontMuscleGroupParts.upperAbs,
				exercises: [
					{
						id: 'crunch',
						name: 'Скручивания',
						description:
							'Базовое упражнение для развития верхней части пресса.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
						primaryMuscles: ['Верхний пресс'],
						secondaryMuscles: [],
						tips: [
							'Подбородок прижат к груди',
							'Отрывайте только лопатки от пола',
							'Выдох на усилии',
							'Не тяните себя за шею',
						],
						equipment: ['Коврик'],
						difficulty: 'Начинающий',
					},
				],
			},
			{
				id: 'lower-abs',
				name: 'Нижний пресс',
				image: manFrontMuscleGroupParts.lowerAbs,
				exercises: [
					{
						id: 'leg-raise',
						name: 'Подъемы ног',
						description: 'Упражнение для развития нижней части пресса.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
						primaryMuscles: ['Нижний пресс'],
						secondaryMuscles: ['Верхний пресс'],
						tips: [
							'Поясница прижата к пол',
							'Поднимайте ноги до вертикали',
							'Опускайте медленно, не касаясь пола',
							'Не раскачивайтесь',
						],
						equipment: ['Коврик', 'Скамья'],
						difficulty: 'Средний',
					},
				],
			},
		],
	},
	{
		id: 'back',
		name: 'Спина',
		image: manBackMuscleGroupParts.spineFull,
		subgroups: [
			{
				id: 'lats',
				name: 'Широчайшие',
				image: manBackMuscleGroupParts.spineFull,
				exercises: [
					{
						id: 'pull-ups',
						name: 'Подтягивания',
						description:
							'Базовое упражнение для развития широчайших мышц спины.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
						primaryMuscles: ['Широчайшие', 'Бицепс'],
						secondaryMuscles: ['Трапеции', 'Ромбовидные', 'Предплечья'],
						tips: [
							'Широкий хват для акцента на спину',
							'Подтягивайтесь к груди, а не к подбородку',
							'Полностью разгибайте руки в нижней точке',
							'Не раскачивайтесь',
						],
						equipment: ['Турник'],
						difficulty: 'Средний',
					},
					{
						id: 'lat-pulldown',
						name: 'Тяга верхнего блока',
						description: 'Упражнение для развития широчайших мышц спины.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
						primaryMuscles: ['Широчайшие'],
						secondaryMuscles: ['Бицепс', 'Трапеции'],
						tips: [
							'Тяните рукоять к груди, а не за голову',
							'Сводите лопатки в нижней точке',
							'Не отклоняйтесь сильно назад',
							'Контролируйте вес в негативной фазе',
						],
						equipment: ['Верхний блок'],
						difficulty: 'Начинающий',
					},
				],
			},
			{
				id: 'traps',
				name: 'Трапеции',
				image: manBackMuscleGroupParts.spineFull,
				exercises: [
					{
						id: 'shrugs',
						name: 'Шраги со штангой',
						description: 'Упражнение для развития трапециевидных мышц.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=gZb2y_4Xo4Q',
						primaryMuscles: ['Трапеции'],
						secondaryMuscles: ['Предплечья'],
						tips: [
							'Держите руки прямыми',
							'Поднимайте плечи как можно выше',
							'Задерживайтесь в верхней точке',
							'Не вращайте плечами',
						],
						equipment: ['Штанга'],
						difficulty: 'Начинающий',
					},
				],
			},
		],
	},
	{
		id: 'legs',
		name: 'Ноги',
		image: manFrontMuscleGroupParts.upperLegFull,
		subgroups: [
			{
				id: 'quads',
				name: 'Квадрицепсы',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'squat',
						name: 'Приседания со штангой',
						description:
							'Король всех упражнений для развития ног и всего тела.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=SW_C1A-rejs',
						primaryMuscles: ['Квадрицепсы', 'Ягодицы'],
						secondaryMuscles: ['Бицепс бедра', 'Икры', 'Пресс', 'Спина'],
						tips: [
							'Глубина до параллели или ниже',
							'Спина прямая',
							'Колени не выходят за носки',
							'Пятки прижаты к пол',
							'Дыхание: вдох внизу, выдох вверху',
						],
						equipment: ['Штанга', 'Стойка'],
						difficulty: 'Продвинутый',
					},
					{
						id: 'leg-press',
						name: 'Жим ногами',
						description:
							'Эффективное упражнение для квадрицепсов с минимальной нагрузкой на спину.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
						primaryMuscles: ['Квадрицепсы', 'Ягодицы'],
						secondaryMuscles: ['Бицепс бедра'],
						tips: [
							'Ноги на ширине плеч',
							'Не разгибайте колени полностью',
							'Опускайте платформу до угла 90 градусов',
							'Не отрывайте поясницу от спинки',
						],
						equipment: ['Тренажер для жима ногами'],
						difficulty: 'Начинающий',
					},
				],
			},
			{
				id: 'hamstrings',
				name: 'Бицепс бедра',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'leg-curl',
						name: 'Сгибания ног лежа',
						description: 'Изолирующее упражнение для бицепса бедра.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
						primaryMuscles: ['Бицепс бедра'],
						secondaryMuscles: ['Икры'],
						tips: [
							'Плотно прижмите бедра к скамье',
							'Сгибайте ноги до касания валиками ягодиц',
							'Контролируйте движение в негативной фазе',
							'Не используйте инерцию',
						],
						equipment: ['Тренажер для сгибания ног'],
						difficulty: 'Начинающий',
					},
					{
						id: 'deadlift',
						name: 'Становая тяга',
						description:
							'Базовое упражнение для развития задней поверхности бедра и спины.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=r4MzxtBKyNE',
						primaryMuscles: ['Бицепс бедра', 'Спина', 'Ягодицы'],
						secondaryMuscles: ['Трапеции', 'Предплечья', 'Квадрицепсы'],
						tips: [
							'Спина прямая на протяжении всего движения',
							'Штанга скользит по ногам',
							'Взрывное движение вверх',
							'Опускание под контролем',
							'Используйте лямки при большом весе',
						],
						equipment: ['Штанга'],
						difficulty: 'Продвинутый',
					},
				],
			},
			{
				id: 'calves',
				name: 'Икры',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'calf-raise',
						name: 'Подъемы на носки стоя',
						description: 'Упражнение для развития икроножных мышц.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
						videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
						primaryMuscles: ['Икры'],
						secondaryMuscles: [],
						tips: [
							'Полная амплитуда движения',
							'Задерживайтесь в верхней точке',
							'Растягивайте икры в нижней точке',
							'Не сгибайте колени',
						],
						equipment: ['Тренажер для икр', 'Штанга'],
						difficulty: 'Начинающий',
					},
				],
			},
		],
	},
]
interface Exercise {
	id?: number
	name: string
	muscleGroup: string
	sets: ExerciseSet[]
	collapsed: boolean
	order_index: number
}

interface ExerciseSet {
	id?: number
	setNumber: number
	weight: number
	reps: number
	completed: boolean
}

type ScreenType = 'muscleGroups' | 'subgroups' | 'exercises' | 'exerciseDetail'

export default function ExerciseSelectionScreen() {
	const router = useRouter()
	const params = useLocalSearchParams<{
		workoutId: string
		onGoBack?: 'reload'
	}>()

	const { addExerciseToWorkout, getActiveExercises, getActiveSets } =
		useDatabase()

	const [exercises, setExercises] = useState<Exercise[]>([])
	const [currentScreen, setCurrentScreen] = useState<ScreenType>('muscleGroups')
	const [selectedMuscleGroup, setSelectedMuscleGroup] =
		useState<MuscleGroup | null>(null)
	const [selectedSubgroup, setSelectedSubgroup] =
		useState<MuscleSubgroup | null>(null)
	const [selectedExercise, setSelectedExercise] =
		useState<ExerciseDetail | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [favorites, setFavorites] = useState<string[]>([])
	const [recentExercises, setRecentExercises] = useState<ExerciseDetail[]>([])
	const [activeTab, setActiveTab] = useState<
		'groups' | 'search' | 'favorites' | 'recent'
	>('groups')

	// Фильтрация упражнений по поисковому запросу
	const filteredExercises = useMemo(() => {
		if (!searchQuery) {
			return []
		}

		const query = searchQuery.toLowerCase()
		return MUSCLE_GROUPS.flatMap(group =>
			group.subgroups.flatMap(subgroup =>
				subgroup.exercises.filter(
					exercise =>
						exercise.name.toLowerCase().includes(query) ||
						exercise.description.toLowerCase().includes(query) ||
						exercise.primaryMuscles.some(muscle =>
							muscle.toLowerCase().includes(query),
						) ||
						exercise.equipment.some(eq => eq.toLowerCase().includes(query)),
				),
			),
		)
	}, [searchQuery])

	// Добавление упражнения в историю
	const addToRecent = (exercise: ExerciseDetail) => {
		setRecentExercises(prev => {
			const filtered = prev.filter(e => e.id !== exercise.id)
			return [exercise, ...filtered].slice(0, 10) // Храним последние 10
		})
	}

	// Переключение избранного
	const toggleFavorite = (exerciseId: string) => {
		setFavorites(prev =>
			prev.includes(exerciseId)
				? prev.filter(id => id !== exerciseId)
				: [...prev, exerciseId],
		)
	}

	const loadExercises = async () => {
		if (!params.workoutId) return

		try {
			const activeExercises = await getActiveExercises(
				parseInt(params.workoutId),
			)

			const exercisesWithSets = await Promise.all(
				activeExercises.map(async (ex: any) => {
					const sets = await getActiveSets(ex.id)
					return {
						id: ex.id,
						name: ex.name,
						muscleGroup: ex.muscle_group,
						sets: sets.map((set: any) => ({
							id: set.id,
							setNumber: set.set_number,
							weight: set.weight,
							reps: set.reps,
							completed: set.completed === 1,
						})),
						collapsed: ex.collapsed === 1,
						order_index: ex.order_index,
					}
				}),
			)

			exercisesWithSets.sort((a, b) => a.order_index - b.order_index)
			setExercises(exercisesWithSets)
		} catch (error) {
			console.error('Error loading exercises:', error)
		}
	}

	// Добавление упражнения в тренировку
	const handleAddExercise = async () => {
		if (!selectedExercise || !params.workoutId) return

		try {
			console.log('Worcout id: ' + params.workoutId)

			await loadExercises()
			// Добавьте здесь логику добавления упражнения через ваш database context
			await addExerciseToWorkout(parseInt(params.workoutId), {
				name: selectedExercise.name,
				muscle_group: selectedMuscleGroup?.name || '',
				order_index: exercises.length + 1,
				collapsed: true,
			})

			// Добавляем в историю
			addToRecent(selectedExercise)

			// Возвращаемся назад с флагом перезагрузки
			router.back()
		} catch (error) {
			console.error('Error adding exercise:', error)
			Alert.alert('Ошибка', 'Не удалось добавить упражнение')
		}
	}

	// Открытие видео
	const handleOpenVideo = (url: string) => {
		Linking.openURL(url).catch(err =>
			Alert.alert('Ошибка', 'Не удалось открыть видео'),
		)
	}

	// Навигация назад
	const handleBack = () => {
		if (currentScreen === 'muscleGroups') {
			router.back()
		} else if (currentScreen === 'subgroups') {
			setCurrentScreen('muscleGroups')
			setSelectedMuscleGroup(null)
		} else if (currentScreen === 'exercises') {
			setCurrentScreen('subgroups')
			setSelectedSubgroup(null)
		} else if (currentScreen === 'exerciseDetail') {
			setCurrentScreen('exercises')
			setSelectedExercise(null)
		}
	}

	// Рендер табов
	const renderTabs = () => (
		<View style={styles.tabsContainer}>
			<TouchableOpacity
				style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
				onPress={() => setActiveTab('groups')}
			>
				<Ionicons
					name='apps-outline'
					size={20}
					color={activeTab === 'groups' ? COLORS.primary : COLORS.textSecondary}
				/>
				<Text
					style={[
						styles.tabText,
						activeTab === 'groups' && styles.activeTabText,
					]}
				>
					Группы
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.tab, activeTab === 'search' && styles.activeTab]}
				onPress={() => setActiveTab('search')}
			>
				<Ionicons
					name='search-outline'
					size={20}
					color={activeTab === 'search' ? COLORS.primary : COLORS.textSecondary}
				/>
				<Text
					style={[
						styles.tabText,
						activeTab === 'search' && styles.activeTabText,
					]}
				>
					Поиск
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
				onPress={() => setActiveTab('favorites')}
			>
				<Ionicons
					name='heart-outline'
					size={20}
					color={
						activeTab === 'favorites' ? COLORS.primary : COLORS.textSecondary
					}
				/>
				<Text
					style={[
						styles.tabText,
						activeTab === 'favorites' && styles.activeTabText,
					]}
				>
					Избранное
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
				onPress={() => setActiveTab('recent')}
			>
				<Ionicons
					name='time-outline'
					size={20}
					color={activeTab === 'recent' ? COLORS.primary : COLORS.textSecondary}
				/>
				<Text
					style={[
						styles.tabText,
						activeTab === 'recent' && styles.activeTabText,
					]}
				>
					Недавние
				</Text>
			</TouchableOpacity>
		</View>
	)

	// Рендер поиска
	const renderSearch = () => (
		<View style={styles.searchContainer}>
			<Ionicons name='search' size={20} color={COLORS.textSecondary} />
			<TextInput
				style={styles.searchInput}
				placeholder='Поиск упражнений...'
				placeholderTextColor={COLORS.textSecondary}
				value={searchQuery}
				onChangeText={setSearchQuery}
				autoFocus={activeTab === 'search'}
			/>
			{searchQuery.length > 0 && (
				<TouchableOpacity onPress={() => setSearchQuery('')}>
					<Ionicons
						name='close-circle'
						size={20}
						color={COLORS.textSecondary}
					/>
				</TouchableOpacity>
			)}
		</View>
	)

	// Рендер групп мышц
	const renderMuscleGroups = () => (
		<FlatList
			data={MUSCLE_GROUPS}
			keyExtractor={item => item.id}
			numColumns={2}
			columnWrapperStyle={styles.columnWrapper}
			contentContainerStyle={styles.muscleGroupsGrid}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => (
				<TouchableOpacity
					style={styles.muscleGroupCard}
					onPress={() => {
						setSelectedMuscleGroup(item)
						setCurrentScreen('subgroups')
					}}
				>
					<View style={styles.muscleGroupImageContainer}>
						<Image source={item.image} style={styles.muscleGroupImage} />
					</View>
					<Text style={styles.muscleGroupName}>{item.name}</Text>
					<Text style={styles.muscleGroupCount}>
						{item.subgroups.length} подгрупп
					</Text>
				</TouchableOpacity>
			)}
		/>
	)

	// Рендер подгрупп
	const renderSubgroups = () =>
		selectedMuscleGroup && (
			<FlatList
				data={selectedMuscleGroup.subgroups}
				keyExtractor={item => item.id}
				numColumns={2}
				columnWrapperStyle={styles.columnWrapper}
				contentContainerStyle={styles.subgroupsGrid}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.muscleSubgroupCard}
						onPress={() => {
							setSelectedSubgroup(item)
							setCurrentScreen('exercises')
						}}
					>
						<View style={styles.muscleSubgroupImageContainer}>
							<Image source={item.image} style={styles.muscleSubgroupImage} />
						</View>
						<Text style={styles.muscleSubgroupName}>{item.name}</Text>
						<Text style={styles.exerciseCount}>
							{item.exercises.length} упражнений
						</Text>
					</TouchableOpacity>
				)}
			/>
		)

	// Рендер списка упражнений
	const renderExercisesList = () => {
		let exercisesToShow: ExerciseDetail[] = []

		if (activeTab === 'search') {
			exercisesToShow = filteredExercises
		} else if (activeTab === 'favorites') {
			exercisesToShow = MUSCLE_GROUPS.flatMap(group =>
				group.subgroups.flatMap(subgroup =>
					subgroup.exercises.filter(ex => favorites.includes(ex.id)),
				),
			)
		} else if (activeTab === 'recent') {
			exercisesToShow = recentExercises
		} else if (selectedSubgroup) {
			exercisesToShow = selectedSubgroup.exercises
		}

		return (
			<FlatList
				data={exercisesToShow}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.exercisesList}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.exerciseListItem}
						onPress={() => {
							setSelectedExercise(item)
							setCurrentScreen('exerciseDetail')
						}}
					>
						<Image source={item.image} style={styles.exerciseListImage} />
						<View style={styles.exerciseListContent}>
							<View style={styles.exerciseListHeader}>
								<Text style={styles.exerciseListName}>{item.name}</Text>
								<TouchableOpacity
									onPress={e => {
										e.stopPropagation()
										toggleFavorite(item.id)
									}}
								>
									<Ionicons
										name={
											favorites.includes(item.id) ? 'heart' : 'heart-outline'
										}
										size={20}
										color={
											favorites.includes(item.id)
												? COLORS.primary
												: COLORS.textSecondary
										}
									/>
								</TouchableOpacity>
							</View>
							<Text style={styles.exerciseListDescription} numberOfLines={2}>
								{item.description}
							</Text>
							<View style={styles.exerciseListTags}>
								<View style={styles.difficultyTag}>
									<Ionicons
										name={
											item.difficulty === 'Начинающий'
												? 'trending-up'
												: item.difficulty === 'Средний'
													? 'trending-up-outline'
													: 'trending-up-sharp'
										}
										size={12}
										color={COLORS.text}
									/>
									<Text style={styles.difficultyText}>{item.difficulty}</Text>
								</View>
								<View style={styles.equipmentTag}>
									<Ionicons
										name='barbell-outline'
										size={12}
										color={COLORS.text}
									/>
									<Text style={styles.equipmentText}>
										{item.equipment.length > 1
											? `${item.equipment[0]} +${item.equipment.length - 1}`
											: item.equipment[0]}
									</Text>
								</View>
							</View>
						</View>
						<Ionicons
							name='chevron-forward'
							size={20}
							color={COLORS.textSecondary}
						/>
					</TouchableOpacity>
				)}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<Ionicons
							name={
								activeTab === 'search'
									? 'search-outline'
									: activeTab === 'favorites'
										? 'heart-outline'
										: 'barbell-outline'
							}
							size={64}
							color={COLORS.textSecondary}
						/>
						<Text style={styles.emptyStateTitle}>
							{activeTab === 'search'
								? 'Ничего не найдено'
								: activeTab === 'favorites'
									? 'Нет избранных упражнений'
									: 'Нет недавних упражнений'}
						</Text>
					</View>
				}
			/>
		)
	}

	// Рендер деталей упражнения
	const renderExerciseDetail = () => {
		if (!selectedExercise) return null

		return (
			<ScrollView
				style={styles.exerciseDetailContainer}
				showsVerticalScrollIndicator={false}
			>
				{selectedExercise.videoUrl && (
					<TouchableOpacity
						style={styles.videoContainer}
						onPress={() => handleOpenVideo(selectedExercise.videoUrl!)}
						activeOpacity={0.7}
					>
						<View style={styles.videoThumbnail}>
							<Ionicons name='play-circle' size={60} color={COLORS.primary} />
							<Text style={styles.videoText}>Смотреть видео</Text>
						</View>
					</TouchableOpacity>
				)}

				<Image
					source={selectedExercise.image}
					style={styles.exerciseMainImage}
					resizeMode='cover'
				/>

				<View style={styles.exerciseHeader}>
					<View style={styles.exerciseTitleContainer}>
						<Text style={styles.exerciseDetailTitle}>
							{selectedExercise.name}
						</Text>
						<TouchableOpacity
							onPress={() => toggleFavorite(selectedExercise.id)}
						>
							<Ionicons
								name={
									favorites.includes(selectedExercise.id)
										? 'heart'
										: 'heart-outline'
								}
								size={24}
								color={
									favorites.includes(selectedExercise.id)
										? COLORS.primary
										: COLORS.textSecondary
								}
							/>
						</TouchableOpacity>
					</View>

					<Text style={styles.exerciseDetailDescriptionFull}>
						{selectedExercise.description}
					</Text>

					<View style={styles.detailStats}>
						<View style={styles.detailStat}>
							<Ionicons name='barbell' size={20} color={COLORS.primary} />
							<Text style={styles.detailStatLabel}>Сложность</Text>
							<Text style={styles.detailStatValue}>
								{selectedExercise.difficulty}
							</Text>
						</View>
						<View style={styles.detailStat}>
							<Ionicons name='construct' size={20} color={COLORS.primary} />
							<Text style={styles.detailStatLabel}>Оборудование</Text>
							<Text style={styles.detailStatValue}>
								{selectedExercise.equipment.join(', ')}
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.muscleGroupsSection}>
					<Text style={styles.sectionTitle}>Работающие мышцы</Text>
					<View style={styles.muscleGroupsGridDetail}>
						<View style={styles.muscleGroupItem}>
							<View style={styles.muscleGroupHeader}>
								<Ionicons name='star' size={16} color={COLORS.primary} />
								<Text style={styles.muscleGroupLabel}>Основные:</Text>
							</View>
							{selectedExercise.primaryMuscles.map((muscle, index) => (
								<View key={index} style={styles.muscleItem}>
									<View style={styles.muscleDot} />
									<Text style={styles.muscleText}>{muscle}</Text>
								</View>
							))}
						</View>
						{selectedExercise.secondaryMuscles.length > 0 && (
							<View style={styles.muscleGroupItem}>
								<View style={styles.muscleGroupHeader}>
									<Ionicons
										name='star-outline'
										size={16}
										color={COLORS.textSecondary}
									/>
									<Text style={styles.muscleGroupLabel}>Второстепенные:</Text>
								</View>
								{selectedExercise.secondaryMuscles.map((muscle, index) => (
									<View key={index} style={styles.muscleItem}>
										<View style={styles.muscleDot} />
										<Text style={styles.muscleText}>{muscle}</Text>
									</View>
								))}
							</View>
						)}
					</View>
				</View>

				<View style={styles.tipsSection}>
					<Text style={styles.sectionTitle}>Техника выполнения</Text>
					{selectedExercise.tips.map((tip, index) => (
						<View key={index} style={styles.tipItem}>
							<View style={styles.tipNumber}>
								<Text style={styles.tipNumberText}>{index + 1}</Text>
							</View>
							<Text style={styles.tipText}>{tip}</Text>
						</View>
					))}
				</View>

				<TouchableOpacity
					style={styles.confirmButton}
					onPress={handleAddExercise}
					activeOpacity={0.7}
				>
					<Ionicons name='add-circle' size={24} color={COLORS.background} />
					<Text style={styles.confirmButtonText}>Добавить в тренировку</Text>
				</TouchableOpacity>

				<View style={styles.spacer} />
			</ScrollView>
		)
	}

	// Определяем заголовок для текущего экрана
	const getHeaderTitle = () => {
		if (currentScreen === 'muscleGroups') {
			if (activeTab === 'search') return 'Поиск упражнений'
			if (activeTab === 'favorites') return 'Избранное'
			if (activeTab === 'recent') return 'Недавние'
			return 'Выберите группу мышц'
		}
		if (currentScreen === 'subgroups') return selectedMuscleGroup?.name || ''
		if (currentScreen === 'exercises') {
			if (activeTab === 'search') return 'Результаты поиска'
			if (activeTab === 'favorites') return 'Избранное'
			if (activeTab === 'recent') return 'Недавние'
			return selectedSubgroup?.name || ''
		}
		if (currentScreen === 'exerciseDetail') return selectedExercise?.name || ''
		return 'Выбор упражнения'
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Хедер */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={handleBack}
					activeOpacity={0.7}
				>
					<Ionicons
						name={currentScreen === 'muscleGroups' ? 'close' : 'arrow-back'}
						size={24}
						color={COLORS.text}
					/>
				</TouchableOpacity>

				<Text style={styles.headerTitle} numberOfLines={1}>
					{getHeaderTitle()}
				</Text>

				<View style={styles.headerRight}>
					{currentScreen === 'exerciseDetail' && selectedExercise && (
						<TouchableOpacity
							onPress={() => toggleFavorite(selectedExercise.id)}
						>
							<Ionicons
								name={
									favorites.includes(selectedExercise.id)
										? 'heart'
										: 'heart-outline'
								}
								size={24}
								color={
									favorites.includes(selectedExercise.id)
										? COLORS.primary
										: COLORS.textSecondary
								}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Контент */}
			<View style={styles.content}>
				{currentScreen === 'muscleGroups' && (
					<>
						{renderTabs()}
						{activeTab === 'search' && renderSearch()}
						{activeTab === 'groups' && renderMuscleGroups()}
						{(activeTab === 'search' ||
							activeTab === 'favorites' ||
							activeTab === 'recent') &&
							renderExercisesList()}
					</>
				)}

				{currentScreen === 'subgroups' && renderSubgroups()}

				{currentScreen === 'exercises' && renderExercisesList()}

				{currentScreen === 'exerciseDetail' && renderExerciseDetail()}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	backButton: {
		padding: 8,
	},
	headerTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
		textAlign: 'center',
		marginHorizontal: 8,
	},
	headerRight: {
		width: 40,
		alignItems: 'flex-end',
	},
	content: {
		flex: 1,
	},

	// Табы
	tabsContainer: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	tab: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 8,
		borderRadius: 8,
	},
	activeTab: {
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
	},
	tabText: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginTop: 4,
	},
	activeTabText: {
		color: COLORS.primary,
		fontWeight: '600',
	},

	// Поиск
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.border,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		margin: 16,
		marginBottom: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: COLORS.text,
		marginLeft: 12,
	},

	// Группы мышц
	muscleGroupsGrid: {
		padding: 16,
		paddingBottom: 32,
	},
	columnWrapper: {
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	muscleGroupCard: {
		width: (SCREEN_WIDTH - 48) / 2,
		backgroundColor: COLORS.card,
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	muscleGroupImageContainer: {
		width: 80,
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.border,
		borderRadius: 12,
		overflow: 'hidden',
		marginBottom: 12,
	},
	muscleGroupImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	muscleGroupName: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		marginBottom: 4,
		textAlign: 'center',
	},
	muscleGroupCount: {
		fontSize: 12,
		color: COLORS.textSecondary,
		textAlign: 'center',
	},

	// Подгруппы
	subgroupsGrid: {
		padding: 16,
		paddingBottom: 32,
	},
	muscleSubgroupCard: {
		width: (SCREEN_WIDTH - 48) / 2,
		backgroundColor: COLORS.card,
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	muscleSubgroupImageContainer: {
		width: 60,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.border,
		borderRadius: 10,
		overflow: 'hidden',
		marginBottom: 12,
	},
	muscleSubgroupImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	muscleSubgroupName: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		marginBottom: 4,
		textAlign: 'center',
	},
	exerciseCount: {
		fontSize: 12,
		color: COLORS.textSecondary,
		textAlign: 'center',
	},

	// Список упражнений
	exercisesList: {
		padding: 16,
		paddingBottom: 32,
	},
	exerciseListItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	exerciseListImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
		marginRight: 12,
	},
	exerciseListContent: {
		flex: 1,
	},
	exerciseListHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 4,
	},
	exerciseListName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.text,
		flex: 1,
		marginRight: 8,
	},
	exerciseListDescription: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginBottom: 8,
		lineHeight: 16,
	},
	exerciseListTags: {
		flexDirection: 'row',
		gap: 8,
	},
	difficultyTag: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(52, 199, 89, 0.2)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	difficultyText: {
		fontSize: 10,
		color: COLORS.text,
		fontWeight: '600',
		marginLeft: 4,
	},
	equipmentTag: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(142, 142, 147, 0.2)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	equipmentText: {
		fontSize: 10,
		color: COLORS.text,
		fontWeight: '600',
		marginLeft: 4,
	},

	// Детали упражнения
	exerciseDetailContainer: {
		flex: 1,
	},
	videoContainer: {
		marginBottom: 16,
	},
	videoThumbnail: {
		backgroundColor: COLORS.border,
		borderRadius: 12,
		height: 150,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.primary,
	},
	videoText: {
		fontSize: 16,
		color: COLORS.primary,
		marginTop: 8,
		fontWeight: '600',
	},
	exerciseMainImage: {
		width: '100%',
		height: 200,
		borderRadius: 0,
		marginBottom: 16,
	},
	exerciseHeader: {
		paddingHorizontal: 16,
		paddingBottom: 20,
	},
	exerciseTitleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	exerciseDetailTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: COLORS.text,
		flex: 1,
		marginRight: 8,
	},
	exerciseDetailDescriptionFull: {
		fontSize: 16,
		color: COLORS.text,
		lineHeight: 24,
		marginBottom: 20,
	},
	detailStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	detailStat: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: COLORS.border,
		padding: 16,
		borderRadius: 12,
		marginHorizontal: 4,
	},
	detailStatLabel: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginTop: 8,
		marginBottom: 4,
	},
	detailStatValue: {
		fontSize: 14,
		fontWeight: '600',
		color: COLORS.text,
		textAlign: 'center',
	},
	muscleGroupsSection: {
		paddingHorizontal: 16,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 16,
	},
	muscleGroupsGridDetail: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	muscleGroupItem: {
		flex: 1,
		backgroundColor: COLORS.border,
		borderRadius: 12,
		padding: 16,
		marginHorizontal: 4,
	},
	muscleGroupHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	muscleGroupLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: COLORS.text,
		marginLeft: 8,
	},
	muscleItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	muscleDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.primary,
		marginRight: 8,
	},
	muscleText: {
		fontSize: 14,
		color: COLORS.text,
		flex: 1,
	},
	tipsSection: {
		paddingHorizontal: 16,
		marginBottom: 30,
	},
	tipItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 16,
	},
	tipNumber: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		marginTop: 2,
	},
	tipNumberText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: COLORS.background,
	},
	tipText: {
		fontSize: 14,
		color: COLORS.text,
		flex: 1,
		lineHeight: 20,
	},
	confirmButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.primary,
		marginHorizontal: 16,
		paddingHorizontal: 32,
		paddingVertical: 18,
		borderRadius: 12,
		marginBottom: 16,
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.background,
		marginLeft: 8,
	},
	spacer: {
		height: 32,
	},

	// Empty state
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 40,
	},
	emptyStateTitle: {
		fontSize: 16,
		color: COLORS.textSecondary,
		marginTop: 16,
		textAlign: 'center',
	},
})
