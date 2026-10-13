'use client';
import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Menu, MenuItem, TextField, Typography } from '@mui/material';
import NodeView from './NodeView';
import { TreeNode, cloneWithNewIds, findNode, initialTree, mapNode, removeNode, uid } from '@/lib/tree';

type Clip = { mode: 'copy' | 'cut'; node: TreeNode } | null;

export default function AccountTree() {
  const [tree, setTree] = React.useState<TreeNode>(initialTree);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['root']));
  const [clip, setClip] = React.useState<Clip>(null);
  const [menu, setMenu] = React.useState<{ x: number; y: number; node: TreeNode } | null>(null);
  const [addTarget, setAddTarget] = React.useState<TreeNode | null>(null);
  const [label, setLabel] = React.useState('');

  const toggle = (id: string) =>
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const expand = (id: string) => setExpanded((s) => new Set(s).add(id));

  const onContext = (e: React.MouseEvent, node: TreeNode) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, node });
  };
  const closeMenu = () => setMenu(null);

  const target = menu?.node;
  const hasChildren = !!target && target.children.length > 0;
  const isRoot = target?.id === 'root';

  const cut = () => {
    if (!target) return;
    setClip({ mode: 'cut', node: target });
    closeMenu();
  };
  const copy = () => {
    if (!target) return;
    setClip({ mode: 'copy', node: target }); // children are copied together with the node
    closeMenu();
  };
  const paste = () => {
    if (!target || !clip) return;
    const t = target.id;
    if (clip.mode === 'cut') {
      const moving = findNode(tree, clip.node.id);
      if (moving) {
        setTree((tr) => mapNode(removeNode(tr, moving.id), t, (n) => ({ ...n, children: [...n.children, moving] })));
      }
      setClip(null);
    } else {
      const copyNode = cloneWithNewIds(clip.node);
      setTree((tr) => mapNode(tr, t, (n) => ({ ...n, children: [...n.children, copyNode] })));
    }
    expand(t);
    closeMenu();
  };
  const remove = () => {
    if (!target) return;
    setTree((tr) => removeNode(tr, target.id));
    if (clip?.node.id === target.id) setClip(null);
    closeMenu();
  };
  const openAdd = () => {
    setAddTarget(target ?? null);
    setLabel('');
    closeMenu();
  };
  const submitAdd = () => {
    const text = label.trim();
    if (!addTarget || !text) return;
    const child: TreeNode = { id: uid(), label: text, children: [] };
    setTree((tr) => mapNode(tr, addTarget.id, (n) => ({ ...n, children: [...n.children, child] })));
    expand(addTarget.id);
    setAddTarget(null);
  };

  const pasteDisabled = !clip || (clip.mode === 'cut' && clip.node.id === target?.id);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
        درخت حساب ها
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        برای باز و بسته کردن روی هر آیتم کلیک کنید و برای دیدن گزینه ها روی آن کلیک راست کنید.
      </Typography>
      <Box sx={{ overflowX: 'auto', pb: 2 }}>
        <Box sx={{ display: 'inline-block', minWidth: '100%' }}>
          <NodeView
            node={tree}
            depth={0}
            expanded={expanded}
            cutId={clip?.mode === 'cut' ? clip.node.id : null}
            onToggle={toggle}
            onContext={onContext}
          />
        </Box>
      </Box>

      <Menu
        open={!!menu}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={menu ? { top: menu.y, left: menu.x } : undefined}
        slotProps={{
          root: {
            onContextMenu: (e: React.MouseEvent) => {
              e.preventDefault();
              closeMenu();
            },
          },
        }}
      >
        <MenuItem onClick={cut} disabled={hasChildren || isRoot}>برش دادن</MenuItem>
        <MenuItem onClick={copy}>کپی کردن</MenuItem>
        <MenuItem onClick={paste} disabled={pasteDisabled}>پیست کردن</MenuItem>
        <MenuItem onClick={remove} disabled={hasChildren || isRoot}>حذف</MenuItem>
        <Divider />
        <MenuItem onClick={openAdd}>افزودن زیرشاخه</MenuItem>
      </Menu>

      <Dialog open={!!addTarget} onClose={() => setAddTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle>افزودن زیرشاخه به «{addTarget?.label}»</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="عنوان زیرشاخه"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTarget(null)} color="inherit">انصراف</Button>
          <Button onClick={submitAdd} variant="contained" disabled={!label.trim()}>افزودن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
