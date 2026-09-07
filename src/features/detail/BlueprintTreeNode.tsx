import type { ResolvedBlueprintTreeNode } from '@/shared/blueprint/icons';
import { Collapsible } from '@/shared/components/shadcn/collapsible';
import { BlueprintTreeNodeChildren } from './BlueprintTreeNodeChildren';
import { BlueprintTreeNodeCollapsibleContent } from './BlueprintTreeNodeCollapsibleContent';
import { BlueprintTreeNodeRow } from './BlueprintTreeNodeRow';

type BlueprintTreeNodeProps = {
  node: ResolvedBlueprintTreeNode;
  path: string;
  depth: number;
  expandedPaths: ReadonlySet<string>;
  focusedPath: string;
  posInSet: number;
  setSize: number;
  onToggle: (path: string, open: boolean) => void;
  onActivate: (path: string) => void;
  onRegisterRef: (path: string, element: HTMLDivElement | null) => void;
};

// A solo blueprint/planner's "contents" tree is just itself: one node, no
// siblings, no children. The chevron-alignment spacer exists to line up
// leaves with their sibling books — with nothing to align against, it just
// reads as a stray indent.
const isSoloLeafNode = (depth: number, setSize: number, hasChildren: boolean) =>
  depth === 1 && setSize === 1 && !hasChildren;

type TreeItemHandlerDeps = {
  hasChildren: boolean;
  path: string;
  isExpanded: boolean;
  onActivate: (path: string) => void;
  onToggle: (path: string, open: boolean) => void;
};

// Only books nest content and can be expanded — a leaf (blueprint/planner)
// has nothing a click could do, so it shouldn't visually react to one at
// all. onMouseDown's preventDefault blocks just the click-triggered focus
// (and the onFocus->onActivate it would otherwise cause); Tab and
// arrow-key tree navigation (focusPath's own .focus() calls) are
// unaffected, so keyboard reachability is unchanged.
const createTreeItemHandlers = ({
  hasChildren,
  path,
  isExpanded,
  onActivate,
  onToggle,
}: TreeItemHandlerDeps) => ({
  onClick: (event: React.MouseEvent) => {
    // stopPropagation runs unconditionally, before the leaf check — a
    // leaf's own click must never bubble up to an ancestor book's
    // onClick and collapse *that* instead.
    event.stopPropagation();
    if (!hasChildren) return;
    onActivate(path);
    onToggle(path, !isExpanded);
  },
  onFocus: (event: React.FocusEvent) => {
    event.stopPropagation();
    onActivate(path);
  },
  onMouseDown: (event: React.MouseEvent) => {
    if (!hasChildren) event.preventDefault();
  },
});

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
  const hasChildren = node.children.length > 0;
  const isExpanded = hasChildren && expandedPaths.has(path);
  const isSoloLeaf = isSoloLeafNode(depth, setSize, hasChildren);
  const isRoot = depth === 1;
  const { onClick, onFocus, onMouseDown } = createTreeItemHandlers({
    hasChildren,
    isExpanded,
    onActivate,
    onToggle,
    path,
  });
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard activation (Enter/Space/arrow keys) is handled by the ancestor role="tree" element's onKeyDown, not a listener on this row itself
    <div
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-level={depth}
      aria-posinset={posInSet}
      aria-setsize={setSize}
      onClick={onClick}
      className="outline-none"
      onFocus={onFocus}
      onMouseDown={onMouseDown}
      ref={(element) => onRegisterRef(path, element)}
      role="treeitem"
      tabIndex={focusedPath === path ? 0 : -1}
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
          <BlueprintTreeNodeCollapsibleContent
            isExpanded={isExpanded}
            isRoot={isRoot}
          >
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
          </BlueprintTreeNodeCollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};
