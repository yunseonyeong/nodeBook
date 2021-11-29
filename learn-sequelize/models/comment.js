const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      comment: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },            // 외래키인 commenter 컬럼이 왜 없냐고 ? 나중에 시퀄라이즈 자체에서 관계를 따로 정의할 수 있다. 
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',   // 한글, 임티까지 허용
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'});
  }
};

// 테이블 두개 다 작성했으면 , index.js 에서 이 둘을 연결하자. 