import Joi from "joi";
import User from "../../models/user";
//회원가입
/*
POST /api/auth/register
{
    username:'hong'
    password:'mypass123'
}
*/
export const register = async (ctx) => {
  //Request Body 검증
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { username, password } = ctx.request.body;
  try {
    //username이 이미 존재하는지 확인
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; //conflict
      return;
    }
    const user = new User({
      username,
    });
    await user.setPassword(password); //비번설정
    await user.save(); //데이터 베이스 저장

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
//로그인
//POST /api/auth/register
// {
//     username:'hong'
//     password:'mypass123'
// }
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;
  //둘중 하나라도 없으면 에러
  if (!username || !password) {
    ctx.status = 401;
    return;
  }
  try {
    const user = await User.findByUsername(username);
    //계정이 없으면 에러
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    // 잘못된 비번이라면
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
//로그인 상태 확인
//GET /api/auth/check
export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};
//로그아웃
export const logout = async (ctx) => {
  ctx.cookies.set("access_token");
  ctx.status = 204;
};

/*
사용자가 브라우저에서 토큰을 사용할때 주로 두가지 방법을 사용한다.
1.브라우저의 localStorage, sessionStorage에 담아서 사용
2. 브라우저의 쿠키에 담아서 사용

*/
