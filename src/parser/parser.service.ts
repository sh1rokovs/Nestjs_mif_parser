import { Injectable } from '@nestjs/common';
import { HelpFunctionService } from 'libs/parser/src';

@Injectable()
export class ParserService {
  constructor(private readonly helpFunction: HelpFunctionService) {}

  postFile(file: string) {
    file = file.toLowerCase();

    const fileLength: number = file.length;

    interface ReturnObj {
      result: Result;
      errors: string[];
    }

    interface Result {
      bounds: string[];
      elements: string[];
    }

    const returnObj: ReturnObj = {
      result: {
        bounds: [],
        elements: [],
      },
      errors: [],
    };

    // const returnObj = {
    //   result: {
    //     bounds: [],
    //     elements: [],
    //   },
    //   errors: [],
    // };
    const boundsCoord = returnObj.result.bounds;
    const bounds: RegExpMatchArray = file.match(
      /bounds\D{1,}([\w.]+)\D{1,}([\w.]*)\D{1,}([\w.]*)\D{1,}([\w.]*)/i,
    );
    enum ParseType {
      Text = 'text',
      Pline = 'pline',
      Region = 'region',
      Line = 'line',
      Point = 'point',
      Symbol = 'symbol',
    }

    boundsCoord.push(
      {
        x: Number(bounds[1]),
        y: Number(bounds[2]),
      },
      {
        x: Number(bounds[3]),
        y: Number(bounds[4]),
      },
    );

    // Exclude Header
    const re = /data/g;

    re.exec(file);
    file = file.substring(re.lastIndex, fileLength);

    // Parse Data
    const rePen = /pen\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i;

    // входящий файл проверяется кусками
    while (true) {
      const numberLine: number = file.match(new RegExp('\\n', 'i')).index + 1;
      const funMatch: RegExpMatchArray = file
        .substring(0, numberLine)
        .match(/^line|^pline|^point|^region|^text|^symbol/i);
      const subString: string = file.substring(0, numberLine);

      if (funMatch) {
        switch (funMatch[0]) {
          // PLINE
          case ParseType.Pline: {
            if (file.substring(0, numberLine).match(/pline multiple/i)) {
              const sections: RegExpMatchArray = file
                .substring(0, numberLine)
                .match(/pline multiple\D(\d{1,})/i);
              const sString: RegExpMatchArray = file.match(
                /pline multiple(.*[\n\r]{1,}){1,}?pen/i,
              );
              const pen: RegExpMatchArray = file.match(rePen);

              this.helpFunction.fillObj(
                returnObj,
                'pline multiple',
                sections,
                sString,
                pen,
              );
            } else {
              const countLines = Number(
                file.substring(0, numberLine).match(/pline\D(\d{1,})/i)[1],
              );
              const pen: RegExpMatchArray = file.match(rePen);

              const coords: RegExpMatchArray = file.match(
                new RegExp(
                  `pline(.*\\r\\n){2}` + '(.*\\r\\n)'.repeat(countLines - 1),
                  'i',
                ),
              );
              if (coords == null) {
                const coords: RegExpMatchArray = file.match(
                  new RegExp(
                    `pline(.*\\n){2}` + '(.*\\n)'.repeat(countLines - 1),
                    'i',
                  ),
                );
              }

              this.helpFunction.fillObj(
                returnObj,
                ParseType.Pline,
                coords,
                pen,
              );
            }
            break;
          }

          // LINE
          case ParseType.Line: {
            const coords: RegExpMatchArray = subString.match(
              /line\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i,
            );
            const pen: RegExpMatchArray = file.match(rePen);

            this.helpFunction.fillObj(returnObj, ParseType.Line, coords, pen);

            break;
          }

          // POINT
          case ParseType.Point: {
            const point: RegExpMatchArray = subString.match(
              /point\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i,
            );

            this.helpFunction.fillObj(returnObj, ParseType.Point, point);

            break;
          }

          // SYMBOL
          case ParseType.Symbol: {
            const symbol: RegExpMatchArray = subString.match(
              /symbol\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i,
            );

            this.helpFunction.fillObj(returnObj, ParseType.Symbol, symbol);

            break;
          }

          // REGION
          case ParseType.Region: {
            const polygons: RegExpMatchArray = file.match(/region (\d{1,})/i);
            const pen: RegExpMatchArray = file.match(rePen);
            const brush: RegExpMatchArray = file.match(
              /brush\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i,
            );
            const coords: RegExpMatchArray = file.match(
              /^\d{1,}\.(.*[\n\r]{1,}){1,}?pen/im,
            );

            this.helpFunction.fillObj(
              returnObj,
              ParseType.Region,
              coords,
              pen,
              brush,
              polygons,
            );

            break;
          }

          // TEXT
          case ParseType.Text: {
            const textBase: RegExpMatchArray = file.match(
              /text\W{1,}"(.*?)"\D{1,}([\d.]{1,})\D([\d.]{1,})\D([\d.]{1,})\D([\d.]{1,})\W{1,}\w{1,}.*?"(.*?)"\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\W{1,}(\w{1,})\s(\w{1,})/i,
            );

            // Get angle
            const sString: RegExpMatchArray = file.match(
              /text.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}\W{1,}\D{1,}[\d.]{1,}/i,
            );
            const angle: RegExpMatchArray = sString[0].match(
              /text.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}\W{1,}(\w{1,})\D([\d.]{1,})/i,
            );

            this.helpFunction.fillObj(
              returnObj,
              ParseType.Text,
              textBase,
              angle,
            );

            break;
          }
        }
      }

      file = file.substring(numberLine, fileLength);
      if (file.length == 0) {
        break;
      }
    }

    return returnObj;
  }
}
