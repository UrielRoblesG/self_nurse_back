import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { VitalSignsEntity } from "./vital-signs.entity";
import { PatientEntity } from "./patient.entity";


@Entity({name: 'alert'})
export class AlertEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name: 'type', type: 'float'})
    type: number;

    @ManyToOne(() => PatientEntity)
    @JoinColumn({name: 'patientId' })
    paciente : PatientEntity;

    @OneToOne(() => VitalSignsEntity)
    @JoinColumn()
    lectura : VitalSignsEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}