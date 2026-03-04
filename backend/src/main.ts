import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "@src/app.module";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

async function bootstrap() {
  const uploadsDir = join(process.cwd(), "uploads");
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(uploadsDir, { prefix: "/api/uploads" });
  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("Cook'us API")
    .setDescription("API du projet Cook'us")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
