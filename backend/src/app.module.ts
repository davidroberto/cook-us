import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HomeModule } from "@src/modules/home/home.module";
import { CookModule } from "@src/modules/cook/cook.module";
import { CookRequestModule } from "@src/modules/cook-request/cookRequest.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres" as const,
        host: process.env.POSTGRES_HOST || "localhost",
        port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
        username: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "postgres_password",
        database: process.env.POSTGRES_DB || "cook_us",
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    HomeModule,
    CookModule,
    CookRequestModule,
  ],
})
export class AppModule {}
