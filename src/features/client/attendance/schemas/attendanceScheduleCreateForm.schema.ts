import { z } from 'zod';

export const attendanceScheduleCreateFormSchema = z.object({
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

export type AttendanceScheduleCreateFormValues = z.infer<typeof attendanceScheduleCreateFormSchema>;
