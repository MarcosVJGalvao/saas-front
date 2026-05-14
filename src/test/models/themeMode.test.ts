import { describe, expect, it } from 'vitest';
import { getNextThemeMode, THEME_MODE } from '@models/themeMode';

describe('theme mode model', () => {
  it('should toggle theme mode', () => {
    expect(getNextThemeMode(THEME_MODE.LIGHT)).toBe(THEME_MODE.DARK);
    expect(getNextThemeMode(THEME_MODE.DARK)).toBe(THEME_MODE.LIGHT);
  });
});
