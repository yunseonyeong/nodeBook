const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() }, 
          })
        }),
      );
      // 시퀄라이즈는 모델과 모델 간의 어떤 관계가 있는지 include 배열로 정의 해준 후에는 아래와 같은 메소드를 지원한다. 
      // 동사 뒤의 모델 이름을 바꾸고 싶다면, 관계 설정 시 as옵션을 사용하면 된다. 
      // getHashtags: 조회
      // setHashtags : 수정
      // addHashtag : 하나 생성
      // addHashtags : 여러 개 생성
      // removeHashtags : 삭제
      await post.addHashtags(result.map(r => r[0]));          // Post모델과 Hashtag모델이 associate 되어있기 때문에 addHashtags 메소드를 사용할 수 있다. 
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;