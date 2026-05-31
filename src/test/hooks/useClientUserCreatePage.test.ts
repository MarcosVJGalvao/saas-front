import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClientUserCreatePage } from '@features/client/admin/hooks/useClientUserCreatePage';
import { clientUsersService } from '@features/client/admin/services/service';
import { employeeService } from '@features/client/employees/services/service';
import type { EmployeeListResponse } from '@features/client/employees/services/types';
import type { Employee } from '@features/client/employees/types/employee.types';

const navigateMock = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('@features/client/admin/services/service', () => ({
  clientUsersService: {
    create: vi.fn(),
  },
}));

vi.mock('@features/client/employees/services/service', () => ({
  employeeService: {
    list: vi.fn(),
    getById: vi.fn(),
  },
}));

const employeeListResponse: EmployeeListResponse = {
  data: [
    {
      id: 'employee-1',
      jobTitle: 'teacher',
      person: {
        id: 'person-1',
        fullName: 'Maria Souza',
      },
    },
    {
      id: 'employee-2',
      jobTitle: 'administrator',
      person: {
        id: 'person-2',
        fullName: 'Joao Lima',
      },
    },
  ],
  meta: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

describe('useClientUserCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(employeeService.list).mockResolvedValue(employeeListResponse);
  });

  it('preenche o email automaticamente quando o funcionario ja possui contato', async () => {
    const employeeDetails: Employee = {
      id: 'employee-1',
      jobTitle: 'teacher',
      person: {
        id: 'person-1',
        fullName: 'Maria Souza',
        contacts: [{ id: 'contact-1', type: 'email', value: 'maria@escola.com' }],
      },
    };

    vi.mocked(employeeService.getById).mockResolvedValue(employeeDetails);

    const { result } = renderHook(() => useClientUserCreatePage());

    await waitFor(() => expect(result.current.employeeOptions).toHaveLength(3));

    act(() => {
      result.current.form.setValue('employeeId', 'employee-1');
    });

    await waitFor(() => expect(result.current.form.getValues('email')).toBe('maria@escola.com'));

    expect(result.current.emailFieldDisabled).toBe(true);
  });

  it('permite informar email manualmente quando o funcionario nao possui contato cadastrado', async () => {
    const employeeDetails: Employee = {
      id: 'employee-2',
      jobTitle: 'administrator',
      person: {
        id: 'person-2',
        fullName: 'Joao Lima',
        contacts: [],
      },
    };

    vi.mocked(employeeService.getById).mockResolvedValue(employeeDetails);

    vi.mocked(clientUsersService.create).mockResolvedValue({
      id: 'user-2',
      email: 'joao@tenant.com',
    });

    const { result } = renderHook(() => useClientUserCreatePage());

    await waitFor(() => expect(result.current.employeeOptions).toHaveLength(3));

    act(() => {
      result.current.form.setValue('employeeId', 'employee-2');
    });

    await waitFor(() => expect(result.current.emailFieldDisabled).toBe(false));

    act(() => {
      result.current.form.setValue('email', 'joao@tenant.com');
      result.current.form.setValue('password', 'senha-segura-123');
    });

    await act(async () => {
      await result.current.onSubmit(result.current.form.getValues());
    });

    expect(clientUsersService.create).toHaveBeenCalledWith({
      employeeId: 'employee-2',
      email: 'joao@tenant.com',
      password: 'senha-segura-123',
    });
    expect(navigateMock).toHaveBeenCalledWith('/client/users');
  });
});
