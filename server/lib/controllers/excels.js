import fs from "fs";
import { Router } from "express";
import mongoose from "mongoose";
import co from "co";
import Excel from "exceljs";
import {get,find} from "lodash";

import * as filesController from "./files";
import * as displayItemsController from "../controllers/displayItems";


const router = Router();

export const index = (req, res, next) => {
  co(function* () {
    try {

      // TODO: index,search,search_detailの切り分け
      const files = yield filesController.index(req, res, next, true);
      const displayItems = yield displayItemsController.index(req, res, next, true);

      const workbook = new Excel.Workbook();

      // TODO: ファイルのプロパティを設定
      workbook.creator = 'Me';
      workbook.lastModifiedBy = 'Her';
      workbook.created = new Date(1985, 8, 30);
      workbook.modified = new Date();
      workbook.lastPrinted = new Date(2016, 9, 27);

      const worksheet = workbook.addWorksheet('My Sheet');


      const column = [];
      for (let j = 0; j < displayItems.length; j++ ) {
        worksheet.getCell(1, j + 1 ).value = displayItems[j].label;
        if(displayItems[j].meta_info_id === null){
          column[j] = {
            name:displayItems[j].name,
            is_metainfo:false
          };
        }else{
          column[j] = {
            name:displayItems[j].name,
            is_metainfo:true,
            meta_info_id:displayItems[j].meta_info_id
          };
        }
      }

      for (let i = 0; i < files.length; i++){
        const line = i + 2;
        for (let j = 0; j < displayItems.length; j++ ) {
          let value = "";
          if(column[j].is_metainfo){
            const meta = find( files[i].meta_infos ,{_id: column[j].meta_info_id} );
            value =  meta === undefined ? "未定義" : meta.value;
          }else{
            value =  get(files[i], column[j].name);
          }

          worksheet.getCell(line, j + 1 ).value = value;
        }

      }

      //出力
      const stream = fs.createWriteStream("/tmp/stream.tmp");
      yield workbook.xlsx.write(stream);
      fs.createReadStream(stream.path).on("data", data => res.write(data) ).on("end", () => res.end() );

    }
    catch (e) {
      // TODO: エラー処理を追加する
      let errors = {};

      switch (e) {
      default:
        errors.unknown = e;
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};
