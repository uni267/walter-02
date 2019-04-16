import analyze from "./analyze";
import initElasticsearch from "./initElasticsearch";
import moveInvisibleFiles from "./moveInvisibleFiles";
import createAdmin from "./createAdmin";
import deleteAdmin from "./deleteAdmin";

import addTenant from "./addTenant";
import initTenantW from "./initTenantW";
import {reCreateElasticCache} from "./initElasticsearch";
import addTimestampSetting from "./addTimestampSetting";

export const AnalyzeTask = () => analyze();

export const initElasticsearchTask = () => initElasticsearch();
export const reCreateElasticCacheTask = () => reCreateElasticCache();

export const moveInvisibleFilesTask = () => moveInvisibleFiles();

export const createAdminTask = () => createAdmin();

export const deleteAdminTask = () => deleteAdmin();

export const addTenantTask = () => addTenant();

export const initTenantWTask = () => initTenantW();

export const addTimestampSettingTask = () => addTimestampSetting();
