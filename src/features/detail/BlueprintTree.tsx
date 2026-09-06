import type { ResolvedBlueprintTreeNode } from '@/shared/blueprint/icons';
import { BlueprintTreeNode } from './BlueprintTreeNode';
import { useBlueprintTreeNavigation } from './useBlueprintTreeNavigation';

type BlueprintTreeProps = {
  nodes: ResolvedBlueprintTreeNode[];
};

export const BlueprintTree = ({ nodes }: BlueprintTreeProps) => {
  const {
    expandedPaths,
    focusedPath,
    handleKeyDown,
    onActivate,
    registerNodeRef,
    toggleExpanded,
  } = useBlueprintTreeNavigation(nodes);

  return (
    <div
      aria-label="Blueprint book contents"
      className="flex flex-col gap-1"
      onKeyDown={handleKeyDown}
      role="tree"
    >
      {nodes.map((node, index) => (
        <BlueprintTreeNode
          depth={1}
          expandedPaths={expandedPaths}
          focusedPath={focusedPath}
          key={String(index)}
          node={node}
          onActivate={onActivate}
          onRegisterRef={registerNodeRef}
          onToggle={toggleExpanded}
          path={String(index)}
          posInSet={index + 1}
          setSize={nodes.length}
        />
      ))}
    </div>
  );
};
