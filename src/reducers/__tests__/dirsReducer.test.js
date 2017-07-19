import dirsReducer from "../dirsReducer";
import DIRS from "../../mock-dirs";

describe("dirsReducer", () => {

  describe("default", () => {

    it("test", () => {
      const newDir = {
        id: 99,
        name: "test dir",
        dir_id: 0
      };

      const result = dirsReducer(DIRS, {
        type: "ADD_DIR_TREE",
        dir: newDir
      });

      const expected = dirsReducer(DIRS, {}).children.length + 1;

      expect(result.children.length).toEqual(expected);
    });

  });

});
