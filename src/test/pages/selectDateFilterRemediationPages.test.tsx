import { describe, expect, it } from 'vitest';
import ClientUserCreatePage from '@features/client/admin/pages/ClientUserCreatePage';
import ClientUserEditPage from '@features/client/admin/pages/ClientUserEditPage';
import StudentEnrollmentEditPage from '@features/client/student-enrollments/pages/StudentEnrollmentEditPage';
import StudentEnrollmentOnboardingPage from '@features/client/student-enrollments/pages/StudentEnrollmentOnboardingPage';
import TeacherSubjectsPage from '@features/client/academic/pages/TeacherSubjectsPage';
import AccountsPayablePage from '@features/client/financial/pages/AccountsPayablePage';
import AccountsReceivablePage from '@features/client/financial/pages/AccountsReceivablePage';
import ReportCardEntriesPage from '@features/client/report-cards/pages/ReportCardEntriesPage';
import ReportCardProcessingsPage from '@features/client/report-cards/pages/ReportCardProcessingsPage';
import ReportCardQueriesPage from '@features/client/report-cards/pages/ReportCardQueriesPage';
import SubscriptionCreatePage from '@features/platform/subscriptions/pages/SubscriptionCreatePage';
import SubscriptionEditPage from '@features/platform/subscriptions/pages/SubscriptionEditPage';

describe('select/date remediation pages smoke', () => {
  it('exports migrated pages', () => {
    expect(ClientUserCreatePage).toBeTruthy();
    expect(ClientUserEditPage).toBeTruthy();
    expect(StudentEnrollmentEditPage).toBeTruthy();
    expect(StudentEnrollmentOnboardingPage).toBeTruthy();
    expect(TeacherSubjectsPage).toBeTruthy();
    expect(AccountsPayablePage).toBeTruthy();
    expect(AccountsReceivablePage).toBeTruthy();
    expect(ReportCardEntriesPage).toBeTruthy();
    expect(ReportCardProcessingsPage).toBeTruthy();
    expect(ReportCardQueriesPage).toBeTruthy();
    expect(SubscriptionCreatePage).toBeTruthy();
    expect(SubscriptionEditPage).toBeTruthy();
  });
});
