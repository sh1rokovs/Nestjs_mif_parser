import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParserService } from './parser.service';

@Controller('api')
export class ParserController {
  constructor(private parserService: ParserService) {}

  @ApiTags('Парсер')
  @ApiOperation({ summary: 'Распарсить файл' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  @Post('/parse')
  @UseInterceptors(FilesInterceptor('file'))
  postFile(@UploadedFiles() file: Express.Multer.File) {
    return this.parserService.postFile(file[0].buffer.toString());
  }
}
