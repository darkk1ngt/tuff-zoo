import { Navigate } from '@solidjs/router';
import { type JSX, Show } from 'solid-js';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  const auth = useAuth();

  return (
    <Show
      when={!auth.isLoading()}
      fallback={
        <div style={{ padding: '2rem', 'text-align': 'center' }}>
          Loading...
        </div>
      }
    >
      <Show when={auth.isAuthenticated()} fallback={<Navigate href="/login" />}>
        <Show
          when={!props.adminOnly || auth.isAdmin()}
          fallback={<Navigate href="/" />}
        >
          {props.children}
        </Show>
      </Show>
    </Show>
  );
}
