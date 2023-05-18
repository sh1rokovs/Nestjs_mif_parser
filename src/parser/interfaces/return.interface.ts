import { Bounds } from './bounds.interface';

export interface ReturnObject {
  result: Result;
  errors: string[];
}

interface Result {
  bounds: Bounds[];
  elements: object[];
}
