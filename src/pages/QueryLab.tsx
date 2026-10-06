import React, { useState } from 'react';

export default function QueryLab() {
  const [selectedQuery, setSelectedQuery] = useState(0);

  const queries = [
    {
      title: 'SELECT - Get all customers',
      description: 'Basic SELECT to retrieve customer information',
      sql: `SELECT 
  CustomerID,
  FirstName,
  LastName,
  Email,
  Phone,
  City,
  State
FROM Customers
ORDER BY LastName, FirstName;`,
    },
    {
      title: 'WHERE - Filter bookings by status',
      description: 'Use WHERE clause to filter pending bookings',
      sql: `SELECT 
  BookingID,
  BookingReference,
  CustomerID,
  TotalPrice,
  BookingStatus,
  TravelStartDate
FROM Bookings
WHERE BookingStatus = 'Pending'
ORDER BY TravelStartDate;`,
    },
    {
      title: 'ORDER BY - Sort packages by price',
      description: 'Sort travel packages in descending order of price',
      sql: `SELECT 
  PackageID,
  PackageName,
  DurationDays,
  BasePrice,
  PackageType,
  IsActive
FROM TravelPackages
WHERE IsActive = true
ORDER BY BasePrice DESC;`,
    },
    {
      title: 'JOIN - Customer with bookings',
      description: 'Join customers and their booking information',
      sql: `SELECT 
  c.FirstName,
  c.LastName,
  c.Email,
  b.BookingReference,
  b.TravelStartDate,
  b.TotalPrice,
  b.BookingStatus
FROM Customers c
INNER JOIN Bookings b ON c.CustomerID = b.CustomerID
ORDER BY c.LastName, b.TravelStartDate;`,
    },
    {
      title: 'LEFT JOIN - Customers with optional bookings',
      description: 'Show all customers, even those without bookings',
      sql: `SELECT 
  c.FirstName,
  c.LastName,
  c.Email,
  COUNT(b.BookingID) AS BookingCount,
  COALESCE(SUM(b.TotalPrice), 0) AS TotalSpent
FROM Customers c
LEFT JOIN Bookings b ON c.CustomerID = b.CustomerID
GROUP BY c.CustomerID
ORDER BY TotalSpent DESC;`,
    },
    {
      title: 'GROUP BY - Revenue by package',
      description: 'Calculate total revenue for each package',
      sql: `SELECT 
  p.PackageName,
  p.PackageType,
  COUNT(b.BookingID) AS BookingCount,
  SUM(b.TotalPrice) AS TotalRevenue,
  AVG(b.TotalPrice) AS AvgBookingValue
FROM TravelPackages p
LEFT JOIN Bookings b ON p.PackageID = b.PackageID
GROUP BY p.PackageID, p.PackageName, p.PackageType
ORDER BY TotalRevenue DESC;`,
    },
    {
      title: 'HAVING - Packages with high bookings',
      description: 'Filter groups using HAVING clause',
      sql: `SELECT 
  p.PackageName,
  COUNT(b.BookingID) AS BookingCount,
  SUM(b.TotalPrice) AS TotalRevenue
FROM TravelPackages p
LEFT JOIN Bookings b ON p.PackageID = b.PackageID
GROUP BY p.PackageID, p.PackageName
HAVING COUNT(b.BookingID) >= 2
ORDER BY BookingCount DESC;`,
    },
    {
      title: 'Aggregate Functions - Payment statistics',
      description: 'Use COUNT, SUM, AVG, MIN, MAX',
      sql: `SELECT 
  COUNT(*) AS TotalPayments,
  SUM(Amount) AS TotalCollected,
  AVG(Amount) AS AvgPaymentAmount,
  MIN(Amount) AS MinPayment,
  MAX(Amount) AS MaxPayment,
  PaymentStatus
FROM Payments
GROUP BY PaymentStatus;`,
    },
    {
      title: 'Subquery - Top customers',
      description: 'Use subquery to find top spending customers',
      sql: `SELECT 
  c.FirstName,
  c.LastName,
  c.Email,
  TotalSpent
FROM (
  SELECT 
    CustomerID,
    SUM(TotalPrice) AS TotalSpent
  FROM Bookings
  GROUP BY CustomerID
  ORDER BY TotalSpent DESC
  LIMIT 10
) AS TopCustomers
JOIN Customers c ON TopCustomers.CustomerID = c.CustomerID
ORDER BY TotalSpent DESC;`,
    },
    {
      title: 'Complex Join - Booking summary',
      description: 'Multiple JOINs with payment calculation',
      sql: `SELECT 
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
GROUP BY b.BookingID, c.CustomerID, p.PackageID
ORDER BY b.BookingReference;`,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-2">SQL Query Lab</h1>
      <p className="text-muted-foreground mb-6">Educational examples of SQL queries on Moon Travels database</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query List */}
        <div className="lg:col-span-1">
          <div className="dashboard-card">
            <h2 className="text-lg font-bold mb-4">Example Queries</h2>
            <div className="space-y-2">
              {queries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedQuery(index)}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selectedQuery === index
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <p className="text-sm font-semibold">{query.title}</p>
                  <p className="text-xs mt-1 opacity-75">{query.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Query Display */}
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <h2 className="text-xl font-bold mb-2">{queries[selectedQuery].title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{queries[selectedQuery].description}</p>

            <div className="bg-muted border border-border rounded p-4 mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">SQL Query:</p>
              <pre className="font-mono text-xs overflow-x-auto text-foreground whitespace-pre-wrap break-words">
                {queries[selectedQuery].sql}
              </pre>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs font-semibold text-blue-900 mb-2">📚 Key Concepts:</p>
              <ul className="text-xs text-blue-800 space-y-1">
                {selectedQuery === 0 && (
                  <>
                    <li>• Basic SELECT retrieves specific columns</li>
                    <li>• ORDER BY sorts results alphabetically</li>
                    <li>• Useful for viewing all records in a table</li>
                  </>
                )}
                {selectedQuery === 1 && (
                  <>
                    <li>• WHERE clause filters rows based on conditions</li>
                    <li>• Use = for exact matches, &gt; &lt; for comparisons</li>
                    <li>• Multiple conditions with AND/OR operators</li>
                  </>
                )}
                {selectedQuery === 2 && (
                  <>
                    <li>• ORDER BY DESC sorts in descending order</li>
                    <li>• Multiple columns can be used for sorting</li>
                    <li>• Useful for finding highest/lowest values</li>
                  </>
                )}
                {selectedQuery === 3 && (
                  <>
                    <li>• INNER JOIN combines rows from two tables</li>
                    <li>• ON clause specifies the join condition</li>
                    <li>• Only matching rows are included</li>
                  </>
                )}
                {selectedQuery === 4 && (
                  <>
                    <li>• LEFT JOIN includes all rows from left table</li>
                    <li>• Right table rows are included if they match</li>
                    <li>• Non-matching rows show NULL values</li>
                  </>
                )}
                {selectedQuery === 5 && (
                  <>
                    <li>• GROUP BY aggregates data by categories</li>
                    <li>• Aggregate functions: COUNT, SUM, AVG</li>
                    <li>• Useful for summaries and statistics</li>
                  </>
                )}
                {selectedQuery === 6 && (
                  <>
                    <li>• HAVING filters groups (like WHERE for groups)</li>
                    <li>• Applied after GROUP BY</li>
                    <li>• Can reference aggregate functions</li>
                  </>
                )}
                {selectedQuery === 7 && (
                  <>
                    <li>• COUNT(*) counts all rows</li>
                    <li>• SUM adds values, AVG calculates average</li>
                    <li>• MIN/MAX find smallest/largest values</li>
                  </>
                )}
                {selectedQuery === 8 && (
                  <>
                    <li>• Subqueries are queries within queries</li>
                    <li>• Can be in FROM, WHERE, or SELECT</li>
                    <li>• Useful for complex filtering</li>
                  </>
                )}
                {selectedQuery === 9 && (
                  <>
                    <li>• Multiple JOINs combine many tables</li>
                    <li>• String concatenation with ||</li>
                    <li>• COALESCE handles NULL values</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card mt-6">
        <h2 className="text-lg font-bold mb-3">SQL Concepts Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-primary mb-2">Clauses</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>SELECT - Choose columns</li>
              <li>FROM - Specify table(s)</li>
              <li>WHERE - Filter rows</li>
              <li>GROUP BY - Aggregate data</li>
              <li>HAVING - Filter groups</li>
              <li>ORDER BY - Sort results</li>
              <li>LIMIT - Limit result count</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-secondary mb-2">Aggregate Functions</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>COUNT() - Count rows</li>
              <li>SUM() - Add values</li>
              <li>AVG() - Calculate average</li>
              <li>MIN() - Find minimum</li>
              <li>MAX() - Find maximum</li>
              <li>DISTINCT - Remove duplicates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
