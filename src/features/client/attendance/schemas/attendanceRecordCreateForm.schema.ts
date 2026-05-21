import { z } from 'zod';

const attendanceRecordItemSchema = z.object({
  studentEnrollmentId: z.string().min(1, 'Informe a matrícula do aluno.'),
  status: z.enum(['present', 'absent', 'justified']),
  observations: z.string().optional(),
});

export const attendanceRecordCreateFormSchema = z.object({
  scheduleId: z.string().min(1, 'Informe o horário.'),
  attendanceDate: z.string().min(1, 'Informe a data.'),
  items: z
    .array(attendanceRecordItemSchema)
    .min(1, 'Selecione um horário com alunos matriculados para lançar a frequência.'),
});

export type AttendanceRecordCreateFormValues = z.infer<typeof attendanceRecordCreateFormSchema>;
