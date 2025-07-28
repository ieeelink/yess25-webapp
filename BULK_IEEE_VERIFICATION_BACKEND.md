# Backend Implementation Guide for Bulk IEEE Verification

## Overview
The bulk IEEE verification feature processes CSV files containing IEEE membership data and matches them against registered tickets.

## Data Structure
The uploaded CSV can have either format:

### Format 1: Simple Template Format
```csv
ieee_number,first_name,last_name,institution
99739023,ALEESHA,SHAMINS,College of Engineering-Perumon
100490042,Joshua,Bose,
```

### Format 2: Official IEEE Export Format
```csv
School Name,Member/Customer Number,Last Name,First Name
College of Engineering-Perumon,99739023,SHAMINS,ALEESHA
,100490042,Bose,Joshua
```

## API Endpoint: `/api/bulk-ieee-verify`

### Request
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field**: `ieeeFile` (the uploaded CSV/Excel file)
- **Headers**: Authorization: Bearer {token}

### Response Format
```json
{
  "verified": 25,
  "failed": 3,
  "notFound": 15,
  "total": 43,
  "details": [
    {
      "ieee_number": "99739023",
      "name": "ALEESHA SHAMINS",
      "status": "verified",
      "message": "IEEE membership verified and ticket updated"
    },
    {
      "ieee_number": "100490042",
      "name": "Joshua Bose", 
      "status": "not_found",
      "message": "No matching ticket found for this IEEE member"
    },
    {
      "ieee_number": "12345678",
      "name": "John Doe",
      "status": "failed",
      "message": "IEEE number mismatch in ticket"
    }
  ]
}
```

## Backend Processing Logic

### 1. File Processing
```javascript
// Parse CSV file (handle both formats)
const records = parseCsv(uploadedFile);

// Normalize to standard format
const normalizedRecords = records.map(record => ({
  ieee_number: record['Member/Customer Number'] || record['ieee_number'],
  first_name: record['First Name'] || record['first_name'], 
  last_name: record['Last Name'] || record['last_name'],
  institution: record['School Name'] || record['institution']
}));
```

### 2. Verification Logic
```javascript
const results = {
  verified: 0,
  failed: 0, 
  notFound: 0,
  total: normalizedRecords.length,
  details: []
};

for (const member of normalizedRecords) {
  // Find matching ticket by IEEE number and name similarity
  const ticket = await findMatchingTicket(member);
  
  if (!ticket) {
    results.notFound++;
    results.details.push({
      ieee_number: member.ieee_number,
      name: `${member.first_name} ${member.last_name}`,
      status: 'not_found',
      message: 'No matching ticket found for this IEEE member'
    });
    continue;
  }
  
  // Verify IEEE number matches
  if (ticket.ieeeMembershipNumber === member.ieee_number) {
    // Update ticket verification status
    await updateTicketVerification(ticket._id, true);
    results.verified++;
    results.details.push({
      ieee_number: member.ieee_number,
      name: `${member.first_name} ${member.last_name}`,
      status: 'verified', 
      message: 'IEEE membership verified and ticket updated'
    });
  } else {
    results.failed++;
    results.details.push({
      ieee_number: member.ieee_number,
      name: `${member.first_name} ${member.last_name}`,
      status: 'failed',
      message: `IEEE number mismatch: expected ${ticket.ieeeMembershipNumber}, got ${member.ieee_number}`
    });
  }
}
```

### 3. Matching Strategy
```javascript
async function findMatchingTicket(member) {
  // Strategy 1: Exact IEEE number match
  let ticket = await Ticket.findOne({ 
    ieeeMembershipNumber: member.ieee_number,
    isIEEEMember: 'yes'
  });
  
  if (ticket) return ticket;
  
  // Strategy 2: Name similarity + no IEEE number in ticket yet
  const nameVariations = generateNameVariations(member.first_name, member.last_name);
  
  ticket = await Ticket.findOne({
    isIEEEMember: 'yes',
    $or: nameVariations.map(name => ({
      fullName: { $regex: name, $options: 'i' }
    })),
    $or: [
      { ieeeMembershipNumber: { $exists: false } },
      { ieeeMembershipNumber: '' },
      { ieeeMembershipNumber: null }
    ]
  });
  
  return ticket;
}

function generateNameVariations(firstName, lastName) {
  return [
    `${firstName} ${lastName}`,
    `${lastName} ${firstName}`,
    `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
    `${lastName.toLowerCase()} ${firstName.toLowerCase()}`,
    // Add more variations as needed
  ];
}
```

### 4. Database Update
```javascript
async function updateTicketVerification(ticketId, isVerified) {
  await Ticket.findByIdAndUpdate(ticketId, {
    ieeeVerified: isVerified,
    ieeeVerificationCompleted: true,
    ieeeVerifiedAt: new Date()
  });
}
```

## Key Features
1. **Flexible Format Support**: Handles both template and official IEEE export formats
2. **Smart Matching**: Uses IEEE number and name similarity for matching
3. **Detailed Results**: Provides specific feedback for each record
4. **Bulk Processing**: Efficiently handles large files
5. **Error Handling**: Graceful handling of malformed data

## Security Considerations
- Validate file size (max 10MB)
- Sanitize CSV input
- Require admin authentication
- Log all verification activities
- Rate limiting for bulk operations
