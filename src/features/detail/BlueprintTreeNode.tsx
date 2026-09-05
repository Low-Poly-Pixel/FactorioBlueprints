import type { ResolvedBlueprintTreeNode } from '../../shared/blueprint/icons'
import {
  Collapsible,
  CollapsibleContent,
} from '../../shared/components/shadcn/collapsible'
import { BlueprintTreeNodeChildren } from './BlueprintTreeNodeChildren'
import { BlueprintTreeNodeRow } from './BlueprintTreeNodeRow'

type BlueprintTreeNodeProps = {
  node: ResolvedBlueprintTreeNode
  path: string
  depth: number
  expandedPaths: ReadonlySet<string>
  focusedPath: string
  posInSet: number
  setSize: number
  onToggle: (path: string, open: boolean) => void
  onActivate: (path: string) => void
  onRegisterRef: (path: string, element: HTMLDivElement | null) => void
}

// A solo blueprint/planner's "contents" tree is just itself: one node, no
// siblings, no children. The chevron-alignment spacer exists to line up
// leaves with their sibling books — with nothing to align against, it just
// reads as a stray indent.
const isSoloLeafNode = (
  depth: number,
  setSize: number,
  hasChildren: boolean,
): boolean => depth === 1 && setSize === 1 && !hasChildren

export const BlueprintTreeNode = ({
  node,
  path,
  depth,
  expandedPaths,
  focusedPath,
  posInSet,
  setSize,
  onToggle,
  onActivate,
  onRegisterRef,
}: BlueprintTreeNodeProps) => {
  const hasChildren = node.children.length > 0
  const isExpanded = hasChildren && expandedPaths.has(path)
  const isFocused = focusedPath === path
  const isSoloLeaf = isSoloLeafNode(depth, setSize, hasChildren)

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard activation (Enter/Space/arrow keys) is handled by the ancestor role="tree" element's onKeyDown, not a listener on this row itself
    <div
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-level={depth}
      aria-posinset={posInSet}
      aria-setsize={setSize}
      onClick={(event) => {
        event.stopPropagation()
        onActivate(path)
        if (hasChildren) {
          onToggle(path, !isExpanded)
        }
      }}
      className="outline-none"
      onFocus={(event) => {
        event.stopPropagation()
        onActivate(path)
      }}
      ref={(element) => onRegisterRef(path, element)}
      role="treeitem"
      tabIndex={isFocused ? 0 : -1}
    >
      <Collapsible open={isExpanded}>
        <BlueprintTreeNodeRow
          entityKind={node.entityKind}
          exportString={node.exportString}
          hasChildren={hasChildren}
          hideIndent={isSoloLeaf}
          icons={node.icons}
          isExpanded={isExpanded}
          title={node.title}
        />
        {hasChildren && (
          <CollapsibleContent>
            <BlueprintTreeNodeChildren
              depth={depth}
              expandedPaths={expandedPaths}
              focusedPath={focusedPath}
              nodes={node.children}
              onActivate={onActivate}
              onRegisterRef={onRegisterRef}
              onToggle={onToggle}
              parentPath={path}
            />
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  )
}
