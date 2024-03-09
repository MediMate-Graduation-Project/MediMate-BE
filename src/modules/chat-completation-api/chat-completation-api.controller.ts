import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ChatCompletationApiService } from "./chat-completation-api.service";
import { PromptBody } from "./model/promt.dto";

@Controller()
export class ChatCompletationApiController{
    constructor (private readonly service:ChatCompletationApiService){}

    @HttpCode(HttpStatus.OK)
    @Post("/diagnostic")
    getpromtResponse(@Body() body: PromptBody){
        return this.service.getPromptResponse(body.diagnostic)
    }
 
}