import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { layoutSpacing } from '@theme/spacing';

type BindingCardProps = {
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onRemove: () => void;
  addLabel: string;
  removeLabel: string;
  isAddLoading: boolean;
  isRemoveLoading: boolean;
};

export const BindingCard = ({
  title,
  description,
  inputLabel,
  inputPlaceholder,
  value,
  onChange,
  onAdd,
  onRemove,
  addLabel,
  removeLabel,
  isAddLoading,
  isRemoveLoading,
}: BindingCardProps) => {
  const anyLoading = isAddLoading || isRemoveLoading;

  return (
    <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
      <AppStack spacing={2}>
        <AppBox>
          <AppText variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </AppText>
          <AppText variant="body2" color="text.secondary">
            {description}
          </AppText>
        </AppBox>
        <AppTextField
          label={inputLabel}
          placeholder={inputPlaceholder}
          value={value}
          onChange={(changeEvent) => onChange(changeEvent.target.value)}
          disabled={anyLoading}
          size="small"
          fullWidth
        />
        <AppStack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <AppButton
            variant="contained"
            onClick={onAdd}
            disabled={anyLoading || value.trim() === ''}
          >
            {isAddLoading ? 'Aguarde...' : addLabel}
          </AppButton>
          <AppButton
            variant="outlined"
            color="error"
            onClick={onRemove}
            disabled={anyLoading || value.trim() === ''}
          >
            {isRemoveLoading ? 'Aguarde...' : removeLabel}
          </AppButton>
        </AppStack>
      </AppStack>
    </AppPaper>
  );
};
