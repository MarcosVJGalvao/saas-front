import type { ReactNode } from 'react';

export interface AppLayoutNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: ReactNode;
  iconBgToken:
    | 'notificationInfoBg'
    | 'notificationSuccessBg'
    | 'notificationWarningBg'
    | 'notificationPrimaryBg'
    | 'notificationSecondaryBg';
  iconColorToken:
    | 'notificationInfoColor'
    | 'notificationSuccessColor'
    | 'notificationWarningColor'
    | 'notificationPrimaryColor'
    | 'notificationSecondaryColor';
}

export interface AppLayoutMessages {
  searchPlaceholder: string;
  keyboardShortcut: string;
  roleLabel: string;
  openMenuAriaLabel: string;
  notificationsAriaLabel: string;
  notificationsTitle: string;
  markAllRead: string;
  viewAllNotifications: string;
  profile: string;
  theme: string;
  density: string;
  logout: string;
  defaultUserName: string;
  defaultUserEmail: string;
}

export const appLayoutMessages: AppLayoutMessages = {
  searchPlaceholder: 'Buscar no sistema...',
  keyboardShortcut: 'Ctrl + K',
  roleLabel: 'Administrador',
  openMenuAriaLabel: 'Abrir menu',
  notificationsAriaLabel: 'Notificações',
  notificationsTitle: 'Notificações',
  markAllRead: 'Marcar todas como lidas',
  viewAllNotifications: 'Ver todas as notificações',
  profile: 'Meu perfil',
  theme: 'Tema',
  density: 'Densidade',
  logout: 'Sair da conta',
  defaultUserName: 'Dev Admin',
  defaultUserEmail: 'dev.admin@sistema.com',
};

export const appLayoutNotifications: AppLayoutNotification[] = [
  {
    id: 'matricula',
    title: 'Nova matrícula realizada',
    description: 'A matrícula #12345 foi realizada com sucesso.',
    time: 'Há 2 minutos',
    unread: true,
    iconBgToken: 'notificationInfoBg',
    iconColorToken: 'notificationInfoColor',
    icon: null,
  },
  {
    id: 'pagamento',
    title: 'Pagamento recebido',
    description: 'Você recebeu um pagamento de R$ 1.250,00',
    time: 'Há 15 minutos',
    unread: true,
    iconBgToken: 'notificationSuccessBg',
    iconColorToken: 'notificationSuccessColor',
    icon: null,
  },
  {
    id: 'vencimento',
    title: 'Vencimento em 3 dias',
    description: 'A mensalidade da matrícula #98765 vence em 3 dias.',
    time: 'Há 1 hora',
    unread: true,
    iconBgToken: 'notificationWarningBg',
    iconColorToken: 'notificationWarningColor',
    icon: null,
  },
  {
    id: 'boleto',
    title: 'Boleto gerado',
    description: 'Foi gerado um novo boleto para a matrícula #54321.',
    time: 'Há 2 horas',
    unread: false,
    iconBgToken: 'notificationPrimaryBg',
    iconColorToken: 'notificationPrimaryColor',
    icon: null,
  },
  {
    id: 'usuario',
    title: 'Novo usuário cadastrado',
    description: 'O usuário Marcos Silva foi cadastrado no sistema.',
    time: 'Há 3 horas',
    unread: false,
    iconBgToken: 'notificationSecondaryBg',
    iconColorToken: 'notificationSecondaryColor',
    icon: null,
  },
];
