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
      // Shapes
      'Activity_1': 65, // 'Assign Approver'
      'Activity_1omool6': 113, // 'Approve Invoice'
      'Activity_1pkoaqu': 48, // 'Clarify Invoice'
      'Activity_1gv7jjb': 107, // 'Prepare Bank Transfer'
      'Activity_11n0ixn': 107, // 'Archive Invoice'
      // Edges
      'Flow_1w8ldp8': 65, // between 'Assign Approver' and 'Approve Invoice'
      'Flow_1pl5mvt': 113, // between 'Approve Invoice' and gateway
      'Flow_0odkkje': 48, // between gateway and 'Clarify Invoice'
      'Flow_09havhs': 48, // between gateway and 'Approve Invoice'
      'Flow_1x81xda': 107, // between gateway and 'Archive Invoice'
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
