import kafka from "../config/kafka.js";
import pool from "../config/db.js";

const consumer = kafka.consumer({
  groupId: "order-group",
});

const startConsumer = async () => {
  try {
    await consumer.connect();

    console.log("✅ Kafka Consumer Connected");

    await consumer.subscribe({
      topic: "order-topic",
      fromBeginning: false,
    });

    console.log("✅ Subscribed to order-topic");

    await consumer.run({
      eachMessage: async ({ message }) => {
        const connection = await pool.getConnection();

        try {
          const order = JSON.parse(
            message.value.toString()
          );

          console.log(
            "📩 Received Order:",
            order
          );

         await connection.query(
  `
  INSERT INTO notifications
  (user_id, title, message, is_read)
  VALUES (?, ?, ?, 0)
  `,
  [
    1,
    "New Order",
    JSON.stringify({
      orderId: order.orderId,
      userId: order.userId,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      address: order.address,
    }),
  ]
);
          console.log(
            "✅ Notification Created"
          );

        } catch (err) {
          console.error(
            "❌ Notification Error:",
            err.message
          );
        } finally {
          connection.release();
        }
      },
    });

  } catch (err) {
    console.error(
      "❌ Consumer Startup Error:",
      err.message
    );
  }
};

export default startConsumer;