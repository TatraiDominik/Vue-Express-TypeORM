import express from 'express';
import cors from 'cors';
import path from 'path'
import { dataSource as db } from './config/database';
import { appConfig } from './config/config';
import producerRoutes from './routes/producer.routes';
import movieRoutes from './routes/movies.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Register routes
app.use('/api/producers', producerRoutes);
app.use('/api/movies', movieRoutes);

db.initialize() 
  .then(() => {
    console.log('Database connection has been established successfully.');
    
    
    return db.synchronize(); 
  })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(appConfig.port, ()=>{
    console.log(`Server running at http://localhost:${appConfig.port}`)
})
