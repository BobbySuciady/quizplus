module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    Question.associate = (models) => {
      Question.belongsTo(models.Quiz, { foreignKey: 'quizId', as: 'quiz' });
    };
  
    return Question;
  };
  