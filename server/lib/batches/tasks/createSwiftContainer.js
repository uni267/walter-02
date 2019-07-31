import { Swift } from "../../storages/Swift";
import * as _ from "lodash";

import util from "util";

// logger
import logger from "../../logger";

const task = async (tenant_name) => {
  try{
    console.log(`creating swift container '${tenant_name}'.....`)

    if (!tenant_name) throw new Error("引数にテナント名を指定する必要があります");

    const swift = new Swift();
    const containers = await swift.getContainers(tenant_name)

    if (containers.filter(c => c.name === tenant_name).length === 0) {
      const container = await swift.createContainer(tenant_name)
    }

    console.log('swift container created.')
  }
  catch (e) {
    console.log(util.inspect(e, false, null));
    logger.error(e);
  }
  finally {
    logger.info("################# createSwiftContainer end #################");
  }

}

export default task;

