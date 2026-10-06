import React, { useEffect, useState } from 'react';
import { getBookings } from 'zitejs/api';
import { toast } from 'sonner';
import { Printer, Download } from 'lucide-react';

export default function Receipts() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { records } = await getBookings({});
      setBookings(records);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!selectedBooking) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-6">Receipts</h1>
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground mb-4">Select a booking to generate receipt</p>
          <div className="space-y-2">
            {bookings.map((booking) => (
              <button
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="w-full text-left p-3 border border-border rounded hover:bg-muted transition-colors"
              >
                <div className="font-mono text-sm">{booking.bookingReference}</div>
                <div className="text-sm text-muted-foreground">₹{booking.totalPrice?.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Receipt</h1>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn btn-primary flex items-center gap-2 no-print">
            <Printer size={18} />
            Print
          </button>
          <button
            onClick={() => setSelectedBooking(null)}
            className="btn btn-outline no-print"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white p-8 border border-border rounded-lg print-only:border-0">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">MOON TRAVELS</h1>
          <p className="text-muted-foreground">Professional Receipt</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Receipt Number</p>
            <p className="text-lg font-mono">{selectedBooking.bookingReference}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-muted-foreground">Date</p>
            <p className="text-lg">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t border-b border-border py-6 mb-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Customer Details</p>
              <p className="font-medium">
                {selectedBooking.customer?.firstName} {selectedBooking.customer?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{selectedBooking.customer?.email}</p>
              <p className="text-sm text-muted-foreground">{selectedBooking.customer?.phone}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Booking Details</p>
              <p className="text-sm">Package: {selectedBooking.package?.packageName}</p>
              <p className="text-sm">Travel Date: {selectedBooking.travelStartDate}</p>
              <p className="text-sm">Passengers: {selectedBooking.passengerCount}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold">Description</th>
                <th className="text-right py-2 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Booking Amount</td>
                <td className="text-right font-semibold">₹{selectedBooking.totalPrice?.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div></div>
          <div className="text-right">
            <div className="flex justify-end gap-4 mb-2">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-lg">₹{selectedBooking.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-8 pt-8 border-t border-border">
          <p>Thank you for choosing Moon Travels!</p>
          <p>For inquiries, contact us at support@moontravels.com</p>
        </div>
      </div>
    </div>
  );
}
