import React, { useEffect, useState } from 'react';
import { getAccommodations, createAccommodation, updateAccommodation, deleteAccommodation } from 'zitejs/api';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Accommodation {
  id: string;
  hotelName: string;
  city: string;
  hotelCategory: string;
  pricePerNight: number;
}

export default function Accommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    hotelName: '',
    city: '',
    hotelCategory: '3star',
    pricePerNight: 0,
    totalRooms: 0,
    amenities: [],
    description: '',
  });

  useEffect(() => {
    loadAccommodations();
  }, []);

  const loadAccommodations = async () => {
    try {
      setLoading(true);
      const { records } = await getAccommodations({});
      setAccommodations(records as Accommodation[]);
    } catch (error) {
      console.error('Error loading accommodations:', error);
      toast.error('Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAccommodation({
          id: editingId,
          ...formData,
        });
        toast.success('Accommodation updated successfully');
      } else {
        await createAccommodation(formData);
        toast.success('Accommodation created successfully');
      }
      resetForm();
      loadAccommodations();
    } catch (error) {
      console.error('Error saving accommodation:', error);
      toast.error('Failed to save accommodation');
    }
  };

  const handleEdit = (accommodation: Accommodation) => {
    setFormData({
      hotelName: accommodation.hotelName,
      city: accommodation.city,
      hotelCategory: accommodation.hotelCategory,
      pricePerNight: accommodation.pricePerNight,
      totalRooms: 0,
      amenities: [],
      description: '',
    });
    setEditingId(accommodation.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this accommodation?')) {
      try {
        await deleteAccommodation({ id });
        toast.success('Accommodation deleted successfully');
        loadAccommodations();
      } catch (error) {
        console.error('Error deleting accommodation:', error);
        toast.error('Failed to delete accommodation');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      hotelName: '',
      city: '',
      hotelCategory: '3star',
      pricePerNight: 0,
      totalRooms: 0,
      amenities: [],
      description: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const categoryLabels: Record<string, string> = {
    '1star': '1 Star',
    '2star': '2 Star',
    '3star': '3 Star',
    '4star': '4 Star',
    '5star': '5 Star',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Accommodations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Accommodation
        </button>
      </div>

      {showForm && (
        <div className="dashboard-card mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'New'} Accommodation</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Hotel Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.hotelName}
                onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                className="form-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.hotelCategory}
                onChange={(e) => setFormData({ ...formData, hotelCategory: e.target.value })}
              >
                <option value="1star">1 Star</option>
                <option value="2star">2 Star</option>
                <option value="3star">3 Star</option>
                <option value="4star">4 Star</option>
                <option value="5star">5 Star</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price Per Night (₹) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Rooms</label>
              <input
                type="number"
                className="form-input"
                value={formData.totalRooms}
                onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="col-span-full flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'} Accommodation
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
          {accommodations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No accommodations found</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Hotel Name</th>
                    <th>City</th>
                    <th>Category</th>
                    <th>Price/Night</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accommodations.map((accommodation) => (
                    <tr key={accommodation.id}>
                      <td className="font-medium">{accommodation.hotelName}</td>
                      <td>{accommodation.city}</td>
                      <td>{categoryLabels[accommodation.hotelCategory] || accommodation.hotelCategory}</td>
                      <td className="font-semibold">₹{accommodation.pricePerNight.toLocaleString()}</td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => handleEdit(accommodation)}
                          className="text-primary hover:text-primary/80"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(accommodation.id)}
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
