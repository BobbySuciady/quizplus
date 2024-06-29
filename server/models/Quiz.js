module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define('Quiz', {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        teacherId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      });
      return Quiz;
}



