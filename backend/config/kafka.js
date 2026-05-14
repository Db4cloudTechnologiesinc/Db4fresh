import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "db4fresh-app",
  brokers: ["localhost:9092"],
  retry: {
  initialRetryTime: 300,
  retries: 10
}
});

export default kafka;