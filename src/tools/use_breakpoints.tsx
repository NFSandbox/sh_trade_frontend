import { useBreakpoint as pUseBp } from "use-breakpoint";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type BreakPointName = keyof typeof BREAKPOINTS;

export function useMinBreakPoint(minBreakPoint: BreakPointName) {
  const { breakpoint } = pUseBp(BREAKPOINTS);

  if (breakpoint == undefined) {
    return false;
  }

  let reachedMinBp = false;
  let reachedCurBp = false;

  for (const curKey of Object.keys(BREAKPOINTS)) {
    if (curKey == minBreakPoint) {
      reachedMinBp = true;
    }
    if (curKey == breakpoint) {
      reachedCurBp = true;
      break;
    }
  }

  return reachedMinBp;
}
