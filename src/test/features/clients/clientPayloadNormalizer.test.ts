import { describe, expect, it } from 'vitest';
import {
  toClientCreatePayload,
  toClientEditPayload,
} from '@features/platform/clients/normalizers/clientForm.normalizer';

describe('clientForm.normalizer', () => {
  it('normaliza payload de criação de cliente', () => {
    expect(
      toClientCreatePayload({
        legalName: ' Empresa Legal LTDA ',
        tradeName: ' Empresa ',
        documentNumber: '12.345.678/0001-99',
        documentType: 'CNPJ',
        email: ' CONTATO@EMPRESA.COM ',
        phone: '(11) 99999-9999',
        status: 'active',
        website: ' ',
        logoUrl: '',
        industry: '',
        notes: '',
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

  it('normaliza payload de edição de cliente', () => {
    expect(
      toClientEditPayload({
        legalName: ' Cliente ',
        tradeName: ' Cliente X ',
        email: ' ADMIN@CLIENTE.COM ',
        phone: '(21) 98888-7777',
        status: 'inactive',
        website: '',
        logoUrl: '',
        industry: '',
        notes: '',
      }),
    ).toEqual({
      legalName: 'Cliente',
      tradeName: 'Cliente X',
      email: 'admin@cliente.com',
      phone: '21988887777',
      status: 'inactive',
      website: undefined,
      logoUrl: undefined,
      industry: undefined,
      notes: undefined,
    });
  });
});
