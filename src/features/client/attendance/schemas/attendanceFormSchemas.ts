import { z } from 'zod';

export const attendanceScheduleFormSchema = z.object({
  academicYearId: z.string().min(1, 'Informe o ano letivo.'),
  schoolClassId: z.string().min(1, 'Informe a turma.'),
  subjectId: z.string().min(1, 'Informe a disciplina.'),
  teacherSubjectId: z.string().min(1, 'Informe o vínculo professor-disciplina.'),
  weekday: z.string().min(1, 'Informe o dia da semana.'),
  startTime: z.string().min(1, 'Informe o horário inicial.'),
  endTime: z.string().min(1, 'Informe o horário final.'),
  startDate: z.string().min(1, 'Informe a data inicial.'),
  endDate: z.string().min(1, 'Informe a data final.'),
});

export const attendanceRecordFormSchema = z.object({
  scheduleId: z.string().min(1, 'Informe o horário.'),
  attendanceDate: z.string().min(1, 'Informe a data.'),
  studentEnrollmentId: z.string().min(1, 'Informe a matrícula.'),
  status: z.enum(['present', 'absent', 'justified']),
  observations: z.string().optional(),
});

export type AttendanceScheduleFormValues = z.infer<typeof attendanceScheduleFormSchema>;
export type AttendanceRecordFormValues = z.infer<typeof attendanceRecordFormSchema>;
