export const GENERIC_ERROR_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.';

export const errorCodeMessages: Record<string, string> = {
  INVALID_INPUT: 'Existem campos inválidos. Revise os dados informados.',
  UNAUTHORIZED: 'Você precisa estar autenticado para executar esta ação.',
  FORBIDDEN: 'Você não tem permissão para executar esta ação.',
  ACCESS_DENIED: 'Você não tem permissão para executar esta ação.',
  PLATFORM_INVALID_CREDENTIALS: 'Credenciais da plataforma inválidas.',
  MFA_CHALLENGE_EXPIRED:
    'Autenticação multifator está incorreta ou expirou. Por favor, tente novamente.',
  PLAN_NOT_FOUND: 'Plano selecionado não encontrado. Por favor, escolha outro plano.',
  PLATFORM_MFA_INVALID_CODE:
    'Código de autenticação multifator inválido. Por favor, tente novamente.',
  SUBSCRIPTION_NOT_FOUND: 'Assinatura não encontrada.',
  SUBSCRIPTION_ALREADY_ACTIVE: 'Este tenant já possui uma assinatura ativa.',
  INVALID_QUERY_RELATION: 'Ocorreu um erro interno. Entre em contato com o suporte.',
};

export const errorMessageTranslations: Record<string, string> = {
  'field cannot be empty': 'O campo não pode estar vazio.',
  'email is invalid': 'O e-mail é inválido.',
  'password must be at least 8 characters': 'A senha deve ter no mínimo 8 caracteres.',
};
