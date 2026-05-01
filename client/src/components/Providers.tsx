import { useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const initFromSession = useUserStore((s) => s.initFromSession);

  useEffect(() => {
    initFromSession();
  }, [initFromSession]);

  return <>{children}</>;
}
