import { BaseConsumer } from "@jiaul.islam/common.ticketing.dev"

import { ConsumerGlobalAndTopicConfig } from "@confluentinc/kafka-javascript/types/kafkajs";


class TicketConsumer extends BaseConsumer {
    protected config: ConsumerGlobalAndTopicConfig;
    public topic: string;

    constructor(config: ConsumerGlobalAndTopicConfig, topic: string) {
        super();
        this.config = config;
        this.topic = topic;
    }

    // set the consumer's group ID, offset and initialize it
    // config["group.id"] = "nodejs-group-1";
    // config["auto.offset.reset"] = "earliest";
    async consumeTicketEvents() {
        await this.consume(this.topic, this.config);
    }
}