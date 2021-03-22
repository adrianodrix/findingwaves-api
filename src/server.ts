import expressPino from 'express-pino-logger';
import cors from 'cors';
import helmet from 'helmet';

import { Server } from '@overnightjs/core';
import * as database from '@src/database';
import express, { Application } from 'express';
import { BeachesController } from './controllers/beaches';
import { ForecastController } from './controllers/forecast';
import { UsersController } from './controllers/users';
import logger from './logger';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  public getApp(): Application {
    return this.app;
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: '*',
      })
    );
    this.app.use(
      expressPino({
        logger,
      })
    );
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server listening on port: ${this.port}`);
    });
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }
}
