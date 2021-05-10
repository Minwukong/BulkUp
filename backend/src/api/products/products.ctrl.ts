import Product from '../../models/product';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
import { getNowDate } from '../../util/date';
import {
    WriteProduct,
    GetProductList,
    UpdateProduct,
} from '../../../../frontend/src/define/request/product';

import { Context, Next } from 'koa';

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
    allowedTags: [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
    ],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http'],
};

// 관리자 계정으로 로그인 되어있는지 체크한다.
export const checkAdminUser = async (ctx: Context, next: Next) => {
    // const { user, product } = ctx.state;
    // if (product.user._id.toString() !== user._id) {
    //     ctx.status = 403;
    //     return;
    // }
    return next();
};

// Joi 유효성 검사 스키마 정의
const schema = Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    genderType: Joi.number(),
    mainType: Joi.number(),
    serveType: Joi.number(),
    price: Joi.number(),
    options: Joi.object(),
});

// Joi 유효성 검사
export const checkJoiByRequestBody = async (ctx: Context, next: Next) => {
    // 검증하고 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    return next();
};

// 상품 아이디가 있는지 확인한다
export const getProductById = async (ctx: Context, next: Next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; //bad request
        return;
    }
    try {
        const product = await Product.findById(id);
        if (!product) {
            ctx.status = 404;
            return;
        }
        ctx.state.product = product;
        return next();
    } catch (e) {
        ctx.throw(500, e);
    }
};

// 상품 추가
// POST /api/products
export const create = async (ctx: Context) => {
    const reqBody: WriteProduct = ctx.request.body;
    const product = new Product({
        title: reqBody.title,
        description: reqBody.description,
        price: reqBody.price,
        thumbnailImage: reqBody.thumbnailImage,
        images: reqBody.images,
        genderType: reqBody.genderType,
        mainType: reqBody.mainType,
        serveType: reqBody.serveType,
        options: reqBody.options,
        tags: reqBody.tags,
        colorTags: reqBody.colorTags,
        publishDate: getNowDate(),
    });

    try {
        await product.save();
        ctx.body = product;
    } catch (e) {
        ctx.throw(500, e);
    }
};

const removeHtmlAndShorten = (body: any) => {
    const filtered = sanitizeHtml(body, {
        allowedTags: [],
    });
    return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

// 상품 목록 조회
// POST /api/products/getList
export const list = async (ctx: Context) => {
    const reqBody: GetProductList = ctx.request.body;

    const sortBy = reqBody.sortBy || 'asc';
    const order = reqBody.order || '_id';
    const limit = reqBody.limit || 20;
    const page = reqBody.page || 1;

    const query = {
        ...(reqBody.genderType ? { genderType: reqBody.genderType } : {}),
        ...(reqBody.mainType ? { mainType: reqBody.mainType } : {}),
        ...(reqBody.serveType ? { serveType: reqBody.serveType } : {}),
        ...(reqBody.tag ? { tags: reqBody.tag } : {}),
        ...(reqBody.colorTag ? { colorTags: reqBody.colorTag } : {}),
    };

    try {
        const products = await Product.find(query)
            .sort([[order, sortBy]])
            .limit(limit)
            .skip((page - 1) * limit)
            .lean() //이 함수는 데이터를 처음부터 JSON형태로 조회한다.
            .exec();
        const postCount = await Product.countDocuments(query).exec();
        ctx.set('Last-Page', String(Math.ceil(postCount / limit)));
        ctx.body = products.map((product) => ({
            ...product,
            body: removeHtmlAndShorten(product),
        }));
    } catch (e) {
        ctx.throw(500, e);
    }
};

// 스키마 해당 데이터들 모두 삭제
// POST /api/products/deleteAll
export const RemoveAll = async (ctx: Context) => {
    Product.remove({}).exec();
    ctx.status = 204;
};

// 특정 상품 조회
// GET /api/products/:id
export const read = async (ctx: Context) => {
    ctx.body = ctx.state.product;
};

// 특정 상품 수정
// PATCH /api/products/:id
export const update = async (ctx: Context) => {
    if (!ctx.state.product) {
        ctx.status = 404;
        return;
    }

    const nextData: UpdateProduct = ctx.request.body;

    try {
        const product = await Product.updateOne(ctx.state.product, nextData, {
            new: true,
        }).exec();
        if (!product) {
            ctx.status = 404;
            return;
        }
        ctx.body = { success: true };
    } catch (e) {
        ctx.throw(500, e);
    }
};

// 특정 상품 삭제
// DELETE /api/products/:id
export const remove = async (ctx: Context) => {
    if (!ctx.state.product) {
        ctx.status = 404;
        return;
    }
    try {
        await Product.remove(ctx.state.product).exec();
        // await Product.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch (e) {
        ctx.throw(500, e);
    }
};
