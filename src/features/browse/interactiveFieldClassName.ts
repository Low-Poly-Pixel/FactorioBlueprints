// Shared hover/focus treatment for this page's interactive fields (search
// input, filter dropdowns): a dimmed white border on hover, full orange on
// focus, both fully opaque — color-mix/opacity versions of these read wrong
// against this app's near-black background, see BrowseSearchInput's commit
// history for the color-mix hue-shift and alpha-darkening pitfalls this
// sidesteps.
export const interactiveFieldClassName =
  'transition-colors duration-200 hover:border-[oklch(0.85_0_0)] focus-visible:border-primary focus-visible:ring-0';
