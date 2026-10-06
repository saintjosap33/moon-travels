import React from 'react';

export default function ViewsIndexes() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Views & Indexes</h1>

      <div className="space-y-6">
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Database Views</h2>
          <p className="text-sm text-muted-foreground mb-4">Virtual tables created from queries for simplified data access</p>

          <div className="space-y-4">
            <div className="border border-border rounded p-4">
              <h3 className="font-semibold mb-2">View: BOOKING_SUMMARY</h3>
              <div className="bg-muted p-3 rounded font-mono text-xs mb-2 overflow-x-auto">
                <pre>{`SELECT 
  b.BookingID,
  b.BookingReference,
  c.FirstName || ' ' || c.LastName AS CustomerName,
  p.PackageName,
  b.TravelStartDate,
  b.PassengerCount,
  b.TotalPrice,
  COALESCE(SUM(pay.Amount), 0) AS TotalPaid,
  b.TotalPrice - COALESCE(SUM(pay.Amount), 0) AS Outstanding,
  b.BookingStatus
FROM Bookings b
JOIN Customers c ON b.CustomerID = c.CustomerID
JOIN TravelPackages p ON b.PackageID = p.PackageID
LEFT JOIN Payments pay ON b.BookingID = pay.BookingID
GROUP BY b.BookingID, c.CustomerID, p.PackageID`}</pre>
              </div>
              <p className="text-sm text-muted-foreground">Purpose: Shows complete booking status with payment information</p>
            </div>

            <div className="border border-border rounded p-4">
              <h3 className="font-semibold mb-2">View: MONTHLY_REVENUE</h3>
              <div className="bg-muted p-3 rounded font-mono text-xs mb-2 overflow-x-auto">
                <pre>{`SELECT 
  DATE_TRUNC('month', pay.PaymentDate) AS Month,
  COUNT(DISTINCT b.BookingID) AS BookingCount,
  COUNT(DISTINCT c.CustomerID) AS UniqueCustomers,
  SUM(pay.Amount) AS TotalRevenue,
  AVG(pay.Amount) AS AvgPaymentAmount
FROM Payments pay
JOIN Bookings b ON pay.BookingID = b.BookingID
JOIN Customers c ON b.CustomerID = c.CustomerID
GROUP BY DATE_TRUNC('month', pay.PaymentDate)
ORDER BY Month DESC`}</pre>
              </div>
              <p className="text-sm text-muted-foreground">Purpose: Financial reporting and trend analysis</p>
            </div>

            <div className="border border-border rounded p-4">
              <h3 className="font-semibold mb-2">View: CUSTOMER_BOOKING_HISTORY</h3>
              <div className="bg-muted p-3 rounded font-mono text-xs mb-2 overflow-x-auto">
                <pre>{`SELECT 
  c.CustomerID,
  c.FirstName || ' ' || c.LastName AS CustomerName,
  COUNT(b.BookingID) AS TotalBookings,
  SUM(b.TotalPrice) AS TotalSpent,
  AVG(r.Rating) AS AvgRating,
  MAX(b.TravelStartDate) AS LastTravelDate
FROM Customers c
LEFT JOIN Bookings b ON c.CustomerID = b.CustomerID
LEFT JOIN Reviews r ON c.CustomerID = r.CustomerID
GROUP BY c.CustomerID
ORDER BY TotalSpent DESC`}</pre>
              </div>
              <p className="text-sm text-muted-foreground">Purpose: Customer analytics and VIP identification</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Database Indexes</h2>
          <p className="text-sm text-muted-foreground mb-4">Indexes improve query performance by enabling faster data retrieval</p>

          <div className="space-y-2">
            <div className="border-l-4 border-primary pl-4 py-2">
              <p className="font-semibold text-sm">Primary Key Indexes (Automatic)</p>
              <p className="text-xs text-muted-foreground">CustomerID, BookingID, PaymentID, PackageID, DestinationID, etc.</p>
            </div>

            <div className="border-l-4 border-secondary pl-4 py-2">
              <p className="font-semibold text-sm">Foreign Key Indexes</p>
              <p className="text-xs text-muted-foreground">Bookings.CustomerID, Bookings.PackageID, Payments.BookingID</p>
            </div>

            <div className="border-l-4 border-accent pl-4 py-2">
              <p className="font-semibold text-sm">Search Indexes</p>
              <p className="text-xs text-muted-foreground">Customers.Email, Bookings.BookingReference, Payments.PaymentReference</p>
            </div>

            <div className="border-l-4 border-green-600 pl-4 py-2">
              <p className="font-semibold text-sm">Date Indexes</p>
              <p className="text-xs text-muted-foreground">Bookings.TravelStartDate, Payments.PaymentDate</p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <p className="font-semibold text-sm">Status Indexes</p>
              <p className="text-xs text-muted-foreground">Bookings.BookingStatus, Payments.PaymentStatus</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded">
            <p className="text-sm font-semibold mb-2">Index Strategy for Moon Travels:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Indexes on foreign keys for JOIN operations</li>
              <li>• Indexes on frequently searched fields (email, reference numbers)</li>
              <li>• Indexes on date fields for range queries</li>
              <li>• Composite indexes on commonly filtered combinations</li>
              <li>• Regular index maintenance and optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
