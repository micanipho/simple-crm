```markdown
# Simple CRM Backend (Next.js API Routes)

This project implements the backend API routes for a Simple CRM application using Next.js, TypeScript, and Prisma with a PostgreSQL database (e.g., RenderPostgres).

## Features

*   **Customer Management**:
    *   Add new customers (POST `/api/customers`)
    *   View all customers (GET `/api/customers`)
    *   Search customers by various fields (GET `/api/customers?search=query`)
    *   View a single customer's details (GET `/api/customers/[id]`)
    *   Update customer information (PUT `/api/customers/[id]`)
    *   Delete customer records (DELETE `/api/customers/[id]`)
*   **Interaction Tracking**:
    *   View all interactions for a specific customer (GET `/api/customers/[id]/interactions`)
    *   Add new interactions to a customer (POST `/api/customers/[id]/interactions`)
    *   Update interaction details (PUT `/api/interactions/[id]`)
    *   Delete interactions (DELETE `/api/interactions/[id]`)
*   **Robust Error Handling**: API routes return appropriate HTTP status codes (200, 201, 204, 400, 404, 405, 500) and JSON error messages.
*   **Server-Side Validation**: Basic validation for required fields and email format is performed on incoming request data.

## Technologies Used

*   **Framework**: Next.js (API Routes)
*   **Language**: TypeScript
*   **ORM**: Prisma
*   **Database**: PostgreSQL (e.g., RenderPostgres)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd simple-crm
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up your database:**
    Create a PostgreSQL database (e.g., on Render, Heroku, or locally).

4.  **Configure Environment Variables:**
    Create a `.env` file in the root directory of the project based on `.env.example`.
    ```
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
    ```
    Replace the placeholder with your actual PostgreSQL connection string.

5.  **Run Prisma Migrations:**
    Generate the Prisma client and push your schema to the database.
    ```bash
    npx prisma migrate dev --name init
    ```
    This command will:
    *   Generate the Prisma client based on your `schema.prisma`.
    *   Create a new migration file.
    *   Apply the migration to your database, creating the `Customer` and `Interaction` tables.

6.  **Start the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The API routes will be accessible at `http://localhost:3000/api/...`.

## API Endpoints

All endpoints return JSON responses.

### Customers

*   **`GET /api/customers`**
    *   Returns a list of all customers.
    *   **Query Params**: `search` (string, optional) - Filters customers by `firstName`, `lastName`, `email`, `phone`, or `address` (case-insensitive).
    *   **Responses**: `200 OK`
*   **`POST /api/customers`**
    *   Creates a new customer.
    *   **Body**: `{ "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "phone": "123-456-7890", "address": "123 Main St" }`
    *   `firstName`, `lastName`, `email` are required. `email` must be unique and valid.
    *   **Responses**: `201 Created`, `400 Bad Request` (for validation errors or duplicate email)
*   **`GET /api/customers/[id]`**
    *   Retrieves a single customer by ID.
    *   **Responses**: `200 OK`, `404 Not Found`, `400 Bad Request` (for invalid ID format)
*   **`PUT /api/customers/[id]`**
    *   Updates an existing customer.
    *   **Body**: `{ "firstName"?: "Jane", "email"?: "jane.doe@example.com" }` (any combination of fields)
    *   `email` must be unique and valid if provided.
    *   **Responses**: `200 OK`, `400 Bad Request` (for validation errors or duplicate email), `404 Not Found`
*   **`DELETE /api/customers/[id]`**
    *   Deletes a customer.
    *   **Responses**: `204 No Content`, `404 Not Found`, `400 Bad Request` (for invalid ID format)

### Interactions

*   **`GET /api/customers/[id]/interactions`**
    *   Retrieves all interactions for a specific customer.
    *   **Responses**: `200 OK`, `400 Bad Request` (for invalid customer ID format)
*   **`POST /api/customers/[id]/interactions`**
    *   Creates a new interaction for a customer.
    *   **Body**: `{ "type": "Call", "notes": "Discussed new project.", "interactionDate": "2023-10-27T10:00:00Z" }`
    *   `notes` is required. `interactionDate` is optional.
    *   **Responses**: `201 Created`, `400 Bad Request` (for validation errors or invalid customer ID), `404 Not Found` (if customer does not exist)
*   **`PUT /api/interactions/[id]`**
    *   Updates an existing interaction.
    *   **Body**: `{ "notes"?: "Follow-up email sent.", "type"?: "Email" }` (any combination of fields)
    *   `notes` cannot be empty if provided.
    *   **Responses**: `200 OK`, `400 Bad Request` (for validation errors), `404 Not Found`
*   **`DELETE /api/interactions/[id]`**
    *   Deletes an interaction.
    *   **Responses**: `204 No Content`, `404 Not Found`, `400 Bad Request` (for invalid ID format)

## Client-Side Validation Note

While this project focuses on the backend API, a complete Next.js CRM application would also implement client-side validation for forms. This typically involves:

*   **HTML5 `required` attribute**: For basic browser-level validation on fields like `firstName`, `lastName`, `email`, and `notes`.
*   **HTML5 `type="email"`**: For basic email format validation.
*   **JavaScript/React State Management**:
    *   Managing form input values and their validation status in React component state.
    *   Displaying real-time error messages (e.g., "Email is required", "Invalid email format") when fields are touched or submitted.
    *   Disabling submit buttons until all required fields are valid.
*   **Form Libraries**: Utilizing libraries like `React Hook Form` or `Formik` combined with validation schemas (e.g., `Zod`, `Yup`) for more robust and maintainable client-side validation logic.

The server-side validation implemented in these API routes acts as a crucial second line of defense, ensuring data integrity even if client-side validation is bypassed or fails.
```