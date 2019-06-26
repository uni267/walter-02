/api/upload/reserve post
  - req { filename, mimetype, chunk_size,  ... }
  - res { file_id }
  - reqの各パラメータをmongo.walter.filesに保存。files._idをresとして返す。

/api/upload/{file_id}/{chunk_no} post
  - req { chunked_data }
  - res { status: { success, is_completed }, errors, body { file } }
  - chunked_dataを`/tmp/${file_id}_${chunk_no}.bin`にファイル保存。
  - file_idの一致するmongo.walter.filesのchunk_size分のbinファイルがそろえば結合し、res.status.is_completedにtrueをセット、res.bodyにfilesレコードをセット。
  - ファイルがそろってなければ、res.status.is_completedにfalseをセット、res.bodyはundifined。



## HTTP を用いたmultipartファイル送信方式
	 
「multipart/form-data」にて送る方式
  - RFC2388 で定義
  - 欠点
    - リクエストボディがピュアな JSONではなくなる


JSONにてbase64のchunkを送る方式
  - 特にRFCで定義されているわけではない
  - reqもresもpure json
  - 欠点
    - base64なので、データ容量がかさむ
    - エンコード／デコードのコストがかかる






