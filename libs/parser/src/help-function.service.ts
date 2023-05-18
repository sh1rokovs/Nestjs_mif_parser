import { Injectable } from '@nestjs/common';

import { ReturnObject } from 'src/parser/interfaces/return.interface';

@Injectable()
export class HelpFunctionService {
  fillObj(obj: ReturnObject, fun: string, ...args: RegExpMatchArray[]): void {
    const elements = obj.result.elements;

    // PLINE
    if (fun == 'pline') {
      const coords: object[] = [];

      for (let el = 0; el < args[0].length; el++) {
        if (el >= 1) {
          const coord: string[] = args[0][el].replace('\r\n', '').split(' ');
          coords.push({
            x: Number(coord[0]),
            y: Number(coord[1]),
          });
        }
      }

      elements.push({
        type: 'pline',
        coords: coords,
        pen: {
          width: Number(args[1][1]),
          color: Number(args[1][3]),
        },
      });
    }

    // PLINE MULTIPLE
    if (fun == 'pline multiple') {
      let sString: string = args[1][0];
      const coords: any = [];

      while (true) {
        if (!sString.match(new RegExp('\\n', 'i'))) {
          break;
        }
        const numberLine: number =
          sString.match(new RegExp('\\n', 'i')).index + 1;
        const fileLength: number = sString.length;
        const funMatch: RegExpMatchArray = sString
          .substring(0, numberLine)
          .match(/^\d[\r\n]{1,}/i);

        if (funMatch) {
          const coords_re: RegExpMatchArray = sString.match(
            new RegExp(
              '^\\d[\\n\\r]{1,}' + '(.*[\\r\\n]{1,2})'.repeat(Number(funMatch)),
              'im',
            ),
          );
          coords.push([]);
          for (let el = 1; el < coords_re.length; el++) {
            const coord: string[] = coords_re[el]
              .replace('\r\n', '')
              .split(' ');
            coords[coords.length - 1].push({
              x: Number(coord[0]),
              y: Number(coord[1]),
            });
          }
        }

        sString = sString.substring(numberLine, fileLength);
      }

      elements.push({
        type: 'pline multiple',
        sections: args[0][1],
        coords: coords,
        pen: {
          width: Number(args[2][1]),
          color: Number(args[2][3]),
        },
      });
    }

    // REGION
    if (fun == 'region') {
      const coord: string[] = args[0][0].split('\n');
      const coords: object[] = [];
      coord.pop();

      for (const el of coord) {
        const coordXY: string[] = el.split(' ');

        if (coordXY[0] != null)
          coords.push({
            x: Number(coordXY[0]),
            y: Number(coordXY[1]),
          });
      }

      elements.push({
        type: 'region',
        polygons: Number(args[3][1]),
        coords: coords,
        pen: {
          width: Number(args[1][1]),
          color: Number(args[1][3]),
        },
        brush: {
          pattern: Number(args[2][1]),
          color: Number(args[2][2]),
        },
      });
    }

    //POINT
    if (fun == 'point') {
      elements.push({
        type: 'point',
        coords: {
          x: Number(args[0][1]),
          y: Number(args[0][2]),
        },
      });
    }

    //Symbol
    if (fun == 'symbol') {
      elements.push({
        type: 'symbol',
        shape: args[0][1],
        color: args[0][2],
        size: args[0][3],
      });
    }

    // LINE
    if (fun == 'line') {
      elements.push({
        type: 'line',
        coords: [
          {
            x: Number(args[0][1]),
            y: Number(args[0][2]),
          },
          {
            x: Number(args[0][3]),
            y: Number(args[0][4]),
          },
        ],
        pen: {
          width: Number(args[1][1]),
          color: Number(args[1][3]),
        },
      });
    }

    // TEXT
    if (fun == 'text') {
      elements.push({
        type: 'text',
        content: args[0][1],
        coords: [
          {
            x: Number(args[0][2]),
            y: Number(args[0][3]),
          },
          {
            x: Number(args[0][4]),
            y: Number(args[0][5]),
          },
        ],
        font: {
          fontname: args[0][6],
          style: Number(args[0][7]),
          size: Number(args[0][8]),
          forecolor: Number(args[0][9]),
          backcolor: null,
        },
        angle: args[1][2] ? Number(args[1][2]) : null,
        justify: args[0][11],
      });
    }
  }
}
