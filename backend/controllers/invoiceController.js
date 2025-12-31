import PDFDocument from "pdfkit";
import db from "../config/db.js";

export const generateInvoice = (req, res) => {
  const orderId = req.params.id;

  const orderSql = `
    SELECT o.*, a.*
    FROM orders o
    JOIN order_addresses a ON o.id = a.order_id
    WHERE o.id = ?
  `;

  const itemsSql = `
    SELECT * FROM order_items WHERE order_id = ?
  `;

  db.query(orderSql, [orderId], (err, orderResult) => {
    if (err || orderResult.length === 0)
      return res.status(404).json({ message: "Order not found" });

    db.query(itemsSql, [orderId], (err, items) => {
      if (err) return res.status(500).json(err);

      const order = orderResult[0];
      const doc = new PDFDocument({ margin: 50 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${orderId}.pdf`
      );

      doc.pipe(res);

      doc.fontSize(20).text("DB4FRESH INVOICE", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Order ID: ${orderId}`);
      doc.text(`Order Date: ${order.created_at}`);
      doc.text(`Payment: ${order.payment_type} (${order.payment_status})`);
      doc.moveDown();

      doc.text("Delivery Address:");
      doc.text(`${order.name}`);
      doc.text(`${order.phone}`);
      doc.text(
        `${order.address_line1}, ${order.address_line2}, ${order.city}`
      );
      doc.text(`${order.state} - ${order.pincode}`);
      doc.moveDown();

      doc.text("Items:");
      let total = 0;

      items.forEach((item) => {
        const price = item.price * item.qty;
        total += price;
        doc.text(
          `${item.product_name} × ${item.qty}  -  ₹${price}`
        );
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: ₹${total}`, {
        align: "right",
      });

      doc.end();
    });
  });
};
