// src/config/swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste your JWT here',
      },
      'access-token', // Name of the security scheme
    )
    .addServer('/') // you can add more servers (e.g. staging)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // include: [AppModule], // optionally limit which modules to scan
    // deepScanRoutes: true, // useful if you have lazy-loaded modules
  });

  SwaggerModule.setup('v1/api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keeps token on page reload
      docExpansion: 'none',
    },
    customSiteTitle: 'My API Docs',
  });
}
