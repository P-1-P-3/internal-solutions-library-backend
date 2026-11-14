import mysql from 'mysql2/promise';

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_database',
    timezone: 'Z',
};

const connection = mysql.createPool(config);

export default connection;

//Connection db and enviroment variables