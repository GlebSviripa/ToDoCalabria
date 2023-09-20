import { DataSource } from 'typeorm';
import * as process from "process";
require('dotenv').config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env["TODO_CALABRIA_DB_HOST"],
    port: parseInt(process.env["TODO_CALABRIA_DB_PORT"] ?? '5434'),
    username: process.env["TODO_CALABRIA_DB_USERNAME"],
    password: process.env["TODO_CALABRIA_DB_PASSWORD"],
    database: process.env["TODO_CALABRIA_DB_NAME"],
    synchronize: true,
    logging: true,
    uuidExtension: 'pgcrypto',
    entities: ["src/database/entities/**/*.ts"],
    migrations: ["migrations/**/*.ts"],
});


if (process.env['ENV'] === 'deployment') {
  AppDataSource.setOptions({
    ssl: {
      rejectUnauthorized: false,
      enableTrace: false,
    },
  });
  AppDataSource.driver.options = AppDataSource.options;
}

export default AppDataSource;
