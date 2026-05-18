import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DomainProtectedRoute } from '@app/guards/DomainProtectedRoute';
import { SessionExpiredDialog } from '@shared/components/feedback/SessionExpiredDialog';
import { AppLayout } from '@app/layout/admin-navigation/AppLayout';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';

const PublicHomePage = lazy(() => import('@/pages/HomePage'));
const PlatformLoginPage = lazy(() => import('@features/platform/auth/pages/LoginPage'));
const PlatformMfaPage = lazy(() => import('@features/platform/auth/pages/MfaPage'));
const PlatformMfaSetupPage = lazy(() => import('@features/platform/auth/pages/MfaSetupPage'));
const PlatformDashboardPage = lazy(
  () => import('@features/platform/dashboard/pages/DashboardPage'),
);
const PlatformHomePage = lazy(() => import('@features/platform/home/pages/HomePage'));
const ClientsListPage = lazy(() => import('@features/platform/clients/pages/ClientsListPage'));
const ClientCreatePage = lazy(() => import('@features/platform/clients/pages/ClientCreatePage'));
const ClientEditPage = lazy(() => import('@features/platform/clients/pages/ClientEditPage'));
const ClientDetailsPage = lazy(() => import('@features/platform/clients/pages/ClientDetailsPage'));
const ClientOnboardingPage = lazy(
  () => import('@features/platform/clients/pages/ClientOnboardingPage'),
);
const PlansListPage = lazy(() => import('@features/platform/plans/pages/PlansListPage'));
const PlanCreatePage = lazy(() => import('@features/platform/plans/pages/PlanCreatePage'));
const PlanEditPage = lazy(() => import('@features/platform/plans/pages/PlanEditPage'));
const PlanDetailsPage = lazy(() => import('@features/platform/plans/pages/PlanDetailsPage'));
const SubscriptionsListPage = lazy(
  () => import('@features/platform/subscriptions/pages/SubscriptionsListPage'),
);
const SubscriptionCreatePage = lazy(
  () => import('@features/platform/subscriptions/pages/SubscriptionCreatePage'),
);
const SubscriptionEditPage = lazy(
  () => import('@features/platform/subscriptions/pages/SubscriptionEditPage'),
);
const SubscriptionDetailsPage = lazy(
  () => import('@features/platform/subscriptions/pages/SubscriptionDetailsPage'),
);
const ClientLoginPage = lazy(() => import('@features/client/auth/pages/LoginPage'));
const ClientForgotPasswordPage = lazy(
  () => import('@features/client/auth/pages/ForgotPasswordPage'),
);
const ClientResetPasswordPage = lazy(() => import('@features/client/auth/pages/ResetPasswordPage'));
const ClientDashboardPage = lazy(() => import('@features/client/dashboard/pages/DashboardPage'));
const ClientHomePage = lazy(() => import('@features/client/home/pages/HomePage'));
const StudentEnrollmentsListPage = lazy(
  () => import('@features/client/student-enrollments/pages/StudentEnrollmentsListPage'),
);
const StudentEnrollmentOnboardingPage = lazy(
  () => import('@features/client/student-enrollments/pages/StudentEnrollmentOnboardingPage'),
);
const StudentEnrollmentDetailsPage = lazy(
  () => import('@features/client/student-enrollments/pages/StudentEnrollmentDetailsPage'),
);
const StudentEnrollmentEditPage = lazy(
  () => import('@features/client/student-enrollments/pages/StudentEnrollmentEditPage'),
);
const AcademicYearsPage = lazy(() => import('@features/client/academic/pages/AcademicYearsPage'));
const AcademicYearDetailsPage = lazy(
  () => import('@features/client/academic/pages/AcademicYearDetailsPage'),
);
const EducationLevelsPage = lazy(
  () => import('@features/client/academic/pages/EducationLevelsPage'),
);
const EducationLevelDetailsPage = lazy(
  () => import('@features/client/academic/pages/EducationLevelDetailsPage'),
);
const GradesPage = lazy(() => import('@features/client/academic/pages/GradesPage'));
const GradeDetailsPage = lazy(() => import('@features/client/academic/pages/GradeDetailsPage'));
const SchoolClassesPage = lazy(() => import('@features/client/academic/pages/SchoolClassesPage'));
const SchoolClassDetailsPage = lazy(
  () => import('@features/client/academic/pages/SchoolClassDetailsPage'),
);
const SubjectsPage = lazy(() => import('@features/client/academic/pages/SubjectsPage'));
const SubjectDetailsPage = lazy(() => import('@features/client/academic/pages/SubjectDetailsPage'));
const TeacherSubjectsPage = lazy(
  () => import('@features/client/academic/pages/TeacherSubjectsPage'),
);
const StudentsPage = lazy(() => import('@features/client/students/pages/StudentsPage'));
const StudentDetailsPage = lazy(() => import('@features/client/students/pages/StudentDetailsPage'));
const LegalGuardiansPage = lazy(() => import('@features/client/students/pages/LegalGuardiansPage'));
const LegalGuardianDetailsPage = lazy(
  () => import('@features/client/students/pages/LegalGuardianDetailsPage'),
);
const AttendanceSchedulesPage = lazy(
  () => import('@features/client/attendance/pages/AttendanceSchedulesPage'),
);
const AttendanceRecordsPage = lazy(
  () => import('@features/client/attendance/pages/AttendanceRecordsPage'),
);
const AttendanceSummariesPage = lazy(
  () => import('@features/client/attendance/pages/AttendanceSummariesPage'),
);
const DocumentsPage = lazy(() => import('@features/client/documents/pages/DocumentsPage'));
const DocumentDetailsPage = lazy(
  () => import('@features/client/documents/pages/DocumentDetailsPage'),
);
const FinancialDashboardPage = lazy(
  () => import('@features/client/financial/pages/FinancialDashboardPage'),
);
const AccountsPayablePage = lazy(
  () => import('@features/client/financial/pages/AccountsPayablePage'),
);
const AccountsReceivablePage = lazy(
  () => import('@features/client/financial/pages/AccountsReceivablePage'),
);
const FinancialCategoriesPage = lazy(
  () => import('@features/client/financial/pages/FinancialCategoriesPage'),
);
const FinancialCategoryDetailsPage = lazy(
  () => import('@features/client/financial/pages/FinancialCategoryDetailsPage'),
);
const FinancialCostCentersPage = lazy(
  () => import('@features/client/financial/pages/FinancialCostCentersPage'),
);
const FinancialCostCenterDetailsPage = lazy(
  () => import('@features/client/financial/pages/FinancialCostCenterDetailsPage'),
);
const FinancialTransactionsPage = lazy(
  () => import('@features/client/financial/pages/FinancialTransactionsPage'),
);
const FinancialReportsPage = lazy(
  () => import('@features/client/financial/pages/FinancialReportsPage'),
);
const ReportCardAcademicPeriodsPage = lazy(
  () => import('@features/client/report-cards/pages/ReportCardAcademicPeriodsPage'),
);
const ReportCardGradeSubjectsPage = lazy(
  () => import('@features/client/report-cards/pages/ReportCardGradeSubjectsPage'),
);
const ReportCardEntriesPage = lazy(
  () => import('@features/client/report-cards/pages/ReportCardEntriesPage'),
);
const ReportCardQueriesPage = lazy(
  () => import('@features/client/report-cards/pages/ReportCardQueriesPage'),
);
const ReportCardProcessingsPage = lazy(
  () => import('@features/client/report-cards/pages/ReportCardProcessingsPage'),
);
const ClientUsersPage = lazy(() => import('@features/client/admin/pages/ClientUsersPage'));
const ClientRolesPage = lazy(() => import('@features/client/admin/pages/ClientRolesPage'));

