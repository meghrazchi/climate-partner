import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @CreateDateColumn() createdAt!: Date;

  @Column() origin!: string;
  @Column() destination!: string;

  @Column('float') distanceKm!: number;

  @Column({ type: 'enum', enum: ['FLIGHT', 'TRAIN', 'CAR'] })
  mode!: 'FLIGHT' | 'TRAIN' | 'CAR';

  @Column('float') emissionsKg!: number;
}
