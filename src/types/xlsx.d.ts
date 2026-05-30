declare module 'xlsx' {
  export interface WorkSheet {
    [cellAddress: string]: unknown;
  }

  export interface WorkBook {
    SheetNames: string[];
    Sheets: Record<string, WorkSheet | undefined>;
  }

  export interface ParsingOptions {
    type: 'string' | 'array';
  }

  export interface SheetToJsonOptions {
    header: 1;
    defval: string;
  }

  export interface XlsxUtils {
    sheet_to_json(sheet: WorkSheet, options: SheetToJsonOptions): unknown[][];
  }

  export function read(data: string | ArrayBuffer, options: ParsingOptions): WorkBook;

  export const utils: XlsxUtils;
}
