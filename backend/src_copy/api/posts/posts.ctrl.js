import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
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

export const getPostById = async (ctx, next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; //bad request
        return;
    }
    try {
        const post = await Post.findById(id);
        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.state.post = post;
        return next();
    } catch (e) {
        ctx.throw(500, e);
    }
};

//id로 찾은 포스트가 로그인 중인 사용자가 작성한 포스트 인지 확인
export const checkOwnPost = (ctx, next) => {
    const { user, post } = ctx.state;
    if (post.user._id.toString() !== user._id) {
        ctx.status = 403;
        return;
    }
    return next();
};

export const write = async (ctx) => {
    const schema = Joi.object().keys({
        //객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(),
    });

    //검증하고 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = ctx.request.body;
    const post = new Post({
        title,
        body: sanitizeHtml(body, sanitizeOption),
        tags,
        user: ctx.state.user,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};

const removeHtmlAndShorten = (body) => {
    const filtered = sanitizeHtml(body, {
        allowedTags: [],
    });
    return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

//포스트 목록 조회
//GET /api/posts
export const list = async (ctx) => {
    //쿼리는 문자열->숫자로 변환
    //값이 주어지지 않으면 1을 사용
    const page = parseInt(ctx.query.page || '1', 10);

    if (page < 1) {
        ctx.status = 400;
        return;
    }
    const { tag, username } = ctx.query;
    //username or tag값이 유효할때만 객체 안에 해당 값을 넣겠다라는 의미
    const query = {
        ...(username ? { 'user.username': username } : {}),
        ...(tag ? { tags: tag } : {}),
    };

    try {
        const posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(10)
            .skip((page - 1) * 10)
            .lean() //이 함수는 데이터를 처음부터 JSON형태로 조회한다.
            .exec();
        const postCount = await Post.countDocuments(query).exec();
        ctx.set('Last-Page', Math.ceil(postCount / 10));

        ctx.body = posts.map((post) => ({
            ...post,
            body: removeHtmlAndShorten(post.body),
        }));
    } catch (e) {
        ctx.throw(500, e);
    }
};

//특정포스트 목록 조회
//GET /api/posts/:id
export const read = async (ctx) => {
    ctx.body = ctx.state.post;
};
//특정 포스트 제거
//DELETE /api/posts/:id
export const remove = async (ctx) => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch (e) {
        ctx.throw(500, e);
    }
};

// 포스트 수정(특정 필드 변경)
// PATCH /api/posts/:id
//PATCH /api/posts
export const update = async (ctx) => {
    const { id } = ctx.params;
    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    });
    //검증하고 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const nextData = { ...ctx.request.body };

    if (nextData.body) {
        nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
    }

    try {
        const post = await Post.findByIdAndUpdate(id, nextData, {
            new: true, //이 값을 설정하면 업데이트 된 데이터를 반환
            //false면 업데이트 되기 전의 데이터를 반환.
        }).exec();
        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};
