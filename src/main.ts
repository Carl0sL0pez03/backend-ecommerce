import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

/**
 * Bootstraps the NestJS application.
 *
 * This function initializes the application using the root `AppModule` and enables CORS
 * to allow cross-origin requests. It starts the server and listens on port 3000.
 *
 * @async
 * @function bootstrap
 * @returns A Promise that resolves when the server is running.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3000);
}
bootstrap();
