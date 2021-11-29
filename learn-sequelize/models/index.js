const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};      // db객체 선언

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;       // db객체의 sequelize 속성에다가, 윗줄에서 생성한 MySQL 연결 객체를 넣어둔다. 재사용 위해서, 

db.User = User;     // User 객체에는 아까 user.js 에서 export 한 user 모델을 담아두고,
db.Comment = Comment;   // Comment 객체도 마찬가지, 

User.init(sequelize);     // static init 메소드로 테이블 설정 , 이게 실행되어야 테이블이 모델로 연결이 된다.
Comment.init(sequelize);    

User.associate(db);       // 다른 테이블이랑 관계 연결해주는 associate 함수, 미리 실행해두자. 
Comment.associate(db);

module.exports = db;  // 이렇게 db객체 안에 User, Comment 모델을 담아두었다. 앞으로 다른 곳에서 db객체 require 하여 User , Comment 모델에 접근할 수 있다. 