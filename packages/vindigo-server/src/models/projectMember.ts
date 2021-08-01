import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Project } from "./project";
import { User } from "./user";

/**
 * Represents a member of a project
 */
@Entity('project_members')
export class ProjectMember extends BaseEntity {

	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => Project, project => project.members)
	public project: Project;

	@ManyToOne(() => User, user => user.projects, { eager: true })
	public member: User;

	@Column()
	public accessLevel: string;

}