import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "user",
})
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: "timestamp",
    name: "dthr_criacao",
  })
  dthrAtualizacao: Date;
}
