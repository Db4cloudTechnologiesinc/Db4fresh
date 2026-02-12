import PDFDocument from "pdfkit";

export const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${order.orderId}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("Db4Fresh Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12)
    .text(`Order ID: ${order.orderId}`)
    .text(`Order Date: ${new Date(order.orderDate).toLocaleString()}`)
    .text(`Payment Method: ${order.paymentMethod}`);

  doc.moveDown();

  doc.fontSize(14).text("Delivery Address", { underline: true });
  doc.fontSize(12)
    .text(order.customer.name || "")
    .text(order.deliveryAddress.house || "")
    .text(
      `${order.deliveryAddress.street || ""}, ${order.deliveryAddress.area || ""}`
    )
    .text(
      `${order.deliveryAddress.city || ""} - ${order.deliveryAddress.pincode || ""}`
    );

  doc.moveDown();

  doc.fontSize(14).text("Items", { underline: true });
  order.items.forEach((item, i) => {
    doc.text(
      `${i + 1}. ${item.name}  | Qty: ${item.qty}  | ₹${item.price}`
    );
  });

  doc.moveDown();

  doc.fontSize(14).text("Bill Summary", { underline: true });
  doc.text(`Items Total: ₹${order.bill.itemTotal}`);
  doc.text(`Delivery Fee: ₹${order.bill.deliveryFee}`);
  doc.text(`GST: ₹${order.bill.gst}`);
  doc
    .font("Helvetica-Bold")
    .text(`Grand Total: ₹${order.bill.grandTotal}`);

  doc.end();
};
