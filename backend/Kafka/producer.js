
// import kafka from "../config/kafka.js";

// const producer = kafka.producer();

// let isConnected = false;

// export const connectProducer = async () => {
//   try {
//     if (!isConnected) {
//       await producer.connect();
//       isConnected = true;
//       console.log("✅ Kafka Producer Connected");
//     }
//   } catch (err) {
//     console.error("❌ Kafka Producer Error:", err.message);
//   }
// };

// export const sendMessage = async (topic, message) => {
//   try {
//     if (!isConnected) {
//       await connectProducer();
//     }

//     await producer.send({
//       topic: topic, // ✅ use dynamic topic
//       messages: [
//         {
//           value: JSON.stringify({
//             orderId: message.orderId,
//             userName: message.userName,
//             products: message.products,
//             totalAmount: message.totalAmount,
//           }),
//         },
//       ],
//     });

//     console.log("📤 Message sent to Kafka:", message);
//   } catch (err) {
//     console.error("❌ Kafka Send Error:", err.message);
//   }
// };
import kafka from "../config/kafka.js";

const producer = kafka.producer();

let isConnected = false;

// ✅ Retry connection logic
export const connectProducer = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      await producer.connect();
      isConnected = true;
      console.log("✅ Kafka Producer Connected");
      return;
    } catch (err) {
      console.error("❌ Kafka connect failed, retrying...", err.message);
      retries--;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  console.error("❌ Kafka connection failed after retries");
};

// ✅ Send message safely
export const sendMessage = async (topic, message) => {
  try {
    if (!isConnected) {
      await connectProducer();
    }

    if (!isConnected) {
      console.error("❌ Producer not connected. Message skipped.");
      return;
    }

    await producer.send({
      topic: topic,
      messages: [
        {
          value: JSON.stringify({
            orderId: message.orderId,
            userName: message.userName,
            products: message.products,
            totalAmount: message.totalAmount,
          }),
        },
      ],
    });

    console.log("📤 Message sent to Kafka:", message);
  } catch (err) {
    console.error("❌ Kafka Send Error:", err.message);
    isConnected = false; // 🔥 force reconnect next time
  }
};