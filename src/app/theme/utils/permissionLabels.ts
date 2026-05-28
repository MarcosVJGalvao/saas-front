const RESOURCE_LABELS: Record<string, string> = {
  attendance: 'Frequência',
  grade: 'Série',
  grades: 'Séries',
  student: 'Aluno',
  students: 'Alunos',
  teacher: 'Professor',
  teachers: 'Professores',
  'teacher-subject': 'Prof. × Disciplina',
  class: 'Turma',
  classes: 'Turmas',
  subject: 'Disciplina',
  subjects: 'Disciplinas',
  user: 'Usuário',
  users: 'Usuários',
  person: 'Pessoa',
  persons: 'Pessoas',
  'person-document': 'Documento',
  contact: 'Contato',
  contacts: 'Contatos',
  'report-card': 'Boletim',
  charge: 'Cobrança',
  charges: 'Cobranças',
  schedule: 'Horário',
  'lesson-note': 'Anotação de Aula',
  'lesson-annotation': 'Anotação de Aula',
  enrollment: 'Matrícula',
  enrollments: 'Matrículas',
  role: 'Perfil',
  roles: 'Perfis',
  permission: 'Permissão',
  permissions: 'Permissões',
  document: 'Documento',
  financial: 'Financeiro',
  employee: 'Funcionário',
  employees: 'Funcionários',
  school: 'Escola',
  tenant: 'Tenant',
  event: 'Evento',
  events: 'Eventos',
  notification: 'Notificação',
  notifications: 'Notificações',
  report: 'Relatório',
  reports: 'Relatórios',
};

const ACTION_LABELS: Record<string, string> = {
  create: 'Criar',
  read: 'Ler',
  update: 'Atualizar',
  delete: 'Excluir',
  write: 'Gravar',
  list: 'Listar',
  export: 'Exportar',
  import: 'Importar',
  manage: 'Gerenciar',
  view: 'Visualizar',
  approve: 'Aprovar',
  reject: 'Rejeitar',
};

export type ActionColorKey = 'create' | 'read' | 'update' | 'delete' | 'write' | 'default';

const ACTION_PALETTE: Record<string, ActionColorKey> = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
  write: 'write',
  list: 'read',
  view: 'read',
  export: 'default',
  import: 'default',
  manage: 'create',
  approve: 'create',
  reject: 'delete',
};

export const getResourceLabel = (resource: string): string =>
  RESOURCE_LABELS[resource] ??
  resource
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getActionLabel = (action: string): string => ACTION_LABELS[action] ?? action;

export const getActionColorKey = (action: string): ActionColorKey =>
  ACTION_PALETTE[action] ?? 'default';

export const parsePermissionName = (name: string): { resource: string; action: string } => {
  const colonIndex = name.lastIndexOf(':');
  if (colonIndex === -1) return { resource: name, action: '' };
  return { resource: name.slice(0, colonIndex), action: name.slice(colonIndex + 1) };
};
