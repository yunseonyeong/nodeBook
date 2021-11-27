const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');     // 템플릿 엔진으로 ejs 가 아닌 nunjucks를 사용해보자.

dotenv.config();
const indexRouter = require('./routes'); // index.js는 생략 가능하다. 존재하는 형식의 파일명임
const userRouter = require('./routes/user');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');       // 넌적스임을 명시하려면 'njk'로 변경해도 되지만, 그냥 html 확장자 그대로 사용해도 됨.

nunjucks.configure('views', {       // 첫번째 인수 : views 폴더 경로 , 두번째 인수 : 옵션
  express : app,    // express 속성에 app 객체 연결
  watch : true,       // html 파일이 변경되면 템플릿 엔진 다시 렌더링하겠다는 뜻.
});

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
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
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);    // 에러 처리 미들웨어의 err로 연결됨.
});

app.use((err, req, res, next) => {
  res.locals.message = err.message; // 404 에러 발생시, 위 함수에서 선언한대로 req.method + req.url + 라우터가 없습니다.가 됨.
  // 시스템 환경(process.env.NODE_ENV)이 배포환경(production)이 아닐 때 err, 'error.html'의 error.stack은 이때만 표시된다.
  // => 배포환경에서는 보안 문제로 에러 스택 트레이스를 노출하지 않는다. 서버 폴더 구조를 유추할 수 있기 때문.
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};  
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log("3000 port waiting.. ");
});