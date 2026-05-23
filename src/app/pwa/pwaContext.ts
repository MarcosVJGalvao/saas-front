import { createContext } from 'react';
import type { BeforeInstallPromptEvent, PwaPushPermissionState } from '@app/pwa/types';

export interface PwaContextValue {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallAvailable: boolean;
  isInstalled: boolean;
  isIosInstallAvailable: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  updateErrorMessage: string | null;
  dismissInstallPrompt: () => void;
  installApp: () => Promise<boolean>;
  applyUpdate: () => Promise<void>;
  lastConnectionChangeAt: number | null;
  pushPermissionState: PwaPushPermissionState;
}

export const PwaContext = createContext<PwaContextValue | undefined>(undefined);
