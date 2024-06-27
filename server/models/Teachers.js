// Make table in mysql
module.exports = (sequelize, Datatypes) => {
    const Teachers = sequelize.define("Teachers", {
        username : {
            type: Datatypes.STRING,
            allowNull: false,
        },
        password : {
            type: Datatypes.STRING,
            allowNull: false,
        },
    })
    return Teachers;
}