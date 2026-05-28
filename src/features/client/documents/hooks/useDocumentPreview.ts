import { useCallback, useEffect, useRef, useState } from 'react';
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx';
import type { WorkBook } from 'xlsx';
import { documentsService } from '@features/client/documents/services/service';
import type {
  DocumentFormat,
  GeneratedDocument,
} from '@features/client/documents/types/document.types';

export type SpreadsheetData = {
  headers: string[];
  rows: string[][];
};

type PreviewState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'pdf'; objectUrl: string; fileName: string }
  | { type: 'spreadsheet'; data: SpreadsheetData; fileName: string }
  | { type: 'error'; message: string };

const cellToString = (cell: unknown): string => {
  if (cell === null || cell === undefined) return '';
  if (typeof cell === 'string') return cell;
  if (typeof cell === 'number' || typeof cell === 'boolean') return String(cell);
  return '';
};

const readSpreadsheetFromBlob = (blob: Blob, format: DocumentFormat): Promise<SpreadsheetData> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      try {
        const fileData = loadEvent.target?.result;
        let workbook: WorkBook;

        if (format === 'csv') {
          if (typeof fileData !== 'string') {
            reject(new Error('Formato CSV inválido'));
            return;
          }
          workbook = xlsxRead(fileData, { type: 'string' });
        } else {
          if (!(fileData instanceof ArrayBuffer)) {
            reject(new Error('Formato de arquivo inválido'));
            return;
          }
          workbook = xlsxRead(fileData, { type: 'array' });
        }

        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          reject(new Error('Planilha vazia'));
          return;
        }

        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
          reject(new Error('Planilha não encontrada'));
          return;
        }

        const jsonRows: unknown[][] = xlsxUtils.sheet_to_json(sheet, { header: 1, defval: '' });

        if (jsonRows.length === 0) {
          resolve({ headers: [], rows: [] });
          return;
        }

        const [headerRow, ...dataRows] = jsonRows;

        if (!Array.isArray(headerRow)) {
          resolve({ headers: [], rows: [] });
          return;
        }

        const headers = headerRow.map(cellToString);
        const rows = dataRows
          .filter((row): row is unknown[] => Array.isArray(row))
          .map((row) => row.map(cellToString));

        resolve({ headers, rows });
      } catch {
        reject(new Error('Não foi possível processar o arquivo'));
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));

    if (format === 'csv') {
      reader.readAsText(blob, 'UTF-8');
    } else {
      reader.readAsArrayBuffer(blob);
    }
  });

export const useDocumentPreview = () => {
  const [previewState, setPreviewState] = useState<PreviewState>({ type: 'idle' });
  const [downloadLoading, setDownloadLoading] = useState(false);
  const objectUrlRef = useRef<string | null>(null);
  const blobRef = useRef<{ blob: Blob; fileName: string } | null>(null);

  const revokePreviousUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      revokePreviousUrl();
    };
  }, []);

  const openPreview = useCallback(async (document: GeneratedDocument): Promise<void> => {
    setPreviewState({ type: 'loading' });
    revokePreviousUrl();
    blobRef.current = null;

    try {
      const download = await documentsService.download(document.id);
      const resolvedFileName =
        download.fileName ?? document.fileName ?? `documento-${document.id}.${document.format}`;

      blobRef.current = { blob: download.blob, fileName: resolvedFileName };

      if (document.format === 'pdf') {
        const objectUrl = URL.createObjectURL(download.blob);
        objectUrlRef.current = objectUrl;
        setPreviewState({ type: 'pdf', objectUrl, fileName: resolvedFileName });
      } else {
        const spreadsheetData = await readSpreadsheetFromBlob(download.blob, document.format);
        setPreviewState({ type: 'spreadsheet', data: spreadsheetData, fileName: resolvedFileName });
      }
    } catch {
      setPreviewState({
        type: 'error',
        message: 'Não foi possível carregar o preview do documento.',
      });
    }
  }, []);

  const closePreview = useCallback(() => {
    revokePreviousUrl();
    blobRef.current = null;
    setPreviewState({ type: 'idle' });
  }, []);

  const downloadFromPreview = useCallback((): void => {
    if (!blobRef.current) return;

    setDownloadLoading(true);
    try {
      const { blob, fileName } = blobRef.current;
      const objectUrl = URL.createObjectURL(blob);
      const anchor = window.document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloadLoading(false);
    }
  }, []);

  return {
    previewState,
    downloadLoading,
    openPreview,
    closePreview,
    downloadFromPreview,
  };
};
