import kafka from "../config/kafka.js";
import { sendNotification } from "../server.js";

const consumer = kafka.consumer({ groupId: "payment-group" });

const runPaymentConsumer = async () => {
  try {
    await consumer.connect();

    await consumer.subscribe({
      topic: "payment-topic",
      fromBeginning: false,
    });

    console.log("💳 Payment Consumer Running...");

    await consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());

        console.log("💰 Payment Event:", data);

        // 🔔 Notify admin
        sendNotification({
          type: "PAYMENT_SUCCESS",
          message: `💳 Payment received for Order #${data.orderId}`,
          amount: data.amount,
          time: new Date().toLocaleTimeString(),
        });

        // 👉 Later: update DB here
      },
    });
  } catch (err) {
    console.error("❌ Payment Consumer Error:", err.message);
  }
};

export default runPaymentConsumer;