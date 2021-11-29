const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {          // User모델을 만들고, 모듈로 export한다. 모델은 Sequelize.Model을 확장한 클래스로 선언한다.
  static init(sequelize) {        // init 메소드는 테이블에 대한 설정을 한다. 
    return super.init({               // 첫번째 인수 : 컬럼에 대한 설정, 두번째 인수 : 테이블에 대한 설정
      name :{           // id 컬럼은 시퀄라이즈에서 알아서 기본키로 연결하므로, 적어줄 필요 없음. 그 외 컬럼 정보들은 MySQL 테이블과 일치하여야 한다.
        type: Sequelize.STRING(20),     // MySQL : VARCHAR , Sequelize : STRING
        allowNull: false,           // alloNull : MySQL 의 NOT NULL  옵션과 동일
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED, // MySQL : INT , Sequelize : INTEGER 
        allowNull: false,
      },
      married: {
        type: Sequelize.BOOLEAN, // MySQL : TINYINT , Sequelize : BOOLEAN
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,   
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,   // MySQL : DATETIME , Sequelize : DATE
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      }, {
        sequelize,      // init 메소드의 매개변수와 연결됨, db.sequelize 객체를 넣어야 한다. 나중에 model/index.js 에서 연결한다.
        timestamps: false,  // 자동으로 createdAt , updatedAt 컬럼을 만들어주는 옵션
        underscored: false, // 테이블명, 컬럼명을 camelcase(createdAt) => snakecase(created_at)로 바꿔주는 옵션
        modelName: 'User',  // 모델 이름 설정
        tableName: 'users', // 실제 db 테이블 이름, 보통 모델이름을 소문자, 복수형으로 
        paranoid: false,    // deletedAt 컬럼 만들어주는 속성, 복원에 용이하도록 삭제한 시각을 기록해주기 때문에 삭제한 row 를 나중에 복원할 일이 생길거라면 true값을 부여하자.
        charset: 'utf8',   // 한글설정
        collate: 'utf8_general_ci', //한글설정
      });
  }
  static associate(db) {}     
};