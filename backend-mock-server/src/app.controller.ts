import {Controller, Get, Post} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck(): string {return 'I\'m alive'}

  // here we return an arbitrary BPMN content, so we don't care of the request body
  @Post('discover/inductive-miner')
  discover(): string {
    return this.appService.getBpmn();
  }

  @Get('stats/frequency')
  getFrequencyStats() {
    return this.appService.getFrequencyStats();
  }

  @Post('conformance/alignment')
  getConformanceAlignment(): any {
    return this.appService.getConformanceAlignment();
  }

  @Post('conversion/xes-to-csv')
  convertXesToCsv() {
    // TODO returning the object seems not working in the frontend
    // return xesLog.map(entry => `<tr><td>${entry.id}</td><td>${entry.name}</td></tr>`).join('\n');
    return this.appService.getXesLog();
  }


}
