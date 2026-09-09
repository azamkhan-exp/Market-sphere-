export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  /**
   * Dispatch email (or log safely in dev)
   */
  static async send(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`📧 [MarketSphere Email] Sent to: ${payload.to} | Subject: "${payload.subject}"`);
    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    };
  }

  static async sendOrderConfirmation(params: any): Promise<any> {
    const html = this.getOrderConfirmationHtml({
      orderNumber: params.orderNumber,
      customerName: params.customerName,
      totalAmount: params.total ?? params.totalAmount ?? 0,
      itemsSummary: params.items?.map((i: any) => `${i.quantity}x ${i.title}`).join(", ") || "Ordered items",
    });
    return this.send({
      to: params.to,
      subject: `Order Confirmation #${params.orderNumber} | MarketSphere`,
      html,
    });
  }

  private static wrapper(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: #0f172a; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">MARKETSPHERE</h1>
              <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Official Multi-Vendor Marketplace</p>
            </div>
            <div style="padding: 32px 24px;">
              ${content}
            </div>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;">MarketSphere Inc. • 100 Innovation Blvd, Seattle, WA</p>
              <p style="margin: 4px 0 0 0;">Secure Shopping • Buyer Protection Guarantee</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static getWelcomeHtml(name: string): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Welcome to MarketSphere, ${name}! 🎉</h2>
      <p style="color: #334155; line-height: 1.6;">Thank you for creating an account with MarketSphere. You now have access to verified independent brands, fast shipping, and transparent customer reviews.</p>
      <div style="margin: 24px 0; text-align: center;">
        <a href="http://localhost:3000/search" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Start Exploring &rarr;</a>
      </div>
    `);
  }

  static getEmailVerificationHtml(name: string, verificationUrl: string): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Verify Your Email Address</h2>
      <p style="color: #334155; line-height: 1.6;">Hi ${name}, please confirm your email address by clicking the verification button below:</p>
      <div style="margin: 24px 0; text-align: center;">
        <a href="${verificationUrl}" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Verify Email</a>
      </div>
      <p style="color: #64748b; font-size: 12px;">If you didn't create this account, you can safely ignore this email.</p>
    `);
  }

  static getPasswordResetHtml(name: string, resetUrl: string): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Reset Your Password</h2>
      <p style="color: #334155; line-height: 1.6;">Hi ${name}, a request was received to reset your MarketSphere account password. Click below to choose a new password:</p>
      <div style="margin: 24px 0; text-align: center;">
        <a href="${resetUrl}" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 12px;">This link will expire in 60 minutes for security purposes.</p>
    `);
  }

  static getOrderConfirmationHtml(params: {
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    itemsSummary: string;
  }): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Order Confirmed! 📦</h2>
      <p style="color: #334155;">Hi <strong>${params.customerName}</strong>,</p>
      <p style="color: #334155; line-height: 1.6;">Your order <strong>#${params.orderNumber}</strong> has been received and confirmed. Our verified merchants are preparing your package for dispatch.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a;">Summary</h4>
        <p style="color: #475569; margin: 0; font-size: 13px;">${params.itemsSummary}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
        <p style="font-size: 16px; font-weight: bold; color: #0f172a; margin: 0;">Total Paid: $${params.totalAmount.toFixed(2)}</p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <a href="http://localhost:3000/orders/${params.orderNumber}/track" style="background: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">Track Package &rarr;</a>
      </div>
    `);
  }

  static getPaymentConfirmationHtml(params: {
    orderNumber: string;
    amount: number;
    paymentMethod: string;
  }): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Payment Receipt</h2>
      <p style="color: #334155;">We have successfully processed your payment of <strong>$${params.amount.toFixed(2)}</strong> for order <strong>#${params.orderNumber}</strong>.</p>
      <p style="color: #64748b; font-size: 13px;">Method: ${params.paymentMethod} • Status: Succeeded</p>
    `);
  }

  static getShippingConfirmationHtml(params: {
    orderNumber: string;
    carrier: string;
    trackingNumber: string;
    estimatedDelivery?: string;
  }): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Your Package is on the Way! 🚚</h2>
      <p style="color: #334155;">Order <strong>#${params.orderNumber}</strong> has been handed over to <strong>${params.carrier}</strong>.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 16px 0;">
        <p style="margin: 0; font-size: 13px; color: #64748b;">Tracking ID:</p>
        <p style="margin: 4px 0 0 0; font-family: monospace; font-size: 15px; font-weight: bold; color: #0f172a;">${params.trackingNumber}</p>
        ${params.estimatedDelivery ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #4f46e5;">Estimated Delivery: <strong>${params.estimatedDelivery}</strong></p>` : ""}
      </div>
    `);
  }

  static getDeliveryConfirmationHtml(params: { orderNumber: string }): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Delivered! 🎉</h2>
      <p style="color: #334155;">Your order <strong>#${params.orderNumber}</strong> has been successfully delivered to your shipping address.</p>
      <p style="color: #334155;">We hope you enjoy your purchase! Please consider leaving a verified review to help other shoppers.</p>
    `);
  }

  static getRefundConfirmationHtml(params: {
    orderNumber: string;
    amount: number;
    reason: string;
  }): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Refund Processed 💳</h2>
      <p style="color: #334155;">A refund of <strong>$${params.amount.toFixed(2)}</strong> for order <strong>#${params.orderNumber}</strong> has been credited to your original payment method.</p>
      <p style="color: #64748b; font-size: 13px;">Reason: ${params.reason}</p>
    `);
  }

  static getSellerApprovalHtml(storeName: string): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Merchant Application Approved! 🚀</h2>
      <p style="color: #334155;">Congratulations! Your store <strong>${storeName}</strong> has been approved by MarketSphere Platform Compliance.</p>
      <p style="color: #334155;">You can now access your Vendor Management Hub to list products, manage inventory, and fulfill customer orders.</p>
      <div style="margin: 24px 0; text-align: center;">
        <a href="http://localhost:3000/seller/dashboard" style="background: #f59e0b; color: #090d16; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Open Vendor Hub &rarr;</a>
      </div>
    `);
  }

  static getSellerRejectionHtml(storeName: string, reason: string): string {
    return this.wrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">Merchant Verification Update</h2>
      <p style="color: #334155;">Regarding your application for store <strong>${storeName}</strong>: compliance review could not verify your business documentation.</p>
      <div style="background: #fef2f2; padding: 16px; border-radius: 12px; border: 1px solid #fee2e2; margin: 16px 0;">
        <p style="color: #991b1b; margin: 0; font-size: 13px;"><strong>Compliance Note:</strong> ${reason}</p>
      </div>
      <p style="color: #64748b; font-size: 13px;">You may re-submit updated documentation in your vendor profile settings.</p>
    `);
  }

  static getLowStockAlertHtml(storeName: string, productTitle: string, currentStock: number, threshold: number): string {
    return this.wrapper(`
      <h2 style="color: #991b1b; margin-top: 0;">⚠️ Low-Stock Alert for ${storeName}</h2>
      <p style="color: #334155;">Your product <strong>"${productTitle}"</strong> has dropped below your safety threshold.</p>
      <div style="background: #fffbeb; padding: 16px; border-radius: 12px; border: 1px solid #fef3c7; margin: 16px 0;">
        <p style="margin: 0; font-size: 14px; font-weight: bold; color: #92400e;">Remaining Units: ${currentStock} (Threshold: ${threshold})</p>
      </div>
      <p style="color: #334155;">Please replenish inventory to prevent stockouts and preserve your product search rank.</p>
    `);
  }
}
