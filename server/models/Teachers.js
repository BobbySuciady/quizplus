// models/Teacher.js
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define("Teacher", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Teacher.associate = (models) => {
    Teacher.belongsToMany(models.Subject, {
      through: 'TeacherSubjects',
      foreignKey: 'teacherId',
      as: 'subjects',
    });
  };

  return Teacher;
};
