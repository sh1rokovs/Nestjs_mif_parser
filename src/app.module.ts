import { Module } from '@nestjs/common';

import { HelpFunctionModule } from 'libs/help-function/src/help-function.module';
import { ParserModule } from './app/parser/parser.module';

@Module({
  imports: [ParserModule, HelpFunctionModule],
})
export class AppModule {}
