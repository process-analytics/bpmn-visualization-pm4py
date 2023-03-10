import { Injectable } from '@nestjs/common';
import { diagram } from './assets/diagram';

type FrequencyStats = { [index: string]: number };
type ConformanceAlignment = Array<{ alignment: Array<Array<string>> }>;

@Injectable()
export class AppService {
  getBpmn(): string {
    return diagram;
  }

  getFrequencyStats(): FrequencyStats {
    return {
      'Assign Approver': 65,
      'Approve Invoice': 113,
      'Clarify Invoice': 48,
      'Prepare Bank Transfer': 107,
      'Archive Invoice': 107,
    };
  }

  getConformanceAlignment(): ConformanceAlignment {
    return [
      { alignment: [['Assign Approver', 'Assign Approver'], ['>>', 'Approve Invoice'], ['Prepare Bank Transfer', 'Prepare Bank Transfer'], ['>>', 'Archive Invoice']] },
      { alignment: [['Assign Approver', '>>'], ['Approve Invoice', 'Approve Invoice'], ['>>', 'Prepare Bank Transfer'], ['Archive Invoice', 'Archive Invoice']]  },
      { alignment: [['Assign Approver', 'Assign Approver'], ['Approve Invoice', 'Approve Invoice'], ['>>', 'Prepare Bank Transfer'], ['>>', 'Archive Invoice']] },
      { alignment: [['>>', 'Assign Approver'], ['>>', 'Approve Invoice'], ['>>', 'Prepare Bank Transfer'], ['Archive Invoice', 'Archive Invoice']] },
    ];
  }

  getXesLog(): Array<XesLogEntry> {
    return [
      {
        id: '1',
        name: 'Invoice received',
        timestamp: '2020-12-10T13:52:36.000+00:00',
      },
      {
        id: '2',
        name: 'Approve Invoice',
        timestamp: '2020-12-10T13:52:38.000+00:00',
      },
      {
        id: '11',
        name: 'Invoice received',
        timestamp: '2020-12-11T13:52:36.000+00:00',
      },
      {
        id: '12',
        name: 'Approve Invoice',
        timestamp: '2020-12-11T13:52:38.000+00:00',
      },
    ];
  }
}

type XesLogEntry = {
  id: string;
  name: string;
  timestamp: string;
};
