import { useCallback, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { CreateClientOnboardingRequest } from '@features/platform/clients/types/clients';
import type {
  ClientOnboardingActions,
  ClientOnboardingUiExtras,
} from '@features/platform/clients/types/clientOnboarding';
import { useAddressAutoFill } from '@shared/hooks/useAddressAutoFill/useAddressAutoFill';
import { onlyDigits } from '@shared/parsers/stringParsers';

type RootOnboardingField =
  | 'tradeName'
  | 'legalName'
  | 'documentNumber'
  | 'clientEmail'
  | 'phone'
  | 'tenantName'
  | 'tenantSlug'
  | 'timezone'
  | 'locale'
  | 'currency'
  | 'planId'
  | 'adminPassword';

type UseClientOnboardingActionsParams = {
  uiExtras: ClientOnboardingUiExtras;
  setValue: Dispatch<SetStateAction<CreateClientOnboardingRequest>>;
  setUiExtras: Dispatch<SetStateAction<ClientOnboardingUiExtras>>;
};

type UseClientOnboardingActionsResult = {
  actions: ClientOnboardingActions;
  addressLoading: boolean;
};

export const useClientOnboardingActions = ({
  uiExtras,
  setValue,
  setUiExtras,
}: UseClientOnboardingActionsParams): UseClientOnboardingActionsResult => {
  const updateRootField = useCallback(
    (field: RootOnboardingField, nextValue: string) => {
      setValue((previousValue) => ({ ...previousValue, [field]: nextValue }));
    },
    [setValue],
  );

  const updateUiExtra = useCallback(
    (field: keyof ClientOnboardingUiExtras, nextValue: string) => {
      setUiExtras((previousValue) => ({ ...previousValue, [field]: nextValue }));
    },
    [setUiExtras],
  );

  const addressAutoFill = useAddressAutoFill({
    onResolved: (fields) =>
      setUiExtras((previousValue) => ({
        ...previousValue,
        cep: fields.zipCode ?? previousValue.cep,
        street: fields.street ?? previousValue.street,
        complement: fields.complement ?? previousValue.complement,
        neighborhood: fields.neighborhood ?? previousValue.neighborhood,
        city: fields.city ?? previousValue.city,
        state: fields.state ?? previousValue.state,
        country: previousValue.country || 'Brasil',
        number: previousValue.number,
      })),
  });

  const resolveAddressByCep = useCallback(() => {
    if (onlyDigits(uiExtras.cep).length === 8) {
      void addressAutoFill.resolveByCep(uiExtras.cep);
    }
  }, [addressAutoFill, uiExtras.cep]);

  const actions = useMemo<ClientOnboardingActions>(
    () => ({
      updateTradeName: (nextValue) => updateRootField('tradeName', nextValue),
      updateLegalName: (nextValue) => updateRootField('legalName', nextValue),
      updateDocumentNumber: (nextValue) => updateRootField('documentNumber', onlyDigits(nextValue)),
      updateClientEmail: (nextValue) => updateRootField('clientEmail', nextValue),
      updatePhone: (nextValue) => updateRootField('phone', onlyDigits(nextValue)),
      updateCep: (nextValue) => updateUiExtra('cep', onlyDigits(nextValue)),
      updateStreet: (nextValue) => updateUiExtra('street', nextValue),
      updateNumber: (nextValue) => updateUiExtra('number', nextValue),
      updateComplement: (nextValue) => updateUiExtra('complement', nextValue),
      updateNeighborhood: (nextValue) => updateUiExtra('neighborhood', nextValue),
      updateCity: (nextValue) => updateUiExtra('city', nextValue),
      updateState: (nextValue) => updateUiExtra('state', nextValue),
      updateCountry: (nextValue) => updateUiExtra('country', nextValue),
      resolveAddressByCep,
      updateTenantName: (nextValue) => updateRootField('tenantName', nextValue),
      updateTenantSlug: (nextValue) => updateRootField('tenantSlug', nextValue),
      updateTimezone: (nextValue) => updateRootField('timezone', nextValue),
      updateLocale: (nextValue) => updateRootField('locale', nextValue),
      updateCurrency: (nextValue) => updateRootField('currency', nextValue),
      updatePlanId: (nextValue) => updateRootField('planId', nextValue),
      updateAdminFullName: (nextValue) => {
        setValue((previousValue) => ({
          ...previousValue,
          employee: {
            ...previousValue.employee,
            person: { ...previousValue.employee.person, fullName: nextValue },
          },
        }));
      },
      updateAdminEmail: (nextValue) => {
        setValue((previousValue) => ({
          ...previousValue,
          employee: {
            ...previousValue.employee,
            contacts: [{ type: 'email', value: nextValue }],
          },
        }));
      },
      updateAdminDocumentType: (nextValue) => {
        setValue((previousValue) => ({
          ...previousValue,
          employee: {
            ...previousValue.employee,
            person: { ...previousValue.employee.person, documentType: nextValue },
          },
        }));
      },
      updateAdminDocumentNumber: (nextValue) => {
        setValue((previousValue) => ({
          ...previousValue,
          employee: {
            ...previousValue.employee,
            person: {
              ...previousValue.employee.person,
              documentNumber: onlyDigits(nextValue),
            },
          },
        }));
      },
      updateAdminDateOfBirth: (nextValue) => {
        setValue((previousValue) => ({
          ...previousValue,
          employee: {
            ...previousValue.employee,
            person: {
              ...previousValue.employee.person,
              dateOfBirth: onlyDigits(nextValue) || undefined,
            },
          },
        }));
      },
      updateAdminGender: (nextValue) => {
        setValue((previousValue) => ({
          ...previousValue,
          employee: {
            ...previousValue.employee,
            person: { ...previousValue.employee.person, gender: nextValue },
          },
        }));
      },
      updateAdminMaritalStatus: (nextValue) => {
        setValue((previousValue) => ({
          ...previousValue,
          employee: {
            ...previousValue.employee,
            person: { ...previousValue.employee.person, maritalStatus: nextValue },
          },
        }));
      },
      updateAdminMonthlyIncome: (nextValue) => {
        setValue((previousValue) => ({
          ...previousValue,
          employee: {
            ...previousValue.employee,
            person: {
              ...previousValue.employee.person,
              monthlyIncome: onlyDigits(nextValue) || undefined,
            },
          },
        }));
      },
      updateAdminPassword: (nextValue) => updateRootField('adminPassword', nextValue),
    }),
    [resolveAddressByCep, setValue, updateRootField, updateUiExtra],
  );

  return {
    actions,
    addressLoading: addressAutoFill.loading,
  };
};
