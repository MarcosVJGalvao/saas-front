import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';

describe('AppDatePicker', () => {
  it('renders label', () => {
    const { getAllByText } = render(
      <AppDatePicker label="Data" value={null} onChange={() => undefined} />,
    );
    expect(getAllByText('Data').length).toBeGreaterThan(0);
  });
});
