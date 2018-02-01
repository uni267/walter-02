import * as moment from "moment";

export const createFileName = (file,pattern) => {
  let rep = [];
  // 置換用文字列を生成(meta_info)
  for(var idx in file.meta_infos){
    rep[`{${file.meta_infos[idx]._id}}`] = file.meta_infos[idx].value;
  }

  // 置換用文字列を生成(拡張子)
  const _name = file.name.split(".");
  rep["{extension}"] = "." + _name[_name.length - 1];

  // ファイル名生成
  const replaced = pattern.replace(/(\{.*?\})/g, (str) => {
    let _str = str.match(/{(.*?):(.*?)}/);
    if(_str === null ){
      // フォーマット文字列なし
      return rep[str] === undefined ? "" : rep[str];
    }else{
      // フォーマット文字列あり
      const ret = rep[`{${_str[1]}}`];
      if(ret === undefined) return "";
      return moment(ret).isValid() ? moment(ret).format(_str[2]) : ret;
    }
  });


  return replaced === rep["{extension}"] ? file.name : replaced;　// 拡張子以外未定義の場合は元のファイル名を返す
};
