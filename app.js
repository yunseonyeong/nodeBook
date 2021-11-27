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

const multer = require('multer');   // multer 미들웨어는, 여러가지 파일들을 멀티파트 형식으로 업로드 시 사용됨
const fs = require('fs');

try{
  fs.readdirSync('uploads');
} catch (error){
  console.error('uploads 폴더가 없어 새로 만듭니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({   // multer 미들웨어 변수 upload 선언, 인수로 어디에 어떻게 저장할지 설정한다.
  storage : multer.diskStorage({    
    destination(req, file, done){ // req에는 요청에 대한 정보가 담겨있다, file 객체에는 업로드한 파일 정보가 담겨있다.
      done(null, 'uploads/');
    },
    filename(req, file, done) { // req에는 요청에 대한 정보가 담겨있다, file 객체에는 업로드한 파일 정보가 담겨있다.
      const ext = path.extname(file.originalname); // ext : 확장자, 
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);   //done 함수의 두번째 매개변수에는 실제경로나 파일 이름 넣어준다, req나 file의 데이터를 가공해 done으로 넘기는 형식이다.
    }, // 파일명 => [파일명+현재시간.확장자] 
  }),
  // limits: {fileSize: 5 * 1024 * 1024},      // limits 속성으로 파일 사이즈를 제한할 수 있다.
});

app.get('/upload', (req, res)=> { 
  res.sendFile(path.join(__dirname, 'multipart.html'));
});

app.post('/upload', upload.fields([{name : 'image1'}, {name : 'image2'}]), (req, res) => {   // 파일 업로드 요청
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(req.files, obj);   // 현재 multipart.html의 type="file" input들이 서로 다르기 때문에 fields라는 미들웨어로 처리하고, req.files가 받는다. type="text" 는 req.body에서 처리해준다.
  res.send('ok');                     // fields 미들웨어의 인수로는 input 태그의 name 을 각각 적는다. 
  },
);

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