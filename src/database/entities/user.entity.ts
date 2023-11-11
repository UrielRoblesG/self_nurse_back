import {
  AfterRemove,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  EventoEntity,
  NurseEntity,
  DoctorEntity,
  PatientEntity,
  CatUserType,
} from './index';

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

  @Column({
    nullable: false,
    name: 'phone',
    length: 10,
  })
  phone: string;

  @Column({ nullable: false, name: 'pswrd' })
  password: string;

  @ManyToOne(() => CatUserType, { cascade: true })
  @Column({ nullable: false, name: 'idTypeId' })
  idType: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, default: '' })
  token: string;

  @Column({ nullable: true, length: 255 })
  imgUrl: string;

  @Column({
    nullable: false,
    default: '',
    type: 'varchar',
    length: 255,
    name: 'deviceToken',
  })
  deviceToken: string;

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
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @OneToOne(() => NurseEntity, { cascade: true })
  @JoinColumn()
  caregiver: NurseEntity;

  @AfterRemove()
  updateStatus() {
    this.deletedAt = new Date();
  }
}
