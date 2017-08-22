import DIRS from "../mock-dirs";

const dirsReducer = (state = [], action) => {

  const walk = (tree) => {

    let children = state.filter(
      dir => dir.ancestor === tree.id && dir.depth === 1);

    if (children.length === 0) return tree;

    children = children.map(child => {
      return {
        id: child.descendant,
        children: []
      };
    });

    tree.children = children.map(child => walk(child));
    return tree;
  };

  const addDirTree = (parent, dir) => {

    let result = [
      ...state,
      {ancestor: dir.id, descendant: dir.id, depth: 0},
      {ancestor: parent.id, descendant: dir.id, depth: 1}
    ];

    const parentNode = DIRS.filter(
      dir => dir.descendant === parent.id && dir.depth !== 0);

    if (parentNode === 0) return result;

    parentNode.forEach(node => {
      result = [
        ...result,
        {
          ancestor: node.ancestor,
          descendant: dir.id,
          depth: node.depth + 1
        }
      ];
    });

    return result;
  };

  const dirRoute = (dir) => {
    let result = [];

    state.slice()
      .sort( (a, b) => a.depth < b.depth)
      .filter(d => d.descendant === dir.id && d.depth !== 0)
      .forEach(d => {
        result = [...result, { id: d.ancestor }];
        result = [...result, { id: d.descendant }];
      });

    return [
      ...result.filter(r => r.id !== dir.id),
      { id: dir.id }
    ];

  };

  switch (action.type) {
  case "INIT_DIR":
    return action.dirs;
  case "DIR_TREE":
    return walk({ id: 0, children: []});
  case "DIR_ROUTE":
    return dirRoute(action.dir);
  case "ADD_DIR_TREE":
    return addDirTree(action.parent, action.dir);
  case "DELETE_DIR_TREE":
    return state.filter(
      dir => !(dir.ancestor === action.dir.id || dir.descendant === action.dir.id)
    );
  default:
    return state;
  }
};

export default dirsReducer;
