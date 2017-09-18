import fs from "fs";
import pkgcloud from "pkgcloud";

import { STORAGE_CONF } from "../../configs/server";

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

  upload(srcFilePath, dstFileName) {
    console.log(srcFilePath, dstFileName);

    return new Promise( (resolve, reject) => {
      const readStream = fs.createReadStream(srcFilePath);
      console.log(readStream);

      const writeStream = this.client.upload({
        container: "walter",
        remote: dstFileName
      });

      writeStream.on("error", err => reject(err) );
      writeStream.on("success", file => resolve(file) );
      readStream.pipe(writeStream);

    });
  }
}

export { Swift };
