import Router from 'koa-router';
import files from './files';
import products from './products';
import reviews from './reviews';
// import auth from './auth';

const api = new Router();
api.use('/products', products.routes());
api.use('/reviews', reviews.routes());
api.use('/files', files.routes());
// api.use("/auth", auth.routes());

export default api;
