module.exports = (sequelize, type) => {
    return sequelize.define("file", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        path: type.STRING,
        hash: type.STRING
    });
};
