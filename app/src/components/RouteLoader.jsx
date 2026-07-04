/**
 * Suspense fallback for lazy-loaded route chunks. Minimal centered spinner
 * using design tokens so it reads correctly in both themes.
 */
export default function RouteLoader() {
  return (
    <div
      className="flex items-center justify-center py-24"
      role="status"
      aria-label="Loading"
    >
      <span className="material-symbols-outlined animate-spin text-3xl text-on-surface-variant">
        progress_activity
      </span>
    </div>
  );
}
