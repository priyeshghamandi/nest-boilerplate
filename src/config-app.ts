import {INestApplication, ValidationPipe} from "@nestjs/common";
const cookieSession = require('cookie-session');

export const configApp = (app: INestApplication) => {

    app.use();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true
        })
    );
}