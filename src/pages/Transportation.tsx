import React, { useEffect, useState } from 'react';
import { getTransportation, createTransportation, updateTransportation, deleteTransportation } from 'zitejs/api';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Transportation {
  id: string;
  transportType: string;
  providerName: string;
  fromLocation: string;
  toLocation: string;
  pricePerPerson: number;
}

export default function Transportation() {
  const [transports, setTransports] = useState<Transportation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    transportType: '',
    providerName: '',
    fromLocation: '',
    toLocation: '',
    pricePerPerson: 0,
    capacity: 0,
    class: 'economy',
    journeyDuration: '0:00',
  });

  useEffect(() => {
    loadTransportation();
  }, []);

  const loadTransportation = async () => {
    try {
      setLoading(true);
      const { records } = await getTransportation({});
      setTransports(records as Transportation[]);
    } catch (error) {
      console.error('Error loading transportation:', error);
      toast.error('Failed to load transportation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTransportation({
          id: editingId,
          ...formData,
        });
        toast.success('Transportation updated successfully');
      } else {
        await createTransportation(formData);
        toast.success('Transportation created successfully');
      }
      resetForm();
      loadTransportation();
    } catch (error) {
      console.error('Error saving transportation:', error);
      toast.error('Failed to save transportation');
    }
  };

  const handleEdit = (transport: Transportation) => {
    setFormData({
      transportType: transport.transportType,
      providerName: transport.providerName,
      fromLocation: transport.fromLocation,
      toLocation: transport.toLocation,
      pricePerPerson: transport.pricePerPerson,
      capacity: 0,
      class: 'economy',
      journeyDuration: '0:00',
    });
    setEditingId(transport.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transportation?')) {
      try {
        await deleteTransportation({ id });
        toast.success('Transportation deleted successfully');
        loadTransportation();
      } catch (error) {
        console.error('Error deleting transportation:', error);
        toast.error('Failed to delete transportation');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      transportType: '',
      providerName: '',
      fromLocation: '',
      toLocation: '',
      pricePerPerson: 0,
      capacity: 0,
      class: 'economy',
      journeyDuration: '0:00',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Transportation</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Transportation
        </button>
      </div>

      {showForm && (
        <div className="dashboard-card mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'New'} Transportation</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Transport Type *</label>
              <input
                type="text"
                className="form-input"
                value={formData.transportType}
                onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                placeholder="e.g., Flight, Train, Bus"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Provider Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.providerName}
                onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">From Location *</label>
              <input
                type="text"
                className="form-input"
                value={formData.fromLocation}
                onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">To Location *</label>
              <input
                type="text"
                className="form-input"
                value={formData.toLocation}
                onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price Per Person (₹) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.pricePerPerson}
                onChange={(e) => setFormData({ ...formData, pricePerPerson: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                className="form-input"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Class</label>
              <select
                className="form-select"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Journey Duration</label>
              <input
                type="text"
                className="form-input"
                value={formData.journeyDuration}
                onChange={(e) => setFormData({ ...formData, journeyDuration: e.target.value })}
                placeholder="HH:MM"
              />
            </div>
            <div className="col-span-full flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'} Transportation
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
          {transports.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transportation found</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Provider</th>
                    <th>Route</th>
                    <th>Price/Person</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transports.map((transport) => (
                    <tr key={transport.id}>
                      <td className="font-medium">{transport.transportType}</td>
                      <td>{transport.providerName}</td>
                      <td className="text-sm">{transport.fromLocation} → {transport.toLocation}</td>
                      <td className="font-semibold">₹{transport.pricePerPerson.toLocaleString()}</td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transport)}
                          className="text-primary hover:text-primary/80"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(transport.id)}
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
