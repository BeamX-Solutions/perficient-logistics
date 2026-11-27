/** Id of the sticky bar at the top of the home page (offers banner + header). */
export const STICKY_TOP_ID = 'site-top';

/** Scroll so the element starts just below the sticky top bar instead of underneath it. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = (document.getElementById(STICKY_TOP_ID)?.offsetHeight ?? 80) + 8;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
