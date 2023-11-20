import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import Redis from 'ioredis';
import { sign, verify } from 'jsonwebtoken';
import { User } from 'src/schemas/user.entity';
import { QueryFailedError, Repository } from 'typeorm';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRedis() private readonly redis: Redis,
    ) {}


    async registerUser(user: User, resp: Response) 
    {
        if(
            typeof user.name == 'undefined' ||
            typeof user.email == 'undefined' ||
            typeof user.password == 'undefined' ||
            !user.name?.trim() || 
            !user.email?.trim() || 
            !user.password.trim()
        ) { 
            return resp
                .status(500)
                .send({ message: 'The data given is incorrect.' }); 
        };

        try {
            const _User = await this.userRepository.save({
                name: user.name,
                email: user.email,
                password: await bcryptjs.hash(user.password, 12),
            });

            await this.loginUser(user, resp);
        }
        catch(error) {
            if (error instanceof QueryFailedError) {
                //@ts-ignore
                if (error.code === '23505') {
                    //@ts-ignore
                    console.error(`Unique constraint ${error.constraint} failed`);
                    return resp
                        .status(500)
                        .send({ message: 'There is already a user with this email.' });
                };
            };

            return resp.status(500).send({ message: error });
        };
    }


    async loginUser(user: User, resp: Response) 
    {
        if(
            typeof user.email == 'undefined' ||
            typeof user.password == 'undefined' ||
            !user.email?.trim() || 
            !user.password.trim()
        ) { 
            return resp
                .status(500)
                .send({ message: 'The data given is incorrect.' }); 
        };

        try {
            const userDB = await this.userRepository.findOne({ where: { email: user.email } });

            if (!userDB || !(await bcryptjs.compare(user.password, userDB.password)))
                return resp.status(500).send({ message: 'Invalid Credentials.' });
    
            const accessToken   = sign({ id: userDB.id }, 'access_secret');
    
            await this.redis.hset(`user:${userDB.id}`, {
                userId: userDB.id,
                accessToken: accessToken,
                dataCreated: new Date().getTime().toString(),
            });
    
            resp
                .status(200)
                .send({ 
                    status: 'OK',
                    accessToken,
                });
        }
        catch(error) {
            return resp.status(500).send({ message: error });
        };
    };

    async getUser(req: Request, resp: Response) 
    {
        try {
            var decoded             = verify(req.body.accessToken, 'access_secret');
            var _UserData: any      = await await this.redis.hgetall(`user:${decoded.id}`);
            var _User               = await this.userRepository.findOne({where: { id: _UserData.userId }});

            resp
                .status(200)
                .send({ 
                    status: 'OK',
                    _User,
                });
        }
        catch(error) {
            return resp.status(500).send({ message: error });
        };
    }
}