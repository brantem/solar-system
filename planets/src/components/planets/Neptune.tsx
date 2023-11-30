import { Fragment, useEffect, useState } from 'react';
import { subscribe } from 'valtio';

import { usePlanet } from './shared';
import Markdown from '../Markdown';
import Moon from '../Moon';
import EditorButton from '../buttons/EditorButton';
import Button from '../Button';

import type { Neptune, Parent } from '../../lib/types';
import { useEditor, points } from '../../lib/state';

const Neptune = () => {
  const [editor] = useEditor();

  const { planet, onRequest, onChange } = usePlanet<Neptune>('planets/neptune/_planet.json');
  const parent: Parent = { id: planet.id, request: onRequest };

  const [stopAt, setStopAt] = useState(-1);

  useEffect(() => {
    const cb = () => {
      for (let i = 0; i < planet.moons.length; i++) {
        const moon = planet.moons[i];
        if (typeof moon === 'string') continue;
        if ((points.value[moon.id] || 0) >= moon.points.min) continue;
        setStopAt(i);
        return;
      }
      setStopAt(-1);
    };

    cb();
    return subscribe(points, cb);
  }, []);

  return (
    <>
      <div key={editor.saved} className="py-5 overflow-y-auto [scrollbar-gutter:stable] h-full">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-5">
          {planet.moons.map((moon, i) => {
            if (stopAt !== -1 && i > stopAt) return null;
            return (
              <Fragment key={i}>
                {typeof moon === 'string' ? (
                  <Markdown className="px-3">{moon}</Markdown>
                ) : (
                  <Moon parent={parent} moon={moon} onChange={onChange(moon.id)} />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-[21px] left-[21px] flex gap-2">
        <EditorButton />
        {/* TODO: reset */}
      </div>

      <a href="/jupiter">
        <Button
          className="fixed right-[21px] bottom-[21px]"
          shadowClassName="bg-sky-600"
          contentClassName="bg-sky-500 px-4 py-2 text-white"
        >
          Jupiter
        </Button>
      </a>
    </>
  );
};

export default Neptune;
