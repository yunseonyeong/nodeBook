const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({        // LocalStrategy 생성자
    usernameField: 'email',       // 전략에 관한 설정을 담당, req.body.email과 req.body.password에 담겨 들어온 애들을 넣어준다.
    passwordField: 'password',
  }, async (email, password, done) => {       // 실제 전략을 수행하는 async함수, 세번째 인자 done은 passport.authenticate의 콜백함수
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {       // password 일치하면, 
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {          // user 가 존재하지 않으면, 
        done(null, false, { message: '가입되지 않은 회원입니다. '});
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};