export interface AppLayoutMessages {
  searchPlaceholder: string;
  keyboardShortcut: string;
  roleLabel: string;
  openMenuAriaLabel: string;
  notificationsAriaLabel: string;
  notificationsTitle: string;
  markAllRead: string;
  viewAllNotifications: string;
  notificationsLoadingLabel: string;
  notificationsEmptyTitle: string;
  notificationsEmptyDescription: string;
  unreadNotificationLabel: string;
  readNotificationLabel: string;
  profile: string;
  theme: string;
  density: string;
  logout: string;
}

export const appLayoutMessages: AppLayoutMessages = {
  searchPlaceholder: 'Buscar no sistema...',
  keyboardShortcut: 'Ctrl + K',
  roleLabel: 'Administrador',
  openMenuAriaLabel: 'Abrir menu',
  notificationsAriaLabel: 'Notificações',
  notificationsTitle: 'Notificações',
  markAllRead: 'Marcar todas como lidas',
  viewAllNotifications: 'Ver notificações',
  notificationsLoadingLabel: 'Carregando notificações',
  notificationsEmptyTitle: 'Nenhuma notificação',
  notificationsEmptyDescription: 'As novas notificações aparecerão aqui.',
  unreadNotificationLabel: 'Não lida',
  readNotificationLabel: 'Lida',
  profile: 'Meu perfil',
  theme: 'Tema',
  density: 'Densidade',
  logout: 'Sair da conta',
};
