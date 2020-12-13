import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryColumn({ unique: true })
  name: string;

  @Column()
  description: string;
}
