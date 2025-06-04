import { DataSource } from 'typeorm';
import { appConfig } from './config';
import { Movies } from '../models/movies.model';
import { Producer } from '../models/producers.model';

const { appDb } = appConfig;


const dataSource = new DataSource({
  type: 'mysql',
  host: appDb.host,
  port: appDb.port, 
  username: appDb.user,
  password: appDb.password,
  database: appDb.database,
  synchronize: true, 
  dropSchema: true, // Drop existing schema and recreate
  logging: true, 
  entities: [
    Movies,
    Producer
  ],
  migrations: [],
  subscribers: [],
});

export { dataSource };
