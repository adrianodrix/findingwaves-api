import config, { IConfig } from 'config';
import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';

const dbConfig: IConfig = config.get('App.database');

export const connect = async (): Promise<Mongoose> =>
  await mongoose.connect(
    dbConfig.get('mongoUrl'),
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) logger.error(err?.message);
    }
  );

export const close = (): Promise<void> => mongoose.connection.close();
