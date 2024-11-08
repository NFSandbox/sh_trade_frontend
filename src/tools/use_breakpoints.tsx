import { useBreakpoint as pUseBp } from "use-breakpoint";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type BreakPointName = keyof typeof BREAKPOINTS;

/**
 * Hook to inspect if a min breakpoint is satisfied.
 *
 * Works like the breakpoint tags in TailwindCSS.
 * A specific breakpoint name is specified when init the hook (for example `md`),
 * then whenever the size of viewport not reach the min limitation of `md`,
 * this hook will return `false`. Else, if the min limitation reached, this
 * hook will return `True`.
 *
 * Usage:
 *
 * ```ts
 *   // in a component
 *   const reachedMd = useMinBreakPoint('md');
 *
 *   if (reachedMd) {
 *     return <SomeLargeSizeContent />
 *   }
 *
 *   return <p>Please use a larger screen to view this page.</p>
 * ```
 *
 * Performance:
 *
 * This function relys on use-breakpoint package.
 * After testing, this hooks will only trigger a potential rerender when
 * screen size go cross one of the specified breakpoint screen size. For example
 * when you make a brower size larger and larger, once if crossed from middle to
 * large breakpoint, this hook will trigger a potential update.
 */
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
