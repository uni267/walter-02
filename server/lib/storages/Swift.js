import fs from "fs";
import pkgcloud from "pkgcloud";
import crypto from "crypto";
import stream from "stream";

import { STORAGE_CONF } from "../../configs/server";
import * as constants from "../../configs/constants";

class Swift {
  constructor(params) {
    // const { tenant_name } = params;

    // if (tenant_name === undefined ||
    //     tenant_name === null ||
    //     tenant_name === "") throw "params.tenant_name not defined";

    // this.tenant_name = tenant_name;

    const mode = process.env.NODE_ENV;
    let config;

    switch (mode) {
    default:
      config = STORAGE_CONF.development;
      break;
    }

    if (config === undefined || config === null) {
      throw "NODE_ENV in 'development' or 'integration' or 'production'??";
    }

    this.client = pkgcloud.storage.createClient(config);
  }

  getContainers() {
    return new Promise( (resolve, reject) => {
      this.client.getContainers( (err, containers) => {
        if (err) return reject(err);
        return resolve(containers);
      });
    });
  }

  getFiles(container_name) {
    return new Promise( (resolve, reject) => {
      this.client.getFiles(container_name, (err, files) => {
        if (err) reject(err);
        resolve(files);
      });
    });
  }

  getFile(container_name, file_name) {
    return new Promise( (resolve, reject) => {
      this.client.getFile(container_name, file_name, (err, file) => {
        if (err) reject(err);
        resolve(file);
      });
    });
  }

  downloadFile(container_name, file) {
    return new Promise( (resolve, reject) => {
      const stream = fs.createWriteStream("/tmp/stream.tmp");

      if(file.is_crypted){
        const decipher = crypto.createDecipher("aes-256-cbc", constants.CRYPTO_PASSWORD);
        this.client.download({
          container: container_name,
          remote: file._id.toString()
        }, (err, result) => {
          if (err) reject(err);
        }).pipe(decipher).pipe(stream).on("finish", () => resolve(stream) );
      }else{
        this.client.download({
          container: container_name,
          remote: file._id.toString()
        }, (err, result) => {
          if (err) reject(err);
        }).pipe(stream).on("finish", () => resolve(stream) );
      }
    }).then( writeStream => {
      return new Promise( (resolve, reject) => {
        resolve(fs.createReadStream(writeStream.path));
      });
    });
  }

  upload(srcFilePath, dstFileName) {

    return new Promise( (resolve, reject) => {

      const readStream = new stream.PassThrough();
      readStream.end(srcFilePath);

      const writeStream = this.client.upload({
        container: "walter",
        remote: dstFileName
      });

      writeStream.on("error", err => reject(err) );
      writeStream.on("success", file => resolve(file) );
      if(constants.USE_CRYPTO){
        const cipher = crypto.createCipher("aes-256-cbc", constants.CRYPTO_PASSWORD);
        readStream.pipe(cipher).pipe(writeStream);
      }else{
        readStream.pipe(writeStream);
      }


    });
  }

  remove(container_name, file){
    return new Promise( (resolve, reject) => {
      this.client.removeFile(
        container_name,
        file._id.toString(),
        (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
    });
  }

  exportFile(container_name, file , exportDir){
    return new Promise( (resolve, reject) => {
      const stream = fs.createWriteStream(exportDir);
      let downloadFile = {};

      if(file.is_crypted){
        const decipher = crypto.createDecipher("aes-256-cbc", constants.CRYPTO_PASSWORD);

        this.client.download({
          container: container_name,
          remote: file._id.toString()
        }, (err, result) => {
          if (err) reject(err);
          downloadFile = result;
        }).pipe(decipher).pipe(stream).on("finish", () => resolve(downloadFile) );
      }else{
        this.client.download({
          container: container_name,
          remote: file._id.toString()
        }, (err, result) => {
          if (err) reject(err);
          downloadFile = result;
        }).pipe(stream).on("finish", () => resolve(downloadFile) );
      }

    });
  }

}

export { Swift };
