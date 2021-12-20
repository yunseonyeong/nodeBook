const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {          // hashtag 모델은 태그 이름을 저장한다. 나중에 해시태그로 검색하는 기능을 넣기 위해 해시태그 모델을 따로 두었다.
    return super.init({
      title: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Hashtag',
      tableName: 'hashtags',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag'});     // Hashtag(N) : Post(M)
  }
};

// 이렇게 NodeBird 프로젝트의 Model은 <User, Post, Hashtag, PostHashtag, Follow> 총 5개이다. 