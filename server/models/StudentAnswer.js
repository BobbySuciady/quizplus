module.exports = (sequelize, DataTypes) => {
    const StudentAnswer = sequelize.define('StudentAnswer', {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      answerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return StudentAnswer;
  };
  