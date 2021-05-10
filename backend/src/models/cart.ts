import mongoose, { Schema } from 'mongoose';

// 장바구니 스키마
const CartSchema = new Schema({
    selectProductOptions: { type: Array, default: [] },

    // 참조 데이터
    ref_user: { type: Schema.Types.ObjectId, ref: 'User' },
    ref_productList: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;

// ===================== 스키마 설명 ===================== //
// selectProductOptions : [
//  {
//     _id: sdkjf3240u34,
//     color: "블랙",
//     size: "L(100)",
//     count: "2",
//  },
//  {
//     _id: rt4554erg,
//     color: "네이비",
//     size: "M(95)",
//     count: "1",
//  }
// ]
