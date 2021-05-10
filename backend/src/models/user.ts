import mongoose, { Schema  } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// 유저 정보 스키마
const UserSchema = new Schema({
    // userID: { type: String, required: true, trim: true },
    // hashedPassword: { type: String, required: true, trim: true },
    // email: { type: String, trim: true },
    // nickName: { type: String, unique: true, trim: true },

    userID:String ,
    hashedPassword:String,
    email: String,
    nickName:String ,


    // userID: { type: String, required: true, trim: true },
    // hashedPassword: { type: String, required: true, trim: true },
    // email: { type: String, trim: true },
    // name: { type: String, required: true, unique: true, trim: true },
    // nickName: { type: String, unique: true, trim: true },
    // address: { type: String, required: true },
    // phoneNumber: { type: String, required: true },
    // point: { type: Number },

    // 참조 데이터
    // ref_reviewList: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    // ref_wishList: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    // ref_cartList: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
    // ref_orderList: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
});

UserSchema.methods.setPassword = async function (password: any) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};
//파라미터로 받은 비밀번호가 해당 계정의 비밀번호와 일치하는지 검증
UserSchema.methods.checkPassword = async function (password: any) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    //첫번째 파라미터에는 토큰안에 집어 넣고 싶은 데이터를 넣는다.
    {
      _id: this.id,
      userID: this.userID,
    },
    process.env.JWT_SECRET as any, //두번째 파라미터에는 JWT암호
    {
      expiresIn: "7d", //7일동안만
    }
  );
  return token;
};
//스태틱 메서드
//모델에서 바로 사용할수 있는 함수

UserSchema.statics.findByUsername = function (userID: any) {
  return this.findOne({ userID });
};



const User = mongoose.model("User", UserSchema);
export default User;
