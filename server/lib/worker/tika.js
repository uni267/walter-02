import esClient from "../elasticsearchclient";
import tikaClient from "../tikaclient";
import { Swift } from "../storages/Swift";
import File from "../models/File";

export const tika = async ( tenant_name, file_id) => {
  console.log(`tika method start... tenant_name:${tenant_name} file_id:${file_id}`)
  try{
    const fileRecord = await File.findById(file_id);
    if (fileRecord === null) throw new ValidationError( "file is empty" );
    if (fileRecord.is_deleted) throw new ValidationError( "file is deleted" );
  
    // OpenStack Swiftより、ファイルを読み込む
    const swift = new Swift();
    //const downloadFile = yield swift.exportFile(tenant_name, file, tmpFileName);
    //const downloadFile = yield swift.getFile(tenant_name, file_id);
    let buffer = ''
    // const readStream = await swift.downloadFile(tenant_name, fileRecord);
    // readStream.on("data", data => buffer += data );
    // readStream.on("end", async () => {
    //   buffer = Buffer.from(buffer, 'binary')
    //   //const buffer = null
    //   const response_meta_text = await tikaClient.getMetaInfo(buffer)
    //   const response_full_text = await tikaClient.getTextInfo(buffer)
    //   console.log(response_meta_text.text)
    //   const meta_info = JSON.parse(response_meta_text.text)
    //   const meta_text = ''  //meta_info.Content-Type || ''
    //   await esClient.updateTextContents(tenant_name, file_id, meta_text, response_full_text.text)
    // });
  
  
  }catch(e){
    console.log(e)    
  }
}
