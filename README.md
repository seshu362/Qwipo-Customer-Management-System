# Customer Management System

A full-stack web application for managing customers and their addresses with complete CRUD operations, search functionality, and pagination.

## Project Overview

The Customer Management System is a comprehensive web application that allows users to manage customer information and their associated addresses. Features include customer creation, editing, deletion, address management, advanced search capabilities, and pagination for efficient data handling.

## Technology Stack

### Frontend
- **React 18** - User interface library
- **React Router DOM** - Client-side routing
- **CSS3** - Custom styling and responsive design
- **JavaScript ES6+** - Modern JavaScript features
- **Fetch API** - HTTP requests to backend

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Lightweight relational database
- **sqlite** - Async/await database driver
- **CORS** - Cross-origin resource sharing middleware

## Features

### Customer Management
- Create new customers with validation
- View customer list with pagination
- Search customers by name or phone number
- Filter customers by city
- Edit customer information
- Delete customers (with cascade address deletion)
- View detailed customer profiles

### Address Management
- Add multiple addresses per customer
- Edit existing addresses
- Delete individual addresses
- View all addresses for a customer
- Automatic city filtering from addresses

### User Interface
- Clean, intuitive interface
- Form validation with error messages
- Loading states and error handling
- Pagination controls
- Search and filter functionality

## Screenshots

