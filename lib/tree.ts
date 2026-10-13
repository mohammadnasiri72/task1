export type TreeNode = { id: string; label: string; children: TreeNode[] };

let counter = 0;
export const uid = () => `n${Date.now().toString(36)}${(counter++).toString(36)}`;

export const findNode = (n: TreeNode, id: string): TreeNode | null => {
  if (n.id === id) return n;
  for (const c of n.children) {
    const f = findNode(c, id);
    if (f) return f;
  }
  return null;
};

export const mapNode = (n: TreeNode, id: string, fn: (n: TreeNode) => TreeNode): TreeNode =>
  n.id === id ? fn(n) : { ...n, children: n.children.map((c) => mapNode(c, id, fn)) };

export const removeNode = (n: TreeNode, id: string): TreeNode => ({
  ...n,
  children: n.children.filter((c) => c.id !== id).map((c) => removeNode(c, id)),
});

// Deep copy with fresh ids (used for "copy": the node and all its descendants)
export const cloneWithNewIds = (n: TreeNode): TreeNode => ({
  ...n,
  id: uid(),
  children: n.children.map(cloneWithNewIds),
});

const n = (id: string, label: string, children: TreeNode[] = []): TreeNode => ({ id, label, children });

export const initialTree: TreeNode = n('root', 'حساب های اصلی', [
  n('1', '1 دارایی های جاری', [
    n('101', '101 وجوه نقد', [n('10101', '10101 تن خواه'), n('10102', '10102 بانک')]),
    n('103', '103 حساب های دریافتنی', [n('10301', '10301 حساب های دریافتنی حامی کت')]),
  ]),
  n('2', '2 دارایی های غیر جاری'),
  n('3', '3 بدهی های جاری', [
    n('301', '301 حسابهای پرداختنی تجاری', [
      n('30101', '30101 کیف پول پرداختنی خریدار'),
      n('30102', '30102 حساب های پرداختنی فروشگاه'),
      n('30103', '30103 حساب های پرداختنی فروشنده'),
      n('30104', '30104 حساب های پرداختنی پیک'),
    ]),
    n('302', '302 حسابهای پرداختنی غیر تجاری', [
      n('30201', '30201 مالیات پرداختنی'),
      n('30202', '30202 بیمه پرداختنی'),
      n('30203', '30203 ارزش افزوده پرداختنی'),
    ]),
  ]),
  n('4', '4 بدهی های غیر جاری'),
  n('5', '5 حقوق صاحبان سهام (سرمایه)'),
  n('6', '6 درآمد', [
    n('601', '601 درامدهای عملیاتی', [
      n('60101', '60101 درامد سفر ( رفت به فروشگاه)'),
      n('60102', '60102 درامد سفر ( رفت به خریدار)'),
      n('60103', '60103 درامد سفر ( برگشت به فروشگاه)'),
    ]),
    n('602', '602 درآمدهای غیرعملیاتی'),
  ]),
  n('7', '7 قیمت تمام شده'),
  n('8', '8 هزینه ها', [
    n('801', '801 حساب های انتظامی سفیر', [
      n('80101', '80101 سفر تحویل از فروشگاه'),
      n('80102', '80102 سفر تحویل از خریدار'),
    ]),
    n('802', '802 حساب های انتظامی فروشگاه'),
    n('803', '803 حساب های انتظامی انبار'),
  ]),
  n('9', '9 حساب های انتظامی'),
]);
