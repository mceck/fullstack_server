import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './Role';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Role, { eager: true })
  @JoinColumn({ referencedColumnName: 'name' })
  role: Role;

  @Field(() => String, { name: 'role' })
  roleName() {
    return this.role.name;
  }

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastAccess: string;

  @Column({ default: 0 })
  tokenVersion: number;
}
