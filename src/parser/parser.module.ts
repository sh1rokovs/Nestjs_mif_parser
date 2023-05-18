import { Module } from '@nestjs/common';

import { HelpFunctionService } from 'libs/parser/src';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';

@Module({
  controllers: [ParserController],
  providers: [
    ParserService,
    {
      provide: 'ReturnObject',
      useClass: ParserService,
    },
  ],
  imports: [HelpFunctionService],
})
export class ParserModule {}
