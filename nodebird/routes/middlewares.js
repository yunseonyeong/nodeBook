// 접근 권한 제어하는 미들웨어를 만들어보자. 
// 1. 로그인된 사용자는 login, signup 라우터 접근 x
// 2. 로그인 하지 않은 사용자는 logout 라우터 접근 x
// isAuthenticated 메소드는 passport가 지원하는 req객체에 추가되는 메소드이다. 로그인 여부를 파악할 수 있다.

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`)
  }
}