import filesReducer from "../filesReducer";
import FILES from "../../mock-files";

describe("filesReducer", () => {

  describe("default", () => {
    it("ファイル一覧が返却される", () => {
      const result = filesReducer(FILES, {});

      const expected = FILES.length;
      expect(result.length).toEqual(expected);
    });
  });

  describe("ADD_FILE", () => {
    it("ファイル追加後の一覧が返却される", () => {
      const result = filesReducer(FILES, {
        type: "ADD_FILE",
        name: "foo.txt"
      });

      const expected = FILES.length + 1;
      expect(result.length).toEqual(expected);
    });

    it("返却された一覧に追加したファイルが含まれている", () => {
      const result = filesReducer(FILES, {
        type: "ADD_FILE",
        name: "foo.txt"
      }).filter(f => f.name === "foo.txt").length;

      const expected = 1;
      expect(result).toEqual(expected);
    });

  });

  describe("ADD_DIR", () => {
    it("ディレクトリ追加後の一覧が返却される", () => {
      const result = filesReducer(FILES, {
        type: "ADD_DIR",
        name: "foo_dir"
      });

      const expected = FILES.length + 1;
      expect(result.length).toEqual(expected);
    });

    it("返却された一覧に追加したディレクトリが含まれている", () => {
      const result = filesReducer(FILES, {
        type: "ADD_DIR",
        name: "foo_dir"
      }).filter(f => f.name === "foo_dir").length;

      const expected = 1;
      expect(result).toEqual(expected);
    });

  });

  describe("DELETE_FILE", () => {

    it("削除後の一覧が返却される", () => {
      const deletedFile = FILES[FILES.length - 1];
      const result = filesReducer(FILES, {
        type: "DELETE_FILE",
        file: deletedFile
      }).length;

      const expected = FILES.length - 1;
      expect(result).toEqual(expected);
    });

  });

  describe("EDIT_FILE", () => {

    it("ファイル名編集後が含まれた一覧が返却される", () => {
      const editedFile = FILES[FILES.length - 1];
      editedFile.name = "change_name";

      const result = filesReducer(FILES, {
        type: "EDIT_FILE",
        file: editedFile
      });

      const expected = result[result.length - 1];
      expect(editedFile).toEqual(expected);
    });

  });

  describe("SORT_FILE", () => {
    let files;

    beforeEach( () => {
      files = [{id: 1, name: "a"}, {id: 2, name: "b"}];      
    });

    it("名前昇順でソートされた結果が返却される", () => {
      const result = filesReducer(files, {
        type: "SORT_FILE",
        desc: true,
        sorted: "name"
      });
      
      const expected = files[files.length - 1];
      expect(result[result.length - 1]).toEqual(expected);
    });

    it("名前降順でソートされた結果が返却される", () => {
      const result = filesReducer(files, {
        type: "SORT_FILE",
        desc: false,
        sorted: "name"
      });

      const expected = files[0];
      expect(result[result.length - 1]).toEqual(expected);
    });
    
  });

  describe("MOVE_FILE", () => {

    it("移動後のファイル一覧が返却される", () => {

      const files = [
        {id: 1, name: "a", dir_id: 1},
        {id: 2, name: "b", dir_id: 2},
        {id: 3, name: "c", dir_id: 3}
      ];

      const result = filesReducer(files, {
        type: "MOVE_FILE",
        file_id: 3,
        dir_id: 1
      });

      expect(result[result.length - 1].dir_id).toEqual(1);
    });

  });

  describe("TOGGLE_STAR", () => {

    it("スターをonにしたファイル一覧が返却される", () => {
      const files = [
        {id: 1, name: "a", is_star: false}
      ];

      const result = filesReducer(files, {
        type: "TOGGLE_STAR",
        file_id: 1
      });

      expect(result[0].is_star).toEqual(true);
    });

    it("スターをoffにしたファイル一覧が返却される", () => {
      const files = [
        {id: 1, name: "a", is_star: true}
      ];

      const result = filesReducer(files, {
        type: "TOGGLE_STAR",
        file_id: 1
      });

      expect(result[0].is_star).toEqual(false);

    });

  });

});
