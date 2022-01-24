import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config';

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({default: ''})
    bio: string;

    @Column({default: ''})
    image: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }

    // @ManyToMany(type => ArticleEntity)
    // @JoinTable()
    // favorites: ArticleEntity[];

    // @OneToMany(type => ArticleEntity, article => article.author)
    // articles: ArticleEntity[];
}
