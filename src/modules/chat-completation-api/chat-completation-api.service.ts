import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {GoogleGenerativeAI} from "@Google/generative-ai"


@Injectable()
export class ChatCompletationApiService{
    private genAI:any;
    private genAiProModel:any;
constructor(private readonly config:ConfigService){

    this.genAI = new GoogleGenerativeAI(this.config.get("API_KEY"))
    this.genAiProModel = this.genAI.getGenerativeModel({model:"gemini-pro"})
}   

async getPromptResponse(prompt: string): Promise<string> {
    try {
        const result = await this.genAiProModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        return text;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
   
}