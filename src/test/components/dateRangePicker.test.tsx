import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DateRangePicker } from '../../components/common/form/DateRangePicker';

describe('DateRangePicker', () => {
  it('renders two date labels', () => {
    const { getAllByText } = render(
      <DateRangePicker
        startValue={null}
        endValue={null}
        onStartChange={() => undefined}
        onEndChange={() => undefined}
      />,
    );

    expect(getAllByText('Data inicial').length).toBeGreaterThan(0);
    expect(getAllByText('Data final').length).toBeGreaterThan(0);
  });
});
