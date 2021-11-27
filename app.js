const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

const indexRouter = require('./routes');    // index.js는 생략 가능하다. 존재하는 형식의 파일명임
const userRouter = require('./routes/user');

app.use(express.json()); // body-parser 
app.use(express.urlencoded({extended: false})); // body-parser
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie-parser => 쿠키 해석해 req.cookies 객체로 만듦// ex) name=zerocho => {name : 'zerocho'}
app.use(session({ // 세션 관리용 미들웨어, 클라이언트에 쿠키를 보냄, 인수로 세션에 대한 설정을 받는다. 
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET, // 세션 쿠키, 쿠키 서명 추가 시 필요함, cookie-parser 의 secret 과 같게 설정하는 것이 좋다.
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log("3000 port waiting.. ");
});