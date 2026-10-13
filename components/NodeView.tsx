'use client';
import * as React from 'react';
import { Box } from '@mui/material';
import type { TreeNode } from '@/lib/tree';

const LINE = '2px solid #c4c4c4';
const GAP = '28px';

type Props = {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  cutId: string | null;
  onToggle: (id: string) => void;
  onContext: (e: React.MouseEvent, node: TreeNode) => void;
};

export default function NodeView({ node, depth, expanded, cutId, onToggle, onContext }: Props) {
  const hasChildren = node.children.length > 0;
  const open = expanded.has(node.id) && hasChildren;
  const isRoot = depth === 0;
  const filled = open; // opened nodes are highlighted like the sample

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        role="button"
        tabIndex={0}
        onClick={() => onToggle(node.id)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(node.id)}
        onContextMenu={(e) => onContext(e, node)}
        sx={{
          minWidth: 190,
          height: 40,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isRoot ? 'center' : 'flex-start',
          borderRadius: '8px',
          border: '1px solid #d98c8c',
          bgcolor: filled || isRoot ? '#c98b8b' : '#fff',
          color: filled || isRoot ? '#fff' : '#444',
          fontSize: 13,
          fontWeight: filled || isRoot ? 700 : 400,
          cursor: 'pointer',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          opacity: cutId === node.id ? 0.4 : 1,
          transition: 'background-color .15s, opacity .15s',
          '&:hover': { borderColor: '#b86a6a' },
          '&:focus-visible': { outline: '2px solid #7a3b3b', outlineOffset: 2 },
        }}
      >
        {node.label}
      </Box>

      {open && (
        <>
          <Box sx={{ width: GAP, borderTop: LINE }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {node.children.map((child, i) => {
              const only = node.children.length === 1;
              const first = i === 0;
              const last = i === node.children.length - 1;
              return (
                <Box
                  key={child.id}
                  sx={{
                    position: 'relative',
                    py: '6px',
                    paddingInlineStart: GAP,
                    '&::before': {
                      content: '""',
                      display: only ? 'none' : 'block',
                      position: 'absolute',
                      insetInlineStart: 0,
                      top: first ? '50%' : 0,
                      bottom: last ? '50%' : 0,
                      borderInlineStart: LINE,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      insetInlineStart: 0,
                      top: '50%',
                      width: GAP,
                      borderTop: LINE,
                    },
                  }}
                >
                  <NodeView
                    node={child}
                    depth={depth + 1}
                    expanded={expanded}
                    cutId={cutId}
                    onToggle={onToggle}
                    onContext={onContext}
                  />
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}
