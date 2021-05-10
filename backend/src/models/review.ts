import mongoose, { Schema } from 'mongoose';

// 상품 게시글의 리뷰 스키마
const ReviewSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    images: { type: Array, default: [] },

    grade: { type: Number, default: 5, max: 5 }, // 평점 등급 0 ~ 5
    good: { type: Number, default: 0 }, // 좋아요 갯수

    // 날짜 기록
    publishDate: { type: String, required: true },
    updateDate: { type: String, required: true },

    // 참조 데이터
    ref_user: { type: Schema.Types.ObjectId, ref: 'User' },
    ref_product: { type: Schema.Types.ObjectId, ref: 'Product' },
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
