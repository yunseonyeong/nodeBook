const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const { authenticate } = require('passport');

const router = express.Router();

// 회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) => {       // isNotLoggedIn 에서 next() 가 실행되어야, 
                                                                      // 즉 isNotLoggedIn미들웨어의 isAuthenticated가 false여야만 다음 미들웨어가 실행된다.
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });          //db에서 해당 email 가진 애 있는지 조회
    if (exUser) {
      return res.redirect('/join?error=exist');                 // 있으면 주소 뒤에 에러 쿼리스트링으로 찍어서 회원가입 페이지로 돌려 보낸다. 
    }
    const hash = await bcrypt.hash(password, 12);         // 없으면 비밀번호 해싱 암호화 (bcrypt 사용, 프로미스 지원하므로 await 사용한다.)
    await User.create({                       // 사용자 정보 생성
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');                         // 메인으로 redirect
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {             
  passport.authenticate('local', (authError, user, info) => {   // 로그인 요청 시, passport.authenticate('local') 미들웨어가 로컬 로그인 전략 수행.
    if (authError) {          // authenticate() 내부의 콜백함수가 실행된다, authError이 존재하면 실패
      console.error(authError);
      return next(authError);
    }
    if (!user) {            // 두번째 인수인 user 가 존재하지 않으면 로그인 실패
      return res.redirect(`/?loginError=${info.message}`);        // 쿼리스트링으로 로그인 에러
    }
    return req.login(user, (loginError) => {          // user도 있고, authError는 없으면 로그인 성공, login()은 내장함수, req객체에 login 메소드 추가 및 user전달, passport.serializeUser으로 넘어감.
      if(loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {       // isLoggedIn 이 true 여야 next실행되어 콜백함수 실행됨.
  req.logout();                   // passport.logout()함수는 req.user 객체를 제거한다.
  req.session.destroy();          // req.session 객체의 세션 정보도 지운다.
  res.redirect('/');              // 따라서, 다시 메인 페이지로 돌아가면 로그인 해제되어 있을 것.
});

module.exports = router;