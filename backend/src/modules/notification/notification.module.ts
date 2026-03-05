import { Module } from "@nestjs/common";
import { NotificationService } from "@src/modules/notification/notification.service";

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
