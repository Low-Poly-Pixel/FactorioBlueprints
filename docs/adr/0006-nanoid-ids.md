# nanoid for public IDs, not UUID or slugs

Blueprints/Books/Planners are addressed by a short, random, URL-safe nanoid, not a UUID and not a human-readable slug.

We decided against slugs because they need collision-avoidance machinery (uniqueness checks, suffixing) for a minor, indirect SEO benefit that isn't worth the complexity here; nanoid gives short, unguessable, collision-safe URLs with none of that machinery.
