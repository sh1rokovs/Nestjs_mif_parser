import { Module } from '@nestjs/common';

import { HelpFunctionService } from './help-function.service';

@Module({
  providers: [HelpFunctionService],
  exports: [HelpFunctionService],
})
export class HelpFunctionModule {}
