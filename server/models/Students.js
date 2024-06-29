// Make table in mysql
module.exports = (sequelize, Datatypes) => {
    const Students = sequelize.define("Students", {
        username : {
            type: Datatypes.STRING,
            allowNull: false,
        },
        password : {
            type: Datatypes.STRING,
            allowNull: false,
        },
    })
    return Students;
}