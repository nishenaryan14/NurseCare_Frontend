'use client';

import { useNotification } from '@/hooks/useNotification';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useNotification();
  return <>{children}</>;
};
