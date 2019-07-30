"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/files"));

var tsController = _interopRequireWildcard(require("../controllers/timestamps"));

var router = (0, _express.Router)(); // ファイル一覧

router.get("/", controller.index); // ファイルダウンロード

router.get("/download", controller.download); // ファイル検索

router.route("/search").get(controller.search); // ファイル検索項目一覧

router.route("/search_items").get(controller.searchItems); // 詳細検索

router.route("/search_detail").post(controller.searchDetail); // ファイルアップロード

router.post("/", controller.upload);
router.route("/:file_id").get(controller.view) // ファイル詳細
["delete"](controller.moveTrash); // ゴミ箱へ移動
// ファイルを上書きするかのチェック

router.route("/exists").post(controller.exists); // ファイルプレビュー取得

router.route("/:file_id/preview_exists").get(controller.previewExists); // ゴミ箱から戻す

router.route("/:file_id/restore").patch(controller.restore); // ゴミ箱から削除

router.route("/:file_id/delete")["delete"](controller.deleteFileLogical); // 完全削除。
// router.route("/:file_id/deletePhysical").delete(controller.deleteFilePhysical);
// ファイル名変更

router.route("/:file_id/rename").patch(controller.rename); // ファイル移動

router.route("/:file_id/move").patch(controller.move); // タグの追加

router.route("/:file_id/tags").post(controller.addTag); // タグの削除

router.route("/:file_id/tags/:tag_id")["delete"](controller.removeTag); // メタ情報の追加

router.route("/:file_id/meta").post(controller.addMeta); // メタ情報の削除

router.route("/:file_id/meta/:meta_id")["delete"](controller.removeMeta); // ロールの追加

router.route("/:file_id/authorities").post(controller.addAuthority); // ロールの削除

router.route("/:file_id/authorities")["delete"](controller.removeAuthority); // お気に入りのトグル

router.route("/:file_id/toggle_star").patch(controller.toggleStar); // 非表示状態のトグル

router.route("/:file_id/toggle_unvisible").patch(controller.toggleUnvisible); // タイムスタンプトークン付与

router.route("/:file_id/timestamp/grant").post(tsController.grantToken); // タイムスタンプトークン検証

router.route("/:file_id/timestamp/verify").post(tsController.verifyToken); // タイムスタンプトークンダウンロード

router.route("/timestamp/download").get(tsController.downloadToken); // ディレクトリ下のタイムスタンプトークン自動付与

router.route("/:file_id/timestamp/auto_grant").post(tsController.enableAutoGrantToken)["delete"](tsController.disableAutoGrantToken);
var _default = router;
exports["default"] = _default;