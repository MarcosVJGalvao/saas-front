import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
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
        id: 'academic-structure',
        label: 'Estrutura acadêmica',
        permission: 'academic-year:read',
        icon: AccountTreeOutlinedIcon,
        children: [
          {
            id: 'academic-years',
            label: 'Anos letivos',
            href: '/academic-years',
            permission: 'academic-year:read',
            icon: CalendarMonthOutlinedIcon,
          },
          {
            id: 'education-levels',
            label: 'Níveis de ensino',
            href: '/education-levels',
            permission: 'education-level:read',
            icon: LayersOutlinedIcon,
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
        id: 'report-card',
        label: 'Avaliação e boletim',
        permission: 'report-card:read',
        icon: GradingOutlinedIcon,
        children: [
          {
            id: 'report-card-periods',
            label: 'Períodos',
            href: '/report-cards/academic-periods',
            permission: 'report-card:read',
            icon: DateRangeOutlinedIcon,
          },
          {
            id: 'report-card-entries',
            label: 'Lançamentos',
            href: '/report-cards/entries',
            permission: 'report-card:read',
            icon: ChecklistOutlinedIcon,
          },
          {
            id: 'report-card-grade-subjects',
            label: 'Matriz curricular',
            href: '/report-cards/grade-subjects',
            permission: 'report-card:read',
            icon: AccountTreeOutlinedIcon,
          },
          {
            id: 'report-card-processings',
            label: 'Processamentos',
            href: '/report-cards/processings',
            permission: 'report-card:read',
            icon: SyncOutlinedIcon,
          },
        ],
      },
    ],
  },
  {
    section: { id: 'section-students', label: 'Alunos' },
    items: [
      {
        id: 'students-registration',
        label: 'Cadastro e vínculo',
        permission: 'student:read',
        icon: GroupAddOutlinedIcon,
        children: [
          {
            id: 'students',
            label: 'Alunos',
            href: '/students',
            permission: 'student:read',
            icon: PeopleOutlinedIcon,
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
    ],
  },
  {
    section: { id: 'section-operations', label: 'Operação escolar' },
    items: [
      {
        id: 'attendance',
        label: 'Frequência',
        permission: 'attendance:read',
        icon: EventAvailableOutlinedIcon,
        children: [
          {
            id: 'attendance-schedules',
            label: 'Horários',
            href: '/attendance/schedules',
            permission: 'attendance:read',
            icon: ScheduleOutlinedIcon,
          },
          {
            id: 'attendance-records',
            label: 'Lançamentos',
            href: '/attendance/records',
            permission: 'attendance:read',
            icon: ChecklistOutlinedIcon,
          },
          {
            id: 'attendance-summaries',
            label: 'Resumos',
            href: '/attendance/summaries',
            permission: 'attendance:read',
            icon: SummarizeOutlinedIcon,
          },
        ],
      },
      {
        id: 'documents',
        label: 'Documentos',
        permission: 'documents:read',
        icon: DescriptionOutlinedIcon,
        children: [
          {
            id: 'generated-documents',
            label: 'Documentos gerados',
            href: '/documents',
            permission: 'documents:read',
            icon: DescriptionOutlinedIcon,
          },
        ],
      },
    ],
  },
  {
    section: { id: 'section-financial', label: 'Financeiro' },
    items: [
      {
        id: 'financial-overview',
        label: 'Visão geral',
        permission: 'finance:read',
        icon: InsightsOutlinedIcon,
        children: [
          {
            id: 'financial-dashboard',
            label: 'Dashboard financeiro',
            href: '/financial/dashboard',
            permission: 'finance:read',
            icon: InsightsOutlinedIcon,
          },
          {
            id: 'financial-reports',
            label: 'Relatórios',
            href: '/financial/reports',
            permission: 'reports:read',
            icon: AssessmentOutlinedIcon,
          },
        ],
      },
      {
        id: 'financial-entries',
        label: 'Lançamentos financeiros',
        permission: 'finance:read',
        icon: ReceiptLongOutlinedIcon,
        children: [
          {
            id: 'accounts-payable',
            label: 'Contas a pagar',
            href: '/financial/accounts-payable',
            permission: 'finance:read',
            icon: PaymentsOutlinedIcon,
          },
          {
            id: 'accounts-receivable',
            label: 'Contas a receber',
            href: '/financial/accounts-receivable',
            permission: 'finance:read',
            icon: RequestQuoteOutlinedIcon,
          },
          {
            id: 'financial-transactions',
            label: 'Transações',
            href: '/financial/transactions',
            permission: 'finance:read',
            icon: CompareArrowsOutlinedIcon,
          },
        ],
      },
      {
        id: 'financial-registers',
        label: 'Cadastros financeiros',
        permission: 'finance:read',
        icon: AccountBalanceOutlinedIcon,
        children: [
          {
            id: 'financial-categories',
            label: 'Categorias',
            href: '/financial/categories',
            permission: 'finance:read',
            icon: CategoryOutlinedIcon,
          },
          {
            id: 'financial-cost-centers',
            label: 'Centros de custo',
            href: '/financial/cost-centers',
            permission: 'finance:read',
            icon: AccountBalanceOutlinedIcon,
          },
        ],
      },
    ],
  },
  {
    section: { id: 'section-administration', label: 'Administração' },
    items: [
      {
        id: 'administration-team',
        label: 'Equipe',
        permission: 'employees:read',
        icon: PeopleOutlinedIcon,
        children: [
          {
            id: 'employees',
            label: 'Funcionários',
            href: '/employees',
            permission: 'employees:read',
            icon: BadgeOutlinedIcon,
          },
        ],
      },
      {
        id: 'administration-access',
        label: 'Acessos',
        permission: 'users:read',
        icon: LockOutlinedIcon,
        children: [
          {
            id: 'users',
            label: 'Usuários',
            href: '/users',
            permission: 'users:read',
            icon: ManageAccountsOutlinedIcon,
          },
          {
            id: 'roles',
            label: 'Perfis',
            href: '/roles',
            permission: 'roles:read',
            icon: AdminPanelSettingsOutlinedIcon,
          },
        ],
      },
    ],
  },
];
