import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';


const cookieSession = require('cookie-session');

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'sqlite',
                    database: config.get<string>('DB_NAME'),
                    synchronize: true,
                    entities: [User, Report],
                };
            },
        }),
        // TypeOrmModule.forRoot({
        //   type: 'sqlite',
        //   database: 'db.sqlite',
        //   entities: [User, Report],
        //   synchronize: true,
        // }),
      //  MongooseModule.forRoot('mongodb+srv://priyesh:N2YMPpqxfNuZ3@cluster0.aukx1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
        UsersModule,
        ReportsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            }),
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                cookieSession({
                    keys: ['asdfasfd'],
                }),
            )
            .forRoutes('*');
    }
}
