import { Context, Next } from 'koa';
import * as type from '../../../../frontend/src/define/types/file';
import { UploadFile } from './../../../../frontend/src/define/request/file';
import { mkDir, saveFile } from '../../util/file';

// 폴더 확인해서 없으면 생성한다.

// POST /files/upload
export const uploadFiles = async (ctx: Context, next: Next) => {
    if (!ctx.request.files) {
        ctx.status = 400;
        return;
    }

    const { dir } = ctx.request.query;
    if (!dir || typeof dir !== 'string') {
        ctx.status = 400;
        return;
    }

    const files: any = ctx.request.files;

    // 폴더 확인 및 생성
    mkDir(dir);

    for (let i = 0; i < files.length; i++) {
        saveFile(files[i], dir);
    }
    console.log(files);
};

// POST /files/single/upload
export const uploadSingleFile = async (ctx: Context, next: Next) => {
    if (!ctx.request.files) {
        ctx.status = 400;
        return;
    }

    const { dir } = ctx.request.query;
    if (!dir || typeof dir !== 'string') {
        ctx.status = 400;
        return;
    }

    const file: any = ctx.request.files.file;

    // 폴더 확인 및 생성
    mkDir(dir);

    await saveFile(file, dir);

    console.log(file);
};

// POST /files/get
export const getFiles = (ctx: Context, next: Next) => {};

// POST /files/single/get
export const getSingleFile = (ctx: Context, next: Next) => {};

// POST /files/delete
export const deleteFiles = (ctx: Context, next: Next) => {};

// POST /files/single/delete
export const deleteSingleFile = (ctx: Context, next: Next) => {};
