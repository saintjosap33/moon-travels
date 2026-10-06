import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite, CustomersRecordInput, TravelPackagesRecordInput, DestinationsRecordInput, AccommodationsRecordInput, TransportationRecordInput, BookingsRecordInput, BookingPassengersRecordInput, PaymentsRecordInput, ReviewsRecordInput, PackageDestinations2RecordInput, PackageAccommodations2RecordInput, PackageTransportation2RecordInput } from 'zitejs/db';

// Indian cities for random assignment
const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Surat', 'Goa',
  'Kerala', 'Agra', 'Varanasi', 'Rishikesh', 'Shimla', 'Manali', 'Ooty',
  'Mysore', 'Kochi', 'Thiruvananthapuram', 'Coimbatore', 'Nagpur', 'Bhopal'
];

// Indian states
const indianStates = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Himachal Pradesh', 'Kerala', 'Goa', 'Punjab', 'Haryana'];

// Destination data
const destinationData = [
  { name: 'Taj Mahal', city: 'Agra', description: 'Iconic white marble mausoleum and UNESCO World Heritage Site', country: 'India', region: 'North India', bestSeason: 'October-March', attractions: 'Taj Mahal, Agra Fort, Mehtab Bagh', altitude: 206 },
  { name: 'Himalayas', city: 'Shimla', description: 'Majestic mountain range with stunning trekking trails', country: 'India', region: 'North India', bestSeason: 'May-September', attractions: 'Hiking, Skiing, Mountain Views', altitude: 2200 },
  { name: 'Kerala Backwaters', city: 'Kochi', description: 'Serene network of lagoons and lakes in tropical paradise', country: 'India', region: 'South India', bestSeason: 'November-February', attractions: 'Houseboat Cruises, Fishing, Beach', altitude: 0 },
  { name: 'Goa Beaches', city: 'Goa', description: 'Beautiful beaches with vibrant nightlife and Portuguese heritage', country: 'India', region: 'West India', bestSeason: 'November-March', attractions: 'Beaches, Water Sports, Heritage Sites', altitude: 0 },
  { name: 'Rajasthan Desert', city: 'Jaipur', description: 'Golden deserts with magnificent forts and palaces', country: 'India', region: 'North India', bestSeason: 'October-March', attractions: 'Hawa Mahal, City Palace, Desert Safari', altitude: 431 },
  { name: 'Varanasi Ghats', city: 'Varanasi', description: 'Spiritual city with ancient temples and sacred river ghats', country: 'India', region: 'North India', bestSeason: 'October-March', attractions: 'Temples, Ghats, Spiritual Ceremonies', altitude: 80 },
  { name: 'Ooty Hill Station', city: 'Ooty', description: 'Cool hill station with tea gardens and scenic beauty', country: 'India', region: 'South India', bestSeason: 'April-June', attractions: 'Botanical Garden, Tea Gardens, Toy Train', altitude: 2240 },
  { name: 'Jaipur Pink City', city: 'Jaipur', description: 'Historic city with stunning architecture and cultural heritage', country: 'India', region: 'North India', bestSeason: 'October-March', attractions: 'Hawa Mahal, Jantar Mantar, City Palace', altitude: 431 },
];

