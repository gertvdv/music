const FileModel = require("./models/file");

const Sequelize = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_PATH
});

var File = FileModel(sequelize, Sequelize);

sequelize
    .authenticate()
    .then(() => {
        console.log(`Successfully connected to ${process.env.DB_PATH}`);
        File.sync();
    })
    .catch(err => {
        console.log(err);
    });

module.exports = {
    File
};
