import { describe, expect, it } from 'vitest';
import { getFileNameFromContentDisposition } from '@shared/utils/contentDisposition';

describe('getFileNameFromContentDisposition', () => {
  it('extrai nome simples do cabeçalho', () => {
    expect(getFileNameFromContentDisposition('attachment; filename="relatorio.pdf"')).toBe(
      'relatorio.pdf',
    );
  });

  it('decodifica nome estendido do cabeçalho', () => {
    expect(
      getFileNameFromContentDisposition("attachment; filename*=UTF-8''hist%C3%B3rico.pdf"),
    ).toBe('histórico.pdf');
  });
});
