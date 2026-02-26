import { NestFactory } from "@nestjs/core";
import { AppModule } from "@src/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors();
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
