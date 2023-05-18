import { Module } from '@nestjs/common';

import { HelpFunctionModule } from 'libs/help-function/src/help-function.module';
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
  imports: [HelpFunctionModule],
})
export class ParserModule {}
