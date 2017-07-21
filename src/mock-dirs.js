const DIRS = [
  // self->self
  {ancestor: 0, descendant: 0, depth: 0},
  {ancestor: 4, descendant: 4, depth: 0},
  {ancestor: 5, descendant: 5, depth: 0},
  {ancestor: 6, descendant: 6, depth: 0},
  {ancestor: 7, descendant: 7, depth: 0},
  {ancestor: 9999, descendant: 9999, depth: 0},

  // top->child
  {ancestor: 0, descendant: 4, depth: 1},
  {ancestor: 0, descendant: 5, depth: 1},
  {ancestor: 0, descendant: 9999, depth: 1},

  // top->grandChild
  {ancestor: 0, descendant: 6, depth: 2},
  {ancestor: 0, descendant: 7, depth: 3},

  // child->grandChild
  {ancestor: 4, descendant: 6, depth: 1},
  
  // grandChild->grandChild
  {ancestor: 6, descendant: 7, depth: 1}
];

export default DIRS;
