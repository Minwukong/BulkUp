import Router from 'koa-router';
import * as reviewsCtrl from './reviews.ctrl';
// import checkLoggedIn from '../../lib/checkLoggedIn';

const reviews = new Router();
reviews.get('/', reviewsCtrl.list);
reviews.post('/', reviewsCtrl.create);

const review = new Router(); // /api/posts/:id
// post.get("/", postsCtrl.read);
// post.delete("/", checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
// post.patch("/", checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

reviews.use('/:id', review.routes());

export default reviews;
