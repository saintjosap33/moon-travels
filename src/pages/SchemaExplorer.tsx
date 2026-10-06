import React from 'react';

export default function SchemaExplorer() {
  const tables = [
    {
      name: 'Customers',
      description: 'Stores customer information',
      fields: ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'dateOfBirth'],
    },
    {
      name: 'Travel Packages',
      description: 'Travel package offerings',
      fields: ['packageName', 'description', 'durationDays', 'basePrice', 'packageType', 'difficultyLevel', 'isActive'],
    },
    {
      name: 'Bookings',
      description: 'Customer bookings',
      fields: ['bookingReference', 'customer', 'package', 'bookingAgent', 'bookingDate', 'travelStartDate', 'passengerCount', 'totalPrice', 'bookingStatus'],
    },
    {
      name: 'Payments',
      description: 'Payment records',
      fields: ['paymentReference', 'booking', 'paymentDate', 'amount', 'paymentMethod', 'paymentStatus', 'transactionReference'],
    },
    {
      name: 'Destinations',
      description: 'Travel destinations',
      fields: ['destinationName', 'description', 'country', 'region', 'bestSeason', 'altitude', 'attractions'],
    },
    {
      name: 'Accommodations',
      description: 'Hotels and lodgings',
      fields: ['hotelName', 'city', 'hotelCategory', 'pricePerNight', 'totalRooms', 'amenities', 'description'],
    },
    {
      name: 'Transportation',
      description: 'Transport services',
      fields: ['transportType', 'providerName', 'fromLocation', 'toLocation', 'pricePerPerson', 'capacity', 'class', 'journeyDuration'],
    },
    {
      name: 'Booking Passengers',
      description: 'Passengers in each booking',
      fields: ['booking', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'idType', 'idNumber'],
    },
    {
      name: 'Reviews',
      description: 'Customer reviews',
      fields: ['customer', 'package', 'rating', 'reviewText', 'reviewDate'],
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Schema Explorer</h1>
      <p className="text-muted-foreground mb-6">Database tables and fields for Moon Travels</p>

      <div className="space-y-6">
        {tables.map((table) => (
          <div key={table.name} className="dashboard-card">
            <h2 className="text-xl font-bold mb-2">{table.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{table.description}</p>
            <div className="bg-muted p-4 rounded border border-border">
              <p className="text-sm font-semibold mb-2">Fields:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {table.fields.map((field) => (
                  <div key={field} className="text-sm font-mono bg-background p-2 rounded border border-border">
                    {field}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-card mt-6">
        <h2 className="text-xl font-bold mb-4">Key Relationships</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Customers 1:N Bookings
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Travel Packages 1:N Bookings
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Bookings 1:N Booking Passengers
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Bookings 1:N Payments
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Travel Packages M:N Destinations (via Package Destinations)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Travel Packages M:N Accommodations (via Package Accommodations)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Travel Packages M:N Transportation (via Package Transportation)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Customers M:N Travel Packages (via Reviews)
          </li>
        </ul>
      </div>
    </div>
  );
}
