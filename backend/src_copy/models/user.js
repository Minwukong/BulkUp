/*
JWT : 데이터가 JSON으로 이루어져 있는 토큰. 두 개체가 서로 안전하게 정보를
주고 받을 수 있도록 웹표준으로 정의된 기술

토큰 기반 인증 시스템
토큰 : 로그인 이후 서버가 만들어 주는 문자열
해당 문자열에는 사용자의 로그인 정보, 해당 정보가 서버에서 발급되었음을
증명하는 서명이 있음.
서명 데이터 :  해싱 알고리즘을 통해 만들어진다. HMAC SHA256. RSA SHA256

서버에서 만들어준 토큰->무결성 보장(정보가 변경되거나 위조되지 않았다.)

사용자 로그인
->서버에서 사용자에게 해당 사용자 정보를 지니고 있는 토큰 발급
->추후 사용자가 다른 API요청을 하게 될때 발급받은 토큰과 함께 요청하게 된다.
->서버에서는 해당 토큰이 유효한지 검사
->결과에따라 작업을 처리하고 응답


토큰 기반 인증시스템
1.서버에서 사용자 로그인 정보를 기억하기 위해 사용하는 리소스가 적다.
2. 사용자 쪽에서 로그인 상태를 지닌 토큰을 가지고 있기 때문에 서버의 확장성이 매우 높다.

*/

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

//setPassword,checkPassword->인스턴스 메서드
//모델을 통해 만든 문서 인스턴스에서 사용할수 있는 함수

//비밀번호를 파라미터로 받아 계정의 hashedPassword 값을 설정
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};
//파라미터로 받은 비밀번호가 해당 계정의 비밀번호와 일치하는지 검증
UserSchema.methods.checkPassword = async function (password) {
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
      username: this.username,
    },
    process.env.JWT_SECRET, //두번째 파라미터에는 JWT암호
    {
      expiresIn: "7d", //7일동안만
    }
  );
  return token;
};
//스태틱 메서드
//모델에서 바로 사용할수 있는 함수

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};
const User = mongoose.model("User", UserSchema);
export default User;
