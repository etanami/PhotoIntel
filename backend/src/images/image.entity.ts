// src/images/entities/image.entity.ts
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ name: 'user_id'})
  // userId: number;

  @ManyToOne(() => User, (user) => user.images)
  user: User;

  @Column()
  url: string;

  @Column('jsonb')
  metadata?: object;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true, name: 'ai_summary' })
  aiSummary?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;
}
