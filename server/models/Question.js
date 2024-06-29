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
  
    return Question;
  };
  