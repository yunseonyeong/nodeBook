const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');
const { hash } = require('bcrypt');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;        // 로그인에 성공하면 req.user가 있으므로 팔로워 수 넣기
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;      // 로그인 성공하면 req.user가 있으므로 팔로잉 수 넣기
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];   // 나중에 팔로워 리스트에 작성자 id가 존재하지 않으면 팔로우 버튼 노출시키기 위해 리스트 생성
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order : [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
  }
});


router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res) => {
  const twits = [];
  res.render('main', { title: 'NodeBird', twits,});
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;        // 쿼리스트링으로 해시태그 이름을 받는다.
  if (!query) {
    return res.redirect('/');         // 해시태그 이름 못받았으면 메인 페이지 렌더링 
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query} });      // title 이 해당 해시태그인 애들 검색
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{model: User}] });       // 시퀄라이즈 제공 메소드인 getPosts 사용해 해당 해시태그 가진 모든 게시물 가져온다. 
                                                                          // 이 때, 사용자 정보를 합친다.
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,         // 조회된 게시물만 넣어서 렌더링
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
module.exports = router;