import { registerPlugin } from '@capacitor/core';

export interface ScreenPinningPlugin {
  startPinning(): Promise<void>;
  stopPinning(): Promise<void>;
}

export const ScreenPinning = registerPlugin<ScreenPinningPlugin>('ScreenPinning');
