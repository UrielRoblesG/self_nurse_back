import {
  AfterRemove,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CatUserType } from './cat.user.type';
import { PatientEntity } from './patient.entity';
import { DoctorEntity } from './doctor.entity';
import { CaregiverEntity } from './caregiver.entity';

@Entity({ name: 'usuario' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nombre' })
  name: string;

  @Column({ name: 'apellidoPaterno' })
  firstName: string;

  @Column({
    name: 'apellidoMaterno',
  })
  secondLastName: string;

  @Column({
    nullable: false,
    unique: true,
    name: 'email',
  })
  email: string;

  @Column({ nullable: false, name: 'pswrd' })
  password: string;

  @ManyToOne(() => CatUserType)
  @Column({ nullable: false })
  idType: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, default: '' })
  token: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToOne(() => PatientEntity, { cascade: true })
  @JoinColumn()
  paciente: PatientEntity;

  @OneToOne(() => DoctorEntity, { cascade: true })
  @JoinColumn()
  doctor: DoctorEntity;

  @OneToOne(() => CaregiverEntity, { cascade: true })
  @JoinColumn()
  caregiver: CaregiverEntity;

  @AfterRemove()
  updateStatus() {
    this.deletedAt = new Date();
  }
}
