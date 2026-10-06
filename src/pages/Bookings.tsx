import React, { useEffect, useState } from 'react';
import { getBookings, getCustomers, getPackages, createBooking, updateBooking, deleteBooking } from 'zitejs/api';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, Users } from 'lucide-react';

interface Booking {
  id: string;
  bookingReference: string;
  customer: any;
  package: any;
  bookingDate: string;
  travelStartDate: string;
  passengerCount: number;
  totalPrice: number;
  bookingStatus: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bookingReference: `BK-${Date.now()}`,
    customer: '',
    package: '',
    bookingDate: new Date().toISOString().split('T')[0],
    travelStartDate: '',
    passengerCount: 1,
    totalPrice: 0,
    bookingStatus: 'pending',
    specialNotes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsResult, customersResult, packagesResult] = await Promise.all([
        getBookings({}),
        getCustomers({}),
        getPackages({}),
      ]);
      setBookings(bookingsResult.records as Booking[]);
      setCustomers(customersResult.records);
      setPackages(packagesResult.records);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find((p) => p.id === packageId);
    if (selectedPackage) {
      setFormData({
        ...formData,
        package: packageId,
        totalPrice: selectedPackage.basePrice * formData.passengerCount,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        customer: formData.customer,
        package: formData.package,
      };

      if (editingId) {
        await updateBooking({
          id: editingId,
          ...submitData,
        });
        toast.success('Booking updated successfully');
      } else {
        await createBooking(submitData);
        toast.success('Booking created successfully');
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Failed to save booking');
    }
  };

  const handleEdit = (booking: Booking) => {
    setFormData({
      bookingReference: booking.bookingReference,
      customer: booking.customer?.id || '',
      package: booking.package?.id || '',
      bookingDate: booking.bookingDate,
      travelStartDate: booking.travelStartDate,
      passengerCount: booking.passengerCount,
      totalPrice: booking.totalPrice,
      bookingStatus: booking.bookingStatus,
      specialNotes: '',
    });
    setEditingId(booking.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking({ id });
        toast.success('Booking deleted successfully');
        loadData();
      } catch (error) {
        console.error('Error deleting booking:', error);
        toast.error('Failed to delete booking');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      bookingReference: `BK-${Date.now()}`,
      customer: '',
      package: '',
      bookingDate: new Date().toISOString().split('T')[0],
      travelStartDate: '',
      passengerCount: 1,
      totalPrice: 0,
      bookingStatus: 'pending',
      specialNotes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getCustomerName = (customer: any) => {
    if (typeof customer === 'object' && customer?.firstName) {
      return `${customer.firstName} ${customer.lastName}`;
    }
    return 'N/A';
  };

  const getPackageName = (pkg: any) => {
    if (typeof pkg === 'object' && pkg?.packageName) {
      return pkg.packageName;
    }
    return 'N/A';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          New Booking
        </button>
      </div>

      {showForm && (
        <div className="dashboard-card mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'New'} Booking</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Booking Reference</label>
              <input
                type="text"
                className="form-input"
                value={formData.bookingReference}
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select
                className="form-select"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Package *</label>
              <select
                className="form-select"
                value={formData.package}
                onChange={(e) => handlePackageChange(e.target.value)}
                required
              >
                <option value="">Select a package</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.packageName} (₹{p.basePrice})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Booking Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Travel Start Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.travelStartDate}
                onChange={(e) => setFormData({ ...formData, travelStartDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Passenger Count *</label>
              <input
                type="number"
                className="form-input"
                value={formData.passengerCount}
                onChange={(e) => {
                  const count = parseInt(e.target.value);
                  const selectedPackage = packages.find((p) => p.id === formData.package);
                  const price = selectedPackage ? selectedPackage.basePrice * count : 0;
                  setFormData({ ...formData, passengerCount: count, totalPrice: price });
                }}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Price (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.totalPrice}
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.bookingStatus}
                onChange={(e) => setFormData({ ...formData, bookingStatus: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Special Notes</label>
              <textarea
                className="form-textarea"
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                rows={2}
              />
            </div>
            <div className="col-span-full flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'} Booking
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
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No bookings found</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Package</th>
                    <th>Travel Date</th>
                    <th>Passengers</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="font-mono text-sm">{booking.bookingReference}</td>
                      <td>{getCustomerName(booking.customer)}</td>
                      <td>{getPackageName(booking.package)}</td>
                      <td>{booking.travelStartDate}</td>
                      <td className="text-center">{booking.passengerCount}</td>
                      <td className="font-semibold">₹{booking.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${booking.bookingStatus === 'confirmed' ? 'success' : booking.bookingStatus === 'pending' ? 'warning' : 'primary'}`}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="text-primary hover:text-primary/80"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
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
