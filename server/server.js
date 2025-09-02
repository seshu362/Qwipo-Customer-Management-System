const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const cors = require("cors");

let db;
const app = express();
app.use(express.json());
app.use(cors());

const initializeDBandServer = async () => {
    try {
        db = await open({
            filename: path.join(__dirname, "customer_management.db"),
            driver: sqlite3.Database,
        });

        // Create tables if they don't exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone_number TEXT NOT NULL UNIQUE,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER,
                address_details TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                pin_code TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
            );
        `);

        // Insert sample data if tables are empty
        const customerCount = await db.get("SELECT COUNT(*) as count FROM customers");
        if (customerCount.count === 0) {
            await insertSampleData();
        }

        app.listen(5000, () => {
            console.log("Server is running on http://localhost:5000/");
        });
    } catch (error) {
        console.log(`Database error is ${error.message}`);
        process.exit(1);
    }
};

const insertSampleData = async () => {
    const sampleCustomers = [
        {
            first_name: "Rajesh",
            last_name: "Kumar",
            phone_number: "9876543210"
        },
        {
            first_name: "Priya",
            last_name: "Nadiu",
            phone_number: "9876543211"
        },
        {
            first_name: "Arjun",
            last_name: "Reddy",
            phone_number: "9876543212"
        },
        {
            first_name: "varun",
            last_name: "Royal",
            phone_number: "9876543213"
        },
        {
            first_name: "Vikram",
            last_name: "Babu",
            phone_number: "9876543214"
        },
        
    ];

    for (const customer of sampleCustomers) {
        const result = await db.run(
            `INSERT INTO customers (first_name, last_name, phone_number) 
             VALUES (?, ?, ?)`,
            [customer.first_name, customer.last_name, customer.phone_number]
        );

        // Add sample addresses for each customer
        const sampleAddresses = [
            {
                address_details: "123 Main Street, Apartment 4B",
                city: "Mumbai",
                state: "Maharashtra",
                pin_code: "400001"
            },
            {
                address_details: "456 Park Avenue, House No. 12",
                city: "Delhi",
                state: "Delhi",
                pin_code: "110001"
            }
        ];

        for (const address of sampleAddresses) {
            await db.run(
                `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) 
                 VALUES (?, ?, ?, ?, ?)`,
                [result.lastID, address.address_details, address.city, address.state, address.pin_code]
            );
        }
    }
};

// GET /api/customers - Retrieve all customers with search, filter and pagination
app.get("/api/customers", async (req, res) => {
    try {
        const { search, city, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT c.*, COUNT(a.id) as address_count 
            FROM customers c 
            LEFT JOIN addresses a ON c.id = a.customer_id
        `;
        let countQuery = "SELECT COUNT(DISTINCT c.id) as total FROM customers c LEFT JOIN addresses a ON c.id = a.customer_id";
        let params = [];
        let conditions = [];

        // Search functionality
        if (search) {
            conditions.push("(c.first_name LIKE ? OR c.last_name LIKE ? OR c.phone_number LIKE ?)");
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        // Filter by city
        if (city) {
            conditions.push("a.city = ?");
            params.push(city);
        }

        if (conditions.length > 0) {
            const whereClause = " WHERE " + conditions.join(" AND ");
            query += whereClause;
            countQuery += whereClause;
        }

        query += " GROUP BY c.id ORDER BY c.createdAt DESC LIMIT ? OFFSET ?";
        params.push(parseInt(limit), parseInt(offset));

        const customers = await db.all(query, params);
        
        // Get total count for pagination
        const totalResult = await db.get(countQuery, params.slice(0, -2));
        const total = totalResult.total;

        res.json({
            message: "success",
            data: customers,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_records: total,
                per_page: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Error retrieving customers:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/customers/:id - Get specific customer details with addresses
app.get("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await db.get("SELECT * FROM customers WHERE id = ?", [id]);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        
        const addresses = await db.all(
            "SELECT * FROM addresses WHERE customer_id = ? ORDER BY createdAt DESC", 
            [id]
        );
        
        res.json({ 
            message: "success",
            data: { ...customer, addresses }
        });
    } catch (error) {
        console.error("Error retrieving customer:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/customers - Create a new customer
app.post("/api/customers", async (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: "All fields (first_name, last_name, phone_number) are required" });
    }

    try {
        // Check if phone number already exists
        const existingCustomer = await db.get(
            "SELECT * FROM customers WHERE phone_number = ?",
            [phone_number]
        );

        if (existingCustomer) {
            return res.status(409).json({ error: "Phone number already exists" });
        }

        const result = await db.run(
            "INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)",
            [first_name, last_name, phone_number]
        );

        const newCustomer = await db.get("SELECT * FROM customers WHERE id = ?", [result.lastID]);

        res.status(201).json({
            message: "Customer created successfully",
            data: newCustomer
        });
    } catch (error) {
        console.error("Error creating customer:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/customers/:id - Update customer information
app.put("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;
    
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if customer exists
        const customer = await db.get("SELECT * FROM customers WHERE id = ?", [id]);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Check if phone number already exists for other customers
        const existingCustomer = await db.get(
            "SELECT * FROM customers WHERE phone_number = ? AND id != ?",
            [phone_number, id]
        );

        if (existingCustomer) {
            return res.status(409).json({ error: "Phone number already exists" });
        }

        await db.run(
            "UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?",
            [first_name, last_name, phone_number, id]
        );

        const updatedCustomer = await db.get("SELECT * FROM customers WHERE id = ?", [id]);

        res.json({
            message: "Customer updated successfully",
            data: updatedCustomer
        });
    } catch (error) {
        console.error("Error updating customer:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /api/customers/:id - Delete a customer
app.delete("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const customer = await db.get("SELECT * FROM customers WHERE id = ?", [id]);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        await db.run("DELETE FROM customers WHERE id = ?", [id]);
        
        res.json({
            message: "Customer deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting customer:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/customers/:id/addresses - Add a new address for a customer
app.post("/api/customers/:id/addresses", async (req, res) => {
    const { id } = req.params;
    const { address_details, city, state, pin_code } = req.body;
    
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ error: "All address fields are required" });
    }

    try {
        // Check if customer exists
        const customer = await db.get("SELECT * FROM customers WHERE id = ?", [id]);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        const result = await db.run(
            "INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)",
            [id, address_details, city, state, pin_code]
        );

        const newAddress = await db.get("SELECT * FROM addresses WHERE id = ?", [result.lastID]);

        res.status(201).json({
            message: "Address added successfully",
            data: newAddress
        });
    } catch (error) {
        console.error("Error adding address:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/customers/:id/addresses - Get all addresses for a customer
app.get("/api/customers/:id/addresses", async (req, res) => {
    const { id } = req.params;
    
    try {
        const customer = await db.get("SELECT * FROM customers WHERE id = ?", [id]);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        const addresses = await db.all(
            "SELECT * FROM addresses WHERE customer_id = ? ORDER BY createdAt DESC",
            [id]
        );
        
        res.json({
            message: "success",
            data: addresses
        });
    } catch (error) {
        console.error("Error retrieving addresses:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/addresses/:addressId - Update a specific address
app.put("/api/addresses/:addressId", async (req, res) => {
    const { addressId } = req.params;
    const { address_details, city, state, pin_code } = req.body;
    
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ error: "All address fields are required" });
    }

    try {
        const address = await db.get("SELECT * FROM addresses WHERE id = ?", [addressId]);
        if (!address) {
            return res.status(404).json({ error: "Address not found" });
        }

        await db.run(
            "UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?",
            [address_details, city, state, pin_code, addressId]
        );

        const updatedAddress = await db.get("SELECT * FROM addresses WHERE id = ?", [addressId]);

        res.json({
            message: "Address updated successfully",
            data: updatedAddress
        });
    } catch (error) {
        console.error("Error updating address:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /api/addresses/:addressId - Delete a specific address
app.delete("/api/addresses/:addressId", async (req, res) => {
    const { addressId } = req.params;
    
    try {
        const address = await db.get("SELECT * FROM addresses WHERE id = ?", [addressId]);
        if (!address) {
            return res.status(404).json({ error: "Address not found" });
        }

        await db.run("DELETE FROM addresses WHERE id = ?", [addressId]);
        
        res.json({
            message: "Address deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting address:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/cities - Get unique cities for filtering
app.get("/api/cities", async (req, res) => {
    try {
        const cities = await db.all("SELECT DISTINCT city FROM addresses ORDER BY city");
        res.json({
            message: "success",
            data: cities.map(row => row.city)
        });
    } catch (error) {
        console.error("Error retrieving cities:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

initializeDBandServer();