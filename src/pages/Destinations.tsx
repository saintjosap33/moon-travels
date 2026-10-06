import React, { useEffect, useState } from 'react';
import { getDestinations, createDestination, updateDestination, deleteDestination } from 'zitejs/api';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Destination {
  id: string;
  destinationName: string;
  country: string;
  region: string;
  bestSeason: string;
}

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    destinationName: '',
    description: '',
    country: '',
    region: '',
    bestSeason: '',
    altitude: 0,
    attractions: '',
  });

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const { records } = await getDestinations({});
      setDestinations(records as Destination[]);
    } catch (error) {
      console.error('Error loading destinations:', error);
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDestination({
          id: editingId,
          ...formData,
        });
        toast.success('Destination updated successfully');
      } else {
        await createDestination(formData);
        toast.success('Destination created successfully');
      }
      resetForm();
      loadDestinations();
    } catch (error) {
      console.error('Error saving destination:', error);
      toast.error('Failed to save destination');
    }
  };

  const handleEdit = (destination: Destination) => {
    setFormData({
      destinationName: destination.destinationName,
      description: '',
      country: destination.country,
      region: destination.region,
      bestSeason: destination.bestSeason,
      altitude: 0,
      attractions: '',
    });
    setEditingId(destination.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      try {
        await deleteDestination({ id });
        toast.success('Destination deleted successfully');
        loadDestinations();
      } catch (error) {
        console.error('Error deleting destination:', error);
        toast.error('Failed to delete destination');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      destinationName: '',
      description: '',
      country: '',
      region: '',
      bestSeason: '',
      altitude: 0,
      attractions: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Destinations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Destination
        </button>
      </div>

      {showForm && (
        <div className="dashboard-card mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'New'} Destination</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Destination Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.destinationName}
                onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Country *</label>
              <input
                type="text"
                className="form-input"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Region</label>
              <input
                type="text"
                className="form-input"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Best Season</label>
              <input
                type="text"
                className="form-input"
                value={formData.bestSeason}
                onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                placeholder="e.g., October-March"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Altitude (meters)</label>
              <input
                type="number"
                className="form-input"
                value={formData.altitude}
                onChange={(e) => setFormData({ ...formData, altitude: parseFloat(e.target.value) })}
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
            <div className="form-group md:col-span-2">
              <label className="form-label">Attractions</label>
              <textarea
                className="form-textarea"
                value={formData.attractions}
                onChange={(e) => setFormData({ ...formData, attractions: e.target.value })}
                rows={2}
              />
            </div>
            <div className="col-span-full flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'} Destination
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
          {destinations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No destinations found</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Region</th>
                    <th>Best Season</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((destination) => (
                    <tr key={destination.id}>
                      <td className="font-medium">{destination.destinationName}</td>
                      <td>{destination.country}</td>
                      <td>{destination.region}</td>
                      <td>{destination.bestSeason}</td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => handleEdit(destination)}
                          className="text-primary hover:text-primary/80"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(destination.id)}
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
