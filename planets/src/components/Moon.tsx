import { Suspense, lazy, memo, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Resource, type File, type Parent, type Moon as _Moon } from '../types';
import { cn } from '../lib/helpers';
import { files, points, moons } from '../lib/state';
import { usePlanet } from '../lib/hooks';
import storage from '../lib/storage';

const Error = ({
  width = '100%',
  height = '100%',
}: {
  width: React.CSSProperties['width'];
  height: React.CSSProperties['height'];
}) => {
  return (
    <div className="p-3 flex items-center justify-center gap-2" style={{ width, height }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-orange-500"
      >
        <path
          fillRule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>

      <p>Something went wrong</p>
    </div>
  );
};

const Loading = ({
  width = '100%',
  height = '100%',
}: {
  width: React.CSSProperties['width'];
  height: React.CSSProperties['height'];
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-center justify-center" style={{ width, height }}>
      {isVisible && (
        <svg
          aria-hidden="true"
          role="status"
          className={cn('inline w-12 h-12 animate-spin transition-opacity', isVisible ? 'opacity-100' : 'opacity-0')}
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
};

export type MoonHandle = {
  snapshot?: () => Promise<{ files: File[]; points: number }>;
  execute?: (action: string, data?: unknown) => Promise<void>;
};

export type MoonProps = {
  moon: _Moon;
};

const Moon = memo(
  function Moon({ moon: { url, ...moon }, ...props }: MoonProps) {
    const Component = lazy(() => import(/* @vite-ignore */ url));

    const planet = usePlanet();

    const parent: Parent = {
      id: planet.id,
      async request(resource, data) {
        switch (resource) {
          case Resource.Files: {
            let cursor = await storage.cursor('files');
            const m = new Map<File['key'], File['body']>();
            while (cursor) {
              if (data.includes(cursor.key)) m.set(cursor.key, cursor.value);
              if (m.size === data.length) {
                cursor = null;
              } else {
                cursor = await cursor.continue();
              }
            }

            return data.map((key) => {
              const body = m.get(key);
              if (!body) return null;
              return { key, body };
            });
          }
        }
      },
    };

    const handleChange = (_files: File[], _points: number): void => {
      for (const file of _files) files.save(file.key, file.body);
      points.save(moon.id, _points);
    };

    return (
      <ErrorBoundary fallback={<Error width={moon.width} height={moon.height} />}>
        <Suspense fallback={<Loading width={moon.width} height={moon.height} />}>
          <Component
            ref={moons.addRef(moon.id)}
            {...moon}
            {...props}
            parent={parent}
            onChange={handleChange}
            onPublish={(action: string, data?: unknown) => moons.publish(action, data, moon.id)}
          />
        </Suspense>
      </ErrorBoundary>
    );
  },
  () => true,
);

export default Moon;
