import type { CreateClientOnboardingRequest } from '@features/platform/clients/types/clients';
import type { OnboardingSummaryData } from '@features/platform/clients/types/clientOnboarding';
import { maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';

const buildSummaryLine = (label: string, fieldValue: string): string =>
  fieldValue.trim().length > 0 ? `${label}: ${fieldValue}` : '';

export const buildClientOnboardingSummary = (
  value: CreateClientOnboardingRequest,
): OnboardingSummaryData => ({
  client: [
    buildSummaryLine('Nome', value.tradeName),
    buildSummaryLine(
      'Documento',
      value.documentType === 'CPF' ? maskCpf(value.documentNumber) : maskCnpj(value.documentNumber),
    ),
    buildSummaryLine('Telefone', maskPhone(value.phone)),
    buildSummaryLine('E-mail', value.clientEmail),
  ]
    .filter(Boolean)
    .join('\n'),
  tenant: [
    buildSummaryLine('Nome', value.tenantName),
    buildSummaryLine('Slug', value.tenantSlug),
    buildSummaryLine('Timezone', value.timezone ?? ''),
    buildSummaryLine('Locale', value.locale ?? ''),
    buildSummaryLine('Moeda', value.currency ?? ''),
  ]
    .filter(Boolean)
    .join('\n'),
  plan: buildSummaryLine('Plano', value.planId),
  admin: [
    buildSummaryLine('Nome', value.employee.person.fullName),
    buildSummaryLine('E-mail', value.employee.contacts[0]?.value ?? ''),
  ]
    .filter(Boolean)
    .join('\n'),
});
