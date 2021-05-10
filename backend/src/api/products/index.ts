import Router from 'koa-router';
import * as productsCtrl from './products.ctrl';

// /api/products
const products = new Router();

// query 문을 통해 리스트를 받아온다.
products.post('/getList', productsCtrl.list);
products.post('/', productsCtrl.checkAdminUser, productsCtrl.create);
products.post(
    '/deleteAll',
    productsCtrl.checkAdminUser,
    productsCtrl.RemoveAll
);

// /api/products/:id
const product = new Router();
product.get('/', productsCtrl.read);
product.patch('/', productsCtrl.checkAdminUser, productsCtrl.update);
product.delete('/', productsCtrl.checkAdminUser, productsCtrl.remove);

products.use('/:id', productsCtrl.getProductById, product.routes());

export default products;
