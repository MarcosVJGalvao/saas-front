export const errorCodeMessages: Record<string, string> = {
  INVALID_INPUT: 'Existem campos inválidos. Revise os dados informados.',
  ACCESS_DENIED: 'Você não tem permissão para executar esta ação.',
  PLATFORM_INVALID_CREDENTIALS: 'Credenciais da plataforma inválidas.',
  MFA_CHALLENGE_EXPIRED:
    'Autenticação multifator está incorreta ou expirou. Por favor, tente novamente.',
  PLAN_NOT_FOUND: 'Plano selecionado não encontrado. Por favor, escolha outro plano.',
  PLATFORM_MFA_INVALID_CODE:
    'Código de autenticação multifator inválido. Por favor, tente novamente.',
};
