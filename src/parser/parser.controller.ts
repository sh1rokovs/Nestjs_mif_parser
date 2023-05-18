import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ParserService } from './parser.service';

@Controller('api')
export class ParserController {
  constructor(private parserService: ParserService) {}

  @Post('/parse')
  @UseInterceptors(FilesInterceptor('file'))
  postFile(@UploadedFiles() file: Express.Multer.File) {
    return this.parserService.postFile(file[0].buffer.toString());
  }
}
