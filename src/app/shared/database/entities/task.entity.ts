import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({
  name: "tasks",
})
export class TaskEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id_task",
  })
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    default: false,
  })
  archived: boolean;

  @CreateDateColumn({
    // type: "timestamp",
    name: "dthr_criacao",
  })
  drhrCriacao: Date;

  @UpdateDateColumn({
    // type: "timestamp",
    name: "dthr_atualizacao",
  })
  drhrAtualizacao: Date;

  @ManyToOne(() => UserEntity, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "id_user",
  })
  user: UserEntity;
}
