import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({
  name: "user",
})
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({
    // type: "timestamp",
    name: "dthr_criacao",
  })
  dthrAtualizacao: Date;
}