### Customer List Page
![Customer list with search and filter options](https://via.placeholder.com/800x500?text=Customer+List+View)

### Customer Detail Page
![Customer details with address management](https://via.placeholder.com/800x500?text=Customer+Detail+View)

### Customer Form
![Add/Edit customer form with validation](https://via.placeholder.com/800x500?text=Customer+Form)

## Live Demo

🌐 **[View Live Demo](https://your-customer-management-demo.com)**

## Local Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm package manager
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/customer-management-system.git
cd customer-management-system
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install express sqlite sqlite3 cors

# Start the backend server
node server.js
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
customer-management-system/
│
├── server/
│   ├── server.js                    # Main server file
│   ├── customer_management.db       # SQLite database (auto-created)
│   ├── package.json                 # Backend dependencies
│   └── README.md                    # Backend documentation
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerList/        # Customer list component
│   │   │   │   ├── index.js
│   │   │   │   └── index.css
│   │   │   ├── CustomerDetail/      # Customer detail view
│   │   │   │   ├── index.js
│   │   │   │   └── index.css
│   │   │   ├── CustomerForm/        # Add/Edit customer form
│   │   │   │   ├── index.js
│   │   │   │   └── index.css
│   │   │   ├── AddressForm/         # Add/Edit address form
│   │   │   │   ├── index.js
│   │   │   │   └── index.css
│   │   │   └── AddressList/         # Address list component
│   │   │       ├── index.js
│   │   │       └── index.css
│   │   ├── App.js                   # Main app component
│   │   ├── index.css                # Global styles
│   │   └── index.js                 # Entry point
│   ├── public/
│   ├── package.json                 # Frontend dependencies
│   └── README.md                    # Frontend documentation
│
├── README.md                        # This file
└── .gitignore                       # Git ignore rules
```

## Database Schema

### Customers Table
```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Addresses Table
```sql
CREATE TABLE addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    address_details TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);
```

## API Endpoints

### Customer Management
- `GET /api/customers` - Get all customers with search/filter/pagination
- `GET /api/customers/:id` - Get specific customer with addresses
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer information
- `DELETE /api/customers/:id` - Delete customer and all addresses

### Address Management
- `GET /api/customers/:id/addresses` - Get all addresses for customer
- `POST /api/customers/:id/addresses` - Add new address to customer
- `PUT /api/addresses/:addressId` - Update specific address
- `DELETE /api/addresses/:addressId` - Delete specific address

### Utility Endpoints
- `GET /api/cities` - Get unique cities for filtering

## Sample Data

The application automatically creates sample data on first run:

**Sample Customers:**
1. Rajesh Kumar - 9876543210
2. Priya Nadiu - 9876543211
3. Arjun Reddy - 9876543212
4. Varun Royal - 9876543213
5. Vikram Babu - 9876543214

**Sample Addresses:**
- Each customer gets 2 addresses in Mumbai and Delhi
- Includes realistic address details with PIN codes

## Key Features Implemented

✅ **Complete CRUD Operations**
- Create, Read, Update, Delete for both customers and addresses
- Form validation on frontend and backend
- Error handling and user feedback

✅ **Advanced Search & Filtering**
- Real-time search by name or phone number
- City-based filtering
- Pagination for large datasets

✅ **Responsive Design**
- Mobile-friendly interface
- Clean, professional styling
- Intuitive navigation and user flow

✅ **Data Relationships**
- One-to-many relationship (Customer → Addresses)
- Cascade deletion of addresses when customer is deleted
- Foreign key constraints maintained

✅ **User Experience**
- Loading states during API calls
- Form validation with clear error messages
- Confirmation dialogs for delete operations
- Breadcrumb navigation

## Development Commands

### Backend
```bash
cd backend
node server.js          # Start server
npm init -y             # Initialize package.json (first time)
npm install express sqlite sqlite3 cors  # Install dependencies
```

### Frontend
```bash
cd frontend
npm start               # Start development server
npm run build          # Build for production
npm install            # Install dependencies (first time)
```

## API Usage Examples

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe", 
    "phone_number": "9876543220"
  }'
```

### Search Customers
```bash
# Search by name
curl "http://localhost:5000/api/customers?search=rajesh"

# Filter by city  
curl "http://localhost:5000/api/customers?city=Mumbai"

# Pagination
curl "http://localhost:5000/api/customers?page=2&limit=5"
```

### Add Address
```bash
curl -X POST http://localhost:5000/api/customers/1/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "address_details": "123 New Street, Apt 4B",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pin_code": "600001"
  }'
```

## Validation Rules

### Customer Validation
- **First Name**: Required, cannot be empty
- **Last Name**: Required, cannot be empty  
- **Phone Number**: Required, must be exactly 10 digits, must be unique

### Address Validation
- **Address Details**: Required, cannot be empty
- **City**: Required, cannot be empty
- **State**: Required, cannot be empty
- **PIN Code**: Required, must be exactly 6 digits

## Error Handling

The application includes comprehensive error handling:

### Frontend
- Form validation with real-time feedback
- Network error handling
- Loading states for better UX
- User-friendly error messages

### Backend
- Input validation
- Database error handling
- HTTP status codes
- Detailed error responses

## Testing the Application

### Manual Testing Steps

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Navigate to** http://localhost:3000
3. **Test customer operations:**
   - View customer list
   - Search for "rajesh"
   - Filter by "Mumbai"
   - Create new customer
   - Edit existing customer
   - Delete customer
4. **Test address operations:**
   - Click on customer to view details
   - Add new address
   - Edit existing address
   - Delete address
5. **Test pagination:**
   - Navigate through pages if more than 10 customers

### API Testing with curl

```bash
# Test customer creation
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","phone_number":"1234567890"}'

# Test customer retrieval
curl http://localhost:5000/api/customers

# Test search
curl "http://localhost:5000/api/customers?search=test"
```

## Dependencies

### Backend
```json
{
  "express": "^4.18.0",
  "sqlite": "^4.1.0", 
  "sqlite3": "^5.1.0",
  "cors": "^2.8.5"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "react-scripts": "5.0.1"
}
```

## Performance Considerations

- **Pagination**: Limits database queries to manageable chunks
- **Indexing**: Phone number has unique constraint for fast lookups
- **Cascade Deletes**: Automatic cleanup of related addresses
- **Efficient Queries**: Optimized SQL queries with proper JOINs

## Security Features

- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured for secure cross-origin requests
- **Data Sanitization**: Trim and validate all user inputs


## Quick Start Guide

1. **Clone the repo**: `git clone <repository-url>`
2. **Backend setup**: `cd backend && npm install express sqlite sqlite3 cors && node server.js`
3. **Frontend setup**: `cd frontend && npm install && npm start`
4. **Access app**: Open http://localhost:3000
5. **Test**: Create a customer, add addresses, search and filter

The application is ready to use with sample data automatically loaded!
