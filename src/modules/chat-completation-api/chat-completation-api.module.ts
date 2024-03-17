import { Module } from "@nestjs/common";
import { ChatCompletationApiService } from "./chat-completation-api.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ChatCompletationApiController } from "./chat-completation-api.controller";

@Module({
    providers: [ChatCompletationApiService],
    imports:[PrismaModule],
    controllers: [ChatCompletationApiController],
  
})
export class ChatCompletationApiModule{}