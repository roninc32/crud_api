import mysql from 'mysql2/promise';
import config from './config.json';

async function testConnection() {
    try {
        const { host, port, user, password, database } = config.database;
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`USE \`${database}\`;`);
        console.log('Database connection successful');
        await connection.end();
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

testConnection();