import type { ReactNode } from 'react';

export function Loading() {
  return <div className="status">Загрузка…</div>;
}

export function ErrorMessage({ message }: { message: string }) {
  return <div className="status error">Не удалось загрузить данные: {message}</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="status">{children}</div>;
}
