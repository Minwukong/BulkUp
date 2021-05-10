require("dotenv").config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';
import jwtMiddleware from "./lib/jwtMiddleware";

// //import createFakeData from "./createFakeData";

const { PORT, MONGO_URI } = process.env;

// 몽고DB 연결 및 설정
mongoose
    .connect(String(MONGO_URI), {
        useNewUrlParser: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log('몽고DB 연결 성공');
    })
    .catch((e) => {
        console.error(e);
    });

const app = new Koa();
const router = new Router();

// 라우터 미들웨어 등록
router.use('/api', api.routes());


// 미들웨어 등록
app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
    console.log('port %d', port);
});

export default app;