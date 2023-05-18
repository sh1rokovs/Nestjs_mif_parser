import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HelpFunctionModule } from 'libs/help-function/src/help-function.module';
import { ParserModule } from './app/parser/parser.module';

@Module({
  imports: [
    ParserModule,
    HelpFunctionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
