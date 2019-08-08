import mongoose from "mongoose";
import initDb from "../batches/tasks/initDatabase";
import addTenant from "../batches/tasks/addTenant";

import { MongoMemoryServer } from 'mongodb-memory-server';

import User from "../models/User";
import Tenant from "../models/Tenant";
import AppSetting from "../models/AppSetting";
import RoleFile from "../models/RoleFile";
import Group from "../models/Group";


let mongoServer;
let mongoUri;

// (async () => {
//   mongoServer = new MongoMemoryServer();
//   mongoUri = await mongoServer.getConnectionString();
// })();

// export const getConnectionString = () => {
//   return mongoUri
// }


export const connect = async (tenant_name) => {
  mongoServer = new MongoMemoryServer();
  mongoUri = await mongoServer.getConnectionString();
  const opts = { useNewUrlParser: true };
  //const mongoUri = getConnectionString()
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) { console.error(err); }
  });
  await initDb()
  await addTenant(tenant_name)

  // 初期データを返却
  const initData = {}
  initData.tenant = (await Tenant.findOne({ name: tenant_name })).toObject()
  initData.user = (await User.findOne({ account_name: `${tenant_name}1` })).toObject()
  initData.appSettings = (await AppSetting.find({ tenant_id: initData.tenant._id }))
  initData.roleFile = (await RoleFile.find({ tenant_id: initData.tenant._id }))
  initData.roleFileFull = initData.roleFile.filter(role => role.name === 'フルコントロール')[0].toObject()
  initData.roleFileReadonly = initData.roleFile.filter(role => role.name === '読み取りのみ')[0].toObject()
  initData.group = (await Group.find({ tenant_id: initData.tenant._id }))
  initData.groupMgr = initData.group.filter(role => role.name === '管理者')[0].toObject()
  initData.groupNorm = initData.group.filter(role => role.name === '全社')[0].toObject()
  return initData
}

export const disconnect = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}