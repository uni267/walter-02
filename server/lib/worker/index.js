// worker process のダウン検知
process.on('uncaughtException', err => {
  console.log('uncaughtException => ' + err);
});

import kafka from "kafka-node"
import { getConsumer } from "../kafkaclient";
import { KAFKA_TOPIC_TIKA } from "../configs/constsants";
//import logger from "../logger/worker";
import esClient from "../elasticsearchclient";
import tikaClient from "../tikaclient";


const tika_consumer = getConsumer({
  topic: KAFKA_TOPIC_TIKA, //partition: 0, 
})
tika_consumer.on('message', async message => {
  console.log(message)
  if(message.offset == (message.highWaterOffset -1)){
    //ここに記述
    const response_meta_text = await tikaClient.getMetaInfo(buffer)
    const response_full_text = await tikaClient.getTextInfo(buffer)
    const meta_info = JSON.parse(response_meta_text.text)
    const meta_text = ''  //meta_info.Content-Type || ''
    await esClient.updateTextContents(tenant_id, file_id, meta_text, response_full_text.text)
  }
});
tika_consumer.on('error', err => {
  //
})



// classifyを実行するjob
queue.process("classify", WORKER_CLASSIFY_CONCURRENT, async (job, done) => {
// log fileはgrepで検索できたほうが便利
logger.info("start classify", JSON.stringify(job.data));

try {
    switch(job.data.api){
    case CLASSIFY_QUEUE_RYOHAN:
    await ryohanCreate(job.data);
    break;
    case CLASSIFY_QUEUE_JIHAN:
    await jihanCreate(job.data);
    break;
    default:
    await ryohanCreate(job.data);
    }

    logger.info("classify success", JSON.stringify(job.data));
    done();
} catch(e) {
    logger.error("classify error: ", JSON.stringify(job.data), JSON.stringify(e));
    done(e);
}

});

queue.process("compression", 10, async (job, done) => {
console.log("job: ", job.data)
try {
    await compression(job.data)
} catch (e) {
    console.log(e)
}
done()
})


// kueのwebui apiの口もある
const port = 3999;
kue.app.listen(port);
console.log("kue app start port: ", port);

