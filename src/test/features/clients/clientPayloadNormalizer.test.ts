import { describe, expect, it } from 'vitest';

import {
  normalizeClientPayload,
  normalizeClientUpdatePayload,
} from '@features/platform/clients/normalizers/clientPayloadNormalizer';

describe('clientPayloadNormalizer', () => {
  it('normaliza payload de criação de cliente', () => {
    expect(
      normalizeClientPayload({
        legalName: ' Empresa Legal LTDA ',
        tradeName: ' Empresa ',
        documentNumber: '12.345.678/0001-99',
        documentType: 'CNPJ',
        email: ' CONTATO@EMPRESA.COM ',
        phone: '(11) 99999-9999',
        status: 'active',
        website: ' ',
      }),
    ).toEqual({
      legalName: 'Empresa Legal LTDA',
      tradeName: 'Empresa',
      documentNumber: '12345678000199',
      documentType: 'CNPJ',
      email: 'contato@empresa.com',
      phone: '11999999999',
      status: 'active',
      website: undefined,
      logoUrl: undefined,
      industry: undefined,
      notes: undefined,
    });
  });

  it('normaliza payload parcial de edição de cliente', () => {
    expect(
      normalizeClientUpdatePayload({
        email: ' ADMIN@CLIENTE.COM ',
        phone: '(21) 98888-7777',
      }),
    ).toEqual({
      email: 'admin@cliente.com',
      phone: '21988887777',
      logoUrl: undefined,
      website: undefined,
      industry: undefined,
      notes: undefined,
    });
  });
});
