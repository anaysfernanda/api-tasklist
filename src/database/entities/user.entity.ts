import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: "user",
})
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: "timestamp",
    name: "dthr_criacao",
    default: () => "CURRENT_TIMESTAMP",
  })
  drhrCriacao: Date;
}
