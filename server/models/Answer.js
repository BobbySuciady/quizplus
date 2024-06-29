module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    });
  
    return Answer;
  };
  