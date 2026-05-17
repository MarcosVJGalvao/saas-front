import { useEffect, useMemo, useRef, useState } from 'react';

const WARNING_THRESHOLD_SECONDS = 10 * 60;
const CRITICAL_THRESHOLD_SECONDS = 5 * 60;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const tokenParts = token.split('.');
  if (tokenParts.length < 2) return null;
  const payloadPart = tokenParts[1];
  if (payloadPart === undefined) return null;
  const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');

  try {
    const decoded = window.atob(paddedPayload);
    const parsed: unknown = JSON.parse(decoded);
    if (!isRecord(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const getExpRemainingSeconds = (accessToken?: string): number | null => {
  if (accessToken === undefined) return null;
  const payload = decodeJwtPayload(accessToken);
  if (payload === null) return null;
  const exp = payload.exp;
  if (typeof exp !== 'number') return null;
  return Math.max(Math.floor(exp - Date.now() / 1000), 0);
};

const parseDurationToSeconds = (duration: string): number => {
  const regex = /^(\d+)([smhd])$/;
  const match = duration.match(regex);
  if (match === null) {
    return 0;
  }

  const amount = Number(match[1]);
  const unit = match[2];
  if (unit === 's') return amount;
  if (unit === 'm') return amount * 60;
  if (unit === 'h') return amount * 3600;
  return amount * 86400;
};

const formatRemainingTime = (remainingSeconds: number, compact: boolean): string => {
  if (remainingSeconds <= 0) return 'Sessão expirada';
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const hoursLabel = hours > 0 ? `${hours}h ` : '';
  if (compact) return `${hoursLabel}${minutes}m`.trim();
  return `${hoursLabel}${minutes}m ${seconds}s`.trim();
};

export interface SessionTimerState {
  remainingSeconds: number;
  label: string;
  tone: 'success' | 'warning' | 'error';
  isExpired: boolean;
}

export const useSessionTimer = (
  expiresIn: string,
  compact = false,
  onExpired?: () => void,
  accessToken?: string,
) => {
  const startedAtRef = useRef<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
    const timerId = window.setInterval(() => {
      const startedAt = startedAtRef.current;
      if (startedAt === null) {
        return;
      }
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const state = useMemo<SessionTimerState>(() => {
    const expRemainingSeconds = getExpRemainingSeconds(accessToken);
    const remainingSeconds =
      expRemainingSeconds !== null
        ? expRemainingSeconds
        : Math.max(parseDurationToSeconds(expiresIn) - elapsedSeconds, 0);
    const label = formatRemainingTime(remainingSeconds, compact);

    if (remainingSeconds === 0) return { remainingSeconds, label, tone: 'error', isExpired: true };
    if (remainingSeconds <= CRITICAL_THRESHOLD_SECONDS)
      return { remainingSeconds, label, tone: 'error', isExpired: false };
    if (remainingSeconds <= WARNING_THRESHOLD_SECONDS)
      return { remainingSeconds, label, tone: 'warning', isExpired: false };
    return { remainingSeconds, label, tone: 'success', isExpired: false };
  }, [accessToken, compact, elapsedSeconds, expiresIn]);

  useEffect(() => {
    if (state.isExpired && onExpired !== undefined) {
      onExpired();
    }
  }, [onExpired, state.isExpired]);

  return state;
};
