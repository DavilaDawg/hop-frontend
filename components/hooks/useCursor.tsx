import { PerfectCursor } from "perfect-cursors";
import * as React from "react";

type Point = [number, number];
type Callback = (point: number[]) => void;

export function usePerfectCursor(cb: Callback, point?: Point): (point: Point) => void {
  const [pc] = React.useState(() => new PerfectCursor(cb));

  React.useLayoutEffect(() => {
    if (point) pc.addPoint(point);
    return () => pc.dispose();
  }, [pc, point]);

  const onPointChange = React.useCallback((point: Point) => {
    pc.addPoint(point);
  }, [pc]);

  return onPointChange;
}
