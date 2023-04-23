import {Controller, UploadedFiles, Res, Post, UseInterceptors, Get} from "@nestjs/common"
import { FilesInterceptor } from "@nestjs/platform-express";
import { AppService } from "./app.service";

@Controller('/api')
export class AppController {

    constructor(private appService: AppService) {}

    @Post('/parse_v1')
    @UseInterceptors(FilesInterceptor('file'))
    postFile(@UploadedFiles() file: Express.Multer.File) {
        return this.appService.postFile(file[0].buffer.toString())
    }
}