// models/Subject.js
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define("Subject", {
    subjectId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Subject.associate = (models) => {
    Subject.belongsToMany(models.Student, {
      through: 'StudentSubjects',
      foreignKey: 'subjectId',
      as: 'students',
    });

    Subject.belongsToMany(models.Teacher, {
      through: 'TeacherSubjects',
      foreignKey: 'subjectId',
      as: 'teachers',
    });

    Subject.hasMany(models.Quiz, { foreignKey: 'subjectId', as: 'quizzes' });
  };

  return Subject;
};
