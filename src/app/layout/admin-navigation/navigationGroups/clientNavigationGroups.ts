import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { NavigationGroup } from '@app/layout/admin-navigation/navigationBuilder';

export const clientNavigationGroups: NavigationGroup[] = [
  {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/home',
        permission: 'dashboard:read',
        icon: HomeOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'section-academic', label: 'Acadêmico' },
    items: [
      {
        id: 'academic-years',
        label: 'Anos letivos',
        href: '/academic-years',
        permission: 'academic-year:read',
        icon: SchoolOutlinedIcon,
      },
      {
        id: 'education-levels',
        label: 'Níveis de ensino',
        href: '/education-levels',
        permission: 'education-level:read',
        icon: SchoolOutlinedIcon,
      },
      {
        id: 'grades',
        label: 'Séries',
        href: '/grades',
        permission: 'grade:read',
        icon: SchoolOutlinedIcon,
      },
      {
        id: 'school-classes',
        label: 'Turmas',
        href: '/school-classes',
        permission: 'school-class:read',
        icon: GroupsOutlinedIcon,
      },
      {
        id: 'subjects',
        label: 'Disciplinas',
        href: '/subjects',
        permission: 'subject:read',
        icon: MenuBookOutlinedIcon,
      },
      {
        id: 'teacher-subjects',
        label: 'Professor-disciplina',
        href: '/teacher-subjects',
        permission: 'teacher-subject:read',
        icon: AssignmentIndOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'section-students', label: 'Alunos' },
    items: [
      {
        id: 'students',
        label: 'Alunos',
        href: '/students',
        permission: 'student:read',
        icon: GroupsOutlinedIcon,
      },
      {
        id: 'student-enrollments',
        label: 'Matrículas',
        href: '/student-enrollments',
        permission: 'student-enroll:read',
        icon: AssignmentIndOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'section-attendance', label: 'Frequência' },
    items: [
      {
        id: 'attendance-schedules',
        label: 'Horários',
        href: '/attendance/schedules',
        permission: 'attendance:read',
        icon: EventAvailableOutlinedIcon,
      },
      {
        id: 'attendance-records',
        label: 'Lançamentos',
        href: '/attendance/records',
        permission: 'attendance:read',
        icon: EventAvailableOutlinedIcon,
      },
      {
        id: 'attendance-summaries',
        label: 'Resumos',
        href: '/attendance/summaries',
        permission: 'attendance:read',
        icon: EventAvailableOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'section-financial', label: 'Financeiro' },
    items: [
      {
        id: 'financial-dashboard',
        label: 'Dashboard financeiro',
        href: '/financial/dashboard',
        permission: 'finance:read',
        icon: LocalAtmOutlinedIcon,
      },
      {
        id: 'accounts-payable',
        label: 'Contas a pagar',
        href: '/financial/accounts-payable',
        permission: 'finance:read',
        icon: LocalAtmOutlinedIcon,
      },
      {
        id: 'accounts-receivable',
        label: 'Contas a receber',
        href: '/financial/accounts-receivable',
        permission: 'finance:read',
        icon: LocalAtmOutlinedIcon,
      },
      {
        id: 'financial-categories',
        label: 'Categorias',
        href: '/financial/categories',
        permission: 'finance:read',
        icon: LocalAtmOutlinedIcon,
      },
      {
        id: 'financial-cost-centers',
        label: 'Centros de custo',
        href: '/financial/cost-centers',
        permission: 'finance:read',
        icon: LocalAtmOutlinedIcon,
      },
      {
        id: 'financial-transactions',
        label: 'Transações',
        href: '/financial/transactions',
        permission: 'finance:read',
        icon: LocalAtmOutlinedIcon,
      },
      {
        id: 'financial-reports',
        label: 'Relatórios',
        href: '/financial/reports',
        permission: 'reports:read',
        icon: LocalAtmOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'section-documents', label: 'Documentos' },
    items: [
      {
        id: 'documents',
        label: 'Documentos gerados',
        href: '/documents',
        permission: 'documents:read',
        icon: DescriptionOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'section-report-cards', label: 'Boletim' },
    items: [
      {
        id: 'report-card-periods',
        label: 'Períodos',
        href: '/report-cards/academic-periods',
        permission: 'report-card:read',
        icon: MenuBookOutlinedIcon,
      },
      {
        id: 'report-card-entries',
        label: 'Lançamentos',
        href: '/report-cards/entries',
        permission: 'report-card:read',
        icon: MenuBookOutlinedIcon,
      },
      {
        id: 'report-card-grade-subjects',
        label: 'Matriz curricular',
        href: '/report-cards/grade-subjects',
        permission: 'report-card:read',
        icon: MenuBookOutlinedIcon,
      },
      {
        id: 'report-card-queries',
        label: 'Consultas',
        href: '/report-cards/queries',
        permission: 'report-card:read',
        icon: MenuBookOutlinedIcon,
      },
      {
        id: 'report-card-processings',
        label: 'Processamentos',
        href: '/report-cards/processings',
        permission: 'report-card:read',
        icon: MenuBookOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'section-administration', label: 'Administração' },
    items: [
      {
        id: 'employees',
        label: 'Funcionários',
        href: '/employees',
        permission: 'employees:read',
        icon: AssignmentIndOutlinedIcon,
      },
      {
        id: 'users',
        label: 'Usuários',
        href: '/users',
        permission: 'users:read',
        icon: SettingsOutlinedIcon,
      },
      {
        id: 'roles',
        label: 'Perfis',
        href: '/roles',
        permission: 'roles:read',
        icon: SettingsOutlinedIcon,
      },
    ],
  },
];
