import Review from '../../models/review';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
import { getNowDate } from '../../util/date';

const { ObjectId } = mongoose.Types;

// 사용자가 작성한 리뷰인지 확인한다.
export const checkOwnReview = async (ctx: any, next: any) => {
    const { user, review } = ctx.state;
    if (review.ref_user._id.toString() !== user._id) {
        ctx.status = 403;
        return;
    }
    return next();
};

const schema = Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
});

// Joi 유효성 검사
export const checkJoiByRequestBody = async (ctx: any, next: any) => {
    // 검증하고 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    return next();
};

// 리뷰 아이디가 있는지 확인한다.
export const getReviewById = async (ctx: any, next: any) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; //bad request
        return;
    }
    try {
        const review = await Review.findById(id);
        if (!review) {
            ctx.status = 404;
            return;
        }
        ctx.state.review = review;
        return next();
    } catch (e) {
        ctx.throw(500, e);
    }
};

// 리뷰 추가
// POST /api/reviews
export const create = async (ctx: any) => {
    const { title, description, grade } = ctx.request.body;

    const review = new Review({
        title,
        description,
        grade,
        publishDate: getNowDate(),
        updateDate: getNowDate(),
    });

    try {
        await review.save();
        ctx.body = review;
    } catch (e) {
        ctx.throw(500, e);
    }
};

// 리뷰 목록 조회
// GET /api/reviews? query
export const list = async (ctx: any) => {
    const sortBy = ctx.query.sortBy || 'desc';
    const order = ctx.query.order || 'good';
    const limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10;
    const page = parseInt(ctx.query.page || '1');

    if (page < 1) {
        ctx.status = 400;
        return;
    }
    const { genderType, mainType, serveType, colorTag, tag } = ctx.query;

    const query = {
        ...(genderType ? { genderType: genderType } : {}),
        ...(mainType ? { mainType: mainType } : {}),
        ...(serveType ? { serveType: serveType } : {}),
        ...(tag ? { tags: tag } : {}),
        ...(colorTag ? { colorTags: colorTag } : {}),
    };

    try {
        const reviews = await Review.find(query)
            .sort([[order, sortBy]])
            .limit(limit)
            .skip((page - 1) * limit)
            .lean() //이 함수는 데이터를 처음부터 JSON형태로 조회한다.
            .exec();
        const reviewCount = await Review.countDocuments(query).exec();
        ctx.set('Last-Page', Math.ceil(reviewCount / limit));

        ctx.body = reviews.map((review) => ({
            ...review,
            // body: removeHtmlAndShorten(review.body),
        }));
    } catch (e) {
        ctx.throw(500, e);
    }
};

// 스키마 해당 데이터들 모두 삭제
// DELETE /api/reviews
export const RemoveAll = async (ctx: any) => {
    Review.remove({}).exec();
    ctx.status = 204;
};

// 특정 상품 조회
// GET /api/products/:id
export const read = async (ctx: any) => {
    ctx.body = ctx.state.review;
};

// 특정 상품 삭제
// DELETE /api/products/:id
export const remove = async (ctx: any) => {
    if (!ctx.state.review) {
        ctx.status = 404;
        return;
    }
    try {
        await Review.remove(ctx.state.review).exec();
        ctx.status = 204;
    } catch (e) {
        ctx.throw(500, e);
    }
};

// 특정 상품 수정
// PATCH /api/products/:id
export const update = async (ctx: any) => {
    if (!ctx.state.review) {
        ctx.status = 404;
        return;
    }

    const nextData = { ...ctx.request.body };

    if (nextData.body) {
        // nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
    }

    try {
        const review = await Review.updateOne(ctx.state.review, nextData, {
            new: true,
        }).exec();
        if (!review) {
            ctx.status = 404;
            return;
        }
        ctx.body = { success: true };
    } catch (e) {
        ctx.throw(500, e);
    }
};
