import { manBackMuscleGroupParts, manFrontMuscleGroupParts } from './images'

export const muscle_groups = [
	{
		id: 'chest',
		name: 'Грудь',
		image: manFrontMuscleGroupParts.rectoralFull,
		imagePosition: {
			width: '100%',
			top: 20,
		},
		subgroups: [
			{
				id: 'chest-upper',
				name: 'Верх груди',
				image: manFrontMuscleGroupParts.pectoralisMajor,
				exercises: [
					{
						id: 'flat-barbell-bench-press',
						name: 'Жим штанги лежа',
						description:
							'Базовое упражнение для развития силы и объема грудных мышц. Широкий хват позволяет максимально эффективно включить в работу большие грудные мышцы.',
						image: require('@/assets/training-videos/v1/v1.png'),
						imagePosition: {
							width: '140%',
							left: -30,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v1/v1.png'),
							require('@/assets/training-videos/v1/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Грудные мышцы'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						primaryFrontMuscles: ['leftPectoralisMajor', 'rightPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						tips: [
							'Сводите лопатки вместе, создавая стабильную опору для плеч',
							'Хват шире плеч (примерно на 1.5 ширины плеч для комфортной амплитуды)',
							'Опускайте штангу на уровень нижней части грудных мышц',
							'Держите стопы жестко упертыми в пол для передачи усилия',
							'Не отрывайте таз от скамьи во время выполнения жима',
						],
						equipment: ['Штанга', 'Горизонтальная скамья'],
						difficulty: 'Базовый',
					},
					{
						id: 'incline-barbell-bench-press',
						name: 'Жим штанги на наклонной скамье',
						description:
							'Классическое базовое упражнение для верхней части грудных. Максимально нагружает ключичную головку pectoralis major при правильном угле.',
						image: require('@/assets/training-videos/v3/v2.png'),
						imagePosition: {
							width: '140%',
							left: -30,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v3/v1.png'),
							require('@/assets/training-videos/v3/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Верх груди'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						primaryFrontMuscles: ['rightPectoralisMajor', 'leftPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						tips: [
							'Угол наклона скамьи 30–45 градусов (оптимально 30° для максимальной активации верха)',
							'Сводите лопатки и держите грудь расправленной',
							'Опускайте штангу к верхней части груди (чуть выше сосков)',
							'Локти под углом ~45° к корпусу',
							'Не выгибайте поясницу чрезмерно',
						],
						equipment: ['Штанга', 'Наклонная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'machine-pec-deck-fly',
						name: 'Сведение рук в тренажере (Бабочка)',
						description:
							'Изолирующее упражнение для проработки больших грудных мышц, особенно их внутренней части. Тренажер обеспечивает постоянное напряжение мышц на всей амплитуде движения.',
						image: require('@/assets/training-videos/v8/v1.png'),
						imagePosition: {
							width: '100%',
							left: 0,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v8/v1.png'),
							require('@/assets/training-videos/v8/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Грудные мышцы'],
						secondaryMuscles: ['Передние дельты'],
						primaryFrontMuscles: ['leftPectoralisMajor', 'rightPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Отрегулируйте высоту сиденья так, чтобы кисти и локти находились на уровне середины груди',
							'Плотно прижмите спину и затылок к спинке тренажера',
							'Сводите руки плавно, делая акцент на сокращении грудных мышц в центральной точке',
							'Не разводите руки слишком сильно назад, чтобы не травмировать плечевые суставы',
							'Держите локти слегка согнутыми и не «выключайте» их до конца',
						],
						equipment: ['Тренажер «Бабочка»'],
						difficulty: 'Новичок',
					},
					{
						id: 'lever-incline-chest-press',
						name: 'Жим в рычажном тренажере под углом',
						description:
							'Упражнение в хаммере для акцентированной проработки верхней части грудных мышц. Фиксированная траектория обеспечивает безопасность суставов и позволяет сфокусироваться на растяжении и сокращении мышц.',
						image: require('@/assets/training-videos/v21/v1.png'),
						imagePosition: {
							width: '140%',
							left: -15,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v21/v1.png'),
							require('@/assets/training-videos/v21/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Верх груди'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						primaryFrontMuscles: ['rightPectoralisMajor', 'leftPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						tips: [
							'Настройте высоту сиденья так, чтобы рукоятки находились на уровне верхней части груди',
							'Плотно прижмите лопатки и таз к спинке тренажера на протяжении всего подхода',
							'Плавно опускайте рукоятки до глубокого растяжения в мышцах груди',
							'На выдохе мощно выжимайте вес вверх, не выпрямляя локти до конца («не вставляйте» сустав)',
							'Держите локти слегка опущенными, не задирайте их слишком высоко к ушам',
						],
						equipment: ['Рычажный тренажер'],
						difficulty: 'Новичок',
					},
					{
						id: 'lever-chest-press',
						name: 'Жим в рычажном тренажере сидя',
						description:
							'Базовое упражнение в тренажере для развития среднего и нижнего отделов грудных мышц. Конструкция хаммера позволяет безопасно работать с большим весом, минимизируя нагрузку на мышцы-стабилизаторы.',
						image: require('@/assets/training-videos/v22/v1.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v22/v1.png'),
							require('@/assets/training-videos/v22/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Грудные мышцы'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						primaryFrontMuscles: ['leftPectoralisMajor', 'rightPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						tips: [
							'Настройте сиденье так, чтобы рукоятки находились на уровне середины груди',
							'Плотно прижмите спину к спинке, сохраняя естественный прогиб в пояснице',
							'На выдохе выжимайте рукоятки вперед, фокусируясь на сведении локтей друг к другу',
							'В конечной точке не распрямляйте локти полностью, сохраняя напряжение в груди',
							'Опускайте вес плавно до комфортного растяжения, не допуская удара плиток или рывков',
						],
						equipment: ['Рычажный тренажер'],
						difficulty: 'Новичок',
					},
					{
						id: 'lever-incline-chest-press-v2',
						name: 'Жим в рычажном тренажере под углом (вверх)',
						description:
							'Упражнение для акцентированной проработки верхней части грудных мышц и передних дельт. Наклонная конструкция тренажера минимизирует нагрузку на поясницу, позволяя изолированно работать над объемом верха груди.',
						image: require('@/assets/training-videos/v23/v1.png'),
						imagePosition: {
							width: '140%',
							left: -15,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v23/v1.png'),
							require('@/assets/training-videos/v23/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Верх груди'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						primaryFrontMuscles: ['leftPectoralisMajor', 'rightPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						tips: [
							'Установите высоту сиденья так, чтобы рукоятки в исходной точке находились чуть ниже уровня плеч',
							'Плотно прижмите лопатки к спинке и не отрывайте их во время жима',
							'Выжимайте рукоятки вверх по дуге, полностью концентрируясь на сокращении верхних отделов груди',
							'Контролируйте фазу опускания, не позволяя весу резко падать вниз',
							'Держите стопы широко и плотно прижатыми к полу для создания устойчивой опоры',
						],
						equipment: ['Рычажный тренажер'],
						difficulty: 'Новичок',
					},
					{
						id: 'incline-dumbbell-press',
						name: 'Жим гантелей на наклонной скамье',
						description:
							'Лучшее упражнение для симметрии и глубокого растяжения верха груди. Гантели позволяют больше амплитуды и лучше прорабатывают каждую сторону отдельно.',
						image: require('@/assets/training-videos/v65/v1.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v65/v1.png'),
							require('@/assets/training-videos/v65/v2.png'),
						],
						videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8', // популярный ролик, можешь заменить
						primaryMuscles: ['Верх груди'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						tips: [
							'Угол 30–45 градусов',
							'В нижней точке — максимальное растяжение (гантели чуть ниже плеч)',
							'В верхней точке не стучите гантелями — держите напряжение',
							'Движение по дуге, сводите гантели вместе вверху',
							'Контролируйте негативную фазу 2–3 секунды',
						],
						equipment: ['Гантели', 'Наклонная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'dumbbell-bench-press',
						name: 'Жим гантелей на горизонтальной скамье',
						description:
							'Базовое упражнение для развития грудных мышц. Работа с гантелями обеспечивает большую амплитуду движения в нижней точке и требует значительных усилий от мышц-стабилизаторов для поддержания баланса.',
						image: require('@/assets/training-videos/v66/v1.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v66/v1.png'),
							require('@/assets/training-videos/v66/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Грудные мышцы'],
						secondaryMuscles: ['Передние дельты', 'Трицепс'],
						primaryFrontMuscles: ['leftPectoralisMajor', 'rightPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						tips: [
							'Начинайте движение с гантелями на уровне середины груди',
							'Опускайте гантели подконтрольно, чувствуя растяжение грудных мышц',
							'В верхней точке сводите гантели друг к другу, но не ударяйте их',
							'Держите локти под углом примерно 45-60 градусов к корпусу (не разводите их строго в стороны)',
							'Плотно упирайтесь стопами в пол и держите лопатки сведенными на скамье',
						],
						equipment: ['Гантели', 'Горизонтальная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'dumbbell-flys',
						name: 'Разведение гантелей лежа',
						description:
							'Изолирующее упражнение для грудных мышц, направленное на их растяжение и проработку внутренней части. Позволяет сфокусироваться исключительно на работе больших грудных мышц без участия трицепса.',
						image: require('@/assets/training-videos/v67/v1.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v67/v1.png'),
							require('@/assets/training-videos/v67/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Грудные мышцы'],
						secondaryMuscles: ['Передние дельты'],
						primaryFrontMuscles: ['leftPectoralisMajor', 'rightPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Держите локти слегка согнутыми («мягкими») на протяжении всего движения',
							'Опускайте гантели по широкой дуге до уровня груди, чувствуя сильное растяжение',
							'В верхней точке не содаряйте гантели, останавливайте их на небольшом расстоянии друг от друга',
							'Движение должно быть плавным и подконтрольным, без использования инерции',
							'Плотно прижимайте лопатки и таз к скамье, сохраняя устойчивое положение стоп',
						],
						equipment: ['Гантели', 'Горизонтальная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'low-to-high-cable-fly',
						name: 'Сведения в кроссовере снизу вверх',
						description:
							'Лучшее изолирующее упражнение на верх груди. Постоянное натяжение + восходящая траектория идеально следуют ходу волокон ключичной головки.',
						image: require('@/assets/training-videos/v41/v2.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v41/v1.png'),
							require('@/assets/training-videos/v41/v2.png'),
						],
						videoUrl: 'https://www.youtube.com/watch?v=5ooGhgz9QMM',
						primaryMuscles: ['Верх груди'],
						secondaryMuscles: ['Средняя часть груди'],
						tips: [
							'Блоки в нижнем положении',
							'Руки идут вверх и вперёд по дуге, сводятся на уровне глаз/шеи',
							'В верхней точке — пиковое сокращение и сжатие 1–2 секунды',
							'Лёгкий наклон корпуса вперёд',
							'Движение только в плечевом суставе, не раскачивайтесь',
						],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
					},
					{
						id: 'standing-cable-chest-fly',
						name: 'Сведение рук в кроссовере стоя',
						description:
							'Изолирующее упражнение для детальной проработки больших грудных мышц. Работа в кабельном тренажере обеспечивает постоянное сопротивление по всей траектории движения, что невозможно при работе со свободными весами.',
						image: require('@/assets/training-videos/v42/v2.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v42/v1.png'),
							require('@/assets/training-videos/v42/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Грудные мышцы'],
						secondaryMuscles: ['Передние дельты'],
						primaryFrontMuscles: ['leftPectoralisMajor', 'rightPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Сделайте шаг вперед для устойчивости и слегка наклоните корпус (спина прямая)',
							'Держите локти слегка согнутыми и зафиксированными в одном положении на протяжении всего подхода',
							'Сводите руки перед собой, стараясь максимально прожать грудные мышцы в точке касания',
							'Разводите руки до уровня плеч, чувствуя растяжение груди, но не допуская боли в суставах',
							'Двигайтесь плавно, избегайте рывков и не используйте инерцию корпуса',
						],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
					},
					{
						id: 'low-cable-chest-fly',
						name: 'Сведения в кроссовере с нижних блоков',
						description:
							'Изолирующее упражнение для проработки ключичной (верхней) головки грудных мышц. Траектория движения снизу вверх и внутрь позволяет максимально сократить верх груди.',
						image: require('@/assets/training-videos/v43/v2.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v43/v1.png'),
							require('@/assets/training-videos/v43/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Верх груди'],
						secondaryMuscles: ['Передние дельты', 'Зубчатые мышцы'],
						primaryFrontMuscles: ['leftPectoralisMajor', 'rightPectoralisMajor'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Установите блоки в самое нижнее положение',
							'Выведите одну ногу вперед для устойчивости и держите корпус прямо или с легким наклоном назад',
							'Сводите рукоятки перед собой на уровне подбородка или чуть выше',
							'В верхней точке задержитесь на 1 секунду для максимального пикового сокращения',
							'Держите локти слегка согнутыми («мягкими») на протяжении всего движения',
						],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
					},
				],
			},
			{
				id: 'chest-lower',
				name: 'Низ груди',
				image: manFrontMuscleGroupParts.pectoralisMinor, // или pectoralisMajorLower, если есть такая часть
				exercises: [
					{
						id: 'decline-bench-press',
						name: 'Жим штанги на скамье с отрицательным наклоном',
						description:
							'Базовое упражнение для акцента на нижнюю часть грудных мышц. Помогает сформировать четкую линию под грудью и добавить объём в нижней зоне.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=LfyQBUKR8DE',
						primaryMuscles: ['Низ груди'],
						secondaryMuscles: ['Трицепс', 'Передние дельты'],
						tips: [
							'Угол наклона скамьи -15°…-30° (чем ниже, тем сильнее акцент на низ)',
							'Опускайте штангу к нижней части груди (ближе к солнечному сплетению)',
							'Сводите лопатки и расправляйте грудь',
							'Локти под углом ~45° к корпусу',
							'Контролируйте опускание (негатив 2–3 секунды)',
						],
						equipment: ['Штанга', 'Скамья с отрицательным наклоном'],
						difficulty: 'Средний',
					},
					{
						id: 'decline-dumbbell-press',
						name: 'Жим гантелей на скамье с отрицательным наклоном',
						description:
							'Отличный вариант для симметрии и большего растяжения низа груди. Гантели позволяют работать в полной амплитуде и устранять дисбаланс между сторонами.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8', // адаптированный ролик, можешь заменить на decline
						primaryMuscles: ['Низ груди'],
						secondaryMuscles: ['Трицепс', 'Передние дельты'],
						tips: [
							'Угол -15°…-30°',
							'В нижней точке — глубокое растяжение (гантели чуть ниже груди)',
							'Сводите гантели по дуге вверху, не стучите их',
							'Держите локти под углом, не разводите широко',
							'Медленный негатив для максимальной нагрузки',
						],
						equipment: ['Гантели', 'Скамья с отрицательным наклоном'],
						difficulty: 'Средний',
					},
					{
						id: 'parallel-bar-dips-chest',
						name: 'Отжимания на брусьях (акцент на грудь)',
						description:
							'Одно из лучших упражнений на нижнюю часть груди. При наклоне вперёд и разведении локтей в стороны максимально нагружает нижние волокна.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
						primaryMuscles: ['Низ груди'],
						secondaryMuscles: ['Трицепс', 'Передние дельты'],
						tips: [
							'Наклоняйтесь вперёд корпусом на 30–45°',
							'Локти разводите в стороны (не назад, как в трицепсовом варианте)',
							'Опускайтесь до комфортного растяжения (плечи не ниже локтей)',
							'В верхней точке не разгибайте локти полностью — держите напряжение',
							'Для прогресса — добавляйте отягощение на пояс',
						],
						equipment: ['Брусья (параллельные)'],
						difficulty: 'Средний / Высокий',
					},
					{
						id: 'high-to-low-cable-fly',
						name: 'Сведения в кроссовере сверху вниз',
						description:
							'Лучшее изолирующее упражнение на низ груди с постоянным натяжением. Траектория сверху вниз идеально следует ходу нижних волокон.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=5ooGhgz9QMM',
						primaryMuscles: ['Низ груди'],
						secondaryMuscles: ['Средняя часть груди'],
						tips: [
							'Блоки в самом верхнем положении',
							'Руки идут вниз и вперёд по дуге, сводятся ниже пояса/живота',
							'В нижней точке — сильное сведение и пиковое сокращение 1–2 секунды',
							'Лёгкий наклон корпуса вперёд для постоянного натяжения',
							'Движение только в плечах, не раскачивайтесь',
						],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
					},
					{
						id: 'decline-dumbbell-fly',
						name: 'Разведения гантелей на скамье с отрицательным наклоном',
						description:
							'Изолирующее упражнение для растяжки и сепарации низа груди. Добавляет объём и улучшает форму нижнего края грудных.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=Uj3ZOK5zMAk', // адаптированный для decline
						primaryMuscles: ['Низ груди'],
						secondaryMuscles: ['Передние дельты'],
						tips: [
							'Угол -15°…-30°',
							'Лёгкий изгиб в локтях на всём диапазоне',
							'Максимальное растяжение внизу (без боли в плечах)',
							'Сводите гантели по широкой дуге вверх',
							'Концентрируйтесь на ощущении в нижней части груди',
						],
						equipment: ['Гантели', 'Скамья с отрицательным наклоном'],
						difficulty: 'Средний',
					},
					{
						id: 'decline-pushup',
						name: 'Отжимания с ногами на возвышении (decline push-ups)',
						description:
							'Эффективное упражнение с собственным весом для акцента на низ груди. Идеально для дома, разминки или добивки в конце тренировки.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
						primaryMuscles: ['Низ груди'],
						secondaryMuscles: ['Трицепс', 'Передние дельты', 'Пресс'],
						tips: [
							'Ноги на скамье/ступеньке — чем выше, тем сильнее акцент на низ',
							'Ладони чуть шире плеч',
							'Опускайтесь до касания грудью пола или почти до пола',
							'Держите тело прямой линией, не прогибайтесь в пояснице',
							'Для усложнения — добавьте паузу внизу или рюкзак с весом',
						],
						equipment: ['Собственный вес', 'Возвышение для ног'],
						difficulty: 'Средний',
					},
				],
			},
			{
				id: 'chest-middle',
				name: 'Середина груди',
				image: manFrontMuscleGroupParts.serratusAnterior,
				exercises: [
					{
						id: 'flat-barbell-bench-press',
						name: 'Жим штанги лёжа на горизонтальной скамье',
						description:
							'Классика для общей массы и толщины средней части груди. Лучшее базовое упражнение для развития "плиты" в центре и силы всего верха тела.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3_M',
						primaryMuscles: ['Середина груди'],
						secondaryMuscles: ['Трицепс', 'Передние дельты'],
						tips: [
							'Лопатки сведены и прижаты к скамье, грудь расправлена',
							'Штанга опускается к середине груди (уровень сосков)',
							'Локти под углом ~45° к корпусу (не разводите широко)',
							'Мощный жим вверх + контроль на опускании (негатив 2–3 секунды)',
							'Не отрывайте таз от скамьи, не выгибайте поясницу чрезмерно',
						],
						equipment: ['Штанга', 'Горизонтальная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'flat-dumbbell-bench-press',
						name: 'Жим гантелей лёжа на горизонтальной скамье',
						description:
							'Отличный вариант для симметрии, большего диапазона движения и растяжения средней части груди. Помогает устранить дисбаланс между сторонами.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
						primaryMuscles: ['Середина груди'],
						secondaryMuscles: ['Трицепс', 'Передние дельты'],
						tips: [
							'В нижней точке — глубокое растяжение (гантели ниже уровня груди)',
							'Движение по дуге: сводите гантели вместе вверху',
							'Не стучите гантелями в верхней точке — держите постоянное напряжение',
							'Локти не опускайте слишком низко, чтобы не нагружать плечи',
							'Контролируйте весь диапазон, особенно негатив',
						],
						equipment: ['Гантели', 'Горизонтальная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'cable-crossover-middle',
						name: 'Сведения в кроссовере на уровне груди',
						description:
							'Лучшее изолирующее для внутренней части груди. Постоянное натяжение + сведение по средней линии идеально прорабатывает середину и улучшает "раздел".',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=p0jD6J6vqLc',
						primaryMuscles: ['Середина / внутренняя часть груди'],
						secondaryMuscles: ['Нижняя часть груди'],
						tips: [
							'Блоки на уровне плеч или чуть ниже',
							'Сводите руки перед собой на уровне груди / солнечного сплетения',
							'В пиковой точке — сильное сжатие 1–2 секунды (как будто обнимаете дерево)',
							'Лёгкий наклон корпуса вперёд для постоянного натяжения',
							'Движение только в плечевых суставах, не раскачивайтесь',
						],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
					},
					{
						id: 'hex-press',
						name: 'Hex press / жим гантелей с сведением',
						description:
							'Отличное упражнение для пикового сокращения в середине груди. Гантели прижаты друг к другу на всём диапазоне — максимальная активация внутренней части.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=0kX6e7e2q9I', // типичный hex press ролик
						primaryMuscles: ['Середина / внутренняя часть груди'],
						secondaryMuscles: ['Трицепс', 'Передние дельты'],
						tips: [
							'Гантели (лучше hex-формы) прижаты друг к другу на протяжении всего движения',
							'Жмите вверх, сохраняя давление между гантелями',
							'В верхней точке — дополнительное сжатие груди',
							'Делайте медленно, фокусируйтесь на сведении',
							'Подходит для добивки в конце тренировки',
						],
						equipment: ['Гантели'],
						difficulty: 'Средний',
					},
					{
						id: 'svend-press',
						name: 'Svend press / сжатие диска / plate press',
						description:
							'Простое и эффективное изолирующее упражнение для внутренней груди. Постоянное сведение создаёт сильное сокращение в центре без большого веса.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=5ooGhgz9QMM', // адаптированный для Svend
						primaryMuscles: ['Середина / внутренняя часть груди'],
						secondaryMuscles: ['Передние дельты'],
						tips: [
							'Возьмите блин / диск / две гантели и сожмите ладонями на уровне груди',
							'Выжимайте вперёд на прямых руках, сохраняя давление',
							'В пиковой точке — максимальное сжатие 1–2 секунды',
							'Делайте стоя или сидя, медленно',
							'Идеально для пампа и добивки',
						],
						equipment: ['Блин от штанги / диск / гантели'],
						difficulty: 'Средний',
					},
					{
						id: 'close-grip-bench-press',
						name: 'Жим штанги лёжа узким хватом',
						description:
							'Хорошо нагружает середину груди + трицепс. Узкий хват смещает акцент внутрь и помогает развить толщину в центре.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=wsDyQ0jCBV8',
						primaryMuscles: ['Середина груди', 'Трицепс'],
						secondaryMuscles: ['Передние дельты'],
						tips: [
							'Хват уже плеч (на ширине плеч или чуть уже)',
							'Опускайте штангу к середине груди',
							'Локти близко к корпусу',
							'Контролируйте движение, не разводите локти',
							'Можно использовать EZ-гриф для комфорта запястий',
						],
						equipment: ['Штанга', 'Горизонтальная скамья'],
						difficulty: 'Средний',
					},
				],
			},
			// ... остальные подгруппы
		],
	},
	{
		id: 'arms',
		name: 'Руки',
		image: manFrontMuscleGroupParts.armFull,
		imagePosition: {
			width: '100%',
			top: -20,
		},
		subgroups: [
			{
				id: 'biceps',
				name: 'Бицепс',
				image: manFrontMuscleGroupParts.bicepsFull,
				exercises: [
					{
						id: 'lateral-raise-machine',
						name: 'Разведения в тренажере на среднюю дельту',
						description:
							'Изолирующее упражнение для акцентированной проработки среднего пучка дельтовидных мышц. Использование тренажера минимизирует участие трапециевидных мышц и позволяет лучше контролировать технику.',
						image: require('@/assets/training-videos/v19/v2.png'),
						imagePosition: {
							width: '140%',
							left: -30,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v19/v1.png'),
							require('@/assets/training-videos/v19/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_lateral_machine.mp4',
						primaryMuscles: ['Средняя дельта'],
						secondaryMuscles: ['Передняя дельта', 'Трапециевидные мышцы'],
						primaryFrontMuscles: ['leftMiddleDeltoid', 'rightMiddleDeltoid'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['trapezius'],
						tips: [
							'Отрегулируйте высоту сиденья так, чтобы оси вращения тренажера совпадали с вашими плечевыми суставами',
							'Плотно прижмитесь спиной к спинке и держите грудь расправленной',
							'Упирайтесь локтями (а не кистями) в подушки тренажера для лучшей изоляции дельт',
							'Поднимайте рычаги до уровня плеч и делайте небольшую паузу в верхней точке',
							'Опускайте вес медленно, не позволяя плитам тренажера соприкасаться, чтобы сохранять нагрузку',
						],
						equipment: ['Разведения в стороны'],
						difficulty: 'Новичок',
					},
					{
						id: 'bicep-curl-machine',
						name: 'Сгибания рук в тренажере',
						description:
							'Изолирующее упражнение для акцентированной проработки бицепса. Конструкция тренажера фиксирует локти, исключая помощь другими мышцами, и обеспечивает пиковое сокращение в верхней точке движения.',
						image: require('@/assets/training-videos/v20/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v20/v1.png'),
							require('@/assets/training-videos/v20/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_bicep_machine.mp4',
						primaryMuscles: ['Бицепс'],
						secondaryMuscles: ['Брахиалис (плечевая мышца)', 'Предплечья'],
						primaryFrontMuscles: ['leftBiceps', 'rightBiceps'],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Отрегулируйте высоту сиденья так, чтобы подмышки плотно прилегали к краю подушки',
							'Плотно прижмите локти и трицепсы к платформе, не отрывайте их во время подъема',
							'Сгибайте руки плавно, делая акцент на сжатии бицепса в верхней точке',
							'Не разгибайте руки полностью в нижней точке, чтобы сохранить напряжение в мышцах',
							'Держите запястья ровно, не сгибайте их слишком сильно к себе при подъеме',
						],
						equipment: ['Тренажер для бицепса'],
						difficulty: 'Новичок',
					},
					{
						id: 'cable-tricep-pushdown-ez-bar',
						name: 'Разгибания на трицепс на верхнем блоке',
						description:
							'Эффективное изолирующее упражнение для всех трех головок трицепса. Использование блока обеспечивает постоянное натяжение мышц на всей траектории движения, а изогнутая рукоять снижает нагрузку на запястья.',
						image: require('@/assets/training-videos/v25/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v25/v1.png'),
							require('@/assets/training-videos/v25/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_tricep_pushdown.mp4',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: ['Предплечья'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						secondaryBackMuscles: [],
						tips: [
							'Прижмите локти к корпусу и держите их неподвижными на протяжении всего подхода',
							'Разгибайте руки полностью, делая секундную паузу и максимально сжимая трицепс в нижней точке',
							'Не позволяйте весу подниматься слишком высоко (выше уровня груди), чтобы не терять контроль над локтями',
							'Стойте ровно или с легким наклоном вперед, не наваливайтесь на рукоять всем весом тела',
							'Двигайте только предплечьями — плечевая кость должна оставаться строго перпендикулярно полу',
						],
						equipment: ['Блочная рама'],
						difficulty: 'Новичок',
					},
					{
						id: 'cable-tricep-rope-pushdown',
						name: 'Разгибания на трицепс с канатом',
						description:
							'Изолирующее упражнение для глубокой проработки трицепса. Канатная рукоять позволяет увеличить амплитуду движения в нижней точке и максимально нагрузить латеральную (внешнюю) головку мышцы.',
						image: require('@/assets/training-videos/v26/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v26/v1.png'),
							require('@/assets/training-videos/v26/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_tricep_rope.mp4',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: ['Предплечья', 'Локтевая мышца'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						secondaryBackMuscles: [],
						tips: [
							'В нижней точке разводите концы каната в стороны, как бы "выворачивая" кисти наружу',
							'Держите локти строго зафиксированными у корпуса, не позволяйте им уходить вперед или в стороны',
							'Сосредоточьтесь на полном выпрямлении рук и секундной паузе в нижней точке',
							'Сохраняйте корпус неподвижным, избегайте раскачки и помощи весом тела',
							'Контролируйте фазу подъема веса — она должна быть в два раза медленнее, чем опускание',
						],
						equipment: ['Блочная рама'],
						difficulty: 'Новичок',
					},
					{
						id: 'barbell-bicep-curl-standing',
						name: 'Подъем штанги на бицепс стоя',
						description:
							'Базовое упражнение для развития двуглавой мышцы плеча. Работа со свободным весом позволяет задействовать больше мышечных волокон и развивает общую силу рук.',
						image: require('@/assets/training-videos/v27/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v27/v1.png'),
							require('@/assets/training-videos/v27/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_barbell_curl.mp4',
						primaryMuscles: ['Бицепс'],
						secondaryMuscles: ['Брахиалис', 'Предплечья', 'Передняя дельта'],
						primaryFrontMuscles: ['leftBiceps', 'rightBiceps'],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms', 'leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Держите спину прямой, а лопатки слегка сведенными. Не раскачивайте корпус (избегайте читтинга)',
							'Локти должны быть прижаты к бокам и оставаться неподвижными во время всего подъема',
							'Поднимайте штангу до уровня верха груди, максимально прожимая бицепс в верхней точке',
							'Опускайте штангу медленно и подконтрольно, не разгибая руки до конца в нижней точке, чтобы не снимать нагрузку',
							'Используйте средний хват (на ширине плеч), чтобы равномерно распределить нагрузку на оба пучка бицепса',
						],
						equipment: ['Штанга'],
						difficulty: 'Новичок',
					},
					{
						id: 'preacher-curl-barbell',
						name: 'Сгибания рук на скамье Скотта',
						description:
							'Изолирующее упражнение для бицепса, исключающее читтинг и раскачку. Упор локтей в наклонную скамью позволяет максимально нагрузить нижнюю часть бицепса и создать выразительный рельеф.',
						image: require('@/assets/training-videos/v28/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v28/v1.png'),
							require('@/assets/training-videos/v28/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_preacher_curl.mp4',
						primaryMuscles: ['Бицепс'],
						secondaryMuscles: ['Брахиалис', 'Предплечья'],
						primaryFrontMuscles: ['leftBiceps', 'rightBiceps'],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Сядьте так, чтобы подмышки плотно прилегали к верхнему краю скамьи',
							'Держите спину ровной, не сутультесь, опирайтесь грудью в платформу',
							'Опускайте штангу медленно, но не выпрямляйте руки до самого конца (оставляйте мизерный изгиб), чтобы не травмировать локтевые связки',
							'В верхней точке максимально сожмите бицепсы, но не доводите штангу до вертикали, чтобы не терять напряжение в мышце',
							'Следите за тем, чтобы кисти не сгибались слишком сильно к себе — держите их в одну линию с предплечьем',
						],
						equipment: ['Скамья Скотта'],
						difficulty: 'Средний',
					},
					{
						id: 'reverse-barbell-curl-standing',
						name: 'Сгибания рук со штангой обратным хватом',
						description:
							'Упражнение для развития мышц предплечья и плечевой мышцы (брахиалиса). Обратный хват позволяет сместить акцент с бицепса на внешнюю часть руки, что делает руки визуально мощнее и улучшает силу хвата.',
						image: require('@/assets/training-videos/v29/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v29/v1.png'),
							require('@/assets/training-videos/v29/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_reverse_curl.mp4',
						primaryMuscles: ['Предплечья', 'Брахиалис'],
						secondaryMuscles: ['Бицепс'],
						primaryFrontMuscles: ['leftForearms', 'rightForearms'],
						secondaryFrontMuscles: ['leftBiceps', 'rightBiceps'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Держите штангу хватом сверху (ладони смотрят в пол) примерно на ширине плеч',
							'Прижмите локти к туловищу и не двигайте ими во время подъема — вся работа идет только в локтевом суставе',
							'Поднимайте штангу до тех пор, пока предплечья не станут почти вертикальными, и максимально напрягите мышцы вверху',
							'Контролируйте опускание веса, не позволяйте штанге "падать" вниз, растягивая мышцы предплечья',
							'Если прямой гриф создает дискомфорт в запястьях, используйте EZ-гриф (изогнутый)',
						],
						equipment: ['Штанга'],
						difficulty: 'Средний',
					},
					{
						id: 'alternating-dumbbell-bicep-curl',
						name: 'Поочередные сгибания рук с гантелями',
						description:
							'Базовое изолирующее упражнение для бицепса. Поочередное выполнение позволяет лучше сконцентрироваться на работе каждой мышцы, а супинация кисти обеспечивает максимальное сокращение двуглавой мышцы плеча.',
						image: require('@/assets/training-videos/v30/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v30/v1.png'),
							require('@/assets/training-videos/v30/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_dumbbell_curl.mp4',
						primaryMuscles: ['Бицепс'],
						secondaryMuscles: ['Брахиалис', 'Предплечья'],
						primaryFrontMuscles: ['leftBiceps', 'rightBiceps'],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Начинайте движение из положения "нейтрального хвата" (ладони смотрят на бедра), а при подъеме разворачивайте ладонь к потолку',
							'Держите локти неподвижно у корпуса, не выводите их вперед при подъеме гантели',
							'Не используйте инерцию и не раскачивайте корпус, чтобы закинуть вес вверх',
							'В верхней точке сделайте небольшую паузу и дополнительно напрягите бицепс',
							'Опускайте гантель медленно и полностью разворачивайте кисть обратно в нейтральное положение внизу',
						],
						equipment: ['Гантели'],
						difficulty: 'Новичок',
					},
					{
						id: 'dumbbell-hammer-curls',
						name: 'Сгибания рук "Молотки"',
						description:
							'Упражнение с нейтральным хватом для развития брахиалиса и плечелучевой мышцы. Помогает увеличить общую толщину рук и силу хвата, создавая сбалансированный атлетический вид.',
						image: require('@/assets/training-videos/v31/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v31/v1.png'),
							require('@/assets/training-videos/v31/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_hammer_curls.mp4',
						primaryMuscles: ['Брахиалис', 'Предплечья'],
						secondaryMuscles: ['Бицепс'],
						primaryFrontMuscles: ['leftForearms', 'rightForearms'],
						secondaryFrontMuscles: ['leftBiceps', 'rightBiceps'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Держите гантели нейтральным хватом (ладони направлены к корпусу) на протяжении всего движения',
							'Зафиксируйте локти у боков, не позволяя им раскачиваться вперед или назад',
							'Поднимайте гантели до уровня плеч, фокусируясь на напряжении внешней стороны руки',
							'Избегайте раскачки корпусом — если вес тянет вас вперед, возьмите гантели полегче',
							'Опускайте вес подконтрольно, полностью растягивая мышцы в нижней точке',
						],
						equipment: ['Гантели'],
						difficulty: 'Новичок',
					},
					{
						id: 'incline-dumbbell-bicep-curl',
						name: 'Сгибания рук на наклонной скамье',
						description:
							'Упражнение для акцентированной проработки длинной головки бицепса. Наклон спинки скамьи позволяет растянуть мышцу в нижней точке сильнее, чем при обычных сгибаниях, что увеличивает амплитуду и эффективность движения.',
						image: require('@/assets/training-videos/v33/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v33/v1.png'),
							require('@/assets/training-videos/v33/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_incline_bicep_curl.mp4',
						primaryMuscles: ['Бицепс'],
						secondaryMuscles: ['Брахиалис', 'Предплечья'],
						primaryFrontMuscles: ['leftBiceps', 'rightBiceps'],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Установите угол скамьи примерно 45–60 градусов',
							'Плотно прижмите спину и затылок к скамье, не отрывайте лопатки во время подъема',
							'Держите локти строго зафиксированными — они должны быть направлены в пол на протяжении всего упражнения',
							'В нижней точке полностью растягивайте бицепс, но не расслабляйте руки до конца',
							'Выполняйте подъем плавно, избегая раскачки гантелей',
						],
						equipment: ['Гантели'],
						difficulty: 'Средний',
					},
					{
						id: 'single-arm-reverse-grip-tricep-pushdown',
						name: 'Разгибание одной руки обратным хватом',
						description:
							'Изолирующее упражнение для акцентированной проработки медиальной головки трицепса. Односторонний формат выполнения помогает лучше чувствовать мышцу и исправлять дисбаланс в силе рук.',
						image: require('@/assets/training-videos/v38/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v38/v1.png'),
							require('@/assets/training-videos/v38/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_single_arm_tricep.mp4',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: ['Предплечья'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						secondaryBackMuscles: [],
						tips: [
							'Возьмитесь за рукоять хватом снизу (ладонь направлена к потолку)',
							'Прижмите рабочий локоть к корпусу и держите его неподвижным на протяжении всего движения',
							'Полностью разгибайте руку вниз, делая паузу и прожимая трицепс в нижней точке',
							'Контролируйте фазу возврата — не позволяйте весу резко дергать руку вверх',
							'Свободной рукой можно придерживаться за раму тренажера для большей устойчивости корпуса',
						],
						equipment: ['Блочная рама'],
						difficulty: 'Средний',
					},
					{
						id: 'cable-overhead-tricep-extension-rope',
						name: 'Разгибания рук из-за головы на блоке',
						description:
							'Эффективное упражнение для акцентированной проработки длинной головки трицепса. Положение рук над головой обеспечивает максимальное растяжение мышцы, а использование каната позволяет увеличить амплитуду движения.',
						image: require('@/assets/training-videos/v39/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v39/v1.png'),
							require('@/assets/training-videos/v39/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_overhead_cable_tricep.mp4',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: ['Предплечья', 'Зубчатые мышцы'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						secondaryBackMuscles: [],
						tips: [
							'Встаньте спиной к тренажеру, выведя одну ногу вперед для устойчивости',
							'Держите локти ближе к голове, не позволяйте им сильно разлетаться в стороны',
							'Разгибайте руки полностью вверх и немного в стороны, разделяя концы каната',
							'Медленно опускайте канат за голову, чувствуя сильное растяжение в трицепсах',
							'Старайтесь не прогибаться в пояснице, держите мышцы пресса напряженными',
						],
						equipment: ['Блочная рама'],
						difficulty: 'Средний',
					},
					{
						id: 'cable-bicep-curl-straight-bar',
						name: 'Сгибания рук на нижнем блоке',
						description:
							'Упражнение для изоляции бицепса с использованием блочного тренажера. Постоянное сопротивление троса позволяет поддерживать мышечное напряжение на всем пути движения, что способствует лучшему пампингу.',
						image: require('@/assets/training-videos/v40/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v40/v1.png'),
							require('@/assets/training-videos/v40/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_cable_curl.mp4',
						primaryMuscles: ['Бицепс'],
						secondaryMuscles: ['Предплечья', 'Брахиалис'],
						primaryFrontMuscles: ['leftBiceps', 'rightBiceps'],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Встаньте лицом к тренажеру, возьмитесь за рукоять хватом снизу и слегка отступите назад для натяжения троса',
							'Прижмите локти к туловищу и не смещайте их во время подъема',
							'Тяните рукоять к плечам плавно, фокусируясь на сокращении бицепса',
							'Не отклоняйте корпус назад, чтобы помочь себе — работайте только силой рук',
							'Медленно возвращайте рукоять в исходное положение, не позволяя плиткам тренажера хлопать друг о друга',
						],
						equipment: ['Блочная рама'],
						difficulty: 'Новичок',
					},
					{
						id: 'machine-seated-dip',
						name: 'Отжимания на трицепс в тренажере',
						description:
							'Эффективное упражнение для развития силы и объема трицепса. Сидячее положение и фиксированная траектория рычагов позволяют работать с большими весами, максимально нагружая все три головки трицепса.',
						image: require('@/assets/training-videos/v47/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v47/v1.png'),
							require('@/assets/training-videos/v47/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_machine_dip.mp4',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: ['Передняя дельта', 'Нижняя часть грудных'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid', 'leftLowerChest', 'rightLowerChest'],
						primaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						secondaryBackMuscles: [],
						tips: [
							'Плотно прижмите спину к спинке тренажера и удерживайте корпус вертикально',
							'Не разводите локти слишком сильно в стороны — держите их ближе к телу для акцента на трицепс',
							'В нижней точке полностью выпрямляйте руки, прожимая трицепс, но не "вставляйте" локти до щелчка',
							'Поднимайте рукояти подконтрольно до уровня, когда предплечья станут параллельны полу, чтобы не перегружать плечевой сустав',
							'Следите, чтобы плечи не поднимались к ушам — держите лопатки опущенными',
						],
						equipment: ['Рычажный тренажер'],
						difficulty: 'Новичок',
					},
					{
						id: 'bodyweight-tricep-dips',
						name: 'Отжимания на брусьях',
						description:
							'Одно из самых эффективных базовых упражнений с собственным весом. Оно развивает колоссальную силу рук и плечевого пояса, прорабатывая все три головки трицепса и нижний отдел грудных мышц.',
						image: require('@/assets/training-videos/v61/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v61/v1.png'),
							require('@/assets/training-videos/v61/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_dips_bodyweight.mp4',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: ['Нижняя часть грудных', 'Передняя дельта'],
						primaryFrontMuscles: ['leftLowerChest', 'rightLowerChest'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						secondaryBackMuscles: [],
						tips: [
							'Держите корпус максимально вертикально, чтобы сместить акцент на трицепс',
							'Не разводите локти широко в стороны, старайтесь держать их ближе к туловищу',
							'Опускайтесь до тех пор, пока плечо не станет параллельно полу (угол в локте 90°), более глубокий наклон может быть травматичен для плеч',
							'Выжимайте себя вверх мощным движением, полностью выпрямляя руки в верхней точке',
							'Контролируйте движение вниз, избегайте резких падений и рывков',
						],
						equipment: ['Брусья'],
						difficulty: 'Средний',
					},
					{
						id: 'machine-seated-overhead-tricep-extension',
						name: 'Французский жим в тренажере сидя',
						description:
							'Изолирующее упражнение для проработки длинной головки трицепса. Работа в тренажере обеспечивает стабильность корпуса и позволяет безопасно растягивать мышцы под нагрузкой в нижней точке траектории.',
						image: require('@/assets/training-videos/v69/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v69/v1.png'),
							require('@/assets/training-videos/v69/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_machine_overhead_tricep.mp4',
						primaryMuscles: ['Трицепс'],
						secondaryMuscles: ['Предплечья'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['leftForearms', 'rightForearms'],
						primaryBackMuscles: ['leftTriceps', 'rightTriceps'],
						secondaryBackMuscles: [],
						tips: [
							'Плотно прижмите спину к спинке тренажера, не прогибайтесь в пояснице',
							'Старайтесь держать локти направленными вверх и не разводите их слишком сильно в стороны',
							'Плавно опускайте рукоять за голову до ощущения комфортного растяжения в трицепсах',
							'На выдохе мощно разгибайте руки вверх, полностью сокращая трицепс в верхней точке',
							'Избегайте резких движений — тренажер требует плавного и подконтрольного темпа',
						],
						equipment: ['Рычажный тренажер'],
						difficulty: 'Новичок',
					},
				],
			},
			{
				id: 'triceps',
				name: 'Трицепс',
				image: manBackMuscleGroupParts.triceps,
				exercises: [
					{ id: 'close-grip-bench-press', name: 'Жим штанги лёжа узким хватом', description: 'База для всех головок.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=wsDyQ0jCBV8', primaryMuscles: ['Трицепс'], secondaryMuscles: ['Грудь'], tips: ['Хват узкий'], equipment: ['Штанга', 'Скамья'], difficulty: 'Средний' },
					{ id: 'tricep-dips', name: 'Отжимания на брусьях (трицепс)', description: 'Вертикальный корпус для трицепса.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Локти назад'], equipment: ['Брусья'], difficulty: 'Высокий' },
					{ id: 'bench-dips', name: 'Отжимания на скамье', description: 'Лёгкий вариант dips.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=some-bench-dips', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Ноги вперёд'], equipment: ['Скамья'], difficulty: 'Средний' },
					{ id: 'tricep-pushdown-rope', name: 'Разгибания на блоке канатом', description: 'Изоляция + памп.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=2-LAMcpzODU', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Развод внизу'], equipment: ['Блок'], difficulty: 'Средний' },
					{ id: 'tricep-pushdown-bar', name: 'Разгибания на блоке прямым грифом', description: 'Классика.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=2-LAMcpzODU', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Локти прижаты'], equipment: ['Блок'], difficulty: 'Средний' },
					{ id: 'overhead-tricep-extension-ez', name: 'Французский жим сидя EZ', description: 'Длинная головка + растяжка.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=YbX7wdC_jvI', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Локти вверх'], equipment: ['EZ-штанга'], difficulty: 'Средний' },
					{ id: 'skull-crushers-ez', name: 'Французский жим лёжа (skull crushers)', description: 'Изоляция.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0lI', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Ко лбу'], equipment: ['EZ-штанга'], difficulty: 'Средний' },
					{ id: 'tricep-kickback', name: 'Kickbacks гантелями', description: 'Латеральная головка + памп.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=Zwd0gO4S2lY', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Плечо фиксировано'], equipment: ['Гантели'], difficulty: 'Средний' },
					{ id: 'diamond-pushup', name: 'Отжимания ромбиком', description: 'Bodyweight трицепс.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=VM2a4v0eS2o', primaryMuscles: ['Трицепс'], secondaryMuscles: ['Грудь'], tips: ['Руки ромбом'], equipment: ['Собственный вес'], difficulty: 'Средний' },
					{ id: 'overhead-cable-extension', name: 'Overhead на блоке', description: 'Постоянное натяжение.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=some-overhead-cable', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Канат'], equipment: ['Кроссовер'], difficulty: 'Средний' },
					{ id: 'jm-press', name: 'JM press', description: 'Гибрид skull + close-grip.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=some-jm-press', primaryMuscles: ['Трицепс'], secondaryMuscles: [], tips: ['Локти вперёд'], equipment: ['Штанга'], difficulty: 'Средний' },
					// ... Добавь reverse grip pushdown, single-arm overhead, etc.
				],
			},
			{
				id: 'forearms',
				name: 'Предплечья',
				image: manFrontMuscleGroupParts.forearmFull,
				exercises: [
					{ id: 'wrist-curl', name: 'Сгибания запястий', description: 'Сгибатели + хват.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=3QeT2rH2Y0E', primaryMuscles: ['Предплечья'], secondaryMuscles: [], tips: ['Ладони вверх'], equipment: ['Штанга'], difficulty: 'Средний' },
					{ id: 'reverse-wrist-curl', name: 'Разгибания запястий', description: 'Разгибатели.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=7v4oD8X0d1E', primaryMuscles: ['Предплечья'], secondaryMuscles: [], tips: ['Ладони вниз'], equipment: ['EZ-штанга'], difficulty: 'Средний' },
					{ id: 'farmer-walk', name: 'Фермерская прогулка', description: 'Функционал + хват.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=Iv0V3dg0F9Y', primaryMuscles: ['Предплечья'], secondaryMuscles: [], tips: ['Тяжёлые гантели'], equipment: ['Гантели'], difficulty: 'Высокий' },
					{ id: 'plate-pinch', name: 'Пинч пластин', description: 'Pinch grip.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=some-plate-pinch', primaryMuscles: ['Предплечья'], secondaryMuscles: [], tips: ['Держать 30-60 сек'], equipment: ['Блины'], difficulty: 'Средний' },
					{ id: 'towel-pull-up', name: 'Подтягивания на полотенце', description: 'Толстый хват.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=some-towel-pullup', primaryMuscles: ['Предплечья'], secondaryMuscles: ['Спина'], tips: ['Полотенце на турнике'], equipment: ['Турник'], difficulty: 'Высокий' },
					{ id: 'dead-hang', name: 'Вис на перекладине', description: 'Изометрия хвата.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=some-dead-hang', primaryMuscles: ['Предплечья'], secondaryMuscles: [], tips: ['Макс время'], equipment: ['Турник'], difficulty: 'Средний' },
					{ id: 'hand-gripper', name: 'Hand gripper squeezes', description: 'Crush grip.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=some-gripper', primaryMuscles: ['Предплечья'], secondaryMuscles: [], tips: ['До отказа'], equipment: ['Gripper'], difficulty: 'Средний' },
					{ id: 'fat-bar-hold', name: 'Fat bar holds', description: 'Толстый гриф.', image: manBackMuscleGroupParts.spineFull, videoUrl: 'https://www.youtube.com/watch?v=some-fat-bar', primaryMuscles: ['Предплечья'], secondaryMuscles: [], tips: ['Держать'], equipment: ['Fat grips'], difficulty: 'Высокий' },
					// ... rice bucket, finger curls, etc.
				],
			},
		],
	},
	{
		id: 'deltoids',
		name: 'Дельты',
		image: manFrontMuscleGroupParts.deltoidsFull,
		imagePosition: {
			width: '100%',
			top: 20,
		},
		subgroups: [
			{
				id: 'deltoids-front',
				name: 'Передние дельты',
				image: manFrontMuscleGroupParts.frontDeltoid || manFrontMuscleGroupParts.deltoidsFull,
				exercises: [
					{
						id: 'rear-delt-fly-machine',
						name: 'Обратные разведения в тренажере (Reverse Fly)',
						description:
							'Изолирующее упражнение для проработки заднего пучка дельтовидных мышц. Помогает улучшить осанку и создать завершенную шаровидную форму плеч, минимизируя нагрузку на мышцы спины при правильной технике.',
						image: require('@/assets/training-videos/v9/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v9/v1.png'),
							require('@/assets/training-videos/v9/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Задняя дельта'],
						secondaryMuscles: ['Ромбовидные мышцы', 'Средняя трапеция'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftRearDeltoid', 'rightRearDeltoid'],
						secondaryBackMuscles: ['trapezius', 'upperBack'],
						tips: [
							'Отрегулируйте высоту сиденья так, чтобы руки были параллельны полу',
							'Держите локти слегка согнутыми и направленными в стороны, не "выключайте" их',
							'Отводите руки назад до уровня плеч, фокусируясь на работе плеч, а не на сведении лопаток',
							'Не позволяйте весу полностью опускаться в исходной точке, чтобы сохранять напряжение',
							'Старайтесь не помогать себе корпусом, плотно прижмитесь грудью к спинке тренажера',
						],
						equipment: ['Тренажер Peck-Deck'],
						difficulty: 'Новичок',
					},
					{
						id: 'lever-shoulder-press',
						name: 'Жим на плечи в рычажном тренажере',
						description:
							'Базовое упражнение для развития плечевого пояса. Тренажер обеспечивает стабильную траекторию, что позволяет безопасно работать с большими весами и максимально нагружать передние и средние дельты.',
						image: require('@/assets/training-videos/v24/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v24/v1.png'),
							require('@/assets/training-videos/v24/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_shoulder_press.mp4',
						primaryMuscles: ['Передняя дельта', 'Средняя дельта'],
						secondaryMuscles: ['Трицепс', 'Верхняя часть трапеции'],
						primaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid', 'leftMiddleDeltoid', 'rightMiddleDeltoid'],
						secondaryFrontMuscles: ['leftTriceps', 'rightTriceps'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['trapezius'],
						tips: [
							'Отрегулируйте высоту сиденья так, чтобы рукоятки в нижней точке находились на уровне или чуть выше плеч',
							'Плотно прижмите спину и затылок к спинке тренажера, не прогибайтесь сильно в пояснице',
							'Выжимайте рукоятки вверх на выдохе, не выпрямляя локти до "щелчка" в верхней точке',
							'Контролируйте движение при опускании веса, не бросайте его резко вниз',
							'Держите локти слегка направленными вперед, а не строго в стороны, чтобы снизить нагрузку на суставы',
						],
						equipment: ['Рычажный тренажер'],
						difficulty: 'Новичок',
					},
					{
						id: 'seated-dumbbell-shoulder-press',
						name: 'Жим гантелей сидя',
						description:
							'Базовое упражнение для проработки дельтовидных мышц. Позволяет работать по большой амплитуде и обеспечивает независимую нагрузку на каждое плечо, что помогает исправить мышечный дисбаланс.',
						image: require('@/assets/training-videos/v32/v1.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v32/v1.png'),
							require('@/assets/training-videos/v32/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_dumbbell_press.mp4',
						primaryMuscles: ['Передняя дельта', 'Средняя дельта'],
						secondaryMuscles: ['Трицепс', 'Верхняя часть трапеции'],
						primaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid', 'leftMiddleDeltoid', 'rightMiddleDeltoid'],
						secondaryFrontMuscles: ['leftTriceps', 'rightTriceps'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['trapezius'],
						tips: [
							'Установите спинку скамьи под углом 80-90 градусов для надежной опоры',
							'Держите гантели на уровне ушей в начальной точке, локти направлены слегка вперед, а не строго в стороны',
							'На выдохе мощно выжимайте гантели вверх, не допуская их соударения в верхней точке',
							'Не выпрямляйте локти полностью вверху, чтобы сохранить напряжение в дельтах',
							'Опускайте гантели подконтрольно, чувствуя растяжение плечевых мышц',
						],
						equipment: ['Гантели', 'Скамья со спинкой'],
						difficulty: 'Средний',
					},
					{
						id: 'dumbbell-lateral-raise',
						name: 'Разводка гантелей в стороны',
						description:
							'Изолирующее упражнение для акцентированной проработки средней дельты. Позволяет создать ширину плечевого пояса и улучшить мышечный рельеф рук.',
						image: require('@/assets/training-videos/v34/v2.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v34/v1.png'),
							require('@/assets/training-videos/v34/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_lateral_raise.mp4',
						primaryMuscles: ['Средняя дельта'],
						secondaryMuscles: ['Передняя дельта', 'Трапециевидные мышцы'],
						primaryFrontMuscles: ['leftMiddleDeltoid', 'rightMiddleDeltoid'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['trapezius'],
						tips: [
							'Поднимайте гантели до уровня плеч, не выше, чтобы не перегружать трапецию',
							'Держите локти слегка согнутыми и ведите их вверх — локоть всегда должен быть чуть выше кисти',
							'Не используйте инерцию (читтинг), корпус должен оставаться неподвижным',
							'В верхней точке мизинец должен быть слегка выше большого пальца (представьте, что выливаете воду из кувшинов)',
							'Опускайте гантели медленно, сопротивляясь весу, не позволяя им просто падать вниз',
						],
						equipment: ['Гантели'],
						difficulty: 'Средний',
					},
					{
						id: 'dumbbell-front-raise-standing',
						name: 'Подъем гантелей перед собой',
						description:
							'Изолирующее упражнение, направленное на детальную проработку переднего пучка дельтовидных мышц. Оно помогает четко очертить переднюю линию плеча и улучшить его рельеф.',
						image: require('@/assets/training-videos/v35/v2.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v35/v1.png'),
							require('@/assets/training-videos/v35/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_front_raise.mp4',
						primaryMuscles: ['Передняя дельта'],
						secondaryMuscles: ['Средняя дельта', 'Верхняя часть грудных'],
						primaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						secondaryFrontMuscles: ['leftMiddleDeltoid', 'rightMiddleDeltoid', 'leftChest', 'rightChest'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['trapezius'],
						tips: [
							'Поднимайте гантели до уровня глаз или чуть выше, сохраняя контроль в верхней точке',
							'Не раскачивайте корпус — если приходится помогать себе телом, значит вес слишком тяжелый',
							'Держите локти "мягкими" (слегка согнутыми) на протяжении всего движения',
							'Опускайте гантели плавно и подконтрольно, не позволяя им просто падать вниз под своим весом',
							'Старайтесь не сводить плечи вперед, держите грудь расправленной',
						],
						equipment: ['Гантели'],
						difficulty: 'Новичок',
					},
					{
						id: 'seated-bent-over-dumbbell-reverse-fly',
						name: 'Разведение гантелей в наклоне сидя',
						description:
							'Изолирующее упражнение для заднего пучка дельтовидных мышц. Выполнение сидя минимизирует читтинг (раскачку корпусом) и позволяет максимально сфокусироваться на целевой мышце.',
						image: require('@/assets/training-videos/v36/v1.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v36/v1.png'),
							require('@/assets/training-videos/v36/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_rear_delt_seated.mp4',
						primaryMuscles: ['Задняя дельта'],
						secondaryMuscles: ['Ромбовидные', 'Средняя трапеция', 'Малая круглая мышца'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftRearDeltoid', 'rightRearDeltoid'],
						secondaryBackMuscles: ['trapezius', 'upperBack'],
						tips: [
							'Наклонитесь вперед так, чтобы грудь почти касалась коленей, спину держите ровной',
							'Разводите гантели в стороны через локти, стараясь не сводить лопатки слишком сильно в верхней точке',
							'Держите мизинцы чуть выше больших пальцев во время подъема для лучшей изоляции задней дельты',
							'Не поднимайте голову вверх, взгляд должен быть направлен в пол перед собой, чтобы не перенапрягать шею',
							'Двигайтесь плавно, без рывков, и делайте небольшую паузу в верхней точке сокращения',
						],
						equipment: ['Гантели', 'Горизонтальная скамья'],
						difficulty: 'Средний',
					},
					{
						id: 'cable-face-pull',
						name: 'Лицевая тяга на верхнем блоке',
						description:
							'Упражнение для укрепления задней дельты, ротаторной манжеты плеча и мышц верха спины. Помогает исправить "округлые плечи" и улучшить стабильность плечевого сустава.',
						image: require('@/assets/training-videos/v37/v2.png'),
						imagePosition: {
							width: '140%',
							left: -30,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v37/v1.png'),
							require('@/assets/training-videos/v37/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_face_pull.mp4',
						primaryMuscles: ['Задняя дельта'],
						secondaryMuscles: ['Средняя трапеция', 'Ромбовидные', 'Подостная мышца'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftRearDeltoid', 'rightRearDeltoid'],
						secondaryBackMuscles: ['trapezius', 'upperBack'],
						tips: [
							'Возьмитесь за концы каната так, чтобы большие пальцы были направлены к вам',
							'Тяните канат к лицу (к уровню лба или носа), разводя концы каната в стороны',
							'В конечной точке локти должны быть направлены в стороны, а кисти находиться выше локтей (внешняя ротация)',
							'Сжимайте лопатки в пиковой точке и задержитесь на 1 секунду',
							'Контролируйте движение при возврате, не позволяя блоку резко тянуть ваши руки вперед',
						],
						equipment: ['Блочная рама'],
						difficulty: 'Средний',
					},
					{
						id: 'lateral-raise-machine',
						name: 'Разведения в тренажере на среднюю дельту',
						description:
							'Изолирующее упражнение для акцентированной проработки среднего пучка дельтовидных мышц. Использование тренажера минимизирует участие трапециевидных мышц и позволяет лучше контролировать технику.',
						image: require('@/assets/training-videos/v68/v2.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v68/v1.png'),
							require('@/assets/training-videos/v68/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_lateral_machine.mp4',
						primaryMuscles: ['Средняя дельта'],
						secondaryMuscles: ['Передняя дельта', 'Трапециевидные мышцы'],
						primaryFrontMuscles: ['leftMiddleDeltoid', 'rightMiddleDeltoid'],
						secondaryFrontMuscles: ['leftFrontDeltoid', 'rightFrontDeltoid'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['trapezius'],
						tips: [
							'Отрегулируйте высоту сиденья так, чтобы оси вращения тренажера совпадали с вашими плечевыми суставами',
							'Плотно прижмитесь спиной к спинке и держите грудь расправленной',
							'Упирайтесь локтями (а не кистями) в подушки тренажера для лучшей изоляции дельт',
							'Поднимайте рычаги до уровня плеч и делайте небольшую паузу в верхней точке',
							'Опускайте вес медленно, не позволяя плитам тренажера соприкасаться, чтобы сохранять нагрузку',
						],
						equipment: ['Разведение в стороны'],
						difficulty: 'Новичок',
					},
				],
			},
			{
				id: 'deltoids-lateral',
				name: 'Средние дельты',
				image: manFrontMuscleGroupParts.middleDeltoid || manFrontMuscleGroupParts.deltoidsFull,
				exercises: [
					{
						id: 'dumbbell-lateral-raise',
						name: 'Махи гантелей в стороны стоя',
						description:
							'Лучшее изолирующее упражнение для ширины плеч. Максимально нагружает средний пучок.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
						primaryMuscles: ['Средние дельты'],
						secondaryMuscles: ['Передние дельты', 'Трапеции'],
						tips: [
							'Лёгкий изгиб в локтях, ладони чуть вниз (pouring water)',
							'Поднимайте до уровня плеч, не выше',
							'Не раскачивайтесь — движение только в плечах',
							'Медленный негатив + пауза внизу',
							'Используйте лёгкие веса для техники',
						],
						equipment: ['Гантели'],
						difficulty: 'Средний',
					},
					{
						id: 'cable-lateral-raise',
						name: 'Махи в стороны на нижнем блоке',
						description:
							'Постоянное натяжение — лучшее для пампа и сепарации средних дельт.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-cable-lateral',
						primaryMuscles: ['Средние дельты'],
						secondaryMuscles: [],
						tips: ['Одной рукой, кабель за спиной или спереди'],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
					},
					{
						id: 'upright-row-ez',
						name: 'Тяга штанги / EZ к подбородку',
						description:
							'Базовое для средних дельт + трапеций. Широкий хват — акцент на дельты.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=VIoihl5ZZzM',
						primaryMuscles: ['Средние дельты'],
						secondaryMuscles: ['Трапеции', 'Передние дельты'],
						tips: ['Локти выше кистей', 'Не поднимайте выше плеч (риск для ротаторов)'],
						equipment: ['EZ-штанга / Штанга'],
						difficulty: 'Средний',
					},
					{
						id: 'machine-lateral-raise',
						name: 'Махи в стороны в тренажёре',
						description:
							'Изоляция + удобство для добивки средних дельт.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-machine-lateral',
						primaryMuscles: ['Средние дельты'],
						secondaryMuscles: [],
						tips: ['Сидя или стоя'],
						equipment: ['Тренажёр для махов'],
						difficulty: 'Средний',
					},
					// ... Добавь dumbbell hip hugger, Egyptian lateral raise и т.д.
				],
			},
			{
				id: 'deltoids-rear',
				name: 'Задние дельты',
				image: manBackMuscleGroupParts.deltoidFull || manFrontMuscleGroupParts.deltoidsFull,
				exercises: [
					{
						id: 'face-pull',
						name: 'Face pull (тяга каната к лицу)',
						description:
							'Лучшее упражнение для задних дельт + ротаторов. Улучшает осанку и здоровье плеч.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=HdayfWP3QfQ',
						primaryMuscles: ['Задние дельты'],
						secondaryMuscles: ['Трапеции', 'Ромбовидные', 'Ротаторы'],
						tips: [
							'Канат на уровне глаз',
							'Тяните к лицу, локти высоко',
							'Разводите канат в стороны в конце',
							'Пиковое сокращение + внешняя ротация',
							'Лёгкий вес — фокус на технике',
						],
						equipment: ['Кроссовер с канатом'],
						difficulty: 'Средний',
					},
					{
						id: 'rear-delt-fly-dumbbell',
						name: 'Разведения гантелей в наклоне (rear delt fly)',
						description:
							'Классика для задних дельт. Отлично формирует "3D" плечи.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=6R7p0rF5lTI',
						primaryMuscles: ['Задние дельты'],
						secondaryMuscles: ['Трапеции', 'Ромбовидные'],
						tips: [
							'Наклон вперёд 45–60°',
							'Лёгкий изгиб в локтях',
							'Разводите руки по дуге, сводите лопатки',
							'Не поднимайте выше уровня плеч',
							'Можно сидя на наклонной скамье',
						],
						equipment: ['Гантели'],
						difficulty: 'Средний',
					},
					{
						id: 'reverse-pec-deck',
						name: 'Разведения в тренажёре (reverse pec deck / butterfly rear)',
						description:
							'Максимальная изоляция задних дельт с удобной фиксацией.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-reverse-pec-deck',
						primaryMuscles: ['Задние дельты'],
						secondaryMuscles: ['Ромбовидные'],
						tips: ['Грудь к спинке', 'Разводите до пикового сокращения'],
						equipment: ['Pec-deck / Butterfly'],
						difficulty: 'Средний',
					},
					{
						id: 'bent-over-reverse-fly-cable',
						name: 'Разведения в кроссовере в наклоне',
						description:
							'Постоянное натяжение для задних дельт.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-cable-rear-fly',
						primaryMuscles: ['Задние дельты'],
						secondaryMuscles: [],
						tips: ['Кабели снизу или сверху'],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
					},
					{
						id: 'incline-row-rear-delt',
						name: 'Тяга в наклоне на 45° (rear delt row)',
						description:
							'Комплекс для задних дельт + верх спины.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-incline-rear-row',
						primaryMuscles: ['Задние дельты'],
						secondaryMuscles: ['Трапеции', 'Ромбовидные'],
						tips: ['Локти высоко'],
						equipment: ['Гантели / Штанга'],
						difficulty: 'Средний',
					},
					// ... Добавь band pull-apart, Y-raises, underhand rear raise и т.д.
				],
			},
		],
	},
	{
		id: 'press',
		name: 'Пресс',
		image: manFrontMuscleGroupParts.pressFull,
		imagePosition: {
			width: '100%',
			top: -60,
		},
		subgroups: [
			{
				id: 'press-upper',
				name: 'Верхний пресс',
				image: manFrontMuscleGroupParts.upperFullAbs || manFrontMuscleGroupParts.pressFull,
				exercises: [
					{
						id: 'crunch',
						name: 'Скручивания лёжа (crunches)',
						description:
							'Классика для верхней части пресса. Максимально нагружает верх rectus abdominis при спинальной флексии.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=Xyd_fa5cO1s',
						primaryMuscles: ['Верхний пресс'],
						secondaryMuscles: ['Косые мышцы'],
						tips: [
							'Поднимайте только лопатки, не тяните шею',
							'Сжимайте пресс вверху 1–2 секунды',
							'Медленный негатив — не падайте вниз',
							'Дыхание: выдох на подъёме',
							'Для прогресса — добавьте вес на грудь',
						],
						equipment: ['Собственный вес', 'Пол / коврик'],
						difficulty: 'Начальный / Средний',
					},
					{
						id: 'stability-ball-crunch',
						name: 'Скручивания на фитболе',
						description:
							'Лучшее по EMG для верхнего пресса — больший диапазон + активация на 24–38% выше обычных скручиваний.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-stability-ball-crunch',
						primaryMuscles: ['Верхний пресс'],
						secondaryMuscles: ['Глубокий кор'],
						tips: [
							'Спина на мяче, ноги на полу',
							'Поднимайтесь до пикового сокращения',
							'Не раскачивайтесь — фокус на пресс',
						],
						equipment: ['Фитбол'],
						difficulty: 'Средний',
					},
					{
						id: 'bicycle-crunch',
						name: 'Велосипед (bicycle crunches)',
						description:
							'Топ-1 по EMG для всего пресса, сильно нагружает верх + косые.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
						primaryMuscles: ['Верхний пресс', 'Косые'],
						secondaryMuscles: ['Нижний пресс'],
						tips: [
							'Локоть к противоположному колену',
							'Медленно, с контролем',
							'Не тяните шею руками',
						],
						equipment: ['Собственный вес'],
						difficulty: 'Средний',
					},
					{
						id: 'weighted-crunch',
						name: 'Скручивания с весом',
						description:
							'Для гипертрофии верхнего пресса — добавьте блин или гантель.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-weighted-crunch',
						primaryMuscles: ['Верхний пресс'],
						secondaryMuscles: ['Косые'],
						tips: ['Вес на груди', '8–15 повторений'],
						equipment: ['Блин / гантель'],
						difficulty: 'Средний / Высокий',
					},
					// ... Добавь cable crunch, dragon flag variations, etc.
				],
			},
			{
				id: 'press-lower',
				name: 'Нижний пресс',
				image: manFrontMuscleGroupParts.lowerFullAbs || manFrontMuscleGroupParts.pressFull,
				exercises: [
					{
						id: 'reverse-crunch',
						name: 'Обратные скручивания (reverse crunches)',
						description:
							'Лучшее для нижнего пресса — таз поднимается к рёбрам, максимальная активация lower rectus.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-reverse-crunch',
						primaryMuscles: ['Нижний пресс'],
						secondaryMuscles: ['Глубокий кор'],
						tips: [
							'Поднимайте таз, не ноги',
							'Не раскачивайтесь',
							'Контролируйте негатив',
						],
						equipment: ['Собственный вес'],
						difficulty: 'Средний',
					},
					{
						id: 'hanging-leg-raise',
						name: 'Подъёмы ног в висе (hanging leg raises)',
						description:
							'Топ по EMG для lower abs + hip flexors.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-hanging-leg-raise',
						primaryMuscles: ['Нижний пресс'],
						secondaryMuscles: ['Косые'],
						tips: ['Поднимайте таз в конце', 'Не раскачивайтесь'],
						equipment: ['Турник'],
						difficulty: 'Высокий',
					},
					{
						id: 'captain-chair-leg-raise',
						name: 'Подъёмы ног в упоре (captain’s chair)',
						description:
							'Вертикальный вариант — максимум для нижнего пресса.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-captain-chair',
						primaryMuscles: ['Нижний пресс'],
						secondaryMuscles: ['Глубокий кор'],
						tips: ['Поднимайте колени к груди'],
						equipment: ['Captain’s chair'],
						difficulty: 'Средний / Высокий',
					},
					{
						id: 'ab-wheel-rollout',
						name: 'Выкатывания на ролике (ab wheel rollout)',
						description:
							'Анти-экстензия + high lower abs activation.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-ab-wheel',
						primaryMuscles: ['Нижний пресс'],
						secondaryMuscles: ['Верхний пресс'],
						tips: ['Из колен для новичков'],
						equipment: ['Ab wheel'],
						difficulty: 'Высокий',
					},
					// ... Добавь scissor kicks, flutter kicks, etc.
				],
			},
			{
				id: 'press-obliques',
				name: 'Косые мышцы',
				image: manFrontMuscleGroupParts.obliqueFullAbs || manFrontMuscleGroupParts.pressFull,
				exercises: [
					{
						id: 'russian-twist',
						name: 'Русские скручивания (Russian twists)',
						description:
							'Ротация для косых — внешние + внутренние.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-russian-twist',
						primaryMuscles: ['Косые мышцы'],
						secondaryMuscles: ['Верхний / нижний пресс'],
						tips: ['С весом для прогресса'],
						equipment: ['Медбол / блин'],
						difficulty: 'Средний',
					},
					{
						id: 'side-plank',
						name: 'Боковая планка (side plank)',
						description:
							'Изометрия для косых + стабилизация.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-side-plank',
						primaryMuscles: ['Косые мышцы'],
						secondaryMuscles: ['Глубокий кор'],
						tips: ['Держите 30–60 сек'],
						equipment: ['Собственный вес'],
						difficulty: 'Средний',
					},
					{
						id: 'woodchopper-cable',
						name: 'Дровосек на блоке (cable woodchoppers)',
						description:
							'Ротация + функционал для косых.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-woodchopper',
						primaryMuscles: ['Косые мышцы'],
						secondaryMuscles: ['Пресс'],
						tips: ['От высокого к низкому'],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
					},
					{
						id: 'bicycle-crunch',
						name: 'Велосипед (bicycle crunches)',
						description:
							'Топ по EMG для косых + всего пресса.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
						primaryMuscles: ['Косые мышцы'],
						secondaryMuscles: ['Верхний / нижний пресс'],
						tips: ['Медленно, с контролем'],
						equipment: ['Собственный вес'],
						difficulty: 'Средний',
					},
					// ... Добавь Pallof press, side bends, etc.
				],
			},
			{
				id: 'press-deep-core',
				name: 'Глубокий кор',
				image: manFrontMuscleGroupParts.pressFull || manFrontMuscleGroupParts.pressFull,
				exercises: [
					{
						id: 'vacuum',
						name: 'Вакуум (stomach vacuum)',
						description:
							'Классика для transverse abdominis — "втягивание живота".',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-stomach-vacuum',
						primaryMuscles: ['Глубокий кор'],
						secondaryMuscles: [],
						tips: ['Вдох — расслабь, выдох — втяни'],
						equipment: ['Собственный вес'],
						difficulty: 'Начальный',
					},
					{
						id: 'plank',
						name: 'Планка (plank)',
						description:
							'Анти-экстензия — максимум для TA + всего кора.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-plank',
						primaryMuscles: ['Глубокий кор'],
						secondaryMuscles: ['Пресс'],
						tips: ['Держите 30–120 сек'],
						equipment: ['Собственный вес'],
						difficulty: 'Средний',
					},
					{
						id: 'bird-dog',
						name: 'Птица-собака (bird dog)',
						description:
							'Стабилизация + TA + multifidus.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-bird-dog',
						primaryMuscles: ['Глубокий кор'],
						secondaryMuscles: ['Спина'],
						tips: ['Рука и противоположная нога'],
						equipment: ['Собственный вес'],
						difficulty: 'Средний',
					},
					{
						id: 'dead-bug',
						name: 'Мёртвый жук (dead bug)',
						description:
							'Анти-экстензия + TA активация без нагрузки на спину.',
						image: manBackMuscleGroupParts.spineFull,
						videoUrl: 'https://www.youtube.com/watch?v=some-dead-bug',
						primaryMuscles: ['Глубокий кор'],
						secondaryMuscles: ['Нижний пресс'],
						tips: ['Спина прижата к полу'],
						equipment: ['Собственный вес'],
						difficulty: 'Средний',
					},
					// ... Добавь hollow hold, bracing, etc.
				],
			},
		],
	},
	{
		id: 'legs',
		name: 'Ноги',
		image: manFrontMuscleGroupParts.upperLegFull,
		imagePosition: {
			width: '100%',
			top: -140,
		},
		subgroups: [
			{
				id: 'vastus-lateralis',
				name: 'Латеральная широкая мышца бедра',
				image: manFrontMuscleGroupParts.vastusLateralis,
				exercises: [
					{
						id: 'lying-leg-curls',
						name: 'Сгибания ног лежа',
						description:
							'Изолирующее упражнение для проработки мышц задней поверхности бедра (бицепса бедра). Работа в тренажере позволяет поддерживать постоянное напряжение и безопасно нагружать мышцы под разными углами.',
						image: require('@/assets/training-videos/v4/v1.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v4/v1.png'),
							require('@/assets/training-videos/v4/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Бицепс бедра'],
						secondaryMuscles: ['Икроножные мышцы'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftHamstring', 'rightHamstring'],
						secondaryBackMuscles: ['leftCalves', 'rightCalves'],
						tips: [
							'Отрегулируйте валик так, чтобы он упирался в нижнюю часть голени, чуть выше ахиллова сухожилия',
							'Колени должны находиться на одной линии с осью вращения тренажера',
							'Плотно прижимайте таз к скамье во время выполнения, чтобы исключить нагрузку на поясницу',
							'Выполняйте сгибание мощно, а разгибание — медленно и подконтрольно',
							'Не разгибайте ноги до самого конца, сохраняя легкое напряжение в мышцах в нижней точке',
						],
						equipment: ['Тренажер для сгибания ног'],
						difficulty: 'Новичок',
					},
					{
						id: 'seated-leg-extensions',
						name: 'Разгибания ног сидя',
						description:
							'Изолирующее упражнение для акцентированной проработки четырехглавой мышцы бедра (квадрицепса). Позволяет максимально нагрузить мышцы без вовлечения спины и ягодиц.',
						image: require('@/assets/training-videos/v5/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v5/v1.png'),
							require('@/assets/training-videos/v5/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Квадрицепс'],
						secondaryMuscles: [],
						primaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						secondaryFrontMuscles: [],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Отрегулируйте спинку так, чтобы подколенный сгиб плотно прилегал к краю сиденья',
							'Валик должен находиться на нижней части голени, прямо над голеностопным суставом',
							'Держитесь за рукоятки по бокам, чтобы таз не отрывался от сиденья при усилии',
							'В верхней точке полностью разгибайте ноги и делайте секундную паузу для пикового сокращения',
							'Опускайте вес плавно, не позволяя плиткам тренажера соприкасаться в нижней точке',
						],
						equipment: ['Тренажер для разгибания ног'],
						difficulty: 'Новичок',
					},
					{
						id: 'seated-hip-adduction',
						name: 'Сведение ног в тренажере сидя',
						description:
							'Изолирующее упражнение для проработки внутренней поверхности бедра (приводящих мышц). Помогает укрепить мышцы, которые часто остаются недогруженными в базовых движениях, и улучшить стабильность таза.',
						image: require('@/assets/training-videos/v6/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v6/v1.png'),
							require('@/assets/training-videos/v6/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Приводящие мышцы бедра'],
						secondaryMuscles: [],
						primaryFrontMuscles: ['innerThigh'], // Внутренняя часть бедра на схеме
						secondaryFrontMuscles: [],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Отрегулируйте ширину разведения рычагов до комфортного растяжения в исходной точке',
							'Спина должна быть плотно прижата к спинке тренажера на протяжении всего подхода',
							'Выполняйте сведение мощно, делая небольшую паузу в точке максимального сокращения',
							'Медленно возвращайте ноги в исходное положение, контролируя вес и не допуская удара плиток',
							'Держитесь за рукоятки по бокам для лучшей стабилизации корпуса',
						],
						equipment: ['Тренажер для сведения ног'],
						difficulty: 'Новичок',
					},

					{
						id: 'seated-hip-abduction',
						name: 'Разведение ног в тренажере сидя',
						description:
							'Изолирующее упражнение для проработки внешней поверхности бедра и ягодичных мышц. Помогает улучшить контур бедер и стабилизировать тазобедренный сустав.',
						image: require('@/assets/training-videos/v7/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v7/v1.png'),
							require('@/assets/training-videos/v7/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Ягодичные мышцы', 'Внешняя часть бедра'],
						secondaryMuscles: ['Напрягатель широкой фасции'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['outerThigh'],
						primaryBackMuscles: ['leftGluteus', 'rightGluteus'],
						secondaryBackMuscles: [],
						tips: [
							'Плотно прижмите спину к сиденью. Для усиления нагрузки на ягодицы можно слегка наклонить корпус вперед',
							'Разводите ноги максимально широко, делая паузу в точке максимального напряжения',
							'Возвращайте ноги в исходное положение медленно, не позволяя грузам полностью опускаться',
							'Держитесь за рукоятки тренажера, чтобы зафиксировать положение таза',
							'Следите, чтобы движение происходило именно в тазобедренных суставах, а не за счет раскачки корпуса',
						],
						equipment: ['Тренажер для разведения ног'],
						difficulty: 'Новичок',
					},
					{
						id: 'incline-leg-press',
						name: 'Жим ногами в тренажере',
						description:
							'Фундаментальное упражнение для развития квадрицепсов, ягодиц и бицепсов бедра. Наклонная платформа позволяет работать с большими весами при полной поддержке спины, что делает его безопасной альтернативой приседаниям.',
						image: require('@/assets/training-videos/v10/v1.png'),
						imagePosition: {
							width: '140%',
							left: -30,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v10/v1.png'),
							require('@/assets/training-videos/v10/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Квадрицепс', 'Ягодичные мышцы'],
						secondaryMuscles: ['Бицепс бедра', 'Икроножные'],
						primaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftGluteus', 'rightGluteus'],
						secondaryBackMuscles: ['leftHamstring', 'rightHamstring'],
						tips: [
							'Ставьте стопы на ширине плеч. Высокая постановка больше грузит ягодицы, низкая — квадрицепс',
							'Никогда не выпрямляйте ноги до "щелчка" в коленях, оставляйте их слегка согнутыми в верхней точке',
							'Плотно прижимайте поясницу к спинке тренажера, не допускайте подкручивания таза в нижней точке',
							'Опускайте платформу плавно и подконтрольно до угла 90 градусов в коленях',
							'Упирайтесь в платформу всей стопой, делая основной акцент на пятки',
						],
						equipment: ['Тренажер для жима ногами'],
						difficulty: 'Средний',
					},
					{
						id: 'leg-press-45',
						name: 'Жим ногами в тренажере',
						description:
							'Базовое упражнение для развития нижней части тела. Позволяет работать с большими весами, акцентируя нагрузку на квадрицепсах и ягодицах, при этом фиксированная спинка минимизирует нагрузку на позвоночник.',
						image: require('@/assets/training-videos/v11/v1.png'),
						imagePosition: {
							width: '140%',
							left: -30,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v11/v1.png'),
							require('@/assets/training-videos/v11/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Квадрицепс', 'Ягодичные'],
						secondaryMuscles: ['Бицепс бедра', 'Приводящие'],
						primaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						secondaryFrontMuscles: ['innerThigh'],
						primaryBackMuscles: ['leftGluteus', 'rightGluteus'],
						secondaryBackMuscles: ['leftHamstring', 'rightHamstring'],
						tips: [
							'Плотно прижимайте поясницу к спинке тренажера на протяжении всего движения',
							'Не выпрямляйте ноги до конца (не блокируйте колени) в верхней точке',
							'Ставьте стопы на ширине плеч; положение выше на платформе больше грузит ягодицы, ниже — квадрицепс',
							'Опускайте платформу плавно, не допуская отрыва таза от сиденья',
							'Упирайтесь в платформу всей стопой, основной упор делайте на пятки',
						],
						equipment: ['Тренажер для жима ногами'],
						difficulty: 'Средний',
					},
					{
						id: 'barbell-back-squat',
						name: 'Приседания со штангой на плечах',
						description:
							'Фундаментальное базовое упражнение, задействующее почти все мышцы нижней части тела и мышцы-стабилизаторы корпуса. Является ключевым для развития общей силы, выносливости и объема ног.',
						image: require('@/assets/training-videos/v17/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v17/v1.png'),
							require('@/assets/training-videos/v17/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Квадрицепс', 'Ягодичные мышцы'],
						secondaryMuscles: ['Бицепс бедра', 'Приводящие мышцы', 'Мышцы поясницы'],
						primaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						secondaryFrontMuscles: ['innerThigh'],
						primaryBackMuscles: ['leftGluteus', 'rightGluteus'],
						secondaryBackMuscles: ['leftHamstring', 'rightHamstring', 'lowerBack'],
						tips: [
							'Расположите гриф на верхней части трапеций, не кладите его на шею',
							'Держите спину прямой с естественным прогибом в пояснице, взгляд направлен прямо перед собой',
							'Начинайте движение с отведения таза назад, как будто садитесь на невидимый стул',
							'Следите, чтобы колени не заваливались внутрь и двигались в одной плоскости со стопами',
							'Плотно упирайтесь всей стопой в пол, распределяя вес между пяткой и серединой стопы',
							'Выдыхайте на усилии при подъеме вверх',
						],
						equipment: ['Штанга', 'Стойки для штанги / Силовая рама'],
						difficulty: 'Высокий',
					},
					{
						id: 'smith-machine-narrow-squat',
						name: 'Приседания в Смите (узкая постановка)',
						description:
							'Вариация приседаний в машине Смита, где стопы ставятся максимально близко друг к другу. Это смещает акцент нагрузки на внешнюю часть квадрицепса и позволяет лучше изолировать переднюю поверхность бедра за счет стабильной траектории штанги.',
						image: require('@/assets/training-videos/v18/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v18/v1.png'),
							require('@/assets/training-videos/v18/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Квадрицепс (внешняя часть)'],
						secondaryMuscles: ['Ягодичные мышцы', 'Приводящие мышцы'],
						primaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftGluteus', 'rightGluteus'],
						secondaryBackMuscles: ['leftHamstring', 'rightHamstring'],
						tips: [
							'Поставьте стопы вплотную друг к другу и слегка вынесите их вперед за линию грифа',
							'Прижимайте спину к грифу, опускаясь вертикально вниз, как будто скользите по стене',
							'Опускайтесь до параллели бедер с полом или чуть ниже, сохраняя пятки прижатыми',
							'Держите корпус ровно, не наклоняйтесь сильно вперед',
							'В верхней точке не выпрямляйте ноги до конца, чтобы сохранять напряжение в мышцах',
						],
						equipment: ['Тренажер Смита'],
						difficulty: 'Средний',
					},
					{
						id: 'standing-glute-kickback-machine',
						name: 'Отведения ноги назад в тренажере',
						description:
							'Изолирующее упражнение для акцентированной проработки ягодичных мышц. Тренажер фиксирует корпус и задает правильную траекторию, позволяя максимально нагрузить большую ягодичную мышцу без включения мышц спины.',
						image: require('@/assets/training-videos/v44/v1.png'),
						imagePosition: {
							width: '140%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v44/v1.png'),
							require('@/assets/training-videos/v44/v1.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Ягодичные мышцы'],
						secondaryMuscles: ['Бицепс бедра'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftGluteus', 'rightGluteus'],
						secondaryBackMuscles: ['leftHamstring', 'rightHamstring'],
						tips: [
							'Упритесь грудью или локтями в подушки тренажера, чтобы стабилизировать корпус',
							'Отводите ногу назад плавно, за счет усилия ягодицы, а не рывка поясницей',
							'В точке максимального отведения сделайте паузу и дополнительно сожмите ягодицу',
							'Не прогибайте сильно спину; держите пресс в напряжении на протяжении всего подхода',
							'Возвращайте ногу в исходное положение медленно, не позволяя весу резко падать',
						],
						equipment: ['Тренажер для ягодиц'],
						difficulty: 'Новичок',
					},
					{
						id: 'hack-squat-machine',
						name: 'Гакк-приседания в тренажере',
						description:
							'Базовое упражнение для ног, которое имитирует приседания со штангой, но снимает значительную часть нагрузки с мышц-стабилизаторов корпуса. Позволяет максимально глубоко проработать квадрицепсы за счет фиксированной траектории.',
						image: require('@/assets/training-videos/v45/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v45/v1.png'),
							require('@/assets/training-videos/v45/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Квадрицепс'],
						secondaryMuscles: ['Ягодичные', 'Бицепс бедра'],
						primaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftGluteus', 'rightGluteus'],
						secondaryBackMuscles: ['leftHamstring', 'rightHamstring'],
						tips: [
							'Плотно прижмите спину к платформе, чтобы между поясницей и спинкой не было зазора',
							'Стопы ставьте на ширине плеч, не отрывайте пятки от платформы во время приседа',
							'Опускайтесь до тех пор, пока угол в коленях не станет 90 градусов или чуть меньше (если позволяет гибкость)',
							'При подъеме не выпрямляйте колени до конца, оставляйте их слегка согнутыми («мягкими»)',
							'Следите, чтобы колени не заваливались внутрь во время движения',
						],
						equipment: ['Гакк-машина / V-Squat'],
						difficulty: 'Средний',
					},
					{
						id: 'lever-seated-leg-extension',
						name: 'Разгибания ног в рычажном тренажере',
						description:
							'Изолирующее упражнение для акцентированной проработки квадрицепсов. Рычажная конструкция обеспечивает более естественную амплитуду движения и позволяет работать над каждой ногой независимо, обеспечивая глубокое пиковое сокращение.',
						image: require('@/assets/training-videos/v48/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v48/v1.png'),
							require('@/assets/training-videos/v48/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Квадрицепс'],
						secondaryMuscles: [],
						primaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						secondaryFrontMuscles: [],
						primaryBackMuscles: [],
						secondaryBackMuscles: [],
						tips: [
							'Прижмите спину плотно к сиденью и держитесь за боковые рукоятки для стабилизации таза',
							'Расположите валик на нижней части голени, прямо над голеностопным суставом',
							'Разгибайте ноги до полного выпрямления, делая паузу в верхней точке для максимального напряжения',
							'Опускайте вес медленно и подконтрольно, не допуская резкого падения рычагов',
							'Держите носки направленными вверх или слегка в стороны для акцента на разные головки квадрицепса',
						],
						equipment: ['Рычажный тренажер для ног'],
						difficulty: 'Новичок',
					},
					{
						id: 'seated-calf-press-plate-loaded',
						name: 'Подъем на носки сидя (рычажный)',
						description:
							'Изолирующее упражнение для проработки камбаловидной мышцы голени. Использование свободных весов (блинов) позволяет точно регулировать нагрузку и обеспечивает плавную траекторию движения.',
						image: require('@/assets/training-videos/v49/v1.png'),
						imagePosition: {
							width: '140%',
							left: -20,
							scaleX: -1
						},
						images: [
							require('@/assets/training-videos/v49/v1.png'),
							require('@/assets/training-videos/v49/v2.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_1.mp4',
						primaryMuscles: ['Камбаловидная мышца'],
						secondaryMuscles: ['Икроножные мышцы'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: [],
						primaryBackMuscles: ['leftCalves', 'rightCalves'],
						secondaryBackMuscles: [],
						tips: [
							'Опустите пятки максимально низко, чтобы почувствовать сильное растяжение в голени',
							'Мощно поднимитесь на носки, задерживаясь в верхней точке на 1-2 секунды',
							'Плотно прижмите колени к подушкам тренажера, спину держите ровно',
							'Двигайтесь плавно, не используйте инерцию и не "пружиньте" в нижней точке',
							'Используйте рукоятки, чтобы зафиксировать корпус и избежать лишних движений',
						],
						equipment: ['Тренажер для голени сидя'],
						difficulty: 'Новичок',
					},
					{
						id: 'elliptical-trainer',
						name: 'Эллиптический тренажер',
						description:
							'Кардиоупражнение низкой интенсивности, задействующее как нижнюю, так и верхнюю часть тела. Идеально подходит для жиросжигания, разминки или заминки, обеспечивая плавную нагрузку на коленные и голеностопные суставы.',
						image: require('@/assets/training-videos/v63/v1.png'),
						imagePosition: {
							width: '120%',
							left: -10,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v63/v1.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_cardio_1.mp4',
						primaryMuscles: ['Сердечно-сосудистая система'],
						secondaryMuscles: ['Квадрицепс', 'Ягодичные', 'Икроножные', 'Мышцы спины'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['leftGluteus', 'rightGluteus', 'leftCalves', 'rightCalves'],
						tips: [
							'Держите спину прямо, не наклоняйтесь сильно вперед и не опирайтесь всем весом на поручни',
							'Старайтесь не отрывать пятки от педалей во время движения для равномерного распределения нагрузки',
							'Используйте подвижные рукоятки, чтобы включить в работу мышцы спины и рук',
							'Двигайтесь плавно, без резких рывков, сохраняя постоянный темп дыхания',
							'Для увеличения интенсивности добавьте уровень сопротивления или измените угол наклона (если тренажер позволяет)',
						],
						equipment: ['Эллиптический тренажер'],
						difficulty: 'Новичок',
					},
					{
						id: 'stationary-bike-upright',
						name: 'Велотренажер (вертикальный)',
						description:
							'Эффективное кардиоупражнение для развития выносливости и укрепления сердечно-сосудистой системы. Минимизирует нагрузку на суставы по сравнению с бегом и позволяет точно контролировать интенсивность тренировки.',
						image: require('@/assets/training-videos/v64/v1.png'),
						imagePosition: {
							width: '130%',
							left: -15,
							scaleX: 1
						},
						images: [
							require('@/assets/training-videos/v64/v1.png'),
						],
						videoUrl: 'https://pub-4059e1140cbe4425b7bfe58afa6e7a85.r2.dev/training-videos/video_cardio_bike.mp4',
						primaryMuscles: ['Сердечно-сосудистая система'],
						secondaryMuscles: ['Квадрицепс', 'Икроножные', 'Бицепс бедра'],
						primaryFrontMuscles: [],
						secondaryFrontMuscles: ['leftQuadriceps', 'rightQuadriceps'],
						primaryBackMuscles: [],
						secondaryBackMuscles: ['leftCalves', 'rightCalves'],
						tips: [
							'Отрегулируйте высоту сиденья так, чтобы в нижней точке нога была почти полностью выпрямлена (но без блокировки колена)',
							'Держите спину ровно, не сутультесь и не переносите весь вес на руки и руль',
							'Старайтесь крутить педали плавно, прилагая усилие по всей окружности движения',
							'Держите стопы параллельно полу, не направляйте носки сильно вниз',
							'Дышите глубоко и равномерно, подбирая сопротивление под свой целевой пульс',
						],
						equipment: ['Велотренажер'],
						difficulty: 'Новичок',
					},
				]
			},
			{
				id: 'vastus-medialis',
				name: 'Медиальная широкая мышца бедра',
				image: manFrontMuscleGroupParts.vastusMedialis,
				exercises: [
					{
						id: 'leg-extension',
						name: 'Разгибания ног в тренажёре',
						description: 'Изоляция для проработки внутренней части квадрицепса.',
						image: manFrontMuscleGroupParts.upperLegFull,
						videoUrl: 'https://www.youtube.com/watch?v=YyvWTp5-9xA',
						primaryMuscles: ['Медиальная широкая мышца бедра'],
						secondaryMuscles: ['Все квадрицепсы'],
						tips: [
							'Поворот носков наружу усиливает акцент',
							'Задерживайтесь в верхней точке для пикового сокращения'
						],
						equipment: ['Тренажёр для разгибаний'],
						difficulty: 'Средний'
					},
					{
						id: 'sissy-squat',
						name: 'Приседания "Сисси"',
						description: 'Упражнение для детализации нижней части квадрицепса.',
						image: manFrontMuscleGroupParts.upperLegFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Медиальная широкая мышца бедра'],
						secondaryMuscles: ['Прямая мышца бедра'],
						tips: ['Контролируйте движение', 'Можно держаться за опору'],
						equipment: [],
						difficulty: 'Высокий'
					}
				]
			},
			{
				id: 'rectus-femoris',
				name: 'Прямая мышца бедра',
				image: manFrontMuscleGroupParts.vastusInternedius, // Используем как общий для прямой мышцы
				exercises: [
					{
						id: 'front-squat',
						name: 'Фронтальные приседания',
						description: 'Отлично нагружает прямую мышцу бедра.',
						image: manFrontMuscleGroupParts.upperLegFull,
						videoUrl: 'https://www.youtube.com/watch?v=7tN6Y_0tO9Q',
						primaryMuscles: ['Прямая мышца бедра'],
						secondaryMuscles: ['Все квадрицепсы', 'Ягодицы'],
						tips: ['Держите корпус вертикально', 'Локти высоко'],
						equipment: ['Штанга'],
						difficulty: 'Высокий'
					},
					{
						id: 'lunges',
						name: 'Выпады',
						description: 'Динамическое упражнение для всей передней поверхности бедра.',
						image: manFrontMuscleGroupParts.upperLegFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Прямая мышца бедра'],
						secondaryMuscles: ['Все квадрицепсы', 'Ягодицы'],
						tips: ['Длинный шаг', 'Колено не выходит за носок'],
						equipment: ['Гантели'],
						difficulty: 'Средний'
					}
				]
			},
			{
				id: 'biceps-femoris',
				name: 'Двуглавая мышца бедра',
				image: manBackMuscleGroupParts.biceosFemoris,
				exercises: [
					{
						id: 'romanian-deadlift',
						name: 'Румынская тяга',
						description: 'Базовое упражнение для бицепса бедра.',
						image: manBackMuscleGroupParts.upperLegFull,
						videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
						primaryMuscles: ['Двуглавая мышца бедра'],
						secondaryMuscles: ['Ягодицы', 'Полусухожильная мышца'],
						tips: [
							'Ноги слегка согнуты',
							'Таз отводите назад',
							'Опускайте до ощущения растяжения'
						],
						equipment: ['Штанга'],
						difficulty: 'Средний'
					},
					{
						id: 'lying-leg-curl',
						name: 'Сгибания ног лёжа',
						description: 'Изоляция двуглавой мышцы бедра.',
						image: manBackMuscleGroupParts.upperLegFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Двуглавая мышца бедра'],
						secondaryMuscles: ['Полусухожильная мышца'],
						tips: ['Полное сгибание', 'Медленный негатив'],
						equipment: ['Тренажёр'],
						difficulty: 'Средний'
					}
				]
			},
			{
				id: 'semitendinosus',
				name: 'Полусухожильная мышца',
				image: manBackMuscleGroupParts.semitendinosus,
				exercises: [
					{
						id: 'good-morning',
						name: 'Наклоны со штангой на плечах',
						description: 'Акцент на внутреннюю часть задней поверхности бедра.',
						image: manBackMuscleGroupParts.semitendinosus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Полусухожильная мышца'],
						secondaryMuscles: ['Двуглавая мышца бедра', 'Ягодицы'],
						tips: ['Спина прямая', 'Движение от таза'],
						equipment: ['Штанга'],
						difficulty: 'Высокий'
					},
					{
						id: 'seated-leg-curl',
						name: 'Сгибания ног сидя',
						description: 'Проработка нижней части бицепса бедра.',
						image: manBackMuscleGroupParts.semitendinosus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Полусухожильная мышца'],
						secondaryMuscles: ['Двуглавая мышца бедра'],
						tips: ['Разные углы наклона туловища меняют акцент'],
						equipment: ['Тренажёр'],
						difficulty: 'Средний'
					}
				]
			},
			{
				id: 'gastrocnemius',
				name: 'Икроножная мышца',
				image: manBackMuscleGroupParts.lowerLegFull,
				exercises: [
					{
						id: 'standing-calf-raise',
						name: 'Подъёмы на носки стоя',
						description: 'Основное упражнение для икроножных мышц.',
						image: manFrontMuscleGroupParts.gastrocnemius,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Икроножная мышца'],
						secondaryMuscles: ['Камбаловидная мышца'],
						tips: [
							'Полная амплитуда',
							'Задержка в верхней точке',
							'Медленное опускание'
						],
						equipment: ['Тренажёр', 'Штанга'],
						difficulty: 'Средний'
					},
					{
						id: 'donkey-calf-raise',
						name: 'Ослиные подъёмы на носки',
						description: 'Классика для объёма икр.',
						image: manFrontMuscleGroupParts.gastrocnemius,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Икроножная мышца'],
						secondaryMuscles: [],
						tips: ['Наклон вперёд растягивает мышцу'],
						equipment: ['Тренажёр', 'Партнёр'],
						difficulty: 'Средний'
					}
				]
			},
			{
				id: 'tibialis-anterior',
				name: 'Передняя большеберцовая мышца',
				image: manFrontMuscleGroupParts.lowerLegFull,
				exercises: [
					{
						id: 'tibialis-raise',
						name: 'Подъёмы носков',
						description: 'Укрепление передней поверхности голени.',
						image: manFrontMuscleGroupParts.upperLegFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Передняя большеберцовая мышца'],
						secondaryMuscles: [],
						tips: ['Медленный темп', 'Полная амплитуда'],
						equipment: [],
						difficulty: 'Лёгкий'
					},
					{
						id: 'resistance-band-tibialis',
						name: 'Сгибание стопы с резиной',
						description: 'Изоляция с дополнительным сопротивлением.',
						image: manFrontMuscleGroupParts.upperLegFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Передняя большеберцовая мышца'],
						secondaryMuscles: [],
						tips: ['Контролируйте движение в обе стороны'],
						equipment: ['Резиновая лента'],
						difficulty: 'Лёгкий'
					}
				]
			},
			{
				id: 'gluteus-maximus',
				name: 'Большая ягодичная мышца',
				description: 'Самая крупная и мощная мышца ягодичной группы. Отвечает за разгибание бедра и отведение таза назад.',
				image: manBackMuscleGroupParts.gluteusMaximus,
				exercises: [
					{
						id: 'hip-thrust',
						name: 'Ягодичный мост со штангой',
						description: 'Лучшее упражнение для гипертрофии большой ягодичной мышцы.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=LMv5U8n5E0E',
						primaryMuscles: ['Большая ягодичная мышца'],
						secondaryMuscles: ['Бицепс бедра', 'Квадрицепсы', 'Средняя ягодичная мышца'],
						tips: [
							'Расположите штангу на тазовых костях',
							'Полное разгибание таза в верхней точке',
							'Интенсивное сжатие ягодиц на 1-2 секунды',
							'Плечи устойчиво лежат на скамье',
							'Нагрузка на пятки, а не на носки'
						],
						equipment: ['Штанга', 'Скамья'],
						difficulty: 'Средний',
						variations: [
							'С гантелей',
							'С резиновой лентой',
							'На одной ноге',
							'В тренажёре Смита'
						]
					},
					{
						id: 'sumo-deadlift',
						name: 'Сумо-тяга',
						description: 'Базовое упражнение с мощным акцентом на большие ягодичные мышцы.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Большая ягодичная мышца'],
						secondaryMuscles: ['Бицепс бедра', 'Квадрицепсы', 'Спина', 'Приводящие'],
						tips: [
							'Широкая постановка ног (стопы развёрнуты на 45°)',
							'Колени направлены в сторону носков',
							'Спина прямая на протяжении всего движения',
							'Толчок ногами, а не тяга спиной',
							'Сжатие ягодиц в верхней точке'
						],
						equipment: ['Штанга'],
						difficulty: 'Высокий',
						variations: [
							'Сумо-тяга с гантелями',
							'Сумо-тяга в Смите'
						]
					},
					{
						id: 'bulgarian-split-squat',
						name: 'Болгарские выпады',
						description: 'Отличное унилатеральное упражнение для ягодиц и квадрицепсов.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=2C-uNgXrS-I',
						primaryMuscles: ['Большая ягодичная мышца'],
						secondaryMuscles: ['Квадрицепсы', 'Бицепс бедра'],
						tips: [
							'Длинный шаг для большего акцента на ягодицы',
							'Вертикальный корпус',
							'Опускание до параллели бедра',
							'Колено передней ноги не выходит за носок',
							'Упор на пятку рабочей ноги'
						],
						equipment: ['Гантели', 'Скамья'],
						difficulty: 'Высокий',
						variations: [
							'Со штангой на плечах',
							'С гирей у груди',
							'С резиновой лентой'
						]
					},
					{
						id: 'romanian-deadlift',
						name: 'Румынская тяга',
						description: 'Идеальное упражнение для задней цепи с акцентом на ягодицы и бицепс бедра.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
						primaryMuscles: ['Большая ягодичная мышца'],
						secondaryMuscles: ['Бицепс бедра', 'Разгибатели спины'],
						tips: [
							'Ноги слегка согнуты в коленях',
							'Опускание штанги вдоль ног до середины голени',
							'Таз отводится назад при наклоне',
							'Ощущение растяжения в ягодицах и бицепсе бедра',
							'Возврат за счёт сокращения ягодиц'
						],
						equipment: ['Штанга'],
						difficulty: 'Средний',
						variations: [
							'С гантелями',
							'На одной ноге',
							'С резиновой лентой'
						]
					},
					{
						id: 'kettlebell-swing',
						name: 'Махи гирей',
						description: 'Динамическое плиометрическое упражнение для взрывной силы ягодиц.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Большая ягодичная мышца'],
						secondaryMuscles: ['Бицепс бедра', 'Кор', 'Плечи'],
						tips: [
							'Движение от таза, а не от рук',
							'Взрывное разгибание бёдер',
							'Корпус напряжён, спина прямая',
							'Гиря поднимается до уровня груди',
							'Контролируемое опускание'
						],
						equipment: ['Гиря'],
						difficulty: 'Высокий',
						variations: [
							'Двуручные махи',
							'Попеременные махи'
						]
					}
				]
			},
			{
				id: 'gluteus-medius',
				name: 'Средняя ягодичная мышца',
				description: 'Расположена под большой ягодичной. Отвечает за отведение бедра и стабилизацию таза при ходьбе.',
				image: manBackMuscleGroupParts.gluteusMedius,
				exercises: [
					{
						id: 'side-lying-leg-raise',
						name: 'Отведение ноги лёжа на боку',
						description: 'Базовое изолирующее упражнение для средней ягодичной мышцы.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средняя ягодичная мышца'],
						secondaryMuscles: ['Малая ягодичная мышца'],
						tips: [
							'Лежите на боку, тело образует прямую линию',
							'Ноги прямые, стопы параллельны',
							'Поднимайте верхнюю ногу без рывков',
							'Не заваливайте корпус назад или вперёд',
							'Контролируйте опускание (2-3 секунды)'
						],
						equipment: [],
						difficulty: 'Лёгкий',
						variations: [
							'С утяжелителем на ноге',
							'С резиновой лентой вокруг бёдер'
						]
					},
					{
						id: 'standing-cable-hip-abduction',
						name: 'Отведение ноги в сторону в кроссовере',
						description: 'Упражнение с прогрессивной нагрузкой для формирования боковой части ягодиц.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средняя ягодичная мышца'],
						secondaryMuscles: ['Малая ягодичная мышца'],
						tips: [
							'Стойте боком к тренажёру, держась за опору',
							'Прикрепите манжету к дальней от тренажёра ноге',
							'Отводите ногу максимально в сторону',
							'Сохраняйте корпус прямым, без наклонов',
							'Медленно возвращайтесь в исходное положение'
						],
						equipment: ['Кроссовер', 'Манжета для ноги'],
						difficulty: 'Средний',
						variations: [
							'С резиновой лентой',
							'С нижнего блока'
						]
					},
					{
						id: 'clamshell',
						name: 'Упражнение "Ракушка"',
						description: 'Функциональное упражнение для укрепления средней ягодичной и стабилизации таза.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средняя ягодичная мышца'],
						secondaryMuscles: ['Малая ягодичная мышца'],
						tips: [
							'Лёжа на боку, колени согнуты под 90°',
							'Стопы вместе, бёдра в линию с корпусом',
							'Поднимайте верхнее колено, не двигая тазом',
							'Максимальное отведение, затем пауза 1-2 секунды',
							'Медленно опускайте колено'
						],
						equipment: ['Резиновая лента (опционально)'],
						difficulty: 'Лёгкий',
						variations: [
							'С резиновой лентой вокруг коленей',
							'С удержанием в верхней точке'
						]
					},
					{
						id: 'lateral-band-walk',
						name: 'Ходьба в сторону с резиновой лентой',
						description: 'Динамическое упражнение для активации средней ягодичной мышцы.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средняя ягодичная мышца'],
						secondaryMuscles: ['Малая ягодичная мышца'],
						tips: [
							'Ноги слегка согнуты, стойка полуприседе',
							'Резиновая лента вокруг бёдер или лодыжек',
							'Делайте шаги в сторону, не сводя ноги',
							'Сохраняйте напряжение ленты',
							'Корпус не раскачивается'
						],
						equipment: ['Резиновая лента'],
						difficulty: 'Средний',
						variations: [
							'С более тугой лентой',
							'С дополнительным приседом на каждом шаге'
						]
					},
					{
						id: 'single-leg-glute-bridge',
						name: 'Ягодичный мост на одной ноге',
						description: 'Усложнённый вариант ягодичного моста с акцентом на стабилизацию таза.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средняя ягодичная мышца'],
						secondaryMuscles: ['Большая ягодичная мышца', 'Бицепс бедра'],
						tips: [
							'Лежа на спине, одна нога согнута, вторая прямая',
							'Поднимайте таз за счёт ягодиц, держа бёдра на одном уровне',
							'Не допускайте заваливания таза в сторону',
							'Пауза в верхней точке с сжатием ягодиц',
							'Контролируемое опускание'
						],
						equipment: [],
						difficulty: 'Средний',
						variations: [
							'С дополнительным весом на тазе',
							'С удержанием в верхней точке'
						]
					},
					{
						id: 'fire-hydrant',
						name: 'Упражнение "Пожарный гидрант"',
						description: 'Изолирующее движение для проработки средней ягодичной мышцы.',
						image: manBackMuscleGroupParts.gluteusMaximus,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средняя ягодичная мышца'],
						secondaryMuscles: ['Малая ягодичная мышца'],
						tips: [
							'Стоя на четвереньках, спина прямая',
							'Отводите согнутую ногу в сторону до уровня таза',
							'Держите корпус стабильным, не раскачивайтесь',
							'Медленное контролируемое движение',
							'Фокусируйтесь на сокращении боковой части ягодицы'
						],
						equipment: [],
						difficulty: 'Лёгкий',
						variations: [
							'С утяжелителем на ноге',
							'С резиновой лентой вокруг коленей'
						]
					}
				]
			}
		]
	},
	{
		id: 'spine',
		name: 'Спина',
		image: manBackMuscleGroupParts.spineFull,
		imagePosition: {
			width: '100%',
			top: -30,
		},
		subgroups: [
			{
				id: 'trapezius-upper',
				name: 'Верх трапеций',
				description: 'Верхняя часть трапециевидной мышцы. Отвечает за подъём лопаток и шеи.',
				image: manBackMuscleGroupParts.upperTrapeziusFull || manBackMuscleGroupParts.trapeziusFull,
				exercises: [
					{
						id: 'barbell-shrug',
						name: 'Шраги со штангой',
						description: 'Базовое упражнение для увеличения массы и силы верхней части трапеций.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=gZbIRJkDp0k',
						primaryMuscles: ['Верх трапеций'],
						secondaryMuscles: ['Средние трапеции', 'Ромбовидные', 'Левиаторы лопаток'],
						tips: [
							'Держите штангу перед собой прямым хватом',
							'Поднимайте плечи строго вертикально вверх',
							'В верхней точке делайте паузу 1-2 секунды',
							'Не вращайте плечами (риск травмы)',
							'Опускайте медленно, с полным растяжением'
						],
						equipment: ['Штанга'],
						difficulty: 'Средний',
						variations: [
							'С гантелями',
							'В тренажёре Смита',
							'За спиной со штангой'
						]
					},
					{
						id: 'dumbbell-shrug',
						name: 'Шраги с гантелями',
						description: 'Более естественная траектория движения, чем со штангой.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Верх трапеций'],
						secondaryMuscles: ['Средние трапеции'],
						tips: [
							'Гантели по бокам вдоль тела',
							'Прямая спина, небольшой наклон вперёд',
							'Поднимайте плечи к ушам',
							'Используйте серьёзные веса',
							'Избегайте инерции'
						],
						equipment: ['Гантели'],
						difficulty: 'Средний',
						variations: [
							'С вращением плеч назад',
							'Попеременные шраги'
						]
					},
					{
						id: 'rack-pull-high',
						name: 'Высокая тяга из стоек (Rack Pull)',
						description: 'Тяжёлое упражнение для верха трапеций и верхней части спины.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Верх трапеций'],
						secondaryMuscles: ['Широчайшие', 'Ромбовидные', 'Выпрямители спины'],
						tips: [
							'Штанга на уровне коленей или выше',
							'Хват на ширине плеч или шире',
							'Тяните штангу к ключицам, ведя локти вверх и назад',
							'Сводите лопатки в верхней точке',
							'Контролируйте опускание'
						],
						equipment: ['Штанга', 'Стойки'],
						difficulty: 'Высокий',
						variations: [
							'С гантелями',
							'В тренажёре Смита'
						]
					},
					{
						id: 'upright-row',
						name: 'Тяга к подбородку',
						description: 'Упражнение для верха трапеций и средних дельт.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Верх трапеций'],
						secondaryMuscles: ['Средние дельты', 'Бицепсы'],
						tips: [
							'Узкий хват (15-20 см) акцентирует трапеции',
							'Тяните локти вверх, а не руки',
							'Штанга движется вдоль тела',
							'Не поднимайте выше ключиц',
							'Избегайте рывков'
						],
						equipment: ['Штанга'],
						difficulty: 'Средний',
						variations: [
							'С гантелями',
							'В кроссовере',
							'С резиновой лентой'
						]
					}
				]
			},
			{
				id: 'trapezius-middle',
				name: 'Средние трапеции',
				description: 'Средняя часть трапециевидной мышцы. Отвечает за сведение лопаток к позвоночнику.',
				image: manBackMuscleGroupParts.middleTrapeziusFull || manBackMuscleGroupParts.trapeziusFull,
				exercises: [
					{
						id: 'face-pull',
						name: 'Тяга к лицу',
						description: 'Лучшее упражнение для здоровья плеч и развития средних трапеций.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средние трапеции'],
						secondaryMuscles: ['Задние дельты', 'Ромбовидные', 'Вращатели плеча'],
						tips: [
							'Используйте канатную рукоять',
							'Тяните к переносице или лбу',
							'Разводите руки в стороны, сводя лопатки',
							'Внешнее вращение в верхней точке',
							'Контролируйте возврат'
						],
						equipment: ['Кроссовер', 'Канат'],
						difficulty: 'Средний',
						variations: [
							'С резиновой лентой',
							'С гантелями лёжа на животе'
						]
					},
					{
						id: 'seated-row',
						name: 'Тяга сидя к груди',
						description: 'Базовое упражнение для средней части спины и трапеций.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средние трапеции'],
						secondaryMuscles: ['Широчайшие', 'Ромбовидные', 'Задние дельты'],
						tips: [
							'Используйте V-образную рукоять',
							'Тяните к нижней части груди',
							'Сводите лопатки в конце движения',
							'Не раскачивайте корпус',
							'Концентрируйтесь на сведении лопаток'
						],
						equipment: ['Тренажёр для тяги сидя'],
						difficulty: 'Средний',
						variations: [
							'С широкой рукоятью',
							'С канатом'
						]
					},
					{
						id: 'bent-over-row',
						name: 'Тяга в наклоне',
						description: 'Комплексное упражнение для всей спины с акцентом на средние трапеции.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средние трапеции'],
						secondaryMuscles: ['Широчайшие', 'Ромбовидные', 'Задние дельты'],
						tips: [
							'Корпус параллелен полу или под углом 45°',
							'Спина прямая, нейтральное положение шеи',
							'Тяните штангу к животу/груди',
							'Локти вдоль тела или под углом 45°',
							'Сведение лопаток в верхней точке'
						],
						equipment: ['Штанга'],
						difficulty: 'Высокий',
						variations: [
							'Тяга Пендли',
							'С гантелями',
							'Обратным хватом'
						]
					},
					{
						id: 'y-raise',
						name: 'Подъёмы рук в форме Y',
						description: 'Упражнение для активации и укрепления средних трапеций.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Средние трапеции'],
						secondaryMuscles: ['Нижние трапеции', 'Задние дельты'],
						tips: [
							'Лёжа на животе на наклонной скамье',
							'Поднимайте руки в форме буквы Y (45°)',
							'Большие пальцы направлены вверх',
							'Фокусируйтесь на сведении лопаток',
							'Не используйте инерцию'
						],
						equipment: ['Гантели', 'Наклонная скамья'],
						difficulty: 'Лёгкий',
						variations: [
							'С резиновой лентой',
							'На полу'
						]
					}
				]
			},
			{
				id: 'trapezius-lower',
				name: 'Низ трапеций',
				description: 'Нижняя часть трапециевидной мышцы. Отвечает за опускание лопаток вниз и стабилизацию.',
				image: manBackMuscleGroupParts.lowerTrapeziusFull || manBackMuscleGroupParts.trapeziusFull,
				exercises: [
					{
						id: 'straight-arm-pulldown',
						name: 'Тяга прямых рук вниз',
						description: 'Изолирующее упражнение для низа трапеций и широчайших.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Низ трапеций'],
						secondaryMuscles: ['Широчайшие', 'Ромбовидные'],
						tips: [
							'Используйте прямую рукоять или канат',
							'Руки прямые или слегка согнутые',
							'Тяните рукоять к бёдрам',
							'Опускайте лопатки вниз и сводите',
							'Не наклоняйтесь сильно вперёд'
						],
						equipment: ['Кроссовер'],
						difficulty: 'Средний',
						variations: [
							'С резиновой лентой',
							'С гантелями лёжа на скамье'
						]
					},
					{
						id: 'pull-up',
						name: 'Подтягивания',
						description: 'Базовое упражнение, отлично прорабатывающее низ трапеций при правильной технике.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Низ трапеций'],
						secondaryMuscles: ['Широчайшие', 'Бицепсы', 'Ромбовидные'],
						tips: [
							'Широкий хват для большего акцента на спину',
							'В начале движения опустите лопатки вниз',
							'Подтягивайтесь грудью к перекладине',
							'Полное растяжение в нижней точке',
							'Контролируемое опускание'
						],
						equipment: ['Турник'],
						difficulty: 'Высокий',
						variations: [
							'Обратным хватом',
							'Нейтральным хватом',
							'С отягощением'
						]
					},
					{
						id: 'lat-pulldown',
						name: 'Тяга верхнего блока к груди',
						description: 'Аналог подтягиваний для развития низа трапеций и широчайших.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Низ трапеций'],
						secondaryMuscles: ['Широчайшие', 'Бицепсы', 'Ромбовидные'],
						tips: [
							'Широкая рукоять',
							'Начинайте движение с опускания лопаток',
							'Тяните рукоять к верхней части груди',
							'Не отклоняйтесь сильно назад',
							'Фокусируйтесь на растяжении и сокращении'
						],
						equipment: ['Тренажёр верхней тяги'],
						difficulty: 'Средний',
						variations: [
							'К затылку',
							'Одной рукой',
							'С канатом'
						]
					},
					{
						id: 'scapular-pull-up',
						name: 'Лопаточные подтягивания',
						description: 'Изолирующее упражнение для развития силы и контроля низа трапеций.',
						image: manBackMuscleGroupParts.trapeziusFull || manBackMuscleGroupParts.trapeziusFull,
						videoUrl: 'https://www.youtube.com/watch?v=example',
						primaryMuscles: ['Низ трапеций'],
						secondaryMuscles: ['Ромбовидные', 'Левиаторы лопаток'],
						tips: [
							'Повисните на перекладине, руки прямые',
							'Поднимайте только лопатки вверх и опускайте вниз',
							'Руки остаются прямыми на протяжении всего движения',
							'Не сгибайте руки в локтях',
							'Медленный темп, полный контроль'
						],
						equipment: ['Турник'],
						difficulty: 'Средний',
						variations: [
							'С резиновой лентой для помощи',
							'В тренажёре Gravitron'
						]
					}
				]
			}
		]
	}
	// ... остальные группы мышц
]