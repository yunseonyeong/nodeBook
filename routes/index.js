const express = require('express');

const router = express.Router();

// router.get('/abc', (req, res) => {
//   res.send('GET /abc');
// });

// router.post('/abc', (req, res) => {
//   res.send('POST /abc');
// });

// 같은 주소로 post, get 요청 시 코드 간결하게 

router.route('/abc')
  .get((req, res) => {
    res.send('GET /abc');
  })
  .post((req, res) => {
    res.send('POST /abc');
  });

module.exports = router;