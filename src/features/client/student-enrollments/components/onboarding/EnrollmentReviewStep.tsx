import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { AppDivider } from '@shared/components/data-display/AppDivider';
import { AppText } from '@shared/components/data-display/AppText';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import {
  documentTypeLabels,
  genderLabels,
  guardianRelationshipTypeLabels,
  nationalityLabels,
} from '@shared/i18n/pt-BR/enums';
import { maskPhone } from '@shared/masks/inputMasks';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
  <AppStack spacing={0.25}>
    <AppText
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem' }}
    >
      {label}
    </AppText>
    <AppText variant="body2" sx={{ fontWeight: 500 }}>
      {value || '—'}
    </AppText>
  </AppStack>
);

const SectionTitle = ({ title }: { title: string }) => (
  <AppStack spacing={0.5}>
    <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
      {title}
    </AppText>
    <AppDivider />
  </AppStack>
);

export const EnrollmentReviewStep = ({
  value,
  uiExtras,
  referenceOptions,
}: StudentEnrollmentStepProps) => {
  const student = value.student;
  const person = student?.person;
  const studentAddress = student?.addresses?.[0];
  const medicalInfo = student?.medicalInfo;

  const selectedStudentLabel =
    referenceOptions.studentOptions.find((option) => option.value === uiExtras.selectedStudentId)
      ?.label ?? uiExtras.selectedStudentId;

  const academicYearLabel =
    referenceOptions.academicYearOptions.find(
      (option) => option.value === value.academic.academicYearId,
    )?.label ?? value.academic.academicYearId;

  const schoolClassLabel =
    referenceOptions.schoolClassOptions.find(
      (option) => option.value === value.academic.schoolClassId,
    )?.label ??
    value.academic.schoolClassId ??
    '';

  const studentName = selectedStudentLabel || person?.fullName || '';

  return (
    <AppStack spacing={1.75}>
      <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <FactCheckOutlinedIcon color="primary" />
        <AppText variant="h6">Revisão</AppText>
      </AppStack>
      <AppText variant="body2" color="text.secondary">
        Confira os principais dados antes de finalizar a matrícula.
      </AppText>

      <AppStack spacing={2}>
        {/* ALUNO */}
        <AppStack spacing={1.25}>
          <SectionTitle title="ALUNO" />
          <AppGrid container spacing={1.5}>
            <AppGrid size={{ xs: 12, md: 6 }}>
              <ReviewItem label="Nome completo" value={studentName} />
            </AppGrid>
            {!uiExtras.selectedStudentId && (
              <>
                <AppGrid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="Documento"
                    value={
                      person?.documentType && person?.documentNumber
                        ? `${documentTypeLabels[person.documentType] ?? person.documentType}: ${person.documentNumber}`
                        : ''
                    }
                  />
                </AppGrid>
                <AppGrid size={{ xs: 12, md: 4 }}>
                  <ReviewItem label="Data de nascimento" value={person?.dateOfBirth ?? ''} />
                </AppGrid>
                <AppGrid size={{ xs: 12, md: 4 }}>
                  <ReviewItem
                    label="Gênero"
                    value={person?.gender ? (genderLabels[person.gender] ?? person.gender) : ''}
                  />
                </AppGrid>
                <AppGrid size={{ xs: 12, md: 4 }}>
                  <ReviewItem
                    label="Nacionalidade"
                    value={
                      person?.nationality
                        ? (nationalityLabels[person.nationality] ?? person.nationality)
                        : ''
                    }
                  />
                </AppGrid>
                {student?.registrationCode ? (
                  <AppGrid size={{ xs: 12, md: 6 }}>
                    <ReviewItem label="Código de matrícula" value={student.registrationCode} />
                  </AppGrid>
                ) : null}
              </>
            )}
          </AppGrid>
        </AppStack>

        {/* RESPONSÁVEIS */}
        {(student?.legalGuardians.length ?? 0) > 0 && (
          <AppStack spacing={1.25}>
            <SectionTitle title="RESPONSÁVEIS" />
            <AppStack spacing={1.5}>
              {student?.legalGuardians.map((guardian, index) => (
                <AppGrid container spacing={1.5} key={index}>
                  <AppGrid size={{ xs: 12, md: 6 }}>
                    <ReviewItem
                      label={`Responsável ${index + 1}${guardian.isPrimary ? ' (Principal)' : ''}`}
                      value={guardian.person?.fullName ?? ''}
                    />
                  </AppGrid>
                  <AppGrid size={{ xs: 12, md: 3 }}>
                    <ReviewItem
                      label="Vínculo"
                      value={
                        guardianRelationshipTypeLabels[guardian.relationshipType] ??
                        guardian.relationshipType
                      }
                    />
                  </AppGrid>
                  <AppGrid size={{ xs: 12, md: 3 }}>
                    <ReviewItem
                      label="Telefone"
                      value={maskPhone(uiExtras.guardianPhones[index] ?? '')}
                    />
                  </AppGrid>
                  {uiExtras.guardianEmails[index] ? (
                    <AppGrid size={{ xs: 12, md: 6 }}>
                      <ReviewItem label="E-mail" value={uiExtras.guardianEmails[index] ?? ''} />
                    </AppGrid>
                  ) : null}
                  {guardian.addresses?.[0]?.city ? (
                    <AppGrid size={{ xs: 12, md: 6 }}>
                      <ReviewItem
                        label="Endereço"
                        value={[
                          guardian.addresses[0].street,
                          guardian.addresses[0].number,
                          guardian.addresses[0].neighborhood,
                          `${guardian.addresses[0].city}/${guardian.addresses[0].state}`,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      />
                    </AppGrid>
                  ) : null}
                </AppGrid>
              ))}
            </AppStack>
          </AppStack>
        )}

        {/* ENDEREÇO DO ALUNO */}
        {studentAddress?.city || uiExtras.studentEmail || uiExtras.studentPhone ? (
          <AppStack spacing={1.25}>
            <SectionTitle title="ENDEREÇO E CONTATOS DO ALUNO" />
            <AppGrid container spacing={1.5}>
              {uiExtras.studentEmail ? (
                <AppGrid size={{ xs: 12, md: 6 }}>
                  <ReviewItem label="E-mail" value={uiExtras.studentEmail} />
                </AppGrid>
              ) : null}
              {uiExtras.studentPhone ? (
                <AppGrid size={{ xs: 12, md: 6 }}>
                  <ReviewItem label="Telefone" value={maskPhone(uiExtras.studentPhone)} />
                </AppGrid>
              ) : null}
              {studentAddress?.city ? (
                <AppGrid size={{ xs: 12 }}>
                  <ReviewItem
                    label="Endereço"
                    value={[
                      studentAddress.street,
                      studentAddress.number,
                      studentAddress.neighborhood,
                      `${studentAddress.city}/${studentAddress.state}`,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  />
                </AppGrid>
              ) : null}
            </AppGrid>
          </AppStack>
        ) : null}

        {/* INFORMAÇÕES MÉDICAS */}
        {medicalInfo?.bloodType ||
        medicalInfo?.allergies ||
        medicalInfo?.chronicDiseases ||
        medicalInfo?.emergencyContactName ? (
          <AppStack spacing={1.25}>
            <SectionTitle title="INFORMAÇÕES MÉDICAS" />
            <AppGrid container spacing={1.5}>
              {medicalInfo?.bloodType ? (
                <AppGrid size={{ xs: 12, md: 3 }}>
                  <ReviewItem label="Tipo sanguíneo" value={medicalInfo.bloodType} />
                </AppGrid>
              ) : null}
              {medicalInfo?.emergencyContactName ? (
                <AppGrid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="Contato de emergência"
                    value={[
                      medicalInfo.emergencyContactName,
                      maskPhone(medicalInfo.emergencyContactPhone ?? ''),
                    ]
                      .filter(Boolean)
                      .join(' — ')}
                  />
                </AppGrid>
              ) : null}
              {medicalInfo?.allergies ? (
                <AppGrid size={{ xs: 12 }}>
                  <ReviewItem label="Alergias" value={medicalInfo.allergies} />
                </AppGrid>
              ) : null}
              {medicalInfo?.chronicDiseases ? (
                <AppGrid size={{ xs: 12 }}>
                  <ReviewItem label="Doenças crônicas" value={medicalInfo.chronicDiseases} />
                </AppGrid>
              ) : null}
              {medicalInfo?.medications ? (
                <AppGrid size={{ xs: 12 }}>
                  <ReviewItem label="Medicamentos" value={medicalInfo.medications} />
                </AppGrid>
              ) : null}
            </AppGrid>
          </AppStack>
        ) : null}

        {/* DADOS ACADÊMICOS */}
        <AppStack spacing={1.25}>
          <SectionTitle title="DADOS ACADÊMICOS" />
          <AppGrid container spacing={1.5}>
            <AppGrid size={{ xs: 12, md: 4 }}>
              <ReviewItem label="Ano letivo" value={academicYearLabel} />
            </AppGrid>
            <AppGrid size={{ xs: 12, md: 4 }}>
              <ReviewItem label="Data da matrícula" value={value.academic.enrollmentDate} />
            </AppGrid>
            {schoolClassLabel ? (
              <AppGrid size={{ xs: 12, md: 4 }}>
                <ReviewItem label="Turma" value={schoolClassLabel} />
              </AppGrid>
            ) : null}
            {value.enrollmentCode ? (
              <AppGrid size={{ xs: 12, md: 4 }}>
                <ReviewItem label="Código da matrícula" value={value.enrollmentCode} />
              </AppGrid>
            ) : null}
          </AppGrid>
        </AppStack>

        {/* OBSERVAÇÕES */}
        {value.observations ? (
          <AppStack spacing={1.25}>
            <SectionTitle title="OBSERVAÇÕES" />
            <AppText variant="body2">{value.observations}</AppText>
          </AppStack>
        ) : null}
      </AppStack>
    </AppStack>
  );
};
