import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Project } from "./project";
import { Team } from "./team";

/**
 * Represents a team invited to a project
 */
@Entity('project_teams')
export class ProjectTeam extends BaseEntity {

	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => Project, project => project.members)
	public project: Project;

	@ManyToOne(() => Team, team => team.projects, { eager: true })
	public team: Team;

	@Column()
	public accessLevel: string;

}