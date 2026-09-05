# WCAG 2.1 AA is a hard requirement, not aspirational

The site must meet WCAG 2.1 (or later) AA compliance as a non-negotiable bar, not a "nice to have" cleaned up at the end. This applies to every interactive surface, including the nested blueprint-book tree view and the icon-heavy browse/detail pages.

We decided this because the site is intended as part of the developer's professional portfolio for job applications, so accessibility gaps are a direct, visible quality signal to reviewers, not just an ethical nice-to-have. It's also much cheaper to build to this bar from the start (accessible component primitives, correct contrast/focus/ARIA from day one) than to retrofit it after the fact — retrofitting keyboard navigation and ARIA semantics onto an already-built nested tree view especially would be costly.
