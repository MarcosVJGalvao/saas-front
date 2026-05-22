import type { AppAutocompleteOption } from '@shared/components/form/AppAutocomplete';
import { AppAutocompleteMultiple } from '@shared/components/form/AppAutocompleteMultiple';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppLoadingButton } from '@shared/components/inputs/AppLoadingButton';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { layoutSpacing, radiusScale } from '@theme/spacing';

type BindingCardProps = {
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  options: AppAutocompleteOption[];
  value: AppAutocompleteOption[];
  onChange: (value: AppAutocompleteOption[]) => void;
  onAdd: () => void;
  onRemove: () => void;
  addLabel: string;
  removeLabel: string;
  isAddLoading: boolean;
  isRemoveLoading: boolean;
  optionsLoading?: boolean;
};

export const BindingCard = ({
  title,
  description,
  inputLabel,
  inputPlaceholder,
  options,
  value,
  onChange,
  onAdd,
  onRemove,
  addLabel,
  removeLabel,
  isAddLoading,
  isRemoveLoading,
  optionsLoading = false,
}: BindingCardProps) => {
  const anyLoading = isAddLoading || isRemoveLoading;

  return (
    <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: radiusScale.md }}>
      <AppStack spacing={2}>
        <AppBox>
          <AppText variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </AppText>
          <AppText variant="body2" color="text.secondary">
            {description}
          </AppText>
        </AppBox>
        <AppAutocompleteMultiple
          label={inputLabel}
          placeholder={inputPlaceholder}
          options={options}
          value={value}
          onChange={onChange}
          disabled={anyLoading || optionsLoading}
        />
        <AppStack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <AppLoadingButton
            variant="contained"
            onClick={onAdd}
            loading={isAddLoading}
            disabled={anyLoading || value.length === 0}
          >
            {addLabel}
          </AppLoadingButton>
          <AppLoadingButton
            variant="outlined"
            color="error"
            onClick={onRemove}
            loading={isRemoveLoading}
            disabled={anyLoading || value.length === 0}
          >
            {removeLabel}
          </AppLoadingButton>
        </AppStack>
      </AppStack>
    </AppPaper>
  );
};