const TOKEN_EXPIRED_EVENT = 'app:token-expired';

const resolveLoginPathByCurrentLocation = (): string =>
  window.location.pathname.startsWith('/client') ? '/client/login' : '/platform/login';

const authFallback = (
  <Box
    sx={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress aria-label="Carregando" />
  </Box>
);

const SuspendedPage = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={authFallback}>{children}</Suspense>
);

const ProtectedPlatformRoute = ({ children }: { children: ReactNode }) => (
  <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
    {children}
  </DomainProtectedRoute>
);

const ProtectedClientRoute = ({ children }: { children: ReactNode }) => (
  <DomainProtectedRoute domain={AUTH_DOMAIN.CLIENT} loginPath="/client/login">
    {children}
  </DomainProtectedRoute>
);

export const AppRouter = () => {
  const [sessionExpiredModalOpen, setSessionExpiredModalOpen] = useState(false);

  useEffect(() => {
    const onTokenExpired = () => {
      setSessionExpiredModalOpen(true);
    };

    window.addEventListener(TOKEN_EXPIRED_EVENT, onTokenExpired);
    return () => window.removeEventListener(TOKEN_EXPIRED_EVENT, onTokenExpired);
  }, []);

  const handleCloseSessionExpiredModal = () => {
    setSessionExpiredModalOpen(false);
    window.location.assign(resolveLoginPathByCurrentLocation());
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/platform/login"
          element={
            <SuspendedPage>
              <PlatformLoginPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/platform/mfa"
          element={
            <SuspendedPage>
              <PlatformMfaPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/platform/mfa-setup"
          element={
            <SuspendedPage>
              <PlatformMfaSetupPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/client/login"
          element={
            <SuspendedPage>
              <ClientLoginPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/client/forgot-password"
          element={
            <SuspendedPage>
              <ClientForgotPasswordPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/client/reset-password"
          element={
            <SuspendedPage>
              <ClientResetPasswordPage />
            </SuspendedPage>
          }
        />

        <Route element={<AppLayout />}>
          <Route
            path="/platform/home"
            element={
              <ProtectedPlatformRoute>
                <PlatformHomePage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients"
            element={
              <ProtectedPlatformRoute>
                <ClientsListPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients/new"
            element={
              <ProtectedPlatformRoute>
                <ClientCreatePage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients/onboarding"
            element={
              <ProtectedPlatformRoute>
                <ClientOnboardingPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients/:id"
            element={
              <ProtectedPlatformRoute>
                <ClientDetailsPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients/:id/edit"
            element={
              <ProtectedPlatformRoute>
                <ClientEditPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/plans"
            element={
              <ProtectedPlatformRoute>
                <PlansListPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/plans/new"
            element={
              <ProtectedPlatformRoute>
                <PlanCreatePage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/plans/:id"
            element={
              <ProtectedPlatformRoute>
                <PlanDetailsPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/plans/:id/edit"
            element={
              <ProtectedPlatformRoute>
                <PlanEditPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/subscriptions"
            element={
              <ProtectedPlatformRoute>
                <SubscriptionsListPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/subscriptions/new"
            element={
              <ProtectedPlatformRoute>
                <SubscriptionCreatePage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/subscriptions/:id"
            element={
              <ProtectedPlatformRoute>
                <SubscriptionDetailsPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/subscriptions/:id/edit"
            element={
              <ProtectedPlatformRoute>
                <SubscriptionEditPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform"
            element={
              <ProtectedPlatformRoute>
                <PlatformDashboardPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/client/home"
            element={
              <ProtectedClientRoute>
                <ClientHomePage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/student-enrollments"
            element={
              <ProtectedClientRoute>
                <StudentEnrollmentsListPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/student-enrollments/new"
            element={
              <ProtectedClientRoute>
                <StudentEnrollmentOnboardingPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/student-enrollments/:id"
            element={
              <ProtectedClientRoute>
                <StudentEnrollmentDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/student-enrollments/:id/edit"
            element={
              <ProtectedClientRoute>
                <StudentEnrollmentEditPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/academic-years"
            element={
              <ProtectedClientRoute>
                <AcademicYearsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/academic-years/:id"
            element={
              <ProtectedClientRoute>
                <AcademicYearDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/education-levels"
            element={
              <ProtectedClientRoute>
                <EducationLevelsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/education-levels/:id"
            element={
              <ProtectedClientRoute>
                <EducationLevelDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/grades"
            element={
              <ProtectedClientRoute>
                <GradesPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/grades/:id"
            element={
              <ProtectedClientRoute>
                <GradeDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/school-classes"
            element={
              <ProtectedClientRoute>
                <SchoolClassesPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/school-classes/:id"
            element={
              <ProtectedClientRoute>
                <SchoolClassDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/subjects"
            element={
              <ProtectedClientRoute>
                <SubjectsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/subjects/:id"
            element={
              <ProtectedClientRoute>
                <SubjectDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/teacher-subjects"
            element={
              <ProtectedClientRoute>
                <TeacherSubjectsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/students"
            element={
              <ProtectedClientRoute>
                <StudentsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/students/:id"
            element={
              <ProtectedClientRoute>
                <StudentDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/legal-guardians"
            element={
              <ProtectedClientRoute>
                <LegalGuardiansPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/legal-guardians/:id"
            element={
              <ProtectedClientRoute>
                <LegalGuardianDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/attendance/schedules"
            element={
              <ProtectedClientRoute>
                <AttendanceSchedulesPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/attendance/records"
            element={
              <ProtectedClientRoute>
                <AttendanceRecordsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/attendance/summaries"
            element={
              <ProtectedClientRoute>
                <AttendanceSummariesPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/documents"
            element={
              <ProtectedClientRoute>
                <DocumentsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/documents/:id"
            element={
              <ProtectedClientRoute>
                <DocumentDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/dashboard"
            element={
              <ProtectedClientRoute>
                <FinancialDashboardPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/accounts-payable"
            element={
              <ProtectedClientRoute>
                <AccountsPayablePage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/accounts-receivable"
            element={
              <ProtectedClientRoute>
                <AccountsReceivablePage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/categories"
            element={
              <ProtectedClientRoute>
                <FinancialCategoriesPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/categories/:id"
            element={
              <ProtectedClientRoute>
                <FinancialCategoryDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/cost-centers"
            element={
              <ProtectedClientRoute>
                <FinancialCostCentersPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/cost-centers/:id"
            element={
              <ProtectedClientRoute>
                <FinancialCostCenterDetailsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/transactions"
            element={
              <ProtectedClientRoute>
                <FinancialTransactionsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/financial/reports"
            element={
              <ProtectedClientRoute>
                <FinancialReportsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/report-cards/academic-periods"
            element={
              <ProtectedClientRoute>
                <ReportCardAcademicPeriodsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/report-cards/grade-subjects"
            element={
              <ProtectedClientRoute>
                <ReportCardGradeSubjectsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/report-cards/entries"
            element={
              <ProtectedClientRoute>
                <ReportCardEntriesPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/report-cards/queries"
            element={
              <ProtectedClientRoute>
                <ReportCardQueriesPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/report-cards/processings"
            element={
              <ProtectedClientRoute>
                <ReportCardProcessingsPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/users"
            element={
              <ProtectedClientRoute>
                <ClientUsersPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client/roles"
            element={
              <ProtectedClientRoute>
                <ClientRolesPage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client"
            element={
              <ProtectedClientRoute>
                <ClientDashboardPage />
              </ProtectedClientRoute>
            }
          />
        </Route>

        <Route
          path="/"
          element={
            <SuspendedPage>
              <PublicHomePage />
            </SuspendedPage>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SessionExpiredDialog
        open={sessionExpiredModalOpen}
        onClose={handleCloseSessionExpiredModal}
      />
    </BrowserRouter>
  );
};
