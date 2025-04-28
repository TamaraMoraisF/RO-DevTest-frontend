# RO.DevTest-Frontend

This project is the **frontend** application for the [RO.DevTest](https://github.com/TamaraMoraisF/RO.DevTest) backend.  
It provides a user interface to manage customers, products, and sales, supporting authentication, role-based access, pagination, sorting, and sales analytics.

It was developed to meet the requirements of the **Rota das Oficinas technical test**.

## 🎥 Demo

![Frontend Demo](demo.gif)

## 🧩Features

- **Login and Authentication:** Login screen with JWT authentication.
- **Role-Based Access:** Different screens and permissions for `Admin` and `Customer` roles.
- **CRUD Operations:**
  - Create, edit, and delete **Products** (Admin only).
  - Create, edit, and delete **Customers** (Admin only).
  - Create and view **Sales** (Admin only).
- **Sales Analytics:** Analyze total sales, total revenue, and product-wise breakdown for a selected period.
- **Pagination and Sorting:** Available for Product, Customer, and Sale listings.
- **Form Validations:** Inputs validated directly on the client side.

## ⚙️ Technologies Used

- React + TypeScript
- Axios for API communication
- React Router for navigation
- JWT Decode for token handling
- Vite for building and running the project

## 📦 Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/TamaraMoraisF/RO-DevTest-frontend.git
```

### 2. Navigate to the project folder

```bash
cd RO-DevTest-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will run at:

```
http://localhost:5173
```

## 🔐 Authentication and Authorization

After logging in, a JWT token is stored in the browser's local storage.  
The token is used to authenticate all API requests to the backend.

### Example of the localStorage content:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🧩 Backend Integration

This frontend consumes the API provided by the [RO.DevTest backend](https://github.com/TamaraMoraisF/RO.DevTest).

> ⚡ Make sure the backend is running at `https://localhost:7014` (or adjust the base URL in the Axios configuration if necessary).

Features such as login, CRUD operations, and analytics rely on the backend endpoints.

## 📄 Project Structure

```
src/
├── api/             # Axios instance
├── components/      # Reusable components (modals, tables, etc.)
├── models/          # TypeScript types (Product, Customer, Sale, etc.)
├── pages/           # Main screens (LoginPage, SuccessPage, etc.)
├── services/        # Service functions to call backend APIs
└── App.tsx          # Application routes and layout
```

## 📝 Notes

- Proper error handling and loading states are implemented.
- Unauthorized users are redirected to the login page.
- Role-based access control is enforced at the frontend level as well.