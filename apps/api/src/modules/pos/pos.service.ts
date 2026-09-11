import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import type {
  InvoiceDetail,
  CheckoutPayload,
  RefundPayload,
  VoidInvoicePayload,
  DigitalReceiptPayload,
  PaymentRecord,
  RefundRecord,
  DigitalReceiptRecord,
} from '@hive/types';

@Injectable()
export class PosService {
  private invoicesDb = new Map<string, InvoiceDetail>();
  private idempotencyStore = new Map<string, string>(); // idempotencyKey -> invoiceId
  private invoiceSequence = 100;

  constructor() {
    this.seedInitialInvoices();
  }

  private seedInitialInvoices() {
    const seedInvoice: InvoiceDetail = {
      id: 'inv-001',
      organizationId: 'org_hive_demo',
      branchId: 'br-jubilee',
      branchName: 'Jubilee Hills Flagship',
      branchCode: 'HYD-JUB',
      branchAddress: 'Road No. 36, Jubilee Hills, Hyderabad - 500033',
      branchPhone: '+91 40 2355 8899',
      branchGstin: '36AAAAA0000A1Z5',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      appointmentId: 'apt-001',
      invoiceNumber: 'HYD-JUB-2026-000001',
      subtotal: 6800,
      discountTotal: 1020,
      discountType: 'MEMBERSHIP',
      discountReason: 'Platinum Club 15% Tier Discount',
      membershipDiscount: 1020,
      loyaltyRedeemedPoints: 0,
      loyaltyDiscountAmount: 0,
      walletDebitedAmount: 0,
      cgstAmount: 520.2,
      sgstAmount: 520.2,
      taxTotal: 1040.4,
      grandTotal: 6820.4,
      paidAmount: 6820.4,
      balanceAmount: 0,
      status: 'PAID',
      idempotencyKey: 'seed-idemp-001',
      refundedAmount: 0,
      notes: 'Client satisfied with Balayage service.',
      items: [
        {
          id: 'item-1',
          itemType: 'SERVICE',
          itemId: 'srv-2',
          itemName: 'Balayage & Multi-Dimensional Glaze',
          itemCode: 'COLOR-002',
          quantity: 1,
          unitPrice: 6800,
          discount: 1020,
          tax: 1040.4,
          totalPrice: 6820.4,
          staffId: 'st-1',
          staffName: 'Aarav Mehta',
          commissionRate: 15,
        },
      ],
      payments: [
        {
          id: 'pay-1',
          invoiceId: 'inv-001',
          amount: 6820.4,
          paymentMethod: 'UPI',
          transactionReference: 'UPI/UTR/9876123456',
          status: 'SUCCESS',
          isAdvance: false,
          createdAt: new Date().toISOString(),
        },
      ],
      digitalReceipts: [
        {
          id: 'rec-1',
          invoiceId: 'inv-001',
          channel: 'WHATSAPP',
          recipient: '+91 98765 43210',
          status: 'SENT',
          sentAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.invoicesDb.set(seedInvoice.id, seedInvoice);
  }

  /**
   * Concurrency-safe sequential invoice number generator
   * Format: DISTRICT-BRANCH-YEAR-SEQUENCE, e.g. HYD-JUB-2026-000002
   */
  private generateInvoiceNumber(branchCode: string = 'HYD-JUB'): string {
    const year = new Date().getFullYear();
    const seq = String(++this.invoiceSequence).padStart(6, '0');
    return `${branchCode}-${year}-${seq}`;
  }

  /**
   * List all invoices with optional branch/status filters
   */
  async getInvoices(
    organizationId: string,
    filters: { branchId?: string; status?: string; search?: string } = {}
  ): Promise<InvoiceDetail[]> {
    const list = Array.from(this.invoicesDb.values()).filter(
      (inv) => inv.organizationId === organizationId
    );

    return list.filter((inv) => {
      if (filters.branchId && filters.branchId !== 'all' && inv.branchId !== filters.branchId) {
        return false;
      }
      if (filters.status && filters.status !== 'all' && inv.status !== filters.status) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
        const matchCust = inv.customerName?.toLowerCase().includes(q) || inv.customerPhone?.includes(q);
        if (!matchNum && !matchCust) return false;
      }
      return true;
    });
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(organizationId: string, id: string): Promise<InvoiceDetail> {
    const invoice = this.invoicesDb.get(id);
    if (!invoice || invoice.organizationId !== organizationId) {
      throw new NotFoundException(`Invoice with ID "${id}" not found.`);
    }
    return invoice;
  }

  /**
   * Execute Transactional POS Checkout
   */
  async checkout(organizationId: string, payload: CheckoutPayload): Promise<InvoiceDetail> {
    // 1. Idempotency Check
    if (payload.idempotencyKey) {
      const existingId = this.idempotencyStore.get(payload.idempotencyKey);
      if (existingId && this.invoicesDb.has(existingId)) {
        return this.invoicesDb.get(existingId)!;
      }
    }

    // 2. Validate Cart Items
    if (!payload.items || payload.items.length === 0) {
      throw new BadRequestException('Cannot checkout an empty cart.');
    }

    // 3. Compute Financial Totals
    const subtotal = payload.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const manualDiscount = Number(payload.discountTotal) || 0;
    const membershipDiscount = Number(payload.membershipDiscount) || 0;
    const loyaltyDiscount = Number(payload.loyaltyDiscountAmount) || 0;
    const walletDebited = Number(payload.walletDebitedAmount) || 0;

    const totalDiscounts = manualDiscount + membershipDiscount + loyaltyDiscount + walletDebited;
    const discountedSubtotal = Math.max(0, subtotal - totalDiscounts);

    // 18% GST (9% CGST + 9% SGST)
    const taxTotal = Math.round(discountedSubtotal * 0.18 * 100) / 100;
    const cgstAmount = Math.round((taxTotal / 2) * 100) / 100;
    const sgstAmount = cgstAmount;
    const grandTotal = Math.round((discountedSubtotal + taxTotal) * 100) / 100;

    // 4. Validate Split Payments
    const totalPaymentsReceived = payload.payments.reduce((acc, p) => acc + Number(p.amount), 0);
    const tolerance = 0.05; // 5 paise floating point tolerance

    if (Math.abs(totalPaymentsReceived - grandTotal) > tolerance) {
      throw new BadRequestException(
        `Payment total (₹${totalPaymentsReceived}) must exactly match invoice grand total (₹${grandTotal}). Remaining: ₹${grandTotal - totalPaymentsReceived}`
      );
    }

    // 5. Build Invoice Document
    const id = `inv-${Date.now()}`;
    const invoiceNumber = this.generateInvoiceNumber('HYD-JUB');

    const paymentRecords: PaymentRecord[] = payload.payments.map((p, idx) => ({
      id: `pay-${id}-${idx}`,
      invoiceId: id,
      amount: Number(p.amount),
      paymentMethod: p.method,
      transactionReference: p.transactionReference || `REF-${Date.now()}-${idx}`,
      status: 'SUCCESS',
      isAdvance: false,
      createdAt: new Date().toISOString(),
    }));

    const digitalReceipts: DigitalReceiptRecord[] = [
      {
        id: `rec-${id}-wa`,
        invoiceId: id,
        channel: 'WHATSAPP',
        recipient: payload.customerPhone || '+91 98765 43210',
        status: 'QUEUED',
        sentAt: new Date().toISOString(),
      },
    ];

    const invoiceDoc: InvoiceDetail = {
      id,
      organizationId,
      branchId: payload.branchId,
      branchName: payload.branchId === 'br-jubilee' ? 'Jubilee Hills Flagship' : 'Banjara Hills Premium',
      branchCode: 'HYD-JUB',
      branchAddress: 'Road No. 36, Jubilee Hills, Hyderabad - 500033',
      branchPhone: '+91 40 2355 8899',
      branchGstin: '36AAAAA0000A1Z5',
      customerId: payload.customerId || null,
      customerName: payload.customerName || 'Walk-in Guest',
      customerPhone: payload.customerPhone || null,
      appointmentId: payload.appointmentId || null,
      invoiceNumber,
      subtotal,
      discountTotal: manualDiscount,
      discountType: payload.discountType || null,
      discountReason: payload.discountReason || null,
      membershipDiscount,
      loyaltyRedeemedPoints: payload.loyaltyRedeemedPoints || 0,
      loyaltyDiscountAmount: loyaltyDiscount,
      walletDebitedAmount: walletDebited,
      cgstAmount,
      sgstAmount,
      taxTotal,
      grandTotal,
      paidAmount: grandTotal,
      balanceAmount: 0,
      status: 'PAID',
      idempotencyKey: payload.idempotencyKey || null,
      refundedAmount: 0,
      notes: payload.notes || null,
      items: payload.items,
      payments: paymentRecords,
      digitalReceipts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.invoicesDb.set(id, invoiceDoc);

    if (payload.idempotencyKey) {
      this.idempotencyStore.set(payload.idempotencyKey, id);
    }

    return invoiceDoc;
  }

  /**
   * Process Full or Partial Refund
   */
  async processRefund(
    organizationId: string,
    invoiceId: string,
    payload: RefundPayload,
    processedBy: string = 'Super Admin'
  ): Promise<InvoiceDetail> {
    const invoice = await this.getInvoiceById(organizationId, invoiceId);

    if (invoice.status === 'VOID') {
      throw new BadRequestException('Cannot refund a voided invoice.');
    }

    const currentRefunded = Number(invoice.refundedAmount) || 0;
    const requestedRefund = Number(payload.amount);

    if (currentRefunded + requestedRefund > invoice.grandTotal) {
      throw new BadRequestException(
        `Total refund (₹${currentRefunded + requestedRefund}) exceeds invoice grand total (₹${invoice.grandTotal}). Maximum refundable: ₹${invoice.grandTotal - currentRefunded}`
      );
    }

    const refundRecord: RefundRecord = {
      id: `ref-${Date.now()}`,
      invoiceId,
      amount: requestedRefund,
      reason: payload.reason,
      refundMethod: payload.refundMethod || 'ORIGINAL_PAYMENT',
      processedBy,
      createdAt: new Date().toISOString(),
    };

    if (!invoice.refunds) invoice.refunds = [];
    invoice.refunds.push(refundRecord);

    invoice.refundedAmount = currentRefunded + requestedRefund;
    invoice.refundReason = payload.reason;
    invoice.refundedAt = new Date().toISOString();
    invoice.status = invoice.refundedAmount >= invoice.grandTotal ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    invoice.updatedAt = new Date().toISOString();

    this.invoicesDb.set(invoiceId, invoice);
    return invoice;
  }

  /**
   * Process Authorized Invoice Void
   */
  async voidInvoice(
    organizationId: string,
    invoiceId: string,
    payload: VoidInvoicePayload,
    voidedBy: string = 'Branch Manager'
  ): Promise<InvoiceDetail> {
    const invoice = await this.getInvoiceById(organizationId, invoiceId);

    if (invoice.status === 'VOID') {
      throw new BadRequestException('Invoice is already voided.');
    }

    invoice.status = 'VOID';
    invoice.voidedAt = new Date().toISOString();
    invoice.voidReason = payload.reason;
    invoice.voidedBy = voidedBy;
    invoice.updatedAt = new Date().toISOString();

    this.invoicesDb.set(invoiceId, invoice);
    return invoice;
  }

  /**
   * Queue Async Digital Receipt
   */
  async queueReceipt(
    organizationId: string,
    invoiceId: string,
    payload: DigitalReceiptPayload
  ): Promise<{ success: boolean; queued: string[] }> {
    const invoice = await this.getInvoiceById(organizationId, invoiceId);
    const queuedChannels: string[] = [];

    payload.channels.forEach((ch) => {
      const rec: DigitalReceiptRecord = {
        id: `rec-${Date.now()}-${ch}`,
        invoiceId,
        channel: ch,
        recipient: ch === 'EMAIL' ? payload.recipientEmail || 'client@example.com' : payload.recipientPhone || invoice.customerPhone || '+91 98765 43210',
        status: 'QUEUED',
        sentAt: new Date().toISOString(),
      };
      if (!invoice.digitalReceipts) invoice.digitalReceipts = [];
      invoice.digitalReceipts.push(rec);
      queuedChannels.push(ch);
    });

    this.invoicesDb.set(invoiceId, invoice);
    return { success: true, queued: queuedChannels };
  }
}
