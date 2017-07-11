import accountReducer from "../accountReducer";

describe("accountReducer", () => {
  
  describe("TOGGLE_ACCOUNT", () => {
    it("openがfalseからtrueにトグルされる", () => {
      const account = { open: false };
      const result = accountReducer(account, { type: "TOGGLE_ACCOUNT" });
      expect(result.open).toEqual(true);
    });

    it("openがtrueからfalseにトグルされる", () => {
      const account = { open: true };
      const result = accountReducer(account, { type: "TOGGLE_ACCOUNT" });
      expect(result.open).toEqual(false);
    });
  });

});
