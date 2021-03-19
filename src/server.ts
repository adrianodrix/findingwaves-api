import { Server } from '@overnightjs/core';
import * as database from '@src/database';
import express, { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import './utils/module-alias';

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
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  public async close(): Promise<void> {
    await database.close();
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }
}
