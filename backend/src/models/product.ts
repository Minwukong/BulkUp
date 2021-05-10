import mongoose, { Schema } from 'mongoose';
import {
    ProductType_gender,
    ProductType_main,
    ProductType_serve,
} from '../../../frontend/src/define/types/product';

// 상품 정보 스키마
const productSchema = new Schema({
    title: { type: String, index: true, required: true },
    description: { type: String, required: true }, // HTML Tag가 포함된 문자열
    price: { type: Number, default: 0 },
    views: { type: Number, default: 0 }, // 조회수
    reviewCount: { type: Number, default: 0 }, // 전체 리뷰 수

    // 이미지 경로
    thumbnailImage: { type: String, default: '' },
    images: { type: Array, default: [] },

    // 타입 ( 카테고리 분류 )
    genderType: { type: Number, default: ProductType_gender.GIRL }, // 대분류
    mainType: { type: Number, default: ProductType_main.TOP }, // 중분류
    serveType: { type: Number, default: ProductType_serve.SHORT }, // 소분류

    // 옵션 ( 하단 스키마 설명 참고 )
    options: { type: Object, default: {} },

    // 태그
    tags: { type: Array, default: [] },
    colorTags: { type: Array, default: [] }, // Color Hex

    // 날짜 기록
    publishDate: { type: String, required: true },

    // 참조 데이터
    ref_reviewList: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

const Product = mongoose.model('Product', productSchema);
export default Product;

// ===================== 스키마 설명 ===================== //
// options : {
//     블랙: [ { size: 'L(100)', sold: 10 }, { size: 'XL(105)', sold: 20 } ],
//     pink: [
//         { size: 'L(100)', sold: 5 },
//         { size: 'XL(105)', sold: 2 },
//     ],
// };
