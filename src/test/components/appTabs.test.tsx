import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppTabs } from '@shared/components/navigation/AppTabs';

describe('AppTabs', () => {
  it('renders tab labels', () => {
    const { getByText } = render(
      <AppTabs
        tabs={[
          { label: 'Aba 1', value: '1' },
          { label: 'Aba 2', value: '2' },
        ]}
        value="1"
        onChange={() => undefined}
      />,
    );
    expect(getByText('Aba 1')).toBeInTheDocument();
    expect(getByText('Aba 2')).toBeInTheDocument();
  });
});
