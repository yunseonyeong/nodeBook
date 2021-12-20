const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,           // kakao에서 발급해주는 아이디, 노출되지 않아야 하므로 process.env 로 설정, 나중에 아이디 발급 받아 .env 파일에 넣을거다.
    callbackURL: '/auth/kakao/callback',        // kakao로부터 인증 결과를 받을 라우터 주소, 라우터 작성 시에 이 주소를 사용하자
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
      const exUser = await User.findOne({       // 이전에 kakao를 통해 회원가입한 사용자가 있는지 조회
        where: {snsId: profile.id, provider: 'kakao'},
      });
      if (exUser) {             // 있다면 done함수에 user 넘겨 호출하고 전략 종료
        done(null, exUser);
      } else {              // 없다면, 첫 로그인 이므로 카카오 계정 정보 가지고 회원가입 시켜준다. 
        const newUser = await User.create({
          email: profile._json && profile._json.kakao_account_email,          // profile 에는 카카오에서 보내준 사용자 정보들이 담겨있다. 
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};