// app/api/orders/[id]/generate-receipt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import { order, orderItem, orderAddress, product } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { validateOrderAccess } from "@/lib/orders/security";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import crypto from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = id;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Validate order access
    const accessValidation = await validateOrderAccess(orderId, null);
    if (!accessValidation.allowed) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // ========== FETCH ORDER DATA USING EXPLICIT QUERIES ==========

    // 1. Get main order data
    const [orderData] = await dbServer
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderData) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // 2. Get order items with product details (like the working API)
    const orderItems = await dbServer
      .select({
        id: orderItem.id,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        price: orderItem.price,
        attributes: orderItem.attributes,
        product: {
          name: product.name,
          brand: product.brand,
          sku: product.sku,
        },
      })
      .from(orderItem)
      .innerJoin(product, eq(orderItem.productId, product.id))
      .where(eq(orderItem.orderId, orderId));

    // 3. Get order addresses (like the working API)
    const orderAddresses = await dbServer
      .select()
      .from(orderAddress)
      .where(eq(orderAddress.orderId, orderId));

    // 4. Find shipping address specifically
    const [shippingAddress] = await dbServer
      .select()
      .from(orderAddress)
      .where(
        and(
          eq(orderAddress.orderId, orderId),
          eq(orderAddress.type, "shipping")
        )
      )
      .limit(1);

    // ========== PDF GENERATION ==========

    // Generate unique verification code
    const verificationCode = crypto
      .randomBytes(8)
      .toString("hex")
      .toUpperCase();

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Helper function to draw text
    const drawText = (
      text: string,
      x: number,
      y: number,
      size: number = 10,
      isBold: boolean = false,
      color: [number, number, number] = [0, 0, 0]
    ) => {
      page.drawText(text, {
        x,
        y: height - y,
        size,
        font: isBold ? fontBold : font,
        color: rgb(color[0], color[1], color[2]),
      });
    };

    // Helper function to draw line
    const drawLine = (
      y: number,
      startX: number = 50,
      endX: number = width - 50
    ) => {
      page.drawLine({
        start: { x: startX, y: height - y },
        end: { x: endX, y: height - y },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      });
    };

    // ========== HEADER SECTION ==========
    // Company header with background
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: rgb(0.9, 0.9, 0.9),
    });

    drawText("zetuTech", width / 2 - 45, 60, 22, true, [0.2, 0.4, 0.8]);
    drawText(
      "Your Trusted Technology Partner",
      width / 2 - 85,
      85,
      10,
      false,
      [0.4, 0.4, 0.4]
    );
    drawText(
      "+255 123 456 789 • support@zetutech.co.tz",
      width / 2 - 120,
      100,
      8,
      false,
      [0.4, 0.4, 0.4]
    );

    // Receipt title
    drawText("ORDER INVOICE", width / 2 - 50, 140, 16, true);

    let yPosition = 170;

    // ========== ORDER & CUSTOMER INFORMATION ==========
    // Left column - Order Details
    drawText("ORDER INFORMATION", 50, yPosition, 12, true);
    drawText(`Order #: ${orderData.orderNumber}`, 50, yPosition + 20, 10);
    drawText(
      `Date: ${new Date(orderData.createdAt).toLocaleDateString("en-TZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      50,
      yPosition + 35,
      10
    );
    drawText(
      `Status: ${orderData.status.toUpperCase()}`,
      50,
      yPosition + 50,
      10
    );
    drawText(
      `Payment: ${formatPaymentMethod(orderData.paymentMethod)}`,
      50,
      yPosition + 65,
      10
    );
    drawText(
      `Delivery: ${formatDeliveryMethod(orderData.deliveryMethod)}`,
      50,
      yPosition + 80,
      10
    );

    if (
      orderData.agentLocation &&
      orderData.deliveryMethod === "agent_pickup"
    ) {
      drawText(`Pickup: ${orderData.agentLocation}`, 50, yPosition + 95, 10);
    }

    // Right column - Customer Information
    drawText("CUSTOMER INFORMATION", 300, yPosition, 12, true);

    if (shippingAddress) {
      // Use address from orderAddresses table
      drawText(`Name: ${shippingAddress.fullName}`, 300, yPosition + 20, 10);
      drawText(`Phone: ${shippingAddress.phone}`, 300, yPosition + 35, 10);
      if (shippingAddress.email) {
        drawText(`Email: ${shippingAddress.email}`, 300, yPosition + 50, 10);
      }
      drawText(`Region: ${shippingAddress.region}`, 300, yPosition + 65, 10);
      if (shippingAddress.address) {
        drawText(
          `Address: ${shippingAddress.address}`,
          300,
          yPosition + 80,
          10
        );
      }
      if (shippingAddress.city) {
        drawText(`City: ${shippingAddress.city}`, 300, yPosition + 95, 10);
      }
    } else {
      // Fallback to order table contact info
      drawText(`Phone: ${orderData.customerPhone}`, 300, yPosition + 20, 10);
      if (orderData.customerEmail) {
        drawText(`Email: ${orderData.customerEmail}`, 300, yPosition + 35, 10);
      }
      // Use first address if available
      const firstAddress = orderAddresses[0];
      drawText(
        `Region: ${firstAddress?.region || "Not specified"}`,
        300,
        yPosition + 50,
        10
      );
    }

    yPosition += 120;
    drawLine(yPosition);
    yPosition += 20;

    // ========== ORDER ITEMS SECTION ==========
    drawText("ORDER ITEMS", 50, yPosition, 14, true);
    yPosition += 25;

    // Table header
    page.drawRectangle({
      x: 50,
      y: height - yPosition - 20,
      width: width - 100,
      height: 20,
      color: rgb(0.95, 0.95, 0.95),
    });

    drawText("PRODUCT", 55, yPosition, 10, true);
    drawText("QTY", 350, yPosition, 10, true);
    drawText("PRICE", 400, yPosition, 10, true);
    drawText("TOTAL", 500, yPosition, 10, true);

    yPosition += 25;

    // Items list
    orderItems.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > 650) {
        page = pdfDoc.addPage([600, 800]);
        yPosition = 50;

        // Add table header on new page
        page.drawRectangle({
          x: 50,
          y: height - yPosition - 20,
          width: width - 100,
          height: 20,
          color: rgb(0.95, 0.95, 0.95),
        });
        drawText("PRODUCT", 55, yPosition, 10, true);
        drawText("QTY", 350, yPosition, 10, true);
        drawText("PRICE", 400, yPosition, 10, true);
        drawText("TOTAL", 500, yPosition, 10, true);
        yPosition += 25;
      }

      const itemPrice = parseFloat(item.price);
      const itemTotal = itemPrice * item.quantity;
      const productName = item.product?.name || "Product";
      const productBrand = item.product?.brand
        ? ` - ${item.product.brand}`
        : "";

      // Alternate row background
      if (index % 2 === 0) {
        page.drawRectangle({
          x: 50,
          y: height - yPosition - 15,
          width: width - 100,
          height: 15,
          color: rgb(0.98, 0.98, 0.98),
        });
      }

      drawText(`${productName}${productBrand}`, 55, yPosition, 9);
      drawText(item.quantity.toString(), 350, yPosition, 9);
      drawText(formatCurrency(itemPrice), 400, yPosition, 9);
      drawText(formatCurrency(itemTotal), 500, yPosition, 9);
      yPosition += 15;
    });

    yPosition += 20;
    drawLine(yPosition);
    yPosition += 25;

    // ========== ORDER SUMMARY SECTION ==========
    drawText("ORDER SUMMARY", 50, yPosition, 14, true);
    yPosition += 25;

    const subtotal = parseFloat(orderData.subtotal);
    const shipping = parseFloat(orderData.shippingAmount);
    const tax = parseFloat(orderData.taxAmount);
    const discount = parseFloat(orderData.discountAmount || "0");
    const total = parseFloat(orderData.totalAmount);

    // Summary items
    const summaryItems = [
      { label: "Subtotal:", amount: subtotal },
      ...(discount > 0 ? [{ label: "Discount:", amount: -discount }] : []),
      { label: "Shipping:", amount: shipping },
      { label: "Tax:", amount: tax },
    ];

    summaryItems.forEach((item) => {
      drawText(item.label, 400, yPosition, 10);
      drawText(
        formatCurrency(Math.abs(item.amount)),
        500,
        yPosition,
        10,
        false,
        item.amount < 0 ? [0.8, 0.2, 0.2] : [0, 0, 0]
      );
      yPosition += 15;
    });

    // Total line
    drawLine(yPosition);
    yPosition += 10;

    drawText("TOTAL AMOUNT:", 400, yPosition, 12, true);
    drawText(formatCurrency(total), 500, yPosition, 12, true, [0.2, 0.4, 0.8]);
    yPosition += 25;

    // ========== DELIVERY INSTRUCTIONS ==========
    if (orderData.agentInstructions) {
      drawText("DELIVERY INSTRUCTIONS", 50, yPosition, 12, true);
      yPosition += 20;

      const instructions = orderData.agentInstructions;
      const maxWidth = 80;
      const instructionLines: string[] = [];

      // Simple text wrapping
      for (let i = 0; i < instructions.length; i += maxWidth) {
        instructionLines.push(instructions.substring(i, i + maxWidth));
      }

      instructionLines.forEach((line, index) => {
        if (yPosition > 750) {
          page = pdfDoc.addPage([600, 800]);
          yPosition = 50;
        }
        drawText(line, 50, yPosition + index * 12, 9);
      });

      yPosition += instructionLines.length * 12 + 20;
    }

    // ========== VERIFICATION SECTION ==========
    drawText(
      "INVOICE VERIFICATION",
      width / 2 - 65,
      yPosition,
      12,
      true,
      [0.2, 0.4, 0.8]
    );
    yPosition += 20;

    page.drawRectangle({
      x: 50,
      y: height - yPosition - 30,
      width: width - 100,
      height: 30,
      color: rgb(0.97, 0.97, 0.97),
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });

    drawText(
      `Invoice Code: ${verificationCode}`,
      60,
      yPosition + 10,
      10,
      true
    );
    drawText(
      `Verify at: https://zetuTech.co.tz/verify/${verificationCode}`,
      60,
      yPosition + 25,
      8
    );
    yPosition += 50;

    // ========== FOOTER SECTION ==========
    drawLine(yPosition);
    yPosition += 20;

    const footerNotes = [
      "Thank you for choosing zetuTech",
      "• We will contact you within 24 hours to confirm pickup/delivery details",
      "• Please bring your ID and order number when collecting your items",
      "• For any questions, contact: +255 123 456 789 or support@zetutech.co.tz",
      `• Receipt generated on: ${new Date().toLocaleDateString("en-TZ")}`,
    ];

    footerNotes.forEach((note, index) => {
      if (yPosition > 780) {
        page = pdfDoc.addPage([600, 800]);
        yPosition = 50;
      }
      drawText(note, 50, yPosition + index * 12, index === 0 ? 10 : 8);
    });

    // ========== UPLOAD TO R2 ==========
    const pdfBytes = await pdfDoc.save();
    const fileName = `invoices/${orderData.orderNumber}-${verificationCode}.pdf`;

    // Get presigned URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://zetutech.vercel.app";
    const formattedBaseUrl = baseUrl.includes("://")
      ? baseUrl
      : `https://${baseUrl}`;

    const presignResponse = await fetch(`${formattedBaseUrl}/api/r2-presign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: fileName,
        contentType: "application/pdf",
      }),
    });

    if (!presignResponse.ok) {
      throw new Error(`Failed to get upload URL: ${presignResponse.status}`);
    }

    const { uploadUrl, publicUrl } = await presignResponse.json();

    if (!uploadUrl) {
      throw new Error("No upload URL received from presign endpoint");
    }

    const pdfBuffer = Buffer.from(pdfBytes);

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/pdf",
      },
      body: pdfBuffer, // Use Blob instead of Uint8Array
    });


    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.text();
      throw new Error(
        `Failed to upload PDF to R2: ${(uploadResponse.status, uploadError)}`
      );
    }


    // Store verification code and PDF URL in database
    await dbServer
      .update(order)
      .set({
        verificationCode,
        pdfFile: publicUrl,
      })
      .where(eq(order.id, orderId));

    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${verificationCode}`;

    return NextResponse.json({
      success: true,
      message: "Invoice generated successfully",
      verifyLink,
      verificationCode,
      receiptUrl: publicUrl,
    });
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to generate receipt: ${(err as Error).message}`,
      },
      { status: 500 }
    );
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatPaymentMethod(method: string): string {
  const methods: { [key: string]: string } = {
    cash_delivery: "Cash on Delivery",
    mpesa: "M-Pesa",
    card: "Credit/Debit Card",
    bank_transfer: "Bank Transfer",
  };
  return methods[method] || method.replace("_", " ").toUpperCase();
}

function formatDeliveryMethod(method: string): string {
  const methods: { [key: string]: string } = {
    direct_delivery: "Direct Delivery",
    agent_pickup: "Agent Pickup",
  };
  return methods[method] || method.replace("_", " ").toUpperCase();
}
