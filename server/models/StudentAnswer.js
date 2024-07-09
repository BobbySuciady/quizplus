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
        quizId: { 
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    StudentAnswer.associate = (models) => {
        StudentAnswer.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
        StudentAnswer.belongsTo(models.Question, { foreignKey: 'questionId', as: 'question' });
        StudentAnswer.belongsTo(models.Quiz, { foreignKey: 'quizId', as: 'quiz' }); 
    };

    return StudentAnswer;
};
