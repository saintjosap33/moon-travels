# Moon Travels - Travel Agency Management System

A complete, production-ready Travel Agency Management System built with React, TypeScript, and ZiteJS for managing customers, travel packages, bookings, payments, and financial reporting.

## Project Overview

**Moon Travels** is a comprehensive DBMS project demonstrating:
- Real CRUD operations with a normalized relational database
- Complete business workflow: Customer → Package → Booking → Passengers → Payment → Receipt → Reports
- Financial management and income tracking
- Educational DBMS concepts (normalization, ER diagrams, transactions, views, indexes)
- Professional UI with role-based access control

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: ZiteJS API Endpoints (Node.js)
- **Database**: Zite Database (PostgreSQL)
- **Authentication**: JWT + Bcrypt
- **UI Components**: Shadcn/ui primitives

## Database Schema

### Core Tables

**Customers**
- Primary Key: CustomerID
- Fields: firstName, lastName, email, phone, address, city, state, postalCode, dateOfBirth, customerRating
- Relationships: 1:N with Bookings, M:N with TravelPackages (via Reviews)

**Travel Packages**
- Primary Key: PackageID
- Fields: packageName, description, durationDays, basePrice, packageType, difficultyLevel, isActive, maxParticipants, minParticipants
- Relationships: 1:N with Bookings, M:N with Destinations/Accommodations/Transportation

**Bookings**
- Primary Key: BookingID
- Foreign Keys: CustomerID, PackageID, BookingAgentID
- Fields: bookingReference, bookingDate, travelStartDate, passengerCount, totalPrice, bookingStatus, specialNotes
- Relationships: 1:N with BookingPassengers, 1:N with Payments

**Booking Passengers**
- Primary Key: PassengerID
- Foreign Key: BookingID
- Fields: firstName, lastName, gender, dateOfBirth, idType, idNumber

**Payments**
- Primary Key: PaymentID
- Foreign Key: BookingID
- Fields: paymentReference, paymentDate, amount, paymentMethod, paymentStatus, transactionReference

**Junction Tables**
- PackageDestinations: Links TravelPackages ↔ Destinations
- PackageAccommodations: Links TravelPackages ↔ Accommodations
- PackageTransportation: Links TravelPackages ↔ Transportation

### Supporting Tables

- **Destinations**: destinationName, country, region, bestSeason, altitude, attractions
- **Accommodations**: hotelName, city, hotelCategory, pricePerNight, totalRooms, amenities
- **Transportation**: transportType, providerName, fromLocation, toLocation, pricePerPerson, capacity, class
- **Reviews**: customer, package, rating, reviewText, reviewDate
- **Users**: email, passwordHash, firstName, lastName, role, phone, isActive
- **Roles**: roleName, description

## Database Normalization

### Unnormalized Form (UNF)
Raw data with repeating groups (destinations, accommodations, passengers within bookings)

### First Normal Form (1NF)
- Removed repeating groups
- All attributes are atomic
- Each field contains only single values

### Second Normal Form (2NF)
- Removed partial dependencies
- All non-key attributes depend on entire primary key
- Junction tables created for M:N relationships

### Third Normal Form (3NF)
- Removed transitive dependencies
- No non-key attribute depends on another non-key attribute
- Fully normalized for CRUD operations

## Key Features

### 1. Customer Management
- Add, edit, delete customers
- Track customer history and ratings
- View customer bookings and reviews

### 2. Package Management
- Create travel packages with pricing
- Assign destinations, accommodations, transportation
- Set difficulty levels and participant limits
- Activate/deactivate packages

### 3. Booking System
- Create bookings linking customers to packages
- Add multiple passengers per booking
- Automatic price calculation
- Track booking status (Pending, Confirmed, Completed, Cancelled)

### 4. Payment Management
- Record multiple payments per booking
- Support multiple payment methods (Cash, Card, Bank Transfer, UPI, Check)
- Track payment status and outstanding amounts
- Calculate booking financial information from real database data

### 5. Receipt Generator
- Professional printable receipts
- Shows booking details, payment information, outstanding balance
- Print-friendly styling

### 6. Income & Finance Dashboard
- Total revenue tracking
- Monthly income breakdown
- Outstanding payments calculation
- Income by payment method
- Real SQL aggregation for all calculations

### 7. Reports
- Revenue by booking status
- Bookings by month
- Payment statistics
- Top packages and customers
- All using real database data

### 8. DBMS Educational Features

#### Schema Explorer
- View all tables and fields
- Understand data types and relationships
- Composite key explanations

#### ER Diagram
- Visual representation of all relationships
- Primary and foreign key connections
- Junction table explanations

#### Normalization Guide
- UNF → 1NF → 2NF → 3NF progression
- Real examples from Moon Travels schema
- Benefits of normalization

