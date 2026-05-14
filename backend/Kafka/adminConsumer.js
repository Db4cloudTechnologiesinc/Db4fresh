
// import kafka from "../config/kafka.js";
// import { sendNotification } from "../server.js"; // ✅ IMPORTANT

// const consumer = kafka.consumer({ groupId: "admin-group" });

// const runAdminConsumer = async () => {
//   try {
//     await consumer.connect();
//     await consumer.subscribe({ topic: "order-topic", fromBeginning: false });

//     console.log("🧑‍💼 Admin Consumer Running...");

//     await consumer.run({
//       eachMessage: async ({ message }) => {
//         const data = JSON.parse(message.value.toString());

//         console.log("📢 ADMIN NOTIFICATION:", data);

//         /* ================= 🔔 SEND TO ADMIN PANEL ================= */
//         // sendNotification({
//         //   type: "NEW_ORDER",
//         //   message: `🛒 New Order Received`,
//         //   orderId: data.orderId || "N/A",
//         //   user: data.user || "Customer",
//         //   time: new Date().toLocaleTimeString(),
//         // });
//         sendNotification({
//   type: "NEW_ORDER",
//   message: `🛒 Order #${data.orderId}`,
//   orderId: data.orderId,
//   user: data.userName || "Customer",
//   products: data.products || [],
//   total: data.totalAmount || 0,
//   time: new Date().toLocaleTimeString(),
// });
//       },
//     });
//   } catch (err) {
//     console.error("❌ Admin Consumer Error:", err.message);
//   }
// };

// export default runAdminConsumer;
import kafka from "../config/kafka.js";
import { sendNotification } from "../server.js";

const consumer = kafka.consumer({ groupId: "admin-group" });

const runAdminConsumer = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      await consumer.connect();

      await consumer.subscribe({
        topic: "order-topic", // ⚠️ make sure this matches producer
        fromBeginning: false,
      });

      console.log("🧑‍💼 Admin Consumer Running...");

      await consumer.run({
        eachMessage: async ({ message }) => {
          const data = JSON.parse(message.value.toString());

          console.log("📢 ADMIN NOTIFICATION:", data);

          sendNotification({
            type: "NEW_ORDER",
            message: `🛒 Order #${data.orderId}`,
            orderId: data.orderId,
            user: data.userName || "Customer",
            products: data.products || [],
            total: data.totalAmount || 0,
            time: new Date().toLocaleTimeString(),
          });
        },
      });

      return; // success
    } catch (err) {
      console.error("❌ Consumer error, retrying...", err.message);
      retries--;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  console.error("❌ Consumer failed after retries");
};

export default runAdminConsumer;