import React from 'react';

export default function Normalization() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Database Normalization</h1>

      <div className="space-y-6">
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Unnormalized Form (UNF)</h2>
          <p className="text-sm text-muted-foreground mb-3">Raw data with repeating groups</p>
          <div className="bg-muted p-4 rounded border border-border font-mono text-xs overflow-x-auto">
            <pre>{`BOOKINGS_UNF
├── BookingID
├── CustomerName
├── CustomerEmail
├── PackageName
├── PackagePrice
├── Destinations[] (repeating group)
│   ├── DestinationName
│   ├── Country
│   └── BestSeason
├── Accommodations[] (repeating group)
│   ├── HotelName
│   ├── City
│   └── PricePerNight
└── Passengers[] (repeating group)
    ├── PassengerName
    ├── DateOfBirth
    └── IDNumber`}</pre>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Problem: Repeating groups, data redundancy, update anomalies</p>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">First Normal Form (1NF)</h2>
          <p className="text-sm text-muted-foreground mb-3">Remove repeating groups - atomic values only</p>
          <div className="bg-muted p-4 rounded border border-border font-mono text-xs overflow-x-auto">
            <pre>{`CUSTOMERS (1NF)
├── CustomerID (PK)
├── FirstName
├── LastName
├── Email
└── Phone

BOOKINGS (1NF)
├── BookingID (PK)
├── CustomerID (FK)
├── PackageID (FK)
├── BookingDate
└── TotalPrice

BOOKING_PASSENGERS (1NF)
├── PassengerID (PK)
├── BookingID (FK)
├── FirstName
├── LastName
├── DateOfBirth
└── IDNumber`}</pre>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Achievement: Eliminated repeating groups; all attributes are atomic</p>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Second Normal Form (2NF)</h2>
          <p className="text-sm text-muted-foreground mb-3">Remove partial dependencies - all non-key attributes depend on entire PK</p>
          <div className="bg-muted p-4 rounded border border-border font-mono text-xs overflow-x-auto">
            <pre>{`TRAVEL_PACKAGES (2NF)
├── PackageID (PK)
├── PackageName
├── Description
├── DurationDays
├── BasePrice
├── PackageType
└── IsActive

PACKAGE_DESTINATIONS (2NF)
├── PackageDestinationID (PK)
├── PackageID (FK, part of composite key)
├── DestinationID (FK, part of composite key)
├── DayNumber
└── Activities

DESTINATIONS (2NF)
├── DestinationID (PK)
├── DestinationName
├── Country
├── Region
├── BestSeason
└── Altitude`}</pre>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Achievement: Removed partial dependencies; each non-key attribute depends on the entire primary key</p>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Third Normal Form (3NF)</h2>
          <p className="text-sm text-muted-foreground mb-3">Remove transitive dependencies - no non-key attribute depends on another non-key attribute</p>
          <div className="bg-muted p-4 rounded border border-border font-mono text-xs overflow-x-auto">
            <pre>{`PAYMENTS (3NF)
├── PaymentID (PK)
├── BookingID (FK) ──┐
├── PaymentDate      │ No transitive dependencies
├── Amount           │ All non-key attributes depend
├── PaymentMethod    │ directly on PaymentID
├── PaymentStatus    │
└── TransactionRef ──┘

ACCOMMODATIONS (3NF)
├── AccommodationID (PK)
├── HotelName ──────────┐
├── City                │ No transitive dependencies
├── HotelCategory       │ All attributes depend
├── PricePerNight       │ directly on AccommodationID
├── TotalRooms          │
└── Description ────────┘`}</pre>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Achievement: Removed transitive dependencies; database is fully normalized for CRUD operations</p>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Benefits of Normalization in Moon Travels</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Data Integrity:</strong> No duplicate customer or package data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Efficient Updates:</strong> Change a package price once, applies everywhere</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Minimal Redundancy:</strong> Each fact stored only once</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Query Performance:</strong> Proper indexing on normalized tables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span><strong>Referential Integrity:</strong> Foreign keys maintain data consistency</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
