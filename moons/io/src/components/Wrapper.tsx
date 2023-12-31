import type { Coordinate } from '../lib/types';
import { STROKE_SIZE } from '../lib/constants';
import { useIo } from '../lib/state';

const getCoord = (el: HTMLElement, pageX: number, pageY: number): Coordinate => {
  const rect = el.getBoundingClientRect();
  const x = pageX - rect.x - window.scrollX;
  const y = pageY - rect.y - window.scrollY;
  const min = STROKE_SIZE - 4;
  const maxX = rect.width - STROKE_SIZE - 4;
  const maxY = rect.height - STROKE_SIZE - 4;
  return { x: x > maxX ? maxX : x < min ? min : x, y: y > maxY ? maxY : y < min ? min : y };
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { a, start, setB, addLine, isConnected } = useIo();
  return (
    <div
      className="relative w-full h-full grid grid-cols-[1fr_theme(spacing.48)_1fr] [grid-template-areas:'start_middle_end'] items-center justify-between font-sans text-4xl font-semibold touch-none z-10"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        if (!(e.target as HTMLElement).classList.contains('dot')) return;
        const el = e.target as Element;
        start(el.parentElement!.id);
      }}
      onPointerMove={(e) => {
        if (!a) return;
        if ((e.target as HTMLElement).classList.contains('dot')) {
          const el = e.target as Element;
          const id = el.parentElement!.id;
          if (id.split('-')[1] !== a.split('-')[1] && !isConnected(id)) return setB(id);
        }
        setB(getCoord(e.currentTarget, e.pageX, e.pageY));
      }}
      onPointerUp={addLine}
    >
      {children}
    </div>
  );
};

export default Wrapper;
