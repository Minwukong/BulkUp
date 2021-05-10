import mongoose, { Schema } from 'mongoose';

// 주문 스키마
const OrderSchema = new Schema({
    selectProductOptions: { type: Array, default: [] },

    orderDate: { type: String, required: true },

    // 참조 데이터
    ref_user: { type: Schema.Types.ObjectId, ref: 'User' },
    ref_productList: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;

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
