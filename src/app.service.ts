import {Injectable} from "@nestjs/common"
import { fillObj } from "./helpFunctions/app.helpfunctions"

@Injectable()
export class AppService {
    postFile(file: string) {
        const fileLength: number = file.length

        enum ParseType {
            Text = "TEXT",
            Pline = "PLINE",
            Region = "Region",
            Line = "LINE",
            Point = "Point",
            Symbol = "SYMBOL"
        }

        // no ts way
        let returnObj = {
            "result": {
                "bounds": [],
                "elements": []
            },
            "errors": []
        }

        let boundsCoord = returnObj.result.bounds
        
        // Bounds
        let bounds: RegExpMatchArray = file.match(/Bounds\D{1,}([\w.]+)\D{1,}([\w.]*)\D{1,}([\w.]*)\D{1,}([\w.]*)/i)
        
        boundsCoord.push({
            "x": Number(bounds[1]), 
            "y": Number(bounds[2])
        }, {
            "x": Number(bounds[3]), 
            "y": Number(bounds[4])
        })

        // Exclude Header
        let re: RegExp = /DATA/g

        re.exec(file)
        file = file.substring(re.lastIndex, fileLength)

        // Parse Data
        const rePen: RegExp = /PEN\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i

        while(true) {
            const numberLine: number = file.match(new RegExp('\\n', 'i')).index + 1
            const funMatch: RegExpMatchArray = file.substring(0, numberLine).match(/^LINE|^PLINE|^POINT|^REGION|^TEXT|^SYMBOL/i)
            const subString: string = file.substring(0, numberLine)

            if(funMatch){
                switch(funMatch[0]) {

                    // PLINE
                    case ParseType.Pline: {
                        if(file.substring(0, numberLine).match(/PLINE MULTIPLE/i)) {
                            const sections: RegExpMatchArray = file.substring(0, numberLine).match(/PLINE MULTIPLE\D(\d{1,})/i)
                            const sString: RegExpMatchArray = file.match(/PLINE MULTIPLE(.*[\n\r]{1,}){1,}?PEN/i)
                            const pen: RegExpMatchArray = file.match(rePen)

                            fillObj(returnObj, "PLINE MULTIPLE", sections, sString, pen)

                        } else {
                            const countLines: number = Number(file.substring(0, numberLine).match(/PLINE\D(\d{1,})/i)[1])
                            const pen: RegExpMatchArray = file.match(rePen)

                            const coords: RegExpMatchArray = file.match(new RegExp(`PLINE(.*\\r\\n){2}` + '(.*\\r\\n)'.repeat(countLines - 1), 'i'))
                            if(coords == null) {
                                const coords: RegExpMatchArray = file.match(new RegExp(`PLINE(.*\\n){2}` + '(.*\\n)'.repeat(countLines - 1), 'i'))
                            }

                            fillObj(returnObj, ParseType.Pline, coords, pen)
                        }
                        break;
                    }

                    // LINE
                    case ParseType.Line: {
                        const coords: RegExpMatchArray = subString.match(/LINE\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i)
                        const pen: RegExpMatchArray = file.match(rePen)

                        fillObj(returnObj, ParseType.Line, coords, pen)
                        
                        break;
                    }

                    // POINT
                    case ParseType.Point: {
                        const point: RegExpMatchArray = subString.match(/POINT\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i)

                        fillObj(returnObj, ParseType.Point, point)

                        break;
                    }

                    // SYMBOL
                    case ParseType.Symbol: {
                        const symbol: RegExpMatchArray = subString.match(/SYMBOL\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i)

                        fillObj(returnObj, ParseType.Symbol, symbol)

                        break;
                    }

                    // REGION
                    case ParseType.Region: {
                        const countCoord: number = Number(file.match(/REGION\s\d{1,}\D{1,}([\d.]{1,})/i)[1])
                        const polygons: RegExpMatchArray = file.match(/REGION (\d{1,})/i) 
                        const pen: RegExpMatchArray = file.match(rePen)
                        const brush: RegExpMatchArray = file.match(/BRUSH\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})/i)
                        const coords: RegExpMatchArray = file.match(/^\d{1,}\.(.*[\n\r]{1,}){1,}?PEN/im)

                        fillObj(returnObj, ParseType.Region, coords, pen, brush, polygons)

                        break;
                    }

                    // TEXT
                    case ParseType.Text: {
                        const textBase: RegExpMatchArray = file.match(/TEXT\W{1,}"(.*?)"\D{1,}([\d.]{1,})\D([\d.]{1,})\D([\d.]{1,})\D([\d.]{1,})\W{1,}\w{1,}.*?"(.*?)"\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\D{1,}([\d.]{1,})\W{1,}(\w{1,})\s(\w{1,})/i)
                        
                        // Get angle
                        const sString: RegExpMatchArray = file.match(/TEXT.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}\W{1,}\D{1,}[\d.]{1,}/i)
                        const angle: RegExpMatchArray = sString[0].match(/TEXT.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}.*[\r\n]{1,}\W{1,}(\w{1,})\D([\d.]{1,})/i)

                        fillObj(returnObj, ParseType.Text, textBase, angle)

                        break;
                    }
                }
            }

            file = file.substring(numberLine, fileLength)
            if(file.length == 0) {
                break
            }
        }
        
        return returnObj
    }
}
