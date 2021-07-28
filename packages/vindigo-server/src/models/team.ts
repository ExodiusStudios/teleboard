import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Represents a team of members within vindigo
 */
@Entity('teams')
export class Team extends BaseEntity {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public createdAt: Date;

	@Column()
	public name: string;

	@Column()
	public description: string;

	@Column()
	public logoImage: string;

}