const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');


module.exports = () => {
  passport.serializeUser((user, done) => {      // 로그인 시 실행됨, req.session 객체에 어떤 데이터 저장할지 정함.
    done(null, user.id);              // user에는 사용자 정보가 담겨있고, user.id를 done함수의 인자로 넘긴다.
                                      // done함수의 첫번째 인자는 에러, 두번째 user.id가 저장하고 싶은 데이터, 사용자 정보 전부 다 저장하기엔 용량 크니까 id만 
  });

  passport.deserializeUser((id, done) => {        // 얘는 로그인뿐 아니라 모든 요청시 실행됨, 라우터 실행 이전에 이게 먼저 실행된다. 
                                                  // +) 서비스 규모가 커지면 디비에 부담이 되므로 캐싱해놓으면 좋음.
    User.findOne({ 
      where: { id },    // user.id 가 인수로 들어간다. 즉, 세션에 저장해둔 데이터로 db조회를 한다.
      include: [{       // 이제부터 following, follower 목록도 사용자 정보 불러올 때 마다 불러오도록 추가해준다.
        model: User,
        attributes: ['id', 'nick'],           // 계속 attributes 를 지정하는 이유는, 실수로 비번 조회하지 않도록 
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })                
      .then(user => done(null, user))             // 두번째 인자는 저장하고 싶은 데이터, req.user 에 조회한 정보 저장
      .catch(err => done(err));
  });

  local();
  kakao();
};