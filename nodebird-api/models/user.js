const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'local',        // kakao 로그인 했을 시, provider : 'kakao', eefault는 local(로컬 로그인)
      },
      snsId: {
        type: Sequelize.STRING(30),   // kakao 로그인 시, snsId 저장
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }


// 같은 테이블 간 N:M 관계에서는 모델 이름과 컬럼 이름을 따로 정해야 한다.
// through 옵션을 통해 생성할 모델 이름을 Follow 로 정하자.
// Follow 모델에서 사용자 id를 저장하는 컬럼 이름이 둘 다 UserId 면 헷갈리니까 따로 foreignKey 옵션으로 지정한다. 
// as 옵션은 foreignKey 옵션과 반대이다. 

  static associate(db) {
    db.User.hasMany(db.Post);           // User 모델은 Post 모델과 1(User):N(Post) 관계
    db.User.belongsToMany(db.User, {    // User 모델은 자기 자신과 N:M  관계임, (팔로잉 기능 때문)
      foreignKey: 'followingId',        // 유저는 여러 유저를 팔로잉 할 수 있다. 그리고 그 유저는 팔로워이다.
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {        // 유저는 여러 팔로워를 가질 수 있다. 그 유저는 그들로부터 팔로잉되는 유저이다. 
      foreignKey: 'followerId',             
      as: 'Followings',
      through: 'Follow',
    });
    db.User.hasMany(db.Domain);
  }
};