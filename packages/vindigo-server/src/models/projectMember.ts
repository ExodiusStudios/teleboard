import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";

import { Project } from "./project";
import { User } from "./user";

/**
 * Represents a member of a project
 */
@Entity('project_members')
export class ProjectMember extends BaseEntity {

	@ManyToOne(() => Project, project => project.members, { primary: true })
	public project: Project;

	@ManyToOne(() => User, user => user.projects, { primary: true })
	public user: User;

	@Column()
	public accessLevel: string;

}