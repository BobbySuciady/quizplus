// models/Quiz.js
module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define("Quiz", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subjects' });
    Quiz.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teachers' });
    Quiz.hasMany(models.Question, { foreignKey: 'quizId', as: 'questions' });
    Quiz.hasMany(models.StudentResult, { foreignKey: 'quizId', as: 'results' });
  };

  return Quiz;
};
