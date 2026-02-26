import { Injectable } from "@nestjs/common";

@Injectable()
export class GetAppNameUseCase {
  execute() {
    return { name: "cook'us" };
  }
}
