export type EntityKind =
  | 'blueprint'
  | 'blueprint_book'
  | 'upgrade_planner'
  | 'deconstruction_planner';

export const fallbackTitles: Record<EntityKind, string> = {
  blueprint: 'Blueprint',
  blueprint_book: 'Blueprint Book',
  upgrade_planner: 'Upgrade Planner',
  deconstruction_planner: 'Deconstruction Planner',
};
