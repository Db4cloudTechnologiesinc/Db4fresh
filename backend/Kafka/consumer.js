lihi/loytfi7
import kafka from "../config/kafka.js";
import pool from "../config/db.js";

const consumer = kafka.consumer({ groupId: "order-group" });

const startConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "order-topic",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const connection = await pool.getConnection();

      try {
        const order = JSON.parse(message.value.toString());

        console.log("✅ Received Order:", order);

        await connection.beginTransaction();

        // ✅ INSERT INTO ORDERS TABLE
        const [orderResult] = await connection.query(
          `INSERT INTO orders
          (user_id, total_amount, payment_method,
           payment_status, order_status, address)
          VALUES (?, ?, ?, ?, 'PLACED', ?)`,
          [
            order.userId,
            order.totalAmount,
            order.paymentMethod,
            order.paymentStatus,
            order.address,
          ]
        );

        const orderId = orderResult.insertId;

        // ✅ INSERT INTO ORDER_ITEMS
        for (const item of order.items) {
          await connection.query(
            `INSERT INTO order_items
            (order_id, product_id, quantity, price,
             product_name, product_image)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.productId,
              item.quantity,
              item.price,
              item.product_name,
              item.product_image,
            ]
          );
        }

        await connection.commit();

        console.log("✅ Order + Items saved successfully");

      } catch (err) {
        await connection.rollback();
        console.error("❌ Error processing order:", err.message);
      } finally {
        connection.release();
      }
    },
  });
};

export default startConsumer;