import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CookModule } from "@src/modules/cook/cook.module";
import { CookRequestModule } from "@src/modules/cook-request/cookRequest.module";
import { AuthModule } from "@src/modules/auth/auth.module";
import { BackofficeModule } from "@src/modules/backoffice/backoffice.module";
import { ConversationModule } from "@src/modules/conversation/conversation.module";
import { UploadModule } from "@src/modules/upload/upload.module";
import { JwtAuthGuard } from "@src/modules/auth/jwt-auth.guard";
import { RolesGuard } from "@src/modules/auth/roles.guard";

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
    CookModule,
    CookRequestModule,
    AuthModule,
    BackofficeModule,
    ConversationModule,
    UploadModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
