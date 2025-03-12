import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import config from "../config.json";
import { initUserModel, User } from "../users/user.model"; // Import User model initializer

// Define database interface
interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

// Define database object
const db: { User?: typeof User; sequelize?: Sequelize } = {};

export default db;

export async function initialize(): Promise<void> {
    try {
        console.log("Initializing database...");

        // Load database config
        const { host, port, user, password, database }: DatabaseConfig = config.database;
        console.log(`Database config: host=${host}, port=${port}, user=${user}, database=${database}`);

        // Create connection to MySQL
        const connection = await mysql.createConnection({ host, port, user, password });
        console.log("MySQL connection established");

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        console.log("Database checked/created");

        // Connect to the database using Sequelize
        const sequelize = new Sequelize(database, user, password, {
            dialect: "mysql",
            logging: false, // Set to 'console.log' to enable logging
        });
        console.log("Sequelize connection established");

        // Initialize the User model
        db.User = initUserModel(sequelize);
        db.sequelize = sequelize;

        // Sync models without forcing recreation
        await sequelize.sync({ force: false });
        console.log("Models synchronized");

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Database initialization failed:", error);
        throw new Error("Database initialization failed");
    }
}

// Ensure database is initialized before export
initialize().then(() => {
    console.log("Database is ready for use.");
}).catch(err => {
    console.error("Failed to initialize database:", err);
});