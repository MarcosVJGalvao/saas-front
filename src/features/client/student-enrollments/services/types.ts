import type {
  CreateStudentEnrollmentRequest,
  StudentEnrollment,
  StudentEnrollmentListResponse,
  StudentEnrollmentQueryParams,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

export type StudentEnrollmentListParams = StudentEnrollmentQueryParams;
export type StudentEnrollmentListServiceResponse = StudentEnrollmentListResponse;
export type StudentEnrollmentDetailsResponse = StudentEnrollment;
export type StudentEnrollmentCreatePayload = CreateStudentEnrollmentRequest;
export type StudentEnrollmentCreateResponse = StudentEnrollment;
export type StudentEnrollmentUpdatePayload = Partial<CreateStudentEnrollmentRequest>;
export type StudentEnrollmentUpdateResponse = StudentEnrollment;
export type StudentEnrollmentDeleteResponse = void;
export type StudentEnrollmentContractDownloadResponse = Blob;