#### Views & Indexes
- SQL view definitions for common queries
- Index strategy for performance
- Query optimization techniques

#### Transactions
- ACID properties explained
- Real transaction examples
- Booking with payment transaction
- Refund transaction with rollback

#### Query Lab
- 10 educational SQL examples
- SELECT, WHERE, ORDER BY, JOIN, LEFT JOIN, GROUP BY, HAVING
- Aggregate functions
- Subqueries
- Interactive learning

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Packages
- `GET /api/packages` - List packages
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Similar endpoints for Destinations, Accommodations, Transportation, Reviews

## Demo Credentials

```
Email: admin@moontravels.com
Password: demo
Role: Admin
```

## Running the Application

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
apps/moon-travels/
├── src/
│   ├── api/
│   │   ├── login.ts
│   │   └── [other endpoints]
│   ├── components/
│   │   └── Sidebar.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Customers.tsx
│   │   ├── Packages.tsx
│   │   ├── Bookings.tsx
│   │   ├── Payments.tsx
│   │   ├── Receipts.tsx
│   │   ├── Income.tsx
│   │   ├── Reports.tsx
│   │   ├── Reviews.tsx
│   │   ├── SchemaExplorer.tsx
│   │   ├── ERDiagram.tsx
│   │   ├── Normalization.tsx
│   │   ├── ViewsIndexes.tsx
│   │   ├── Transactions.tsx
│   │   └── QueryLab.tsx
│   ├── App.tsx
│   └── index.css
├── zite.config.json
└── README.md
```

## Database Constraints & Integrity

### Primary Keys
- All tables have auto-incrementing primary keys
- Junction tables use composite keys

### Foreign Keys
- Enforce referential integrity
- Prevent orphaned records
- Cascading updates/deletes where appropriate

### NOT NULL Constraints
- Essential fields marked as NOT NULL
- Ensures data completeness

### UNIQUE Constraints
- Email addresses unique in Customers and Users
- Booking references unique
- Payment references unique

### CHECK Constraints
- Passenger count > 0
- Prices >= 0
- Valid booking statuses
- Valid payment statuses

### Indexes
- Primary key indexes (automatic)
- Foreign key indexes for JOIN performance
- Search indexes on email, reference numbers
- Date indexes for range queries

## Data Validation

### Client-Side
- Form field validation
- Email format validation
- Date range validation
- Required field checks

### Server-Side
- All inputs validated on backend
- Type checking with Zod schemas
- Business logic validation
- Referential integrity checks

## Security Features

- **Authentication**: JWT-based with bcrypt password hashing
- **Authorization**: Role-based access control (Admin/Agent)
- **Input Validation**: Parameterized queries, input sanitization
- **Data Protection**: No hardcoded credentials, environment variables for secrets

## Sample Data

The database includes realistic Indian travel agency data:
- **Customers**: Indian names and cities
- **Destinations**: Popular Indian and international destinations
- **Packages**: Domestic and international travel packages
- **Pricing**: INR (Indian Rupee) currency
- **Hotels**: Real-world accommodations
- **Transportation**: Flight, train, and bus options

## VIVA Explanation Points

1. **Database Normalization**: Explain the progression from UNF to 3NF with Moon Travels examples
2. **ER Relationships**: Describe 1:N and M:N relationships and how they're implemented
3. **ACID Properties**: Explain how transactions ensure data consistency
4. **SQL Queries**: Demonstrate complex queries with JOINs and aggregations
5. **Indexing Strategy**: Explain why certain fields are indexed for performance
6. **Referential Integrity**: Show how foreign keys prevent invalid data
7. **CRUD Operations**: Walk through creating, reading, updating, deleting records
8. **Financial Calculations**: Show how income is calculated from real database data
9. **Views & Reports**: Explain how views simplify complex queries
10. **Real-World Workflow**: Trace complete booking → payment → receipt flow

## Key Learning Outcomes

✓ Relational database design and normalization
✓ Complex SQL queries with JOINs and aggregations
✓ Transaction management and ACID properties
✓ Database indexing and optimization
✓ Referential integrity and constraints
✓ Real-world business logic implementation
✓ Full-stack application development
✓ API design and REST principles
✓ User interface for data management
✓ Financial calculations and reporting

## Future Enhancements

- Multi-currency support
- Advanced analytics dashboard
- Email notifications for bookings
- SMS alerts for payments
- Integration with payment gateways (Stripe, PayPal)
- Mobile app version
- API documentation (Swagger/OpenAPI)
- Database backup and recovery procedures
- Performance monitoring and optimization

## License

This project is created for educational purposes as a DBMS college project.

## Contact & Support

For questions about the implementation or database design, refer to:
- Database schema documentation
- DBMS features section in the application
- SQL Query Lab for learning examples
- Code comments throughout the application

---

**Built with ❤️ for learning database management systems**
