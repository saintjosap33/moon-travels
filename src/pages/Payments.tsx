import React, { useEffect, useState } from 'react';
import { getPayments, getBookings, createPayment, updatePayment, deletePayment } from 'zitejs/api';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, Printer } from 'lucide-react';

interface Payment {
  id: string;
  paymentReference: string;
  booking: any;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    paymentReference: `PAY-${Date.now()}`,
    booking: '',
    paymentDate: new Date().toISOString().split('T')[0],
    amount: 0,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    transactionReference: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsResult, bookingsResult] = await Promise.all([
        getPayments({}),
        getBookings({}),
      ]);
      setPayments(paymentsResult.records as Payment[]);
      setBookings(bookingsResult.records);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        booking: formData.booking,
      };

      if (editingId) {
        await updatePayment({
          id: editingId,
          ...submitData,
        });
        toast.success('Payment updated successfully');
      } else {
        await createPayment(submitData);
        toast.success('Payment recorded successfully');
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error('Failed to save payment');
    }
  };

  const handleEdit = (payment: Payment) => {
    setFormData({
      paymentReference: payment.paymentReference,
      booking: payment.booking?.id || '',
      paymentDate: payment.paymentDate,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      transactionReference: '',
      notes: '',
    });
    setEditingId(payment.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment({ id });
        toast.success('Payment deleted successfully');
        loadData();
      } catch (error) {
        console.error('Error deleting payment:', error);
        toast.error('Failed to delete payment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      paymentReference: `PAY-${Date.now()}`,
      booking: '',
      paymentDate: new Date().toISOString().split('T')[0],
      amount: 0,
      paymentMethod: 'card',
      paymentStatus: 'completed',
      transactionReference: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getBookingInfo = (booking: any) => {
    if (typeof booking === 'object' && booking?.bookingReference) {
      return booking.bookingReference;
    }
    return 'N/A';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      {showForm && (
        <div className="dashboard-card mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'New'} Payment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Payment Reference</label>
              <input
                type="text"
                className="form-input"
                value={formData.paymentReference}
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="form-label">Booking *</label>
              <select
                className="form-select"
                value={formData.booking}
                onChange={(e) => setFormData({ ...formData, booking: e.target.value })}
                required
              >
                <option value="">Select a booking</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bookingReference} - ₹{b.totalPrice}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="check">Check</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Transaction Reference</label>
              <input
                type="text"
                className="form-input"
                value={formData.transactionReference}
                onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>
            <div className="col-span-full flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Record'} Payment
              </button>
              <button type="button" onClick={resetForm} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="dashboard-card">
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No payments found</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Booking</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="font-mono text-sm">{payment.paymentReference}</td>
                      <td>{getBookingInfo(payment.booking)}</td>
                      <td>{payment.paymentDate}</td>
                      <td className="font-semibold">₹{payment.amount.toLocaleString()}</td>
                      <td className="capitalize">{payment.paymentMethod}</td>
                      <td>
                        <span className={`badge ${payment.paymentStatus === 'completed' ? 'badge-success' : payment.paymentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="text-primary hover:text-primary/80"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="text-destructive hover:text-destructive/80"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
