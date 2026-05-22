import { useEffect, useState } from 'react';
import type { AppAutocompleteOption } from '@shared/components/form/AppAutocomplete';
import { studentService } from '@features/client/students/services/service';
import { teacherSubjectService } from '@features/client/academic/services/service';

const LIMIT = 100;

export const useSchoolClassBindingOptions = () => {
  const [studentOptions, setStudentOptions] = useState<AppAutocompleteOption[]>([]);
  const [teacherSubjectOptions, setTeacherSubjectOptions] = useState<AppAutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const [studentsRes, teacherSubjectsRes] = await Promise.all([
          studentService.list({ page: 1, limit: LIMIT }),
          teacherSubjectService.list({ page: 1, limit: LIMIT }),
        ]);

        if (!isMounted) return;

        setStudentOptions(
          studentsRes.data.map((student) => ({
            value: student.id,
            label:
              student.person?.fullName ??
              student.registrationCode ??
              student.person?.documentNumber ??
              student.id,
          })),
        );

        setTeacherSubjectOptions(
          teacherSubjectsRes.data.map((ts) => {
            const teacherName =
              ts.teacher?.person?.fullName ?? ts.teacher?.name ?? ts.teacher?.id ?? '';
            const subjectName = ts.subject?.name ?? '';
            const label =
              teacherName && subjectName
                ? `${teacherName} — ${subjectName}`
                : teacherName || subjectName || ts.id;
            return { value: ts.id, label };
          }),
        );
      } catch {
        // silently ignore — binding options are non-critical
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { studentOptions, teacherSubjectOptions, loading };
};
