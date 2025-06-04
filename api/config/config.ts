import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); 

export const appConfig = {
  appDb: {
    port: parseInt(process.env.DBPORT || '3306'),
    host: process.env.DBHOST as string,
    user: process.env.DBUSER as string,
    password: process.env.DBPASS as string,
    database: process.env.DBNAME as string,
    force: process.env.FORCE === 'true',
    logging: process.env.LOGGING === 'true',
    alter: process.env.ALTER === 'true',
  },
  port: parseInt(process.env.PORT || '3001'),
};
