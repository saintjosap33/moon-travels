import React, { useEffect, useState } from 'react';
import { getReviews, getCustomers, getPackages, createReview, deleteReview } from 'zitejs/api';
import { toast } from 'sonner';
import { Trash2, Plus, Star } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    package: '',
    rating: 5,
    reviewText: '',
    reviewDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsResult, customersResult, packagesResult] = await Promise.all([
        getReviews({}),
        getCustomers({}),
        getPackages({}),
      ]);
      setReviews(reviewsResult.records);
      setCustomers(customersResult.records);
      setPackages(packagesResult.records);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview(formData);
      toast.success('Review added successfully');
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview({ id });
        toast.success('Review deleted successfully');
        loadData();
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customer: '',
      package: '',
      rating: 5,
      reviewText: '',
      reviewDate: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'fill-secondary text-secondary' : 'text-muted-foreground'}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Review
        </button>
      </div>

      {showForm && (
        <div className="dashboard-card mb-6">
          <h2 className="text-xl font-bold mb-4">New Review</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                required
              >
                <option value="">Select a package</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.packageName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Rating (1-5) *</label>
              <select
                className="form-select"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              >
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Review Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.reviewDate}
                onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Review Text</label>
              <textarea
                className="form-textarea"
                value={formData.reviewText}
                onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                rows={3}
              />
            </div>
            <div className="col-span-full flex gap-2">
              <button type="submit" className="btn btn-primary">
                Submit Review
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
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="dashboard-card">
              <p className="text-muted-foreground text-center py-8">No reviews found</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="dashboard-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{review.customer?.firstName} {review.customer?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{review.package?.packageName}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-destructive hover:text-destructive/80"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mb-2">{renderStars(review.rating)}</div>
                <p className="text-foreground mb-2">{review.reviewText}</p>
                <p className="text-xs text-muted-foreground">{review.reviewDate}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
