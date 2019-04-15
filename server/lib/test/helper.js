import * as fs from "fs";

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