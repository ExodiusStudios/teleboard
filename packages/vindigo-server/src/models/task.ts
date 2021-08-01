import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Tasks are the most important concept in Vindigo and
 * represent a single task witin a project.
 */
@Entity('tasks')
export class Task extends BaseEntity {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public createdAt: Date;

	@Column()
	public lastModifiedAt: Date;

	@Column()
	public summary: string;

	@Column()
	public description?: string;

	@Column()
	public parent?: number;

}