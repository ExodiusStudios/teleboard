import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ProjectMember } from "./projectMember";
import { ProjectTeam } from "./projectTeam";

@Entity('projects')
export class Project extends BaseEntity {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public createdAt: Date;

	@Column()
	public lastModifiedAt: Date;

	@Column()
	public name: string;

	@Column()
	public description: string;

	@Column()
	public coverImage: string;

	@Column()
	public backgroundImage: string;

	@Column()
	public creatorId: number;

	@Column()
	public isVisible: boolean;

	@Column()
	public isClosed: boolean;

	@Column()
	public isPublic: boolean;

	@OneToMany(() => ProjectMember, member => member.project)
	public members: ProjectMember[];

	@OneToMany(() => ProjectTeam, team => team.project)
	public teams: ProjectTeam[];

}