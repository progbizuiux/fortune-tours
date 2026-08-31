/* The live Lenis instance, held where non-provider code can reach it.
 *
 * Anything that covers the page — a modal, a drawer — has to stop the smooth
 * scroller, not just set `overflow: hidden`. Lenis drives the scroll position
 * itself from wheel and touch events, so with only a CSS lock the page keeps
 * moving behind the overlay while the body refuses to show it, and the reader
 * is returned somewhere else when the overlay closes. `lenis.stop()` is the
 * supported way to freeze it, and it needs the instance.
 *
 * A module singleton rather than a context: the instance never changes for the
 * life of the app, nothing renders from it, and a context would re-render the
 * whole tree on mount to hand down a value that is only ever read in an event
 * handler. LenisProvider registers it on create and clears it on destroy.
 */

let instance = null;

export function setLenis(lenis) {
  instance = lenis;
}

/** The instance, or null before the provider has mounted (SSR included). */
export function getLenis() {
  return instance;
}
