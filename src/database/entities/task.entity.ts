import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({
  name: "task",
})
export class UserEntity {
  @PrimaryColumn({
    name: "id_task",
  })
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: "timestamp",
    name: "dthr_criacao",
    default: () => "CURRENT_TIMESTAMP",
  })
  drhrCriacao: Date;

  @Column({
    type: "timestamp",
    name: "dthr_atualizacao",
    default: () => "CURRENT_TIMESTAMP",
  })
  drhrAtualizacao: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: "id_user",
  })
  user: UserEntity;
}
