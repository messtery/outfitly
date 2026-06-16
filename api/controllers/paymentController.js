import { Xendit } from 'xendit-node';
import Order from '../models/order.js';
import Customer from '../models/customer.js';

const xendit = new Xendit({ secretKey: process.env.XENDIT_KEY });

export const checkPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const order = await Order.findOne({ where: { id, customerId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.invoiceId) {
      return res.status(400).json({ message: 'No invoice associated with this order' });
    }

    if (order.paymentStatus === 'paid') {
      return res.json({ data: { paymentStatus: 'paid', invoiceUrl: order.invoiceUrl } });
    }

    const invoice = await xendit.Invoice.getInvoiceById({ invoiceId: order.invoiceId });

    let newStatus = order.paymentStatus;
    if (invoice.status === 'PAID' || invoice.status === 'SETTLED') {
      newStatus = 'paid';
    } else if (invoice.status === 'EXPIRED') {
      newStatus = 'failed';
    }

    if (newStatus !== order.paymentStatus) {
      await order.update({ paymentStatus: newStatus });
    }

    res.json({ data: { paymentStatus: newStatus, invoiceUrl: order.invoiceUrl } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to check payment status' });
  }
};
