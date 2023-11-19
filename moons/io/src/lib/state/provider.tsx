import { createContext, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { subscribeKey } from 'valtio/utils';

import { type AppState, state } from './shared';

// @ts-expect-error because i still don't know how to make ts happy
export const AppContext = createContext<AppState>({});

type Data = Pick<AppState, 'lines'>;

enum Action {
  Reset = 'reset',
}

export type AppProviderHandle = {
  snapshot(): { data: Data; points: number };
  subscribe(action: Action, data: any): boolean;
};

export type AppProviderProps = {
  onChange(data: Data, points: number): void;
  children: React.ReactNode;
};

export const AppProvider = forwardRef<AppProviderHandle, AppProviderProps>(({ children, onChange }, ref) => {
  const value = useRef(state).current;

  const snapshot = () => {
    const lines = JSON.parse(JSON.stringify(state.lines)) as AppState['lines']; // unwrap
    const points = lines.reduce((points, line) => {
      return line.a.split('-')[1] === line.b.split('-')[1] ? ++points : points;
    }, 0);
    return { data: { lines }, points };
  };

  useImperativeHandle(ref, () => ({
    snapshot,
    subscribe(action) {
      switch (action) {
        case Action.Reset:
          value.lines = [];
          return true;
        default:
          return false;
      }
    },
  }));

  useEffect(() => {
    const unsubscribe = subscribeKey(state, 'lines', () => {
      const { data, points } = snapshot();
      onChange(data, points);
    });
    return () => unsubscribe();
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
});