// Package data
const packageData = [
  { name: 'Taj Mahal Experience', type: 'Cultural', difficulty: 'Easy', duration: 3, price: 15000, minPax: 2, maxPax: 20, description: 'Explore the magnificent Taj Mahal and Agra Fort with expert guides' },
  { name: 'Himalayan Adventure', type: 'Adventure', difficulty: 'Hard', duration: 7, price: 45000, minPax: 4, maxPax: 15, description: 'Thrilling trekking expedition through the majestic Himalayas' },
  { name: 'Kerala Houseboat Cruise', type: 'Beach', difficulty: 'Easy', duration: 4, price: 25000, minPax: 2, maxPax: 8, description: 'Relaxing cruise through Kerala backwaters on traditional houseboats' },
  { name: 'Goa Beach Getaway', type: 'Beach', difficulty: 'Easy', duration: 5, price: 20000, minPax: 2, maxPax: 30, description: 'Enjoy pristine beaches, water sports, and vibrant nightlife' },
  { name: 'Rajasthan Royal Tour', type: 'Cultural', difficulty: 'Easy', duration: 6, price: 35000, minPax: 2, maxPax: 25, description: 'Experience the grandeur of Rajasthan with palace visits and desert safari' },
  { name: 'Varanasi Spiritual Journey', type: 'Pilgrimage', difficulty: 'Easy', duration: 3, price: 12000, minPax: 2, maxPax: 15, description: 'Spiritual awakening at the holy city of Varanasi' },
  { name: 'Honeymoon in Ooty', type: 'Honeymoon', difficulty: 'Easy', duration: 4, price: 30000, minPax: 2, maxPax: 2, description: 'Romantic getaway in the scenic hill station of Ooty' },
  { name: 'Family Fun in Jaipur', type: 'Family', difficulty: 'Easy', duration: 4, price: 22000, minPax: 4, maxPax: 20, description: 'Family-friendly exploration of Jaipur with cultural and adventure activities' },
];

