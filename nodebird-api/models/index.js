const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const Domain = require('./domain');

const db = {};
const sequelize = new Sequelize(            // MySQL 연동 위해 sequelize 연결 객체 생성
  config.database, config.username, config.password, config,      // config.json 파일에 있는 MySQL 관련 정보 가져와 연결 
);

db.sequelize = sequelize;       // db 객체의 sequelize 속성에 만든 연결객체 부여
db.User = User;           // User.js 에서 만든 모델 import 하여 User 속성에 넣는다.
db.Post = Post;           // Post.js 에서 만든 모델 import 하여 Post 속성에 넣는다.
db.Hashtag = Hashtag;     // Hashtag.js 에서 만든 모델 import 하여 Hashtag 속성에 넣는다.
db.Domain = Domain;

User.init(sequelize);   // init 함수 실행시켜 테이블 정보와 모델 연결
Post.init(sequelize);
Hashtag.init(sequelize);
Domain.init(sequelize);

User.associate(db);     // 다른 테이블과의 관계 위해 연결
Post.associate(db);
Hashtag.associate(db);
Domain.associate(db);

module.exports = db;      // 앞으로 다른 파일에서 db.User, db.Post, db.Hashtag 로 접근할거야. 이제 다시 각 모델 파일 가서 외래키 설정해주자.