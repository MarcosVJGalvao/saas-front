import { describe, expect, it } from 'vitest';
import { toEmployeeCreatePayload } from '@features/client/employees/normalizers/employeeForm.normalizer';

describe('employeeFormNormalizer', () => {
  it('usa pessoa existente quando o modo é vincular cadastro já criado', () => {
    const payload = toEmployeeCreatePayload({
      creationMode: 'existing_person',
      personId: ' person-1 ',
      fullName: ' Ana ',
      documentType: 'CPF',
      documentNumber: '123.456.789-00',
      naturality: '',
      jobTitle: 'teacher',
      department: ' Acadêmico ',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'BR',
      email: '',
      phone: '',
    });

    expect(payload).toEqual({
      personId: 'person-1',
      jobTitle: 'teacher',
      department: 'Acadêmico',
    });
  });

  it('normaliza pessoa, endereço e contatos ao cadastrar do zero', () => {
    const payload = toEmployeeCreatePayload({
      creationMode: 'new_person',
      personId: '',
      fullName: ' Ana Silva ',
      documentType: 'CPF',
      documentNumber: '123.456.789-00',
      naturality: ' Salvador ',
      jobTitle: 'teacher',
      department: '',
      zipCode: '40.000-000',
      street: ' Rua das Flores ',
      number: ' 100 ',
      complement: ' Sala 2 ',
      neighborhood: ' Centro ',
      city: ' Salvador ',
      state: ' BA ',
      country: ' BR ',
      email: ' ana@escola.com.br ',
      phone: '(71) 99999-9999',
    });

    expect(payload).toEqual({
      person: {
        fullName: 'Ana Silva',
        documentNumber: '12345678900',
        documentType: 'CPF',
        naturality: 'Salvador',
      },
      addresses: [
        {
          zipCode: '40000000',
          street: 'Rua das Flores',
          number: '100',
          complement: 'Sala 2',
          neighborhood: 'Centro',
          city: 'Salvador',
          state: 'BA',
          country: 'BR',
        },
      ],
      contacts: [
        { type: 'email', value: 'ana@escola.com.br' },
        { type: 'phone', value: '71999999999' },
      ],
      jobTitle: 'teacher',
      department: undefined,
    });
  });
});
