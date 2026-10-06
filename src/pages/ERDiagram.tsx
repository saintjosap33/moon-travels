import React from 'react';

export default function ERDiagram() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Entity-Relationship Diagram</h1>

      <div className="dashboard-card mb-6">
        <div className="bg-muted p-8 rounded border border-border overflow-x-auto">
          <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
{`
                    ┌─────────────────────┐
                    │    CUSTOMERS        │
                    ├─────────────────────┤
                    │ PK: id              │
                    │    firstName        │
                    │    lastName         │
                    │    email            │
                    │    phone            │
                    │    address          │
                    │    city             │
                    │    state            │
                    │    postalCode       │
                    │    dateOfBirth      │
                    └─────────────────────┘
                            │ 1
                            │
                         1:N│
                            │
                            ▼
                    ┌─────────────────────┐
                    │    BOOKINGS         │
                    ├─────────────────────┤
                    │ PK: id              │
                    │ FK: customerId      │◄──────┐
                    │ FK: packageId       │       │
                    │ FK: agentId         │       │
                    │    bookingRef       │       │
                    │    bookingDate      │       │
                    │    travelStartDate  │       │
                    │    passengerCount   │       │
                    │    totalPrice       │       │
                    │    status           │       │
                    └─────────────────────┘       │
                      │            │              │
                   1:N│         1:N│          1:N │
                      │            │              │
                      ▼            ▼              │
        ┌──────────────────────┐  ┌──────────────────────┐
        │ BOOKING_PASSENGERS   │  │    PAYMENTS          │
        ├──────────────────────┤  ├──────────────────────┤
        │ PK: id               │  │ PK: id               │
        │ FK: bookingId        │  │ FK: bookingId        │
        │    firstName         │  │    paymentRef        │
        │    lastName          │  │    paymentDate       │
        │    gender           │  │    amount            │
        │    dateOfBirth       │  │    paymentMethod     │
        │    idType            │  │    status            │
        │    idNumber          │  │    transactionRef    │
        └──────────────────────┘  └──────────────────────┘
                                          │
                                      1:N │
                                          │
                    ┌─────────────────────┴──────────────────┐
                    │                                        │
                    │     TRAVEL_PACKAGES                    │
                    ├────────────────────────────────────────┤
                    │ PK: id                                 │
                    │    packageName                         │
                    │    description                         │
                    │    durationDays                        │
                    │    basePrice                           │
                    │    packageType                         │
                    │    difficultyLevel                     │
                    │    isActive                            │
                    │    maxParticipants                     │
                    │    minParticipants                     │
                    └────────────────────────────────────────┘
                      │             │             │
                   M:N│          M:N│          M:N│
                      │             │             │
                      ▼             ▼             ▼
            ┌──────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
            │PACKAGE_DESTINATIONS │PACKAGE_ACCOMMODATIONS│PACKAGE_TRANSPORTATION
            ├──────────────────┤  ├─────────────────────┤  ├──────────────────┤
            │ PK: id           │  │ PK: id              │  │ PK: id           │
            │ FK: packageId    │  │ FK: packageId       │  │ FK: packageId    │
            │ FK: destId       │  │ FK: accommodationId │  │ FK: transportId  │
            │    dayNumber     │  │    nights           │  │    sequence      │
            │    activities    │  └─────────────────────┘  └──────────────────┘
            └──────────────────┘
                    │
                    │
                    ▼
            ┌──────────────────┐
            │  DESTINATIONS    │
            ├──────────────────┤
            │ PK: id           │
            │    destName      │
            │    description   │
            │    country       │
            │    region        │
            │    bestSeason    │
            │    altitude      │
            │    attractions   │
            └──────────────────┘
`}
          </pre>
        </div>
      </div>

      <div className="dashboard-card">
        <h2 className="text-xl font-bold mb-4">Relationship Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="font-semibold text-primary min-w-fit">1:N</span>
            <span>Customers → Bookings (One customer can have many bookings)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-semibold text-primary min-w-fit">1:N</span>
            <span>Travel Packages → Bookings (One package can have many bookings)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-semibold text-primary min-w-fit">1:N</span>
            <span>Bookings → Booking Passengers (One booking can have many passengers)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-semibold text-primary min-w-fit">1:N</span>
            <span>Bookings → Payments (One booking can have multiple payment records)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-semibold text-primary min-w-fit">M:N</span>
            <span>Travel Packages ↔ Destinations (via Package Destinations junction table)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-semibold text-primary min-w-fit">M:N</span>
            <span>Travel Packages ↔ Accommodations (via Package Accommodations junction table)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-semibold text-primary min-w-fit">M:N</span>
            <span>Travel Packages ↔ Transportation (via Package Transportation junction table)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
