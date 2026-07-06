
import kafka from "../config/kafka.js";

const producer = kafka.producer();

let isConnected = false;

// ✅ Retry connection logic
export const connectProducer = async () => {
  if (isConnected) return true;

  try {
    await producer.connect();
    isConnected = true;
    console.log("✅ Kafka Producer Connected");
    return true;
  } catch (err) {
    console.error("❌ Kafka Producer:", err.message);
    return false;
  }
};
// ✅ Send message safely
export const sendMessage = async (topic, message) => {
  const connected = await connectProducer();

  if (!connected) {
    console.log("⚠ Kafka unavailable. Skipping message.");
    return;
  }

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};