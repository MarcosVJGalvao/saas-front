import { z } from 'zod';

export const attendanceRecordCreateFormSchema = z.object({
  scheduleId: z.string().min(1, 'Informe o horário.'),
  attendanceDate: z.string().min(1, 'Informe a data.'),
  studentEnrollmentId: z.string().min(1, 'Informe a matrícula.'),
  status: z.enum(['present', 'absent', 'justified']),
  observations: z.string().optional(),
});

export type AttendanceRecordCreateFormValues = z.infer<typeof attendanceRecordCreateFormSchema>;
