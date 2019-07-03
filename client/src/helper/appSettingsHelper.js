import * as _ from "lodash";

const appSettingsHelper = {}

appSettingsHelper.getValue = (appSettingArray, name) => {
    if(!appSettingArray || appSettingArray.length === 0 ) return false;
    const result = appSettingsHelper.getItem(appSettingArray, name)
    return result && result.enable === true ? true : false 
}
appSettingsHelper.getDefaultValue = (appSettingArray, name) => {
    if(!appSettingArray || appSettingArray.length === 0 ) return false;
    const result = appSettingsHelper.getItem(appSettingArray, name)
    return result && result.default_value === true ? true : false 
}
appSettingsHelper.getItem = (appSettingArray, name) => {
    if(!appSettingArray || appSettingArray.length === 0 ) return null;
    return _.chain(appSettingArray).filter(obj => obj.name === name).last().value();
}
export default appSettingsHelper;
