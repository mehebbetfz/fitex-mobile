export interface BaseEntity {
	id: string
	createdAt: Date
	updatedAt: Date
}

export interface MuscleGroup extends BaseEntity {
	name: string
	displayName: string
	description?: string
	recoveryTime: number
	color: string
	icon: string
	exercisesCount: number
}
