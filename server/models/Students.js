// models/Student.js
module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Student.associate = (models) => {
      Student.belongsToMany(models.Subject, {
        through: 'StudentSubjects',
        foreignKey: 'studentId',
        as: 'subjects',
      });
    };
  
    return Student;
  };
  