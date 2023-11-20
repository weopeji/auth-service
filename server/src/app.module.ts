import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schemas/user.entity';
import { RedisModule } from '@liaoliaots/nestjs-redis';


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([
            User,
        ]),
        RedisModule.forRoot({
            config: {
                host: 'localhost',
                port: 6379,
            }
        })
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService,
    ],
})

export class AppModule { }