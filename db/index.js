const Sequelize = require("sequelize");

const connectToDataBase =  () => {
    const dev = () => new Sequelize('thursday', 'postgres', 'vlad2020',
            {
                host: 'localhost',
                dialect: 'postgres'
            },
        );

    const prod = () =>  new Sequelize(process.env.DATABASE_URL);

    switch (process.env.NODE_ENV) {
        case 'development':
            return  dev();
        case 'production':
            return  prod();
        default: return  dev();
    }
};
const db = connectToDataBase();

db.sync({
    alter: true
});

module.exports = db;