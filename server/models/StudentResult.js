module.exports = (sequelize, DataTypes) => {
    const StudentResult = sequelize.define('StudentResult', {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  
    return StudentResult;
  };
  