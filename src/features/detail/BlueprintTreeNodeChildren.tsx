import type { ResolvedBlueprintTreeNode } from '../../shared/blueprint/icons'
import { BlueprintTreeNode } from './BlueprintTreeNode'

type BlueprintTreeNodeChildrenProps = {
  nodes: ResolvedBlueprintTreeNode[]
  parentPath: string
  depth: number
  expandedPaths: ReadonlySet<string>
  focusedPath: string
  onToggle: (path: string, open: boolean) => void
  onActivate: (path: string) => void
  onRegisterRef: (path: string, element: HTMLDivElement | null) => void
}

export const BlueprintTreeNodeChildren = ({
  nodes,
  parentPath,
  depth,
  expandedPaths,
  focusedPath,
  onToggle,
  onActivate,
  onRegisterRef,
}: BlueprintTreeNodeChildrenProps) => (
  // biome-ignore lint/a11y/useSemanticElements: role="group" here is the WAI-ARIA APG tree pattern's node-children grouping, not a form fieldset
  <div className="ml-2 border-l border-border pl-4" role="group">
    {nodes.map((child, index) => {
      const childPath = `${parentPath}-${index}`
      return (
        <BlueprintTreeNode
          depth={depth + 1}
          expandedPaths={expandedPaths}
          focusedPath={focusedPath}
          key={childPath}
          node={child}
          onActivate={onActivate}
          onRegisterRef={onRegisterRef}
          onToggle={onToggle}
          path={childPath}
          posInSet={index + 1}
          setSize={nodes.length}
        />
      )
    })}
  </div>
)
