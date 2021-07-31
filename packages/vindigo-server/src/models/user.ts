import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ProjectMember } from "./projectMember";

/**
 * Represents a single registered Vindigo user
 */
@Entity('users')
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public createdAt: Date;

	@Column()
	public lastSeenAt: Date;

	@Column()
	public username: string;

	@Column()
	public password: string;

	@Column()
	public avatar?: string;

	@Column()
	public email: string;

	@Column()
	public name: string;

	@Column()
	public isVerified: boolean;

	@Column()
	public isEnabled: boolean;

	@Column()
	public role: string;

	@Column()
	public language: string;

	@OneToMany(() => ProjectMember, member => member.user)
	public projects: ProjectMember[];

}