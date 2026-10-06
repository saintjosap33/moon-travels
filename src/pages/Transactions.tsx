import React from 'react';

export default function Transactions() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Database Transactions</h1>

      <div className="space-y-6">
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">ACID Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded p-4">
              <p className="font-semibold text-primary mb-2">A - Atomicity</p>
              <p className="text-sm text-muted-foreground">All or nothing - either all operations succeed or all rollback</p>
            </div>
            <div className="border border-border rounded p-4">
              <p className="font-semibold text-secondary mb-2">C - Consistency</p>
              <p className="text-sm text-muted-foreground">Database moves from one valid state to another</p>
            </div>
            <div className="border border-border rounded p-4">
              <p className="font-semibold text-accent mb-2">I - Isolation</p>
              <p className="text-sm text-muted-foreground">Concurrent transactions don't interfere with each other</p>
            </div>
            <div className="border border-border rounded p-4">
              <p className="font-semibold text-green-600 mb-2">D - Durability</p>
              <p className="text-sm text-muted-foreground">Committed data survives system failures</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Transaction Example: Create Booking with Payment</h2>
          <div className="bg-muted p-4 rounded border border-border font-mono text-xs overflow-x-auto mb-4">
            <pre>{`BEGIN TRANSACTION;

-- Step 1: Insert booking
INSERT INTO Bookings (
  BookingReference, CustomerID, PackageID, 
  BookingDate, TravelStartDate, PassengerCount, 
  TotalPrice, BookingStatus
) VALUES (
  'BK-2024001', 5, 3,
  '2024-09-24', '2024-12-15', 2,
  45000, 'Pending'
);
-- Get the new booking ID
SET @BookingID = LAST_INSERT_ID();

-- Step 2: Insert passengers
INSERT INTO BookingPassengers (BookingID, FirstName, LastName, Gender, DateOfBirth)
VALUES 
  (@BookingID, 'Raj', 'Kumar', 'Male', '1990-05-15'),
  (@BookingID, 'Priya', 'Kumar', 'Female', '1992-08-22');

-- Step 3: Record initial payment
INSERT INTO Payments (
  PaymentReference, BookingID, PaymentDate, 
  Amount, PaymentMethod, PaymentStatus
) VALUES (
  'PAY-2024001', @BookingID, '2024-09-24',
  22500, 'Card', 'Completed'
);

-- Step 4: Verify all succeeded
IF (SELECT COUNT(*) FROM Bookings WHERE BookingID = @BookingID) > 0
  AND (SELECT COUNT(*) FROM BookingPassengers WHERE BookingID = @BookingID) = 2
  AND (SELECT COUNT(*) FROM Payments WHERE BookingID = @BookingID) > 0
THEN
  COMMIT;  -- All succeeded, save changes
ELSE
  ROLLBACK;  -- Something failed, undo everything
END IF;`}</pre>
          </div>
          <p className="text-sm text-muted-foreground">If any step fails, entire transaction rolls back - no partial bookings</p>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Transaction Isolation Levels</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4 py-2">
              <p className="font-semibold text-sm">READ UNCOMMITTED</p>
              <p className="text-xs text-muted-foreground">Lowest isolation; dirty reads possible</p>
            </div>
            <div className="border-l-4 border-secondary pl-4 py-2">
              <p className="font-semibold text-sm">READ COMMITTED (Default)</p>
              <p className="text-xs text-muted-foreground">Only committed data visible; prevents dirty reads</p>
            </div>
            <div className="border-l-4 border-accent pl-4 py-2">
              <p className="font-semibold text-sm">REPEATABLE READ</p>
              <p className="text-xs text-muted-foreground">Consistent reads within transaction; prevents non-repeatable reads</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4 py-2">
              <p className="font-semibold text-sm">SERIALIZABLE</p>
              <p className="text-xs text-muted-foreground">Highest isolation; transactions act as if sequential</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Real-World Scenario: Refund Transaction</h2>
          <div className="bg-muted p-4 rounded border border-border font-mono text-xs overflow-x-auto">
            <pre>{`BEGIN TRANSACTION;

-- Scenario: Customer cancels booking, needs refund

-- 1. Verify booking exists and is refundable
SELECT BookingID, TotalPrice, BookingStatus 
FROM Bookings WHERE BookingID = 42;

-- 2. Calculate refund amount (100% in this case)
SET @RefundAmount = 45000;

-- 3. Create refund payment record
INSERT INTO Payments (
  PaymentReference, BookingID, PaymentDate,
  Amount, PaymentMethod, PaymentStatus
) VALUES (
  'REF-2024001', 42, NOW(),
  -@RefundAmount, 'Card Refund', 'Completed'
);

-- 4. Update booking status
UPDATE Bookings 
SET BookingStatus = 'Cancelled' 
WHERE BookingID = 42;

-- 5. Clean up: Remove passengers
DELETE FROM BookingPassengers 
WHERE BookingID = 42;

-- 6. Commit if all successful
COMMIT;

-- If any error occurs, automatic ROLLBACK ensures:
-- - No partial refund
-- - Booking status unchanged
-- - Passenger data intact`}</pre>
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Transaction Best Practices</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Keep transactions short:</strong> Only include necessary operations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Handle errors:</strong> Always implement error handling and rollback logic</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Avoid deadlocks:</strong> Access tables in consistent order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Test rollback:</strong> Verify transaction rollback works correctly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Log transactions:</strong> Maintain audit trail for financial operations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
