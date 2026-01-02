import dotenv from "dotenv"
dotenv.config()

export const development = {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    dialect: "postgres",
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
    },
}
export const production = {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    dialect: "postgres",
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
    },
}
