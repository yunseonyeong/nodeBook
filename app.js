const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('combined'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());      // body-parser 
app.use(express.urlencoded({extended:false}));    // body-parser
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie-parser => 쿠키 해석해 req.cookies 객체로 만듦// ex) name=zerocho => {name : 'zerocho'}
app.use(session({   // 세션 관리용 미들웨어, 클라이언트에 쿠키를 보냄, 인수로 세션에 대한 설정을 받는다. 
  resave:false,
  saveUninitialized : false,
  secret: process.env.COOKIE_SECRET,    // 세션 쿠키, 쿠키 서명 추가 시 필요함, cookie-parser 의 secret 과 같게 설정하는 것이 좋다.
  cookie : {
    httpOnly:true,
    secure : false,
  },
  name : 'session-cookie',
}));

app.use((req, res, next) => {
  console.log("모든 요청에 의해 실행");
  next();
});

app.get('/', (req, res, next) => {
  console.log("GET/ 요청에만 실행");
  next();
}, (req, res) => {
  throw new Error("에러는 에러처리 미들웨어에서 계속");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log("3000 port waiting.. ");
});