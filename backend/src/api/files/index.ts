import koaBody from 'koa-body';
import Router from 'koa-router';
import * as filesCtrl from './files.ctrl';

const files = new Router();
files.post('/upload', koaBody({ multipart: true }), filesCtrl.uploadFiles);
files.post('/get', filesCtrl.getFiles);
files.post('/delete', filesCtrl.deleteFiles);

const file = new Router();
file.post('/upload', koaBody(), filesCtrl.uploadSingleFile);
file.post('/get', filesCtrl.getSingleFile);
file.post('/delete', filesCtrl.deleteSingleFile);

files.use('/single', file.routes());

export default files;
