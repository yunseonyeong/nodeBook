const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');


module.exports = () => {
  passport.serializeUser((user, done) => {      // 로그인 시 실행됨, req.session 객체에 어떤 데이터 저장할지 정함.
    done(null, user.id);              // user에는 사용자 정보가 담겨있고, user.id를 done함수의 인자로 넘긴다.
                                      // done함수의 첫번째 인자는 에러, 두번째 user.id가 저장하고 싶은 데이터, 사용자 정보 전부 다 저장하기엔 용량 크니까 id만 
  });

  passport.deserializeUser((id, done) => {        // 얘는 로그인뿐 아니라 모든 요청시 실행됨
    User.findOne({ where: { id }})                // user.id 가 인수로 들어간다. 즉, 세션에 저장해둔 데이터로 db조회를 한다.
      .then(user => done(null, user))             // req.user 에 조회한 정보 저장
      .catch(err => done(err));
  });

  local();
  kakao();
};