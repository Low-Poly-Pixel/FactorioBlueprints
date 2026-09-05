import { z } from 'zod';
import type { EntityKind } from './entityKind.ts';

const itemTypeSchema = z.enum([
  'item',
  'fluid',
  'virtual',
  'recipe',
  'entity',
  'space-location',
  'asteroid-chunk',
  'quality',
]);
export type ItemType = z.infer<typeof itemTypeSchema>;

const iconSchema = z.object({
  signal: z.object({
    type: itemTypeSchema.optional(),
    name: z.string(),
  }),
  index: z.number(),
});

// Only the fields this app actually reads, not a full model of Factorio's
// blueprint format — but real fields, runtime-checked, since a blueprint
// string is user-uploaded input, not data we control.
export type RawPayload = {
  label?: string;
  description?: string;
  version: number;
  icons?: z.infer<typeof iconSchema>[];
  blueprints?: RawNestedEntry[];
};

type EntityWrapper =
  | { blueprint: RawPayload }
  | { blueprint_book: RawPayload }
  | { upgrade_planner: RawPayload }
  | { deconstruction_planner: RawPayload };

export type RawNestedEntry = EntityWrapper & { index: number };

const payloadSchema: z.ZodType<RawPayload> = z.lazy(() =>
  z.object({
    label: z.string().optional(),
    description: z.string().optional(),
    version: z.number(),
    icons: z.array(iconSchema).optional(),
    blueprints: z.array(nestedEntrySchema).optional(),
  }),
);

const blueprintWrapperSchema = z.object({ blueprint: payloadSchema });
const blueprintBookWrapperSchema = z.object({ blueprint_book: payloadSchema });
const upgradePlannerWrapperSchema = z.object({
  upgrade_planner: payloadSchema,
});
const deconstructionPlannerWrapperSchema = z.object({
  deconstruction_planner: payloadSchema,
});

export const topLevelSchema = z.union([
  blueprintWrapperSchema,
  blueprintBookWrapperSchema,
  upgradePlannerWrapperSchema,
  deconstructionPlannerWrapperSchema,
]);

const nestedEntrySchema: z.ZodType<RawNestedEntry> = z.lazy(() =>
  z.union([
    blueprintWrapperSchema.extend({ index: z.number() }),
    blueprintBookWrapperSchema.extend({ index: z.number() }),
    upgradePlannerWrapperSchema.extend({ index: z.number() }),
    deconstructionPlannerWrapperSchema.extend({ index: z.number() }),
  ]),
);

// Narrows a validated wrapper to its entity kind + payload via property
// presence (`in`), not a type assertion — Zod already guaranteed at runtime
// that exactly one of these four keys is present.
export const entityKindAndPayload = (
  wrapper: EntityWrapper,
): { entityKind: EntityKind; payload: RawPayload } => {
  if ('blueprint' in wrapper) {
    return { entityKind: 'blueprint', payload: wrapper.blueprint };
  }
  if ('blueprint_book' in wrapper) {
    return { entityKind: 'blueprint_book', payload: wrapper.blueprint_book };
  }
  if ('upgrade_planner' in wrapper) {
    return { entityKind: 'upgrade_planner', payload: wrapper.upgrade_planner };
  }
  return {
    entityKind: 'deconstruction_planner',
    payload: wrapper.deconstruction_planner,
  };
};