// Hotel data
const hotelData = [
  { name: 'Taj Palace Hotel', city: 'Agra', category: '5 Star', pricePerNight: 8000, rooms: 150, amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Gym'], description: 'Luxury hotel with Taj Mahal views' },
  { name: 'Mountain View Resort', city: 'Shimla', category: '4 Star', pricePerNight: 5000, rooms: 80, amenities: ['WiFi', 'AC', 'Restaurant', 'Gym'], description: 'Cozy resort with mountain views' },
  { name: 'Backwater Houseboat', city: 'Kochi', category: '4 Star', pricePerNight: 4500, rooms: 20, amenities: ['AC', 'Restaurant', 'WiFi'], description: 'Traditional houseboat experience' },
  { name: 'Goa Beach Resort', city: 'Goa', category: '4 Star', pricePerNight: 5500, rooms: 100, amenities: ['WiFi', 'AC', 'Pool', 'Beach Access', 'Restaurant'], description: 'Beachfront resort with water sports' },
  { name: 'Rajasthan Palace Hotel', city: 'Jaipur', category: '5 Star', pricePerNight: 7500, rooms: 120, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Parking'], description: 'Grand hotel with palace-like architecture' },
  { name: 'Varanasi Heritage Hotel', city: 'Varanasi', category: '3 Star', pricePerNight: 2500, rooms: 60, amenities: ['WiFi', 'AC', 'Restaurant'], description: 'Budget-friendly heritage hotel' },
  { name: 'Ooty Garden Hotel', city: 'Ooty', category: '4 Star', pricePerNight: 4000, rooms: 70, amenities: ['WiFi', 'AC', 'Garden', 'Restaurant'], description: 'Peaceful hotel in tea garden' },
];

// Transportation data
const transportationData = [
  { type: 'Flight', provider: 'Air India', from: 'Delhi', to: 'Agra', pricePerPerson: 5000, capacity: 180, class: 'Economy', duration: 1800 },
  { type: 'Train', provider: 'Indian Railways', from: 'Delhi', to: 'Shimla', pricePerPerson: 1500, capacity: 500, class: 'AC', duration: 7200 },
  { type: 'Houseboat', provider: 'Kerala Cruises', from: 'Kochi', to: 'Alleppey', pricePerPerson: 3000, capacity: 8, class: 'Luxury', duration: 28800 },
  { type: 'Bus', provider: 'Goa Tours', from: 'Mumbai', to: 'Goa', pricePerPerson: 1200, capacity: 45, class: 'AC', duration: 14400 },
  { type: 'Flight', provider: 'SpiceJet', from: 'Delhi', to: 'Jaipur', pricePerPerson: 4000, capacity: 180, class: 'Economy', duration: 1200 },
  { type: 'Train', provider: 'Indian Railways', from: 'Delhi', to: 'Varanasi', pricePerPerson: 2000, capacity: 500, class: 'AC', duration: 14400 },
  { type: 'Flight', provider: 'Air India', from: 'Chennai', to: 'Ooty', pricePerPerson: 3500, capacity: 180, class: 'Economy', duration: 1800 },
];

// Helper functions
function generateIndianMobileNumber(index: number): string {
  const prefixes = ['6', '7', '8', '9'];
  const prefix = prefixes[index % prefixes.length];
  const remaining = String(1000000000 + (index * 12345) % 8999999999).slice(0, 9);
  return prefix + remaining;
}

function getRandomCity(index: number): string {
  return indianCities[index % indianCities.length];
}

function getRandomState(index: number): string {
  return indianStates[index % indianStates.length];
}

function generateAddress(city: string, index: number): string {
  const streetNames = ['Main Street', 'Park Road', 'Market Lane', 'Garden Path', 'Plaza Avenue', 'Heritage Street'];
  const street = streetNames[index % streetNames.length];
  const number = (100 + (index % 900)).toString();
  return `${number} ${street}, ${city}`;
}

function generatePostalCode(index: number): string {
  return String(100000 + (index % 900000)).padStart(6, '0');
}

export default createEndpoint({
  description: 'Populate application with complete travel data including customers, packages, destinations, accommodations, bookings, and payments',
  inputSchema: z.object({}),
  outputSchema: z.object({
    customersUpdated: z.number(),
    customersWithGeneratedPhones: z.number(),
    customersWithGeneratedCities: z.number(),
    destinationsCreated: z.number(),
    accommodationsCreated: z.number(),
    transportationCreated: z.number(),
    packagesCreated: z.number(),
    packageDestinationsLinked: z.number(),
    packageAccommodationsLinked: z.number(),
    packageTransportationLinked: z.number(),
    bookingsCreated: z.number(),
    bookingPassengersCreated: z.number(),
    paymentsCreated: z.number(),
    reviewsCreated: z.number(),
    totalRecordsProcessed: z.number(),
    message: z.string(),
  }),
  execute: async () => {
    let customersUpdated = 0;
    let customersWithGeneratedPhones = 0;
    let customersWithGeneratedCities = 0;

    // Step 1: Update customers with missing data
    const customers = await zite.customers.findAll({ limit: 2000 });
    const customerUpdates: Array<{ id: string; record: CustomersRecordInput }> = [];

    for (let i = 0; i < customers.records.length; i++) {
      const customer = customers.records[i];
      const updates: CustomersRecordInput = {
        firstName: customer.firstName || null,
        lastName: customer.lastName || null,
        email: customer.email || null,
        phone: customer.phone || generateIndianMobileNumber(i),
        address: customer.address || generateAddress(getRandomCity(i), i),
        city: customer.city || getRandomCity(i),
        state: customer.state || getRandomState(i),
        postalCode: customer.postalCode || generatePostalCode(i),
        dateOfBirth: customer.dateOfBirth || null,
        customerRating: customer.customerRating || (3 + (i % 3)), // Rating 3-5
        bookings: null,
        reviews: null,
      };

      if (!customer.phone) customersWithGeneratedPhones++;
      if (!customer.city) customersWithGeneratedCities++;

      await zite.customers.update({ id: customer.id, record: updates });
      customersUpdated++;
    }

    // Step 2: Create destinations
    const destinationIds: Record<string, string> = {};
    const destinationRecords: DestinationsRecordInput[] = destinationData.map(d => ({
      destinationName: d.name,
      description: d.description,
      country: d.country,
      region: d.region,
      bestSeason: d.bestSeason,
      altitude: d.altitude,
      attractions: d.attractions,
      packageDestinations: null,
    }));

    const createdDestinations = await zite.destinations.bulkCreate({ records: destinationRecords });
    createdDestinations.records.forEach((dest, idx) => {
      destinationIds[destinationData[idx].name] = dest.id;
    });

    // Step 3: Create accommodations
    const accommodationIds: Record<string, string> = {};
    const accommodationRecords: AccommodationsRecordInput[] = hotelData.map(h => ({
      hotelName: h.name,
      city: h.city,
      hotelCategory: h.category,
      pricePerNight: h.pricePerNight,
      totalRooms: h.rooms,
      amenities: h.amenities,
      description: h.description,
      packageAccommodations: null,
    }));

    const createdAccommodations = await zite.accommodations.bulkCreate({ records: accommodationRecords });
    createdAccommodations.records.forEach((acc, idx) => {
      accommodationIds[hotelData[idx].name] = acc.id;
    });

    // Step 4: Create transportation
    const transportationIds: Record<string, string> = {};
    const transportationRecords: TransportationRecordInput[] = transportationData.map(t => ({
      transportType: t.type,
      providerName: t.provider,
      fromLocation: t.from,
      toLocation: t.to,
      pricePerPerson: t.pricePerPerson,
      capacity: t.capacity,
      class: t.class,
      journeyDuration: t.duration,
      packageTransportation: null,
    }));

    const createdTransportation = await zite.transportation.bulkCreate({ records: transportationRecords });
    createdTransportation.records.forEach((trans, idx) => {
      transportationIds[`${transportationData[idx].type}-${idx}`] = trans.id;
    });

    // Step 5: Create packages
    const packageIds: Record<string, string> = {};
    const packageRecords: TravelPackagesRecordInput[] = packageData.map(p => ({
      packageName: p.name,
      description: p.description,
      durationDays: p.duration,
      basePrice: p.price,
      packageType: p.type,
      difficultyLevel: p.difficulty,
      isActive: true,
      maxParticipants: p.maxPax,
      minParticipants: p.minPax,
      packageDestinations: null,
      packageAccommodations: null,
      packageTransportation: null,
      bookings: null,
      reviews: null,
    }));

    const createdPackages = await zite.travelPackages.bulkCreate({ records: packageRecords });
    createdPackages.records.forEach((pkg, idx) => {
      packageIds[packageData[idx].name] = pkg.id;
    });

    // Step 6: Link packages to destinations, accommodations, and transportation
    let packageDestinationsLinked = 0;
    let packageAccommodationsLinked = 0;
    let packageTransportationLinked = 0;

    // Link destinations to packages (2-3 destinations per package)
    const packageDestinationLinks: PackageDestinations2RecordInput[] = [];
    createdPackages.records.forEach((pkg, pkgIdx) => {
      const startDestIdx = (pkgIdx * 2) % destinationData.length;
      const destCount = 2 + (pkgIdx % 2);
      for (let i = 0; i < destCount; i++) {
        const destIdx = (startDestIdx + i) % destinationData.length;
        packageDestinationLinks.push({
          package: pkg.id,
          destination: destinationIds[destinationData[destIdx].name],
          dayNumber: i + 1,
          activities: `Explore ${destinationData[destIdx].name}, visit local attractions`,
        });
      }
    });

    if (packageDestinationLinks.length > 0) {
      const linkedDests = await zite.packageDestinations2.bulkCreate({ records: packageDestinationLinks });
      packageDestinationsLinked = linkedDests.records.length;
    }

    // Link accommodations to packages (1-2 hotels per package)
    const packageAccommodationLinks: PackageAccommodations2RecordInput[] = [];
    createdPackages.records.forEach((pkg, pkgIdx) => {
      const hotelIdx = pkgIdx % hotelData.length;
      const nights = 1 + (pkgIdx % 3);
      packageAccommodationLinks.push({
        package: pkg.id,
        accommodation: accommodationIds[hotelData[hotelIdx].name],
        nights: nights,
      });
    });

    if (packageAccommodationLinks.length > 0) {
      const linkedAccoms = await zite.packageAccommodations2.bulkCreate({ records: packageAccommodationLinks });
      packageAccommodationsLinked = linkedAccoms.records.length;
    }

    // Link transportation to packages (1-2 transport modes per package)
    const packageTransportationLinks: PackageTransportation2RecordInput[] = [];
    createdPackages.records.forEach((pkg, pkgIdx) => {
      const transIdx = pkgIdx % transportationData.length;
      packageTransportationLinks.push({
        package: pkg.id,
        transportation: transportationIds[`${transportationData[transIdx].type}-${transIdx}`],
        sequence: 1,
      });
      if (pkgIdx % 2 === 0) {
        const transIdx2 = (pkgIdx + 1) % transportationData.length;
        packageTransportationLinks.push({
          package: pkg.id,
          transportation: transportationIds[`${transportationData[transIdx2].type}-${transIdx2}`],
          sequence: 2,
        });
      }
    });

    if (packageTransportationLinks.length > 0) {
      const linkedTrans = await zite.packageTransportation2.bulkCreate({ records: packageTransportationLinks });
      packageTransportationLinked = linkedTrans.records.length;
    }

    // Step 7: Create bookings (5-10 per package, distributed across customers)
    const bookingIds: string[] = [];
    const bookingRecords: BookingsRecordInput[] = [];

    createdPackages.records.forEach((pkg, pkgIdx) => {
      const bookingsPerPackage = 5 + (pkgIdx % 6);
      for (let i = 0; i < bookingsPerPackage; i++) {
        const customerIdx = (pkgIdx * 10 + i) % customers.records.length;
        const customer = customers.records[customerIdx];
        const bookingDate = new Date(2026, Math.floor(Math.random() * 9), 1 + Math.floor(Math.random() * 28));
        const travelDate = new Date(bookingDate.getTime() + (30 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000);
        const passengerCount = 1 + (i % 4);
        const totalPrice = (packageData[pkgIdx]?.price || 20000) * passengerCount * (0.9 + Math.random() * 0.2);

        bookingRecords.push({
          bookingReference: `BK${Date.now()}${pkgIdx}${i}`,
          customer: customer.id,
          package: pkg.id,
          bookingAgent: null,
          bookingDate: bookingDate.toISOString().split('T')[0],
          travelStartDate: travelDate.toISOString().split('T')[0],
          passengerCount: passengerCount,
          totalPrice: Math.round(totalPrice),
          bookingStatus: ['Pending', 'Confirmed', 'Completed'][Math.floor(Math.random() * 3)],
          specialNotes: `Booking for ${passengerCount} passengers`,
          bookingPassengers: null,
          payments: null,
        });
      }
    });

    const createdBookings = await zite.bookings.bulkCreate({ records: bookingRecords });
    createdBookings.records.forEach(b => bookingIds.push(b.id));

    // Step 8: Create booking passengers
    const bookingPassengerRecords: BookingPassengersRecordInput[] = [];
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Deepika', 'Arjun', 'Ananya', 'Vikram', 'Shreya', 'Rohit', 'Neha'];
    const lastNames = ['Kumar', 'Singh', 'Patel', 'Sharma', 'Gupta', 'Verma', 'Joshi', 'Rao', 'Nair', 'Desai'];

    createdBookings.records.forEach((booking, bookingIdx) => {
      const passengerCount = (bookingRecords[bookingIdx]?.passengerCount as number) || 1;
      for (let i = 0; i < passengerCount; i++) {
        const firstName = firstNames[(bookingIdx * 3 + i) % firstNames.length];
        const lastName = lastNames[(bookingIdx * 7 + i) % lastNames.length];
        const dob = new Date(1980 + (bookingIdx % 40), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28));

        bookingPassengerRecords.push({
          passengerName: `${firstName} ${lastName}`,
          booking: booking.id,
          firstName: firstName,
          lastName: lastName,
          gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
          dateOfBirth: dob.toISOString().split('T')[0],
          idType: 'Passport',
          idNumber: `IN${String(1000000 + Math.floor(Math.random() * 9000000)).slice(0, 7)}`,
        });
      }
    });

    const createdPassengers = await zite.bookingPassengers.bulkCreate({ records: bookingPassengerRecords });

    // Step 9: Create payments (1-3 per booking)
    const paymentRecords: PaymentsRecordInput[] = [];
    createdBookings.records.forEach((booking, bookingIdx) => {
      const totalPrice = (bookingRecords[bookingIdx]?.totalPrice as number) || 20000;
      const paymentCount = 1 + (bookingIdx % 3);
      const amountPerPayment = totalPrice / paymentCount;

      for (let i = 0; i < paymentCount; i++) {
        const paymentDate = new Date(2026, Math.floor(Math.random() * 9), 1 + Math.floor(Math.random() * 28));

        paymentRecords.push({
          paymentReference: `PAY${Date.now()}${bookingIdx}${i}`,
          booking: booking.id,
          paymentDate: paymentDate.toISOString().split('T')[0],
          amount: Math.round(amountPerPayment),
          paymentMethod: ['Card', 'Bank Transfer', 'UPI'][Math.floor(Math.random() * 3)],
          paymentStatus: ['Pending', 'Completed'][Math.floor(Math.random() * 2)],
          transactionReference: `TXN${String(Math.random()).slice(2, 12)}`,
          notes: `Payment ${i + 1} of ${paymentCount}`,
        });
      }
    });

    const createdPayments = await zite.payments.bulkCreate({ records: paymentRecords });

    // Step 10: Create reviews (30-40% of bookings)
    const reviewRecords: ReviewsRecordInput[] = [];
    const reviewTexts = [
      'Amazing experience! Highly recommend this package.',
      'Great value for money. Well-organized tour.',
      'Excellent service and beautiful destinations.',
      'Perfect getaway. Will book again!',
      'Outstanding experience with knowledgeable guides.',
      'Wonderful memories created. Thank you!',
      'Best vacation ever. Highly satisfied.',
      'Professional team and beautiful locations.',
      'Worth every penny. Fantastic tour!',
      'Exceeded expectations. Highly recommended.',
    ];

    createdBookings.records.forEach((booking, bookingIdx) => {
      if (Math.random() < 0.35) {
        const customerIdx = (bookingIdx * 7) % customers.records.length;
        const packageIdx = (bookingIdx * 5) % createdPackages.records.length;
        const rating = 3 + Math.floor(Math.random() * 3); // 3-5 stars
        const reviewDate = new Date(2026, Math.floor(Math.random() * 9), 1 + Math.floor(Math.random() * 28));

        reviewRecords.push({
          customer: customers.records[customerIdx].id,
          package: createdPackages.records[packageIdx].id,
          rating: rating,
          reviewText: reviewTexts[bookingIdx % reviewTexts.length],
          reviewDate: reviewDate.toISOString().split('T')[0],
        });
      }
    });

    const createdReviews = await zite.reviews.bulkCreate({ records: reviewRecords });

    const totalRecordsProcessed = 
      customersUpdated + 
      createdDestinations.records.length + 
      createdAccommodations.records.length + 
      createdTransportation.records.length + 
      createdPackages.records.length + 
      packageDestinationsLinked + 
      packageAccommodationsLinked + 
      packageTransportationLinked + 
      createdBookings.records.length + 
      createdPassengers.records.length + 
      createdPayments.records.length + 
      createdReviews.records.length;

    return {
      customersUpdated,
      customersWithGeneratedPhones,
      customersWithGeneratedCities,
      destinationsCreated: createdDestinations.records.length,
      accommodationsCreated: createdAccommodations.records.length,
      transportationCreated: createdTransportation.records.length,
      packagesCreated: createdPackages.records.length,
      packageDestinationsLinked,
      packageAccommodationsLinked,
      packageTransportationLinked,
      bookingsCreated: createdBookings.records.length,
      bookingPassengersCreated: createdPassengers.records.length,
      paymentsCreated: createdPayments.records.length,
      reviewsCreated: createdReviews.records.length,
      totalRecordsProcessed,
      message: `Successfully populated application with ${totalRecordsProcessed} records. Application is now fully functional and ready for use.`,
    };
  },
});
