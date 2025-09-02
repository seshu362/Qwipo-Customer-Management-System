# Customer Management Backend API

A Node.js Express backend API for managing customers and their addresses using SQLite database.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)

## Features

- **Customer Management**: Create, read, update, and delete customers
- **Address Management**: Manage multiple addresses per customer
- **Search & Filter**: Search customers by name/phone, filter by city
- **Pagination**: Paginated customer listing
- **Data Validation**: Server-side validation for all inputs
- **Sample Data**: Automatic sample data insertion on first run
- **CORS Enabled**: Cross-origin requests supported

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Database Driver**: sqlite (async/await support)
- **CORS**: cors middleware

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. **Create server directory and navigate to it:**
   ```bash
   mkdir server
   cd server
   ```

2. **Initialize Node.js project:**
   ```bash
   npm init -y
   ```

3. **Install dependencies:**
   ```bash
   npm install express sqlite sqlite3 cors
   ```

4. **Create server.js file** (copy the provided server code)

5. **Start the server:**
   ```bash
   node server.js
   ```

6. **Server will start on:**
   ```
   http://localhost:5000
   ```

## Database Schema

### Customers Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique customer ID |
| `first_name` | TEXT | NOT NULL | Customer's first name |
| `last_name` | TEXT | NOT NULL | Customer's last name |
| `phone_number` | TEXT | NOT NULL UNIQUE | Customer's phone number |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |

### Addresses Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique address ID |
| `customer_id` | INTEGER | FOREIGN KEY (customers.id) | Links to customer |
| `address_details` | TEXT | NOT NULL | Street address details |
| `city` | TEXT | NOT NULL | City name |
| `state` | TEXT | NOT NULL | State name |
| `pin_code` | TEXT | NOT NULL | Postal/ZIP code |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Relationship**: One-to-Many (One customer can have multiple addresses)

## API Endpoints

### Customer Endpoints

#### 1. Get All Customers
```
GET /api/customers
```

**Query Parameters:**
- `search` (optional): Search by name or phone number
- `city` (optional): Filter customers by city
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of records per page (default: 10)

**Response:**
```json
{
    "message": "success",
    "data": [
        {
            "id": 1,
            "first_name": "Rajesh",
            "last_name": "Kumar",
            "phone_number": "9876543210",
            "createdAt": "2024-01-01 10:00:00",
            "address_count": 2
        }
    ],
    "pagination": {
        "current_page": 1,
        "total_pages": 3,
        "total_records": 25,
        "per_page": 10
    }
}
```

#### 2. Get Customer by ID
```
GET /api/customers/:id
```

**Response:**
```json
{
    "message": "success",
    "data": {
        "id": 1,
        "first_name": "Rajesh",
        "last_name": "Kumar",
        "phone_number": "9876543210",
        "createdAt": "2024-01-01 10:00:00",
        "addresses": [
            {
                "id": 1,
                "customer_id": 1,
                "address_details": "123 Main Street",
                "city": "Mumbai",
                "state": "Maharashtra",
                "pin_code": "400001",
                "createdAt": "2024-01-01 10:00:00"
            }
        ]
    }
}
```

#### 3. Create New Customer
```
POST /api/customers
```

**Request Body:**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "9876543215"
}
```

**Response:**
```json
{
    "message": "Customer created successfully",
    "data": {
        "id": 6,
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "9876543215",
        "createdAt": "2024-01-01 15:30:00"
    }
}
```

#### 4. Update Customer
```
PUT /api/customers/:id
```

**Request Body:**
```json
{
    "first_name": "John",
    "last_name": "Smith",
    "phone_number": "9876543215"
}
```

#### 5. Delete Customer
```
DELETE /api/customers/:id
```

**Response:**
```json
{
    "message": "Customer deleted successfully"
}
```

### Address Endpoints

#### 1. Add Address to Customer
```
POST /api/customers/:id/addresses
```

**Request Body:**
```json
{
    "address_details": "456 Park Avenue, Apartment 2A",
    "city": "Delhi",
    "state": "Delhi",
    "pin_code": "110001"
}
```

#### 2. Get Customer Addresses
```
GET /api/customers/:id/addresses
```

#### 3. Update Address
```
PUT /api/addresses/:addressId
```

**Request Body:**
```json
{
    "address_details": "789 New Street, House No. 5",
    "city": "Bangalore",
    "state": "Karnataka",
    "pin_code": "560001"
}
```

#### 4. Delete Address
```
DELETE /api/addresses/:addressId
```

### Utility Endpoints

#### Get All Cities
```
GET /api/cities
```

**Response:**
```json
{
    "message": "success",
    "data": ["Mumbai", "Delhi", "Bangalore", "Chennai"]
}
```

## Usage Examples

### Search Customers
```bash
# Search by name
curl "http://localhost:5000/api/customers?search=rajesh"

# Filter by city
curl "http://localhost:5000/api/customers?city=Mumbai"

# Pagination
curl "http://localhost:5000/api/customers?page=2&limit=5"

# Combined search, filter, and pagination
curl "http://localhost:5000/api/customers?search=kumar&city=Delhi&page=1&limit=10"
```

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alice",
    "last_name": "Johnson",
    "phone_number": "9876543216"
  }'
```

### Add Address
```bash
curl -X POST http://localhost:5000/api/customers/1/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "address_details": "123 Business District",
    "city": "Mumbai",
    "state": "Maharashtra", 
    "pin_code": "400002"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate phone number)
- `500` - Internal Server Error

### Error Response Format
```json
{
    "error": "Error description message"
}
```

### Common Errors
- **400 Bad Request**: Missing required fields
- **404 Not Found**: Customer/Address doesn't exist
- **409 Conflict**: Phone number already exists
- **500 Internal Server Error**: Database or server issues

## Project Structure

```
server/
├── server.js              # Main server file
├── customer_management.db  # SQLite database (auto-created)
├── package.json           # Node.js dependencies
└── README.md             # This documentation
```

## Sample Data

The server automatically inserts sample data on first run:

**Sample Customers:**
- Rajesh Kumar (9876543210)
- Priya Sharma (9876543211)
- Amit Singh (9876543212)
- Sunita Patel (9876543213)
- Vikram Gupta (9876543214)

**Sample Addresses:**
- Each customer gets 2 sample addresses
- Cities include: Mumbai, Delhi
- States include: Maharashtra, Delhi

## Development Tips

1. **Database File**: The SQLite database file `customer_management.db` will be created automatically in the server directory

2. **Testing API**: Use tools like:
   - Postman
   - curl commands
   - VS Code REST Client extension

3. **Database Inspection**: Use SQLite browser tools to inspect the database:
   - DB Browser for SQLite
   - SQLite Studio

4. **Logging**: Server logs all database operations and errors to the console

5. **Port Configuration**: Server runs on port 5000 (matches project requirements)

## Next Steps

After setting up the backend:

1. Test all endpoints using Postman or curl
2. Verify database tables are created correctly
3. Check sample data insertion
4. Proceed with frontend React development
5. Connect frontend to these API endpoints

## Support

If you encounter issues:

1. Check that all dependencies are installed
2. Ensure port 5000 is not in use by other applications
3. Verify Node.js version compatibility
4. Check console logs for detailed error messages