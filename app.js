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

app.use((req, res, next) => {   // 익스프레스가 자체적으로 404에러 처리해주기는 하지만, 웬만하면 에러처리 미들웨어랑 연결되는 404응답 미들웨어를 만들어주자. 
  // ㅋㅋ 근데 이게 왜 에러처리 미들웨어랑 연결임 ,, ? 이해 못했음 ,, error 객체 만들어주고 next(error) 해야 연결되는거 아입니까? 
  // res.status(404).send('Not Found');
  const testErr = new Error("테스트 에러임"); // 일케요
  next(testErr);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log("3000 port waiting.. ");
});