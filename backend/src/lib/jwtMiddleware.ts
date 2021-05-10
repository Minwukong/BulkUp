import jwt from "jsonwebtoken";
import User from "../models/user";

const jwtMiddleware = async (ctx: any , next : any) => {
  // const token = ctx.cookies.get("access_token");
  // if (!token) return next(); //토큰 없음
  // try {
  //   const jwtSecret = process.env.JWT_SECRET;
  //   const decoded  = jwt.verify(token, String(jwtSecret));
  //   ctx.state.user = {
  //     _id: decoded._id,
  //     userID: decoded.userID,
  //   };
  //   //토큰의 남은 유효기간이 3.5일 미만이면 재발급
  //   const now = Math.floor(Date.now() / 1000);
  //   if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
  //     const user  = await User.findById(decoded._id);
  //     const token = user.generateToken();
  //     ctx.cookies.set("access_token", token, {
  //       maxAge: 1000 * 60 * 60 * 24 * 7,
  //       httpOnly: true,
  //     });
  //   }
  //   //console.log(decoded);
  //   return next();
  // } catch (e) {
  //   return next(); //토큰 검증 실패
  // }
};

export default jwtMiddleware;
