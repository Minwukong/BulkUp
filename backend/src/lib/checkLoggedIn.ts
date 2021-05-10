const checkLoggedIn = (ctx : any, next : any) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    return;
  }
  return next();
};
export default checkLoggedIn;
