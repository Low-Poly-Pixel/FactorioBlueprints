import { useRef, useState } from 'react'

import type { ResolvedBlueprintTreeNode } from '../../shared/blueprint/icons'

const flattenVisiblePaths = (
  nodes: ResolvedBlueprintTreeNode[],
  expandedPaths: ReadonlySet<string>,
  parentPath = '',
): string[] =>
  nodes.flatMap((node, index) => {
    const path = parentPath ? `${parentPath}-${index}` : String(index)
    if (node.children.length === 0 || !expandedPaths.has(path)) return [path]
    return [path, ...flattenVisiblePaths(node.children, expandedPaths, path)]
  })

const getNodeAtPath = (
  nodes: ResolvedBlueprintTreeNode[],
  path: string,
): ResolvedBlueprintTreeNode => {
  const indices = path.split('-').map(Number)
  let node = nodes[indices[0]]
  for (const index of indices.slice(1)) {
    node = node.children[index]
  }
  return node
}

const getParentPath = (path: string): string | null => {
  const lastDash = path.lastIndexOf('-')
  return lastDash === -1 ? null : path.slice(0, lastDash)
}

const getSiblingFocusPath = (
  visiblePaths: string[],
  focusedPath: string,
  delta: number,
): string | null =>
  visiblePaths[visiblePaths.indexOf(focusedPath) + delta] ?? null

const getEdgeFocusPath = (
  visiblePaths: string[],
  edge: 'start' | 'end',
): string | null =>
  (edge === 'start' ? visiblePaths[0] : visiblePaths.at(-1)) ?? null

type ArrowAction =
  | { type: 'expand' | 'collapse' | 'none' }
  | { type: 'focus'; path: string }

const getArrowRightAction = (
  nodes: ResolvedBlueprintTreeNode[],
  expandedPaths: ReadonlySet<string>,
  visiblePaths: string[],
  focusedPath: string,
): ArrowAction => {
  const node = getNodeAtPath(nodes, focusedPath)
  if (node.children.length === 0) {
    return { type: 'none' }
  }
  if (!expandedPaths.has(focusedPath)) {
    return { type: 'expand' }
  }
  const next = getSiblingFocusPath(visiblePaths, focusedPath, 1)
  return next ? { type: 'focus', path: next } : { type: 'none' }
}

const getArrowLeftAction = (
  nodes: ResolvedBlueprintTreeNode[],
  expandedPaths: ReadonlySet<string>,
  focusedPath: string,
): ArrowAction => {
  const node = getNodeAtPath(nodes, focusedPath)
  if (node.children.length > 0 && expandedPaths.has(focusedPath)) {
    return { type: 'collapse' }
  }
  const parentPath = getParentPath(focusedPath)
  return parentPath ? { type: 'focus', path: parentPath } : { type: 'none' }
}

const useExpandedPaths = (): [
  ReadonlySet<string>,
  (path: string, open: boolean) => void,
] => {
  const [expandedPaths, setExpandedPaths] = useState<ReadonlySet<string>>(
    () => new Set(),
  )

  const toggleExpanded = (path: string, open: boolean) => {
    setExpandedPaths((current) => {
      const next = new Set(current)
      if (open) {
        next.add(path)
      } else {
        next.delete(path)
      }
      return next
    })
  }

  return [expandedPaths, toggleExpanded]
}

const useRovingTreeFocus = () => {
  const [focusedPath, setFocusedPath] = useState('0')
  const nodeRefs = useRef(new Map<string, HTMLDivElement>())

  const registerNodeRef = (path: string, element: HTMLDivElement | null) => {
    if (element) {
      nodeRefs.current.set(path, element)
    } else {
      nodeRefs.current.delete(path)
    }
  }

  const focusPath = (path: string) => {
    setFocusedPath(path)
    nodeRefs.current.get(path)?.focus()
  }

  return { focusPath, focusedPath, onActivate: setFocusedPath, registerNodeRef }
}

type KeyHandlerDeps = {
  nodes: ResolvedBlueprintTreeNode[]
  expandedPaths: ReadonlySet<string>
  focusedPath: string
  toggleExpanded: (path: string, open: boolean) => void
  focusPath: (path: string) => void
}

const createKeyHandlers = ({
  nodes,
  expandedPaths,
  focusedPath,
  toggleExpanded,
  focusPath,
}: KeyHandlerDeps): Partial<
  Record<string, (visiblePaths: string[]) => void>
> => {
  const applyArrowAction = (action: ArrowAction) => {
    if (action.type === 'expand') {
      toggleExpanded(focusedPath, true)
    } else if (action.type === 'collapse') {
      toggleExpanded(focusedPath, false)
    } else if (action.type === 'focus') {
      focusPath(action.path)
    }
  }

  const toggleFocusedNode = () => {
    const node = getNodeAtPath(nodes, focusedPath)
    if (node.children.length > 0) {
      toggleExpanded(focusedPath, !expandedPaths.has(focusedPath))
    }
  }

  return {
    ' ': toggleFocusedNode,
    ArrowDown: (visiblePaths) => {
      const next = getSiblingFocusPath(visiblePaths, focusedPath, 1)
      if (next) {
        focusPath(next)
      }
    },
    ArrowLeft: () =>
      applyArrowAction(getArrowLeftAction(nodes, expandedPaths, focusedPath)),
    ArrowRight: (visiblePaths) =>
      applyArrowAction(
        getArrowRightAction(nodes, expandedPaths, visiblePaths, focusedPath),
      ),
    ArrowUp: (visiblePaths) => {
      const previous = getSiblingFocusPath(visiblePaths, focusedPath, -1)
      if (previous) {
        focusPath(previous)
      }
    },
    End: (visiblePaths) => {
      const edge = getEdgeFocusPath(visiblePaths, 'end')
      if (edge) {
        focusPath(edge)
      }
    },
    Enter: toggleFocusedNode,
    Home: (visiblePaths) => {
      const edge = getEdgeFocusPath(visiblePaths, 'start')
      if (edge) {
        focusPath(edge)
      }
    },
  }
}

export const useBlueprintTreeNavigation = (
  nodes: ResolvedBlueprintTreeNode[],
) => {
  const [expandedPaths, toggleExpanded] = useExpandedPaths()
  const { focusPath, focusedPath, onActivate, registerNodeRef } =
    useRovingTreeFocus()

  const keyHandlers = createKeyHandlers({
    expandedPaths,
    focusPath,
    focusedPath,
    nodes,
    toggleExpanded,
  })

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const handler = keyHandlers[event.key]
    const visiblePaths = flattenVisiblePaths(nodes, expandedPaths)
    if (!(handler && visiblePaths.includes(focusedPath))) {
      return
    }
    event.preventDefault()
    handler(visiblePaths)
  }

  return {
    expandedPaths,
    focusedPath,
    handleKeyDown,
    onActivate,
    registerNodeRef,
    toggleExpanded,
  }
}
