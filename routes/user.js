const express = require('express');

const router = express.Router();

// GET /user 라우터

router.get('/', (req, res) => {     // 일반 라우터
  res.send('hello, user(origin)');
});

router.get('/:id', (req, res) => {      // 매개변수 들어간 라우터는 다른 라우터들을 아우르기 때문에 같은 경로 포함하는 일반 라우터보다 뒤에 위치해야 방해를 안함.
  console.log(req.params, req.query);   // req.params에는 id, query 는 ?구분자 뒤의 쿼리스트링들의 키:값 담겨 있음
  res.send('Hello, User');np
});

module.exports = router;

