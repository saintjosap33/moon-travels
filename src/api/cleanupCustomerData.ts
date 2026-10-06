import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite, CustomersRecordInput } from 'zitejs/db';

// Comprehensive Indian names database
const firstNames = [
  'Aarav', 'Aditya', 'Arjun', 'Amit', 'Ashok', 'Anand', 'Abhishek', 'Ankur', 'Aniruddh', 'Anmol',
  'Rajesh', 'Ravi', 'Rohit', 'Rahul', 'Rohan', 'Raghav', 'Ramesh', 'Rishi', 'Rajat', 'Rishabh',
  'Vikram', 'Vivek', 'Varun', 'Vipul', 'Vinay', 'Vikas', 'Vishal', 'Vipin', 'Vikrant', 'Vinod',
  'Sanjay', 'Siddharth', 'Suresh', 'Sanjiv', 'Satish', 'Sandeep', 'Saurabh', 'Samir', 'Sushant', 'Siddhu',
  'Karthik', 'Karan', 'Kamal', 'Krishan', 'Kunal', 'Karanvir', 'Kapil', 'Karan', 'Kundan', 'Kesav',
  'Nikhil', 'Neeraj', 'Naveen', 'Naman', 'Nitin', 'Narendra', 'Nilesh', 'Nishant', 'Neelesh', 'Navneet',
  'Prateek', 'Pawan', 'Pranav', 'Prakash', 'Parth', 'Parag', 'Prabhat', 'Pushkar', 'Pallav', 'Prithvi',
  'Ananya', 'Anjali', 'Aparna', 'Akanksha', 'Amrita', 'Aisha', 'Arpita', 'Ashwini', 'Arya', 'Avni',
  'Priya', 'Pooja', 'Preeti', 'Payal', 'Poonam', 'Puja', 'Pallavi', 'Priyanka', 'Prachiti', 'Purvi',
  'Sneha', 'Swati', 'Shalini', 'Sheetal', 'Shweta', 'Sakshi', 'Sana', 'Sunaina', 'Smita', 'Shruti',
  'Neha', 'Nisha', 'Nidhi', 'Nikita', 'Nandini', 'Navya', 'Nitya', 'Namrata', 'Naina', 'Noor',
  'Kavya', 'Kalpana', 'Kanika', 'Kaveri', 'Kshama', 'Kritika', 'Kalyani', 'Kshitija', 'Keerti', 'Kanya',
  'Divya', 'Deepti', 'Deepika', 'Disha', 'Diya', 'Devika', 'Dharini', 'Daya', 'Darshana', 'Dhriti',
  'Meera', 'Megha', 'Madhuri', 'Malini', 'Malika', 'Manisha', 'Mira', 'Medha', 'Mona', 'Mridula',
  'Riya', 'Renu', 'Richa', 'Rashmi', 'Radhika', 'Rani', 'Ramya', 'Ragini', 'Ritu', 'Rupali',
  'Vidya', 'Vimla', 'Vanshika', 'Vasundhra', 'Vaidehi', 'Veda', 'Varsha', 'Vanessa', 'Veda', 'Vedavati',
  'Isha', 'Ishita', 'Indu', 'Indira', 'Ira', 'Iris', 'Ipsa', 'Ipsita', 'Ishwari', 'Isha',
  'Jiya', 'Jyoti', 'Jaya', 'Jasmine', 'Jhumpa', 'Jyotsna', 'Janvi', 'Janaki', 'Jiya', 'Jhanvi',
  'Zara', 'Zoya', 'Zahra', 'Zainab', 'Zara', 'Zeba', 'Zeenat', 'Zinnia', 'Zara', 'Zoya',
];

