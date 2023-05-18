import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpFunctionService {
  fillObj(obj: any, fun: string, ...args: RegExpMatchArray[]): void {
    const elements = obj.result.elements;

    // PLINE
    if (fun == 'PLINE') {
      elements.push({
        type: 'PLINE',
        coords: [],
        pen: {
          width: Number(args[1][1]),
          color: Number(args[1][3]),
        },
      });

      for (let el = 0; el < args[0].length; el++) {
        if (el >= 1) {
          const coord: string[] = args[0][el].replace('\r\n', '').split(' ');
          elements[elements.length - 1].coords.push({
            x: Number(coord[0]),
            y: Number(coord[1]),
          });
        }
      }
    }

    // PLINE MULTIPLE
    if (fun == 'PLINE MULTIPLE') {
      elements.push({
        type: 'PLINE MULTIPLE',
        sections: args[0][1],
        coords: [],
        pen: {
          width: Number(args[2][1]),
          color: Number(args[2][3]),
        },
      });

      let sString: string = args[1][0];

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
          const coords: RegExpMatchArray = sString.match(
            new RegExp(
              '^\\d[\\n\\r]{1,}' + '(.*[\\r\\n]{1,2})'.repeat(Number(funMatch)),
              'im',
            ),
          );
          elements[elements.length - 1].coords.push([]);
          for (let el = 1; el < coords.length; el++) {
            const coord: string[] = coords[el].replace('\r\n', '').split(' ');
            elements[elements.length - 1].coords[
              elements[elements.length - 1].coords.length - 1
            ].push({
              x: Number(coord[0]),
              y: Number(coord[1]),
            });
          }
        }

        sString = sString.substring(numberLine, fileLength);
      }
    }

    // REGION
    if (fun == 'Region') {
      elements.push({
        type: 'REGION',
        polygons: Number(args[3][1]),
        coords: [],
        pen: {
          width: Number(args[1][1]),
          color: Number(args[1][3]),
        },
        brush: {
          pattern: Number(args[2][1]),
          color: Number(args[2][2]),
        },
      });

      const coord = args[0][0].split('\n');
      coord.pop();

      for (const el of coord) {
        const coordXY: string[] = el.split(' ');

        if (coordXY[0] != null)
          elements[elements.length - 1].coords.push({
            x: Number(coordXY[0]),
            y: Number(coordXY[1]),
          });
      }
    }

    //POINT
    if (fun == 'Point') {
      elements.push({
        type: 'POINT',
        coords: {
          x: Number(args[0][1]),
          y: Number(args[0][2]),
        },
      });
    }

    //POINT
    if (fun == 'SYMBOL') {
      elements.push({
        type: 'SYMBOL',
        shape: args[0][1],
        color: args[0][2],
        size: args[0][3],
      });
    }

    // LINE
    if (fun == 'LINE') {
      elements.push({
        type: 'LINE',
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
    if (fun == 'TEXT') {
      elements.push({
        type: 'TEXT',
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
        angle: null,
        justify: args[0][11],
      });

      if (args[1] != null) {
        elements[elements.length - 1].angle = Number(args[1][2]);
      }
    }
  }
}
