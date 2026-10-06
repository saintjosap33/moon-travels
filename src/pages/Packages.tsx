import React, { useEffect, useState } from 'react';
import { getPackages, createPackage, updatePackage, deletePackage } from 'zitejs/api';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Package {
  id: string;
  packageName: string;
  packageType: string;
  durationDays: number;
  basePrice: number;
  isActive: boolean;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    packageName: '',
    description: '',
    durationDays: 1,
    basePrice: 0,
    packageType: 'adventure',
    difficultyLevel: 'easy',
    isActive: true,
    maxParticipants: 10,
    minParticipants: 2,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const { records } = await getPackages({});
      setPackages(records as Package[]);
    } catch (error) {
      console.error('Error loading packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePackage({
          id: editingId,
          ...formData,
        });
        toast.success('Package updated successfully');
      } else {
        await createPackage(formData);
        toast.success('Package created successfully');
      }
      resetForm();
      loadPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package');
    }
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      packageName: pkg.packageName,
      description: '',
      durationDays: pkg.durationDays,
      basePrice: pkg.basePrice,
      packageType: pkg.packageType,
      difficultyLevel: 'easy',
      isActive: pkg.isActive,
      maxParticipants: 10,
      minParticipants: 2,
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage({ id });
        toast.success('Package deleted successfully');
        loadPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
        toast.error('Failed to delete package');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      packageName: '',
      description: '',
      durationDays: 1,
      basePrice: 0,
      packageType: 'adventure',
      difficultyLevel: 'easy',
      isActive: true,
      maxParticipants: 10,
      minParticipants: 2,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Travel Packages</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Package
        </button>
      </div>

      {showForm && (
        <div className="dashboard-card mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'New'} Package</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Package Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.packageName}
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Package Type *</label>
              <select
                className="form-select"
                value={formData.packageType}
                onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
              >
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="beach">Beach</option>
                <option value="pilgrimage">Pilgrimage</option>
                <option value="honeymoon">Honeymoon</option>
                <option value="family">Family</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (Days) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Base Price (₹) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                className="form-select"
                value={formData.difficultyLevel}
                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Min Participants</label>
              <input
                type="number"
                className="form-input"
                value={formData.minParticipants}
                onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Participants</label>
              <input
                type="number"
                className="form-input"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="col-span-full flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'} Package
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
          {packages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No packages found</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Base Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="font-medium">{pkg.packageName}</td>
                      <td>{pkg.packageType}</td>
                      <td>{pkg.durationDays} days</td>
                      <td className="font-semibold">₹{pkg.basePrice.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${pkg.isActive ? 'badge-success' : 'badge-warning'}`}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="text-primary hover:text-primary/80"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
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
