import { Test, TestingModule } from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";

describe('Authentication System (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles a signUp request | /auth/signup (POST)', () => {
        let email = (Math.floor(Math.random() * 9999 )) + '-test@e2e.com';
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: email,
                password: '1s3gs4dfg67sd'
            })
            .expect(201)
            .then((res) => {
                const {id, email} = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(email);
            });
    });

    it('signup as new user and get currently logged in usr ', async () => {
        let email = (Math.floor(Math.random() * 9999 )) + '-test@e2e.com';
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: email,
                password: '1s3gs4dfg67sd'
            })
            .expect(201)

        const cookie = res.get('Set-Cookie');

        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie)
            .expect(200)

        expect(body.email).toEqual(email);

    })
});
