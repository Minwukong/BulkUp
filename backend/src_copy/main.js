require('dotenv').config();

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';
//import createFakeData from "./createFakeData";

//비구조화 할당을 통해 process.env 내부값에 대한 레퍼런스 만듬
const { PORT, MONGO_URI } = process.env;

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        console.log('몽고디비 오랜만이얌');
    })
    .catch((e) => {
        console.error(e);
    });

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

//라우터 적용전에 bodyparser적용
app.use(bodyParser());
app.use(jwtMiddleware);
//app instance에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
    console.log('port %d', port);
});
