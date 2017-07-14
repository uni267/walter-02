const ROLES = [
  {
    id: 1,
    name: "読み取り専用",
    actions: ["read"]
  },
  {
    id: 2,
    name: "読み取り、編集可能",
    actions: ["read", "write"]
  },
  {
    id: 3,
    name: "フルコントロール",
    actions: ["read", "write", "authority"]
  }
];

export default ROLES;
