const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {            // 게시글 모델은 게시글 내용과 이미지 경로를 저장한다.
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    },{
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {                // 나중에 sequelize가 알아서 게시글 등록자 id 값 담은 컬럼 생성해준다. 외래키로, 
    db.Post.belongsTo(db.User);         // Post(N) : User(1), 시퀄라이즈가 Post 모델에 UserId 컬럼 추가한다.
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag'});        // Post(N) : Hashtag(M) , PostHashtag 는 중간 모델, 이 때는 User모델과 다르게 
                                                                      // 같은 테이블이 아니기 때문에, foreignKey는 자동으로 postId 와 HashtagId 가 추가된다.
  }         
};