const lastNames = [
  'Sharma', 'Singh', 'Patel', 'Gupta', 'Verma', 'Rao', 'Reddy', 'Iyer', 'Nair', 'Menon',
  'Joshi', 'Kapoor', 'Khanna', 'Malhotra', 'Chopra', 'Bhat', 'Desai', 'Dutta', 'Chatterjee', 'Banerjee',
  'Roy', 'Mukherjee', 'Ghosh', 'Dasgupta', 'Bose', 'Dey', 'Mazumdar', 'Sinha', 'Mitra', 'Ganguly',
  'Agarwal', 'Arora', 'Bhatnagar', 'Mittal', 'Saxena', 'Srivastava', 'Tripathi', 'Pandey', 'Mishra', 'Dixit',
  'Subramanian', 'Krishnan', 'Pillai', 'Raman', 'Sundaram', 'Murthy', 'Srinivasan', 'Gopal', 'Anand', 'Bhat',
  'Kulkarni', 'Kadam', 'Gawde', 'Bhosale', 'Patil', 'Pawar', 'Deshmukh', 'Kale', 'Jadhav', 'Wagh',
  'Mehta', 'Shah', 'Vora', 'Mody', 'Naik', 'Trivedi', 'Amin', 'Patel', 'Dave', 'Jain',
  'Khan', 'Ahmed', 'Hassan', 'Ali', 'Hussain', 'Mohammad', 'Iqbal', 'Siddiqui', 'Mirza', 'Malik',
  'Pandey', 'Singh', 'Yadav', 'Srivastava', 'Mishra', 'Verma', 'Kumar', 'Tiwari', 'Dubey', 'Rao',
  'Bhuyan', 'Nayak', 'Jena', 'Sahoo', 'Dash', 'Mohanty', 'Panigrahi', 'Sahu', 'Rath', 'Behera',
  'Baruah', 'Sarma', 'Deka', 'Gogoi', 'Hazarika', 'Mahanta', 'Sarmah', 'Neog', 'Konwar', 'Chetia',
  'Nambiar', 'Namboothiri', 'Unni', 'Varma', 'Kurup', 'Menon', 'Iyer', 'Iyengar', 'Ayyar', 'Pillai',
  'Hegde', 'Bhat', 'Shetty', 'Poojary', 'Amin', 'Kotian', 'Pai', 'Rao', 'Deshpande', 'Kini',
];

const emailDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'rediffmail.com', 'ymail.com'];

const cityStateMap: Record<string, string> = {
  'Mumbai': 'Maharashtra',
  'Delhi': 'Delhi',
  'New Delhi': 'Delhi',
  'Bangalore': 'Karnataka',
  'Bengaluru': 'Karnataka',
  'Hyderabad': 'Telangana',
  'Chennai': 'Tamil Nadu',
  'Kolkata': 'West Bengal',
  'Pune': 'Maharashtra',
  'Ahmedabad': 'Gujarat',
  'Jaipur': 'Rajasthan',
  'Lucknow': 'Uttar Pradesh',
  'Chandigarh': 'Chandigarh',
  'Indore': 'Madhya Pradesh',
  'Surat': 'Gujarat',
  'Goa': 'Goa',
  'Kochi': 'Kerala',
  'Thiruvananthapuram': 'Kerala',
  'Coimbatore': 'Tamil Nadu',
  'Nagpur': 'Maharashtra',
  'Bhopal': 'Madhya Pradesh',
  'Shimla': 'Himachal Pradesh',
  'Manali': 'Himachal Pradesh',
  'Ooty': 'Tamil Nadu',
  'Mysore': 'Karnataka',
  'Varanasi': 'Uttar Pradesh',
  'Rishikesh': 'Uttarakhand',
  'Agra': 'Uttar Pradesh',
  'Visakhapatnam': 'Andhra Pradesh',
  'Bhubaneswar': 'Odisha',
  'Guwahati': 'Assam',
  'Patna': 'Bihar',
  'Ranchi': 'Jharkhand',
  'Raipur': 'Chhattisgarh',
  'Thiruchirapalli': 'Tamil Nadu',
  'Madurai': 'Tamil Nadu',
  'Salem': 'Tamil Nadu',
  'Erode': 'Tamil Nadu',
  'Tirupati': 'Andhra Pradesh',
  'Vijayawada': 'Andhra Pradesh',
  'Guntur': 'Andhra Pradesh',
  'Nashik': 'Maharashtra',
  'Aurangabad': 'Maharashtra',
  'Vadodara': 'Gujarat',
  'Rajkot': 'Gujarat',
  'Srinagar': 'Jammu and Kashmir',
  'Jammu': 'Jammu and Kashmir',
  'Kota': 'Rajasthan',
  'Udaipur': 'Rajasthan',
  'Jodhpur': 'Rajasthan',
  'Bikaner': 'Rajasthan',
  'Ajmer': 'Rajasthan',
};

