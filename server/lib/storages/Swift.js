import pkgcloud from "pkgcloud";
import { STORAGE_CONF } from "../../configs/server";

export const getClient = () => {
  const mode = process.env.NODE_ENV;
  let config;

  switch (mode) {
  default:
    config = STORAGE_CONF.development;
    break;
  }
  
  return pkgcloud.storage.createClient(config);
};

export const getContainers = (client) => {
  return new Promise( (resolve, reject) => {
    client.getContainers( (err, containers) => {
      if (err) return reject(err);
      return resolve(containers);
    });
  });
};
