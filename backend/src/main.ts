import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1'); // matches Vite proxy target
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupSwagger(app);

  await app.listen(process.env.PORT || 4000);
  console.log(`API on http://localhost:${process.env.PORT || 4000}/v1`);
}
bootstrap();