const cities = Object.keys(cityStateMap);

function generateUniqueName(index: number, usedNames: Set<string>): string {
  let attempt = 0;
  while (attempt < 10) {
    const firstName = firstNames[(index * 7 + attempt) % firstNames.length];
    const lastName = lastNames[(index * 11 + attempt) % lastNames.length];
    const fullName = `${firstName} ${lastName}`;
    
    if (!usedNames.has(fullName)) {
      usedNames.add(fullName);
      return fullName;
    }
    attempt++;
  }
  
  // Fallback with index suffix
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index + 1) % lastNames.length];
  return `${firstName} ${lastName} ${index}`;
}

function generateUniqueEmail(name: string, index: number, usedEmails: Set<string>): string {
  const [firstName, lastName] = name.split(' ');
  const baseEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomains[index % emailDomains.length]}`;
  
  if (!usedEmails.has(baseEmail)) {
    usedEmails.add(baseEmail);
    return baseEmail;
  }
  
  // Try with suffix
  for (let i = 1; i <= 100; i++) {
    const suffixEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${emailDomains[index % emailDomains.length]}`;
    if (!usedEmails.has(suffixEmail)) {
      usedEmails.add(suffixEmail);
      return suffixEmail;
    }
  }
  
  // Fallback
  const uniqueEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index}@${emailDomains[index % emailDomains.length]}`;
  usedEmails.add(uniqueEmail);
  return uniqueEmail;
}

function generateUniqueMobileNumber(index: number, usedNumbers: Set<string>): string {
  const prefixes = ['6', '7', '8', '9'];
  const prefix = prefixes[index % prefixes.length];
  
  let attempt = 0;
  while (attempt < 100) {
    const remaining = String(1000000000 + ((index * 12345 + attempt * 54321) % 8999999999)).slice(0, 9);
    const number = prefix + remaining;
    
    if (!usedNumbers.has(number)) {
      usedNumbers.add(number);
      return number;
    }
    attempt++;
  }
  
  // Fallback
  const remaining = String(1000000000 + (Math.random() * 8999999999)).slice(0, 9);
  const number = prefix + remaining;
  usedNumbers.add(number);
  return number;
}

function getStateForCity(city: string): string {
  return cityStateMap[city] || 'Maharashtra'; // Default fallback
}

export default createEndpoint({
  description: 'Clean up and normalize all customer data with realistic names, emails, and contact information',
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalCustomersProcessed: z.number(),
    namesChanged: z.number(),
    emailsChanged: z.number(),
    mobileNumbersGenerated: z.number(),
    citiesFilledOrCorrected: z.number(),
    statesFilledOrCorrected: z.number(),
    duplicateEmailsFound: z.number(),
    duplicatePhonesFound: z.number(),
    recordsWithIssues: z.number(),
    finalCustomerCount: z.number(),
    message: z.string(),
  }),
  execute: async () => {
    // Fetch all customers
    const allCustomers = await zite.customers.findAll({ limit: 2000 });
    const customers = allCustomers.records;

    let namesChanged = 0;
    let emailsChanged = 0;
    let mobileNumbersGenerated = 0;
    let citiesFilledOrCorrected = 0;
    let statesFilledOrCorrected = 0;
    let duplicateEmailsFound = 0;
    let duplicatePhonesFound = 0;
    let recordsWithIssues = 0;

    const usedNames = new Set<string>();
    const usedEmails = new Set<string>();
    const usedPhones = new Set<string>();
    const emailMap = new Map<string, string>();
    const phoneMap = new Map<string, string>();

    // First pass: identify existing emails and phones to preserve uniqueness
    for (const customer of customers) {
      if (customer.email) {
        usedEmails.add(customer.email);
        emailMap.set(customer.id, customer.email);
      }
      if (customer.phone) {
        usedPhones.add(customer.phone);
        phoneMap.set(customer.id, customer.phone);
      }
    }

    // Second pass: update all customers
    const updates: Array<{ id: string; record: CustomersRecordInput }> = [];

    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      
      // Generate new name if placeholder or empty
      let newFirstName = customer.firstName || '';
      let newLastName = customer.lastName || '';
      const isPlaceholderName = !newFirstName || !newLastName || 
                                newFirstName.toLowerCase().includes('customer') ||
                                newLastName.toLowerCase().includes('customer') ||
                                /^\d+$/.test(newFirstName);

      if (isPlaceholderName) {
        const newName = generateUniqueName(i, usedNames);
        [newFirstName, newLastName] = newName.split(' ');
        namesChanged++;
      } else {
        usedNames.add(`${newFirstName} ${newLastName}`);
      }

      // Generate new email if placeholder or empty
      let newEmail = customer.email || '';
      const isPlaceholderEmail = !newEmail || 
                                 newEmail.includes('@travel.local') ||
                                 newEmail.toLowerCase().includes('customer');

      if (isPlaceholderEmail) {
        newEmail = generateUniqueEmail(`${newFirstName} ${newLastName}`, i, usedEmails);
        emailsChanged++;
      }

      // Check for duplicate emails
      const emailCount = customers.filter(c => c.email === newEmail).length;
      if (emailCount > 1) {
        duplicateEmailsFound++;
        recordsWithIssues++;
      }

      // Handle mobile number
      let newPhone = customer.phone || '';
      if (!newPhone || newPhone.length < 10) {
        newPhone = generateUniqueMobileNumber(i, usedPhones);
        mobileNumbersGenerated++;
      }

      // Check for duplicate phones
      const phoneCount = customers.filter(c => c.phone === newPhone).length;
      if (phoneCount > 1) {
        duplicatePhonesFound++;
        recordsWithIssues++;
      }

      // Handle city
      let newCity = customer.city || '';
      if (!newCity || newCity.trim() === '') {
        newCity = cities[i % cities.length];
        citiesFilledOrCorrected++;
      }

      // Handle state - ensure it matches city
      let newState = customer.state || '';
      const correctState = getStateForCity(newCity);
      
      if (!newState || newState.trim() === '' || newState !== correctState) {
        newState = correctState;
        statesFilledOrCorrected++;
      }

      // Prepare update record
      updates.push({
        id: customer.id,
        record: {
          firstName: newFirstName || null,
          lastName: newLastName || null,
          email: newEmail || null,
          phone: newPhone || null,
          address: customer.address || null,
          city: newCity || null,
          state: newState || null,
          postalCode: customer.postalCode || null,
          dateOfBirth: customer.dateOfBirth || null,
          customerRating: customer.customerRating || null,
          bookings: null,
          reviews: null,
        },
      });
    }

    // Batch update all customers
    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];
      await zite.customers.update({ id: update.id, record: update.record });
    }

    // Final verification
    const finalCustomers = await zite.customers.findAll({ limit: 2000 });
    const finalCustomerCount = finalCustomers.records.length;

    // Verify no placeholder names remain
    const placeholderNamesRemaining = finalCustomers.records.filter(c => 
      !c.firstName || !c.lastName || 
      c.firstName.toLowerCase().includes('customer') ||
      c.lastName.toLowerCase().includes('customer') ||
      /^\d+$/.test(c.firstName || '')
    ).length;

    // Verify no placeholder emails remain
    const placeholderEmailsRemaining = finalCustomers.records.filter(c =>
      !c.email || c.email.includes('@travel.local') || c.email.toLowerCase().includes('customer')
    ).length;

    // Verify all have phone numbers
    const withoutPhone = finalCustomers.records.filter(c => !c.phone || c.phone.length < 10).length;

    // Verify all have city and state
    const withoutCity = finalCustomers.records.filter(c => !c.city || c.city.trim() === '').length;
    const withoutState = finalCustomers.records.filter(c => !c.state || c.state.trim() === '').length;

    return {
      totalCustomersProcessed: customers.length,
      namesChanged,
      emailsChanged,
      mobileNumbersGenerated,
      citiesFilledOrCorrected,
      statesFilledOrCorrected,
      duplicateEmailsFound,
      duplicatePhonesFound,
      recordsWithIssues,
      finalCustomerCount,
      message: `Customer data cleanup complete. Processed ${customers.length} customers. 
        Placeholder names remaining: ${placeholderNamesRemaining}, 
        Placeholder emails remaining: ${placeholderEmailsRemaining}, 
        Without phone: ${withoutPhone}, 
        Without city: ${withoutCity}, 
        Without state: ${withoutState}`,
    };
  },
});
