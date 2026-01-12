import { useDatabase } from '@/app/contexts/database-context'
import {
	manBackMuscleGroupParts,
	manFrontMuscleGroupParts,
} from '@/constants/images'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	Alert,
	FlatList,
	Image,
	Linking,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
	modalOverlay: 'rgba(0, 0, 0, 0.8)',
} as const

// Типы
interface ExerciseSet {
	id?: number
	setNumber: number
	weight: number
	reps: number
	completed: boolean
}

interface Exercise {
	id?: number
	name: string
	muscleGroup: string
	sets: ExerciseSet[]
	collapsed: boolean
	order_index: number
}

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

// Данные для модального окна
const MUSCLE_GROUPS: MuscleGroup[] = [
	{
		id: 'chest',
		name: 'Грудь',
		image: manFrontMuscleGroupParts.rectoralFull,
		subgroups: [
			{
				id: 'chest-upper',
				name: 'Верх груди',
				image: manFrontMuscleGroupParts.extensorCarp1Radials,
				exercises: [
					{
						id: 'incline-bench-press',
						name: 'Жим штанги на наклонной скамье',
						description:
							'Базовое упражнение для развития верхней части грудных мышц. Идеально подходит для формирования верхнего края грудной клетки.',
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
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
						image: manFrontMuscleGroupParts.extensorCarp1Radials,
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
							'Поясница прижата к полу',
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
		id: 'spine',
		name: 'Спина',
		image: manBackMuscleGroupParts.spineFull,
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
							'Пятки прижаты к полу',
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
							'Пятки прижаты к полу',
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
		],
	},
]

// Подкомпонент для строки подхода
interface SetRowProps {
	set: ExerciseSet
	exerciseId: number
	onComplete: (exerciseId: number, setId: number) => void
	onUpdate: (
		exerciseId: number,
		setId: number,
		field: 'weight' | 'reps',
		value: string
	) => void
	onRemove: (exerciseId: number, setId: number) => void
}

const SetRow: React.FC<SetRowProps> = React.memo(
	({ set, exerciseId, onComplete, onUpdate, onRemove }) => {
		const handleWeightChange = useCallback(
			(value: string) => {
				if (set.id) {
					onUpdate(exerciseId, set.id, 'weight', value)
				}
			},
			[exerciseId, set.id, onUpdate]
		)

		const handleRepsChange = useCallback(
			(value: string) => {
				if (set.id) {
					onUpdate(exerciseId, set.id, 'reps', value)
				}
			},
			[exerciseId, set.id, onUpdate]
		)

		return (
			<View style={styles.setRow}>
				<Text style={styles.setNumber}>{set.setNumber}</Text>

				<TextInput
					style={[styles.input, set.completed && styles.inputCompleted]}
					value={set.weight.toString()}
					onChangeText={handleWeightChange}
					keyboardType='numeric'
					placeholder='0'
					placeholderTextColor={COLORS.textSecondary}
					maxLength={5}
				/>

				<TextInput
					style={[styles.input, set.completed && styles.inputCompleted]}
					value={set.reps.toString()}
					onChangeText={handleRepsChange}
					keyboardType='numeric'
					placeholder='0'
					placeholderTextColor={COLORS.textSecondary}
					maxLength={3}
				/>

				<TouchableOpacity
					style={[styles.checkbox, set.completed && styles.checkboxCompleted]}
					onPress={() => {
						if (set.id) {
							onComplete(exerciseId, set.id)
						}
					}}
					activeOpacity={0.7}
				>
					{set.completed && (
						<Ionicons name='checkmark' size={16} color={COLORS.background} />
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.deleteButton}
					onPress={() => {
						if (set.id) {
							onRemove(exerciseId, set.id)
						}
					}}
					activeOpacity={0.7}
				>
					<Ionicons name='trash-outline' size={18} color={COLORS.error} />
				</TouchableOpacity>
			</View>
		)
	}
)

// Подкомпонент для упражнения
interface ExerciseItemProps {
	exercise: Exercise
	onToggleCollapse: (id: number) => void
	onSetComplete: (exerciseId: number, setId: number) => void
	onUpdateSet: (
		exerciseId: number,
		setId: number,
		field: 'weight' | 'reps',
		value: string
	) => void
	onRemoveSet: (exerciseId: number, setId: number) => void
	onAddSet: (exerciseId: number) => void
	onRemoveExercise: (exerciseId: number) => void
}

const ExerciseItem: React.FC<ExerciseItemProps> = React.memo(
	({
		exercise,
		onToggleCollapse,
		onSetComplete,
		onUpdateSet,
		onRemoveSet,
		onAddSet,
		onRemoveExercise,
	}) => {
		return (
			<View style={styles.exerciseCard}>
				<View style={styles.exerciseHeader}>
					<TouchableOpacity
						style={styles.exerciseHeaderContent}
						onPress={() => {
							if (exercise.id) {
								onToggleCollapse(exercise.id)
							}
						}}
						activeOpacity={0.7}
					>
						<Ionicons
							name={exercise.collapsed ? 'chevron-down' : 'chevron-up'}
							size={20}
							color={COLORS.primary}
							style={styles.collapseIcon}
						/>
						<View>
							<Text style={styles.exerciseName}>{exercise.name}</Text>
							<Text style={styles.exerciseMuscle}>{exercise.muscleGroup}</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {
							if (exercise.id) {
								Alert.alert(
									'Удалить упражнение?',
									'Все подходы также будут удалены',
									[
										{ text: 'Отмена', style: 'cancel' },
										{
											text: 'Удалить',
											style: 'destructive',
											onPress: () => onRemoveExercise(exercise.id!),
										},
									]
								)
							}
						}}
						activeOpacity={0.7}
					>
						<Ionicons name='trash-outline' size={20} color={COLORS.error} />
					</TouchableOpacity>
				</View>

				{!exercise.collapsed && (
					<>
						<View style={styles.setsHeader}>
							<Text style={{ ...styles.setHeaderText, width: 30 }}>#</Text>
							<Text style={{ ...styles.setHeaderText, flex: 2 }}>Вес (кг)</Text>
							<Text style={{ ...styles.setHeaderText, flex: 2 }}>
								Повторения
							</Text>
							<Text style={{ ...styles.setHeaderText, flex: 1 }}></Text>
							<Text style={{ ...styles.setHeaderText, flex: 1 }}></Text>
						</View>

						{exercise.sets.map(set => (
							<SetRow
								key={set.id || `${exercise.id}-${set.setNumber}`}
								set={set}
								exerciseId={exercise.id!}
								onComplete={onSetComplete}
								onUpdate={onUpdateSet}
								onRemove={onRemoveSet}
							/>
						))}

						<TouchableOpacity
							style={styles.addSetButton}
							onPress={() => exercise.id && onAddSet(exercise.id)}
							activeOpacity={0.7}
						>
							<Ionicons name='add' size={20} color={COLORS.primary} />
							<Text style={styles.addSetText}>Добавить подход</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		)
	}
)

// Основной компонент
export default function CreateWorkoutScreen() {
	const router = useRouter()
	const {
		createNewWorkout: createNewWorkoutInDB,
		updateWorkout,
		addExerciseToWorkout,
		addSetToExercise,
		updateSet,
		deleteSet,
		deleteExercise,
		completeWorkout,
		getActiveExercises,
		getActiveSets,
	} = useDatabase()

	const [workoutId, setWorkoutId] = useState<number | null>(null)
	const [workoutName, setWorkoutName] = useState('Новая тренировка')
	const [exercises, setExercises] = useState<Exercise[]>([])
	const [timer, setTimer] = useState(0)
	const [isTimerRunning, setIsTimerRunning] = useState(false)
	const [showAddExerciseModal, setShowAddExerciseModal] = useState(false)
	const [selectedMuscleGroup, setSelectedMuscleGroup] =
		useState<MuscleGroup | null>(null)
	const [selectedSubgroup, setSelectedSubgroup] =
		useState<MuscleSubgroup | null>(null)
	const [selectedExerciseDetail, setSelectedExerciseDetail] =
		useState<ExerciseDetail | null>(null)
	const [imageError, setImageError] = useState<{ [key: string]: boolean }>({})
	const [notes, setNotes] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const hasCreatedWorkout = useRef(false)

	// Создание новой тренировки при монтировании
	useEffect(() => {
		const createWorkout = async () => {
			if (hasCreatedWorkout.current) return

			try {
				setIsLoading(true)
				hasCreatedWorkout.current = true
				const id = await createNewWorkoutInDB('Новая тренировка')
				console.log('Created: ' + id)
				setWorkoutId(id)
				setIsLoading(false)
			} catch (error) {
				console.error('Error creating workout:', error)
				Alert.alert('Ошибка', 'Не удалось создать тренировку')
				setIsLoading(false)
				router.back()
			}
		}

		createWorkout()
	}, [])

	// Загрузка упражнений после создания тренировки
	useEffect(() => {
		if (workoutId) {
			loadExercises()
		}
	}, [workoutId])

	const loadExercises = async () => {
		if (!workoutId) return

		try {
			const activeExercises = await getActiveExercises(workoutId)

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
				})
			)

			exercisesWithSets.sort((a, b) => a.order_index - b.order_index)
			setExercises(exercisesWithSets)
		} catch (error) {
			console.error('Error loading exercises:', error)
		}
	}

	// Таймер
	useEffect(() => {
		let interval: NodeJS.Timeout
		if (isTimerRunning && workoutId) {
			interval = setInterval(() => {
				setTimer(prev => prev + 1)
			}, 1000)
		}
		return () => clearInterval(interval)
	}, [isTimerRunning])

	// Автосохранение тренировки
	useEffect(() => {
		const saveWorkoutDuration = async () => {
			if (workoutId) {
				try {
					await updateWorkout(workoutId, {
						duration: timer,
						notes: notes,
						name: workoutName,
					})
				} catch (error) {
					console.error('Error saving workout:', error)
				}
			}
		}

		const debouncedSave = setTimeout(saveWorkoutDuration, 5000)
		return () => clearTimeout(debouncedSave)
	}, [timer, notes, workoutName, workoutId])

	// Автосохранение названия тренировки
	useEffect(() => {
		const saveWorkoutName = async () => {
			if (workoutId && workoutName.trim()) {
				try {
					await updateWorkout(workoutId, { name: workoutName })
				} catch (error) {
					console.error('Error saving workout name:', error)
				}
			}
		}

		const debouncedSave = setTimeout(saveWorkoutName, 1000)
		return () => clearTimeout(debouncedSave)
	}, [workoutName, workoutId])

	// Мемоизированные вычисления
	const { totalCompleted, totalSets, totalVolume } = useMemo(() => {
		let totalSets = 0
		let totalCompleted = 0
		let totalVolume = 0

		exercises.forEach(exercise => {
			exercise.sets.forEach(set => {
				totalSets++
				if (set.completed) {
					totalCompleted++
				}
				totalVolume += set.weight * set.reps
			})
		})

		return { totalCompleted, totalSets, totalVolume }
	}, [exercises])

	const formatTime = useCallback((seconds: number) => {
		const hrs = Math.floor(seconds / 3600)
		const mins = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60

		if (hrs > 0) {
			return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
				.toString()
				.padStart(2, '0')}`
		}
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`
	}, [])

	// Обработчики с useCallback
	const toggleExerciseCollapse = (exerciseId: number) => {
		setExercises(prev =>
			prev.map(exercise =>
				exercise.id === exerciseId
					? { ...exercise, collapsed: !exercise.collapsed }
					: exercise
			)
		)
	}

	const handleSetComplete = async (exerciseId: number, setId: number) => {
		if (!workoutId) return

		try {
			const exercise = exercises.find(ex => ex.id === exerciseId)
			const set = exercise?.sets.find(s => s.id === setId)

			if (set) {
				await updateSet(setId, { completed: !set.completed })
				await loadExercises()
			}
		} catch (error) {
			console.error('Error completing set:', error)
		}
	}

	const handleUpdateSet = async (
		exerciseId: number,
		setId: number,
		field: 'weight' | 'reps',
		value: string
	) => {
		if (!workoutId) return

		try {
			const numValue = parseFloat(value) || 0
			const validatedValue = Math.min(
				Math.max(numValue, 0),
				field === 'weight' ? 999 : 999
			)

			await updateSet(setId, { [field]: validatedValue })

			setExercises(prev =>
				prev.map(exercise =>
					exercise.id === exerciseId
						? {
								...exercise,
								sets: exercise.sets.map(set =>
									set.id === setId ? { ...set, [field]: validatedValue } : set
								),
						  }
						: exercise
				)
			)
		} catch (error) {
			console.error('Error updating set:', error)
		}
	}

	const handleRemoveSet = async (exerciseId: number, setId: number) => {
		if (!workoutId) return

		Alert.alert('Удалить подход?', 'Это действие нельзя отменить', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Удалить',
				style: 'destructive',
				onPress: async () => {
					try {
						await deleteSet(setId)
						await loadExercises()
					} catch (error) {
						console.error('Error deleting set:', error)
						Alert.alert('Ошибка', 'Не удалось удалить подход')
					}
				},
			},
		])
	}

	const handleAddSet = async (exerciseId: number) => {
		if (!workoutId) return

		try {
			const exercise = exercises.find(ex => ex.id === exerciseId)
			const maxSetNumber =
				exercise?.sets.reduce((max, set) => Math.max(max, set.setNumber), 0) ||
				0

			await addSetToExercise(exerciseId, {
				set_number: maxSetNumber + 1,
				weight: 0,
				reps: 0,
				completed: false,
			})
			await loadExercises()
		} catch (error) {
			console.error('Error adding set:', error)
			Alert.alert('Ошибка', 'Не удалось добавить подход')
		}
	}

	const handleFinishWorkout = async () => {
		if (!workoutId) return

		Alert.alert(
			'Завершить тренировку?',
			`Вы выполнили ${exercises.length} упражнений, ${totalSets} подходов\nОбщий объем: ${totalVolume} кг`,
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Завершить',
					onPress: async () => {
						try {
							const completedId = await completeWorkout(workoutId)
							Alert.alert(
								'Успех!',
								`Тренировка сохранена в историю\nОбщее время: ${formatTime(
									timer
								)}`,
								[
									{
										text: 'OK',
										onPress: () => router.push('/'),
									},
								]
							)
						} catch (error) {
							console.error('Error completing workout:', error)
							Alert.alert('Ошибка', 'Не удалось завершить тренировку')
						}
					},
				},
			]
		)
	}

	const handleAddExercise = async () => {
		if (!workoutId || !selectedExerciseDetail) return

		try {
			await addExerciseToWorkout(workoutId, {
				name: selectedExerciseDetail.name,
				muscle_group: selectedMuscleGroup?.name || '',
				order_index: exercises.length + 1,
				collapsed: false,
			})

			setShowAddExerciseModal(false)
			setSelectedMuscleGroup(null)
			setSelectedSubgroup(null)
			setSelectedExerciseDetail(null)
			await loadExercises()
		} catch (error) {
			console.error('Error adding exercise:', error)
			Alert.alert('Ошибка', 'Не удалось добавить упражнение')
		}
	}

	const handleRemoveExercise = async (exerciseId: number) => {
		if (!workoutId) return

		try {
			await deleteExercise(exerciseId)
			await loadExercises()
		} catch (error) {
			console.error('Error deleting exercise:', error)
			Alert.alert('Ошибка', 'Не удалось удалить упражнение')
		}
	}

	const handleDiscardWorkout = () => {
		Alert.alert(
			'Отменить тренировку?',
			'Все данные будут удалены без сохранения',
			[
				{ text: 'Продолжить', style: 'cancel' },
				{
					text: 'Отменить',
					style: 'destructive',
					onPress: () => router.back(),
				},
			]
		)
	}

	const handleOpenVideo = (url: string) => {
		Linking.openURL(url).catch(err =>
			Alert.alert('Ошибка', 'Не удалось открыть видео')
		)
	}

	// Рендер элементов для FlatList
	const renderExerciseItem = ({ item }: { item: Exercise }) => (
		<ExerciseItem
			exercise={item}
			onToggleCollapse={toggleExerciseCollapse}
			onSetComplete={handleSetComplete}
			onUpdateSet={handleUpdateSet}
			onRemoveSet={handleRemoveSet}
			onAddSet={handleAddSet}
			onRemoveExercise={handleRemoveExercise}
		/>
	)

	const renderMuscleGroupItem = ({ item }: { item: MuscleGroup }) => (
		<TouchableOpacity
			style={styles.muscleGroupCard}
			onPress={() => setSelectedMuscleGroup(item)}
			activeOpacity={0.7}
		>
			<View style={styles.muscleGroupImageContainer}>
				{imageError[item.id] ? (
					<Ionicons name='barbell-outline' size={40} color={COLORS.primary} />
				) : (
					<Image
						source={item.image}
						style={styles.muscleGroupImage}
						onError={() =>
							setImageError(prev => ({ ...prev, [item.id]: true }))
						}
					/>
				)}
			</View>
			<Text style={styles.muscleGroupName}>{item.name}</Text>
			<Text style={styles.muscleGroupExercisesCount}>
				{item.subgroups.length} подгрупп
			</Text>
		</TouchableOpacity>
	)

	const renderMuscleSubgroupItem = ({ item }: { item: MuscleSubgroup }) => (
		<TouchableOpacity
			style={styles.muscleSubgroupCard}
			onPress={() => setSelectedSubgroup(item)}
			activeOpacity={0.7}
		>
			<View style={styles.muscleSubgroupImageContainer}>
				{imageError[item.id] ? (
					<Ionicons name='barbell-outline' size={40} color={COLORS.primary} />
				) : (
					<Image
						source={item.image}
						style={styles.muscleSubgroupImage}
						onError={() =>
							setImageError(prev => ({ ...prev, [item.id]: true }))
						}
					/>
				)}
			</View>
			<Text style={styles.muscleSubgroupName}>{item.name}</Text>
			<Text style={styles.muscleSubgroupExercisesCount}>
				{item.exercises.length} упр.
			</Text>
		</TouchableOpacity>
	)

	const renderExerciseListItem = ({ item }: { item: ExerciseDetail }) => (
		<TouchableOpacity
			style={styles.exerciseListItem}
			onPress={() => setSelectedExerciseDetail(item)}
			activeOpacity={0.7}
		>
			<Image source={item.image} style={styles.exerciseListImage} />
			<View style={styles.exerciseListContent}>
				<Text style={styles.exerciseListName}>{item.name}</Text>
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
						<Ionicons name='barbell-outline' size={12} color={COLORS.text} />
						<Text style={styles.equipmentText}>
							{item.equipment.length > 1
								? `${item.equipment[0]} +${item.equipment.length - 1}`
								: item.equipment[0]}
						</Text>
					</View>
				</View>
			</View>
			<Ionicons name='chevron-forward' size={20} color={COLORS.textSecondary} />
		</TouchableOpacity>
	)

	const renderExerciseDetail = () => {
		if (!selectedExerciseDetail) return null

		return (
			<ScrollView style={styles.exerciseDetailContainer}>
				{selectedExerciseDetail.videoUrl && (
					<TouchableOpacity
						style={styles.videoContainer}
						onPress={() => handleOpenVideo(selectedExerciseDetail.videoUrl!)}
						activeOpacity={0.7}
					>
						<View style={styles.videoThumbnail}>
							<Ionicons name='play-circle' size={60} color={COLORS.primary} />
							<Text style={styles.videoText}>Смотреть видео</Text>
						</View>
					</TouchableOpacity>
				)}

				<Image
					source={selectedExerciseDetail.image}
					style={styles.exerciseMainImage}
					resizeMode='cover'
				/>

				<View style={styles.exerciseInfo}>
					<Text style={styles.exerciseDetailTitle}>
						{selectedExerciseDetail.name}
					</Text>
					<Text style={styles.exerciseDetailDescriptionFull}>
						{selectedExerciseDetail.description}
					</Text>

					<View style={styles.detailStats}>
						<View style={styles.detailStat}>
							<Ionicons name='barbell' size={20} color={COLORS.primary} />
							<Text style={styles.detailStatLabel}>Сложность</Text>
							<Text style={styles.detailStatValue}>
								{selectedExerciseDetail.difficulty}
							</Text>
						</View>
						<View style={styles.detailStat}>
							<Ionicons name='construct' size={20} color={COLORS.primary} />
							<Text style={styles.detailStatLabel}>Оборудование</Text>
							<Text style={styles.detailStatValue}>
								{selectedExerciseDetail.equipment.join(', ')}
							</Text>
						</View>
					</View>

					<View style={styles.muscleGroupsSection}>
						<Text style={styles.sectionTitle}>Работающие мышцы</Text>
						<View style={styles.muscleGroupsGrid}>
							<View style={styles.muscleGroupItem}>
								<View style={styles.muscleGroupHeader}>
									<Ionicons name='star' size={16} color={COLORS.primary} />
									<Text style={styles.muscleGroupLabel}>Основные:</Text>
								</View>
								{selectedExerciseDetail.primaryMuscles.map((muscle, index) => (
									<View key={index} style={styles.muscleItem}>
										<View style={styles.muscleDot} />
										<Text style={styles.muscleText}>{muscle}</Text>
									</View>
								))}
							</View>
							<View style={styles.muscleGroupItem}>
								<View style={styles.muscleGroupHeader}>
									<Ionicons
										name='star-outline'
										size={16}
										color={COLORS.textSecondary}
									/>
									<Text style={styles.muscleGroupLabel}>Второстепенные:</Text>
								</View>
								{selectedExerciseDetail.secondaryMuscles.map(
									(muscle, index) => (
										<View key={index} style={styles.muscleItem}>
											<View style={styles.muscleDot} />
											<Text style={styles.muscleText}>{muscle}</Text>
										</View>
									)
								)}
							</View>
						</View>
					</View>

					<View style={styles.tipsSection}>
						<Text style={styles.sectionTitle}>Техника выполнения</Text>
						{selectedExerciseDetail.tips.map((tip, index) => (
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
				</View>
			</ScrollView>
		)
	}

	if (isLoading || !workoutId) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<Ionicons name='barbell-outline' size={48} color={COLORS.primary} />
					<Text style={styles.loadingText}>Создание тренировки...</Text>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={handleDiscardWorkout}
					style={styles.backButton}
					activeOpacity={0.7}
				>
					<Ionicons name='close' size={24} color={COLORS.textSecondary} />
				</TouchableOpacity>
				<View style={styles.headerCenter}>
					<Text style={styles.headerTitle}>Новая тренировка</Text>
					<Text style={styles.headerSubtitle}>#{workoutId}</Text>
				</View>
				<TouchableOpacity
					onPress={handleFinishWorkout}
					style={styles.finishButton}
					activeOpacity={0.7}
				>
					<Ionicons name='checkmark-circle' size={24} color={COLORS.primary} />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.workoutInfo}>
					<TextInput
						style={styles.workoutName}
						value={workoutName}
						onChangeText={setWorkoutName}
						placeholder='Название тренировки'
						placeholderTextColor={COLORS.textSecondary}
					/>

					<View style={styles.statsRow}>
						<View style={styles.stat}>
							<Text style={styles.statNumber}>
								{totalCompleted}/{totalSets}
							</Text>
							<Text style={styles.statLabel}>Подходы</Text>
						</View>
						<View style={styles.stat}>
							<Text style={styles.statNumber}>{exercises.length}</Text>
							<Text style={styles.statLabel}>Упражнения</Text>
						</View>
						<View style={styles.stat}>
							<Text style={styles.statNumber}>{formatTime(timer)}</Text>
							<Text style={styles.statLabel}>Время</Text>
						</View>
					</View>

					<View style={styles.timerControls}>
						<TouchableOpacity
							style={[
								styles.timerButton,
								isTimerRunning && styles.timerButtonActive,
							]}
							onPress={() => setIsTimerRunning(!isTimerRunning)}
							activeOpacity={0.7}
						>
							<Ionicons
								name={isTimerRunning ? 'pause' : 'play'}
								size={20}
								color={isTimerRunning ? COLORS.text : COLORS.primary}
							/>
							<Text
								style={[
									styles.timerButtonText,
									isTimerRunning && styles.timerButtonTextActive,
								]}
							>
								{isTimerRunning ? 'Пауза' : 'Старт'}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.volumeButton} activeOpacity={0.7}>
							<Ionicons name='barbell' size={20} color={COLORS.primary} />
							<Text style={styles.volumeButtonText}>{totalVolume} кг</Text>
						</TouchableOpacity>
					</View>
				</View>

				{exercises.length === 0 ? (
					<View style={styles.emptyState}>
						<Ionicons
							name='barbell-outline'
							size={64}
							color={COLORS.textSecondary}
						/>
						<Text style={styles.emptyStateTitle}>Нет упражнений</Text>
						<Text style={styles.emptyStateSubtitle}>
							Добавьте первое упражнение в вашу тренировку
						</Text>
						<TouchableOpacity
							style={styles.addFirstExerciseButton}
							onPress={() => setShowAddExerciseModal(true)}
							activeOpacity={0.7}
						>
							<Ionicons name='add' size={20} color={COLORS.background} />
							<Text style={styles.addFirstExerciseText}>
								Добавить упражнение
							</Text>
						</TouchableOpacity>
					</View>
				) : (
					<FlatList
						data={exercises}
						renderItem={renderExerciseItem}
						keyExtractor={item =>
							item.id?.toString() || Math.random().toString()
						}
						scrollEnabled={false}
						contentContainerStyle={styles.exercisesList}
					/>
				)}

				{exercises.length > 0 && (
					<TouchableOpacity
						style={styles.addExerciseButton}
						onPress={() => setShowAddExerciseModal(true)}
						activeOpacity={0.7}
					>
						<Ionicons
							name='add-circle-outline'
							size={24}
							color={COLORS.primary}
						/>
						<Text style={styles.addExerciseText}>Добавить упражнение</Text>
					</TouchableOpacity>
				)}

				<View style={styles.notesSection}>
					<Text style={styles.notesTitle}>Заметки</Text>
					<TextInput
						style={styles.notesInput}
						placeholder='Добавьте заметки к тренировке...'
						placeholderTextColor={COLORS.textSecondary}
						multiline
						numberOfLines={4}
						textAlignVertical='top'
						value={notes}
						onChangeText={setNotes}
					/>
				</View>

				<View style={styles.workoutActions}>
					<TouchableOpacity
						style={[styles.actionButton, styles.finishActionButton]}
						onPress={handleFinishWorkout}
						activeOpacity={0.7}
					>
						<Ionicons name='checkmark' size={20} color={COLORS.text} />
						<Text style={styles.actionButtonText}>Завершить тренировку</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.actionButton, styles.discardButton]}
						onPress={handleDiscardWorkout}
						activeOpacity={0.7}
					>
						<Ionicons name='trash-outline' size={20} color={COLORS.text} />
						<Text style={styles.actionButtonText}>Отменить тренировку</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Модальное окно добавления упражнения */}
			<Modal
				visible={showAddExerciseModal}
				animationType='slide'
				transparent={true}
				onRequestClose={() => {
					if (selectedExerciseDetail) {
						setSelectedExerciseDetail(null)
					} else if (selectedSubgroup) {
						setSelectedSubgroup(null)
					} else if (selectedMuscleGroup) {
						setSelectedMuscleGroup(null)
					} else {
						setShowAddExerciseModal(false)
					}
				}}
				statusBarTranslucent
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								{selectedMuscleGroup
									? selectedSubgroup
										? selectedExerciseDetail
											? 'Детали упражнения'
											: `Упражнения: ${selectedSubgroup.name}`
										: `Подгруппы: ${selectedMuscleGroup.name}`
									: 'Выберите группу мышц'}
							</Text>
							<TouchableOpacity
								onPress={() => {
									if (selectedExerciseDetail) {
										setSelectedExerciseDetail(null)
									} else if (selectedSubgroup) {
										setSelectedSubgroup(null)
									} else if (selectedMuscleGroup) {
										setSelectedMuscleGroup(null)
									} else {
										setShowAddExerciseModal(false)
									}
								}}
								style={styles.modalCloseButton}
								activeOpacity={0.7}
							>
								<Ionicons name='close' size={24} color={COLORS.textSecondary} />
							</TouchableOpacity>
						</View>

						{!selectedMuscleGroup ? (
							// Шаг 1: Выбор группы мышц
							<FlatList
								data={MUSCLE_GROUPS}
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={styles.muscleGroupsList}
								renderItem={renderMuscleGroupItem}
								keyExtractor={item => item.id}
							/>
						) : !selectedSubgroup ? (
							// Шаг 2: Выбор подгруппы
							<FlatList
								data={selectedMuscleGroup.subgroups}
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={styles.muscleGroupsList}
								renderItem={renderMuscleSubgroupItem}
								keyExtractor={item => item.id}
							/>
						) : !selectedExerciseDetail ? (
							// Шаг 3: Выбор упражнения
							<FlatList
								data={selectedSubgroup.exercises}
								contentContainerStyle={styles.exercisesListModal}
								renderItem={renderExerciseListItem}
								keyExtractor={item => item.id}
							/>
						) : (
							// Шаг 4: Детали упражнения
							renderExerciseDetail()
						)}
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	loadingText: {
		fontSize: 16,
		color: COLORS.textSecondary,
		marginTop: 16,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: COLORS.card,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	backButton: {
		padding: 4,
	},
	headerCenter: {
		flex: 1,
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.text,
	},
	headerSubtitle: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	finishButton: {
		padding: 4,
	},
	content: {
		flex: 1,
	},
	workoutInfo: {
		backgroundColor: COLORS.card,
		padding: 20,
		marginBottom: 12,
		marginTop: 8,
		borderRadius: 16,
		marginHorizontal: 16,
	},
	workoutName: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 20,
		backgroundColor: COLORS.border,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#3A3A3C',
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 20,
	},
	stat: {
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.primary,
		marginBottom: 6,
	},
	statLabel: {
		fontSize: 12,
		color: COLORS.textSecondary,
	},
	timerControls: {
		flexDirection: 'row',
		gap: 12,
	},
	timerButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(52, 199, 89, 0.2)',
	},
	timerButtonActive: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	timerButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.primary,
		marginLeft: 8,
	},
	timerButtonTextActive: {
		color: COLORS.background,
	},
	volumeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.border,
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#3A3A3C',
	},
	volumeButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		marginLeft: 8,
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 40,
		marginTop: 40,
	},
	emptyStateTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.text,
		marginTop: 16,
	},
	emptyStateSubtitle: {
		fontSize: 14,
		color: COLORS.textSecondary,
		textAlign: 'center',
		marginTop: 8,
		marginBottom: 24,
	},
	addFirstExerciseButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.primary,
		paddingHorizontal: 24,
		paddingVertical: 14,
		borderRadius: 12,
	},
	addFirstExerciseText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.background,
		marginLeft: 8,
	},
	exercisesList: {
		paddingVertical: 10,
	},
	exerciseCard: {
		backgroundColor: COLORS.card,
		marginBottom: 12,
		padding: 16,
		marginHorizontal: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	exerciseHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	exerciseHeaderContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	collapseIcon: {
		marginRight: 12,
	},
	exerciseName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.text,
	},
	exerciseMuscle: {
		fontSize: 14,
		color: COLORS.textSecondary,
		marginTop: 4,
	},
	setsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 8,
		marginBottom: 12,
	},
	setHeaderText: {
		fontSize: 12,
		fontWeight: '600',
		color: COLORS.textSecondary,
		textAlign: 'center',
	},
	setRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	setNumber: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		width: 30,
		textAlign: 'center',
	},
	input: {
		flex: 2,
		height: 50,
		borderWidth: 1,
		borderColor: '#3A3A3C',
		borderRadius: 8,
		textAlign: 'center',
		fontSize: 16,
		color: COLORS.text,
		backgroundColor: COLORS.border,
		marginHorizontal: 4,
	},
	inputCompleted: {
		backgroundColor: COLORS.card,
		color: COLORS.textSecondary,
		borderColor: COLORS.primary,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#3A3A3C',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.border,
	},
	checkboxCompleted: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	deleteButton: {
		width: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addSetButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		marginTop: 8,
		borderRadius: 8,
		backgroundColor: 'rgba(52, 199, 89, 0.1)',
		borderWidth: 1,
		borderColor: 'rgba(52, 199, 89, 0.2)',
	},
	addSetText: {
		fontSize: 14,
		color: COLORS.primary,
		fontWeight: '600',
		marginLeft: 8,
	},
	addExerciseButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.card,
		padding: 16,
		marginBottom: 12,
		marginHorizontal: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	addExerciseText: {
		fontSize: 16,
		color: COLORS.primary,
		fontWeight: '600',
		marginLeft: 8,
	},
	notesSection: {
		backgroundColor: COLORS.card,
		padding: 20,
		marginBottom: 20,
		marginHorizontal: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	notesTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		marginBottom: 12,
	},
	notesInput: {
		borderWidth: 1,
		borderColor: '#3A3A3C',
		borderRadius: 12,
		padding: 16,
		fontSize: 14,
		color: COLORS.text,
		minHeight: 100,
		backgroundColor: COLORS.border,
	},
	workoutActions: {
		paddingHorizontal: 16,
		paddingBottom: 30,
		gap: 12,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		borderRadius: 12,
	},
	finishActionButton: {
		backgroundColor: COLORS.primary,
	},
	discardButton: {
		backgroundColor: COLORS.error,
	},
	actionButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		marginLeft: 8,
	},
	// Стили для модального окна
	modalOverlay: {
		flex: 1,
		backgroundColor: COLORS.modalOverlay,
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: COLORS.card,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 20,
		maxHeight: '85%',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.text,
		flex: 1,
	},
	modalCloseButton: {
		padding: 4,
	},
	muscleGroupsList: {
		paddingVertical: 10,
	},
	muscleGroupCard: {
		width: 120,
		backgroundColor: COLORS.border,
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#2d2d2eff',
	},
	muscleGroupImageContainer: {
		width: 60,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#333',
		borderRadius: 10,
		overflow: 'hidden',
	},
	muscleGroupImage: {
		width: 60,
		height: 60,
	},
	muscleGroupName: {
		fontSize: 14,
		marginVertical: 5,
		fontWeight: '600',
		color: COLORS.text,
		marginBottom: 4,
		textAlign: 'center',
	},
	muscleGroupExercisesCount: {
		fontSize: 12,
		color: COLORS.textSecondary,
		textAlign: 'center',
	},
	// Стили для подгрупп мышц
	muscleSubgroupCard: {
		width: 140,
		backgroundColor: COLORS.border,
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#2d2d2eff',
	},
	muscleSubgroupImageContainer: {
		width: 80,
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#333',
		borderRadius: 12,
		overflow: 'hidden',
		marginBottom: 12,
	},
	muscleSubgroupImage: {
		width: 80,
		height: 80,
	},
	muscleSubgroupName: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
		marginBottom: 4,
		textAlign: 'center',
	},
	muscleSubgroupExercisesCount: {
		fontSize: 12,
		color: COLORS.textSecondary,
		textAlign: 'center',
	},
	// Стили для списка упражнений
	exercisesListModal: {
		paddingVertical: 10,
	},
	exerciseListItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.border,
		borderRadius: 12,
		padding: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#3A3A3C',
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
	exerciseListName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 4,
	},
	exerciseListDescription: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginBottom: 8,
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
	// Стили для деталей упражнения
	exerciseDetailContainer: {
		height: '96%',
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
		borderRadius: 12,
		marginBottom: 16,
	},
	exerciseInfo: {
		paddingBottom: 20,
	},
	exerciseDetailTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 12,
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
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 16,
	},
	muscleGroupsGrid: {
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
		paddingHorizontal: 32,
		paddingVertical: 18,
		borderRadius: 12,
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.background,
		marginLeft: 8,
	},
})
