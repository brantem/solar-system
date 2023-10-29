import { useEffect, useState } from 'react';

import { getBoundingClientRectById } from '../../lib/helpers';
import { Path } from '../../lib/types';

type Style = {
  top: number;
  left: number;
  height: number;
  width: number;
};

const PADDING = 32;

const Box = ({ path }: { path: Path }) => {
  const [style, setStyle] = useState<Style>();

  useEffect(() => {
    const rect = getBoundingClientRectById(path.id);
    if (!rect) return;
    setStyle({
      top: rect.top - PADDING / 2,
      left: rect.left - PADDING / 2,
      width: rect.width + PADDING,
      height: rect.height + PADDING,
    });
  }, []);

  if (!path.prediction || !style) return null;

  const probability = path.prediction.probability * 100;

  return (
    <div
      className={[
        'absolute border border-solid rounded-md z-[8] flex items-end',
        probability > 95 ? 'border-green-300' : 'border-neutral-300',
      ].join(' ')}
      style={style}
    >
      {path.prediction ? (
        <code
          className={['m-0 p-1 rounded-b-md break-all', probability > 95 ? 'bg-green-50' : 'bg-neutral-50'].join(' ')}
        >
          {JSON.stringify({ label: path.prediction.label, probability: probability.toFixed(2) })}
        </code>
      ) : null}
    </div>
  );
};

export default Box;