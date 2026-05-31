import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
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
        id: 'academic-years',
        label: 'Anos letivos',
        href: '/academic-years',
        permission: 'academic-year:read',
        icon: CalendarMonthOutlinedIcon,
      },
      {
        id: 'academic-structure',
        label: 'Estrutura de ensino',
        href: '/academic-structure',
        permission: 'education-level:read',
        icon: LayersOutlinedIcon,
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
  {
    section: { id: 'section-operations', label: 'Operações' },
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
        id: 'generated-documents',
        label: 'Documentos',
        href: '/documents',
        permission: 'documents:read',
        icon: DescriptionOutlinedIcon,
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
        icon: InsightsOutlinedIcon,
      },
      {
        id: 'financial-reports',
        label: 'Relatórios',
        href: '/financial/reports',
        permission: 'reports:read',
        icon: AssessmentOutlinedIcon,
      },
      {
        id: 'financial-entries',
        label: 'Lançamentos',
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
        href: '/financial/registers',
        permission: 'finance:read',
        icon: AccountBalanceOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'section-administration', label: 'Administração' },
    items: [
      {
        id: 'notifications',
        label: 'Notificações',
        href: '/notifications',
        permission: 'dashboard:read',
        icon: NotificationsOutlinedIcon,
      },
      {
        id: 'employees',
        label: 'Funcionários',
        href: '/employees',
        permission: 'employees:read',
        icon: BadgeOutlinedIcon,
      },
      {
        id: 'access',
        label: 'Acessos',
        href: '/access',
        permission: 'users:read',
        icon: LockOutlinedIcon,
      },
    ],
  },
];
