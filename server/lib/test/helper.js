import * as fs from "fs";
import Tenant from "../models/Tenant";
import User from "../models/Tenant";

export const loadResourceFile = name => {
  return fs.readFileSync("./lib/test/resources/" + name);
}

export const sleep = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export const getUser = async (tenant_name, account_name) => {
  const tenant = await Tenant.findOne({
    name: tenant_name
  })
  const user = await User.findOne({
    tenant_id: tenant.id.toString(),
    account_name
  })
  return user
}

export const getUUID = ()=>{
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}