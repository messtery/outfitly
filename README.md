# outfitly

## Feature List
### Student App
1. Registration
2. Login
3. Browse Canteen Menus
4. Search & Filter Menus
5. Cart & Checkout
6. Payment Method Selection
7. Order Status Tracking
8. Estimated Waiting Time Prediction (AI)
9. Menu Recommendation (AI)
10. Favorite Menus
11. Order History
12. Reorder
13. Notifications
14. Profile Management
15. Change Password

### Vendor App
16. Menu Management
17. Inventory Management
18. Order Management
19. Daily Revenue Prediction (AI)
20. Peak Hour Insights

### Team Members
- 241110402 - Hermes Agistrian Laoli
- 241110236 - Richie Sanjiro
- 241111802 - Gylbert Mars Antonius
- 241110625 - Frederiko

---

## API Schema

### Base URL
http://localhost:8000


---

1. Create Order

POST /orders

Request Body
```json
{
  "customerId": 1,
  "items": [
    {
      "id": 1,
      "qty": 2,
      "price": 10000
    },
    {
      "id": 2,
      "qty": 1,
      "price": 5000
    }
  ]
}
```
Response (201)
```json
{
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "customerId": 1,
    "total": 25000,
    "paymentStatus": "pending",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "qty": 2,
        "price": 10000
      },
      {
        "id": 2,
        "orderId": 1,
        "productId": 2,
        "qty": 1,
        "price": 5000
      }
    ],
    "createdAt": "2026-05-02T00:00:00.000Z",
    "updatedAt": "2026-05-02T00:00:00.000Z"
  }
}
```
2. Get All Orders

GET /orders

Query Params
q (optional): search by order id
page (optional): default 1
limit (optional): default 10
Example
/orders?q=1&page=1&limit=10
Response (200)
```json
{
  "data": [
    {
      "id": 1,
      "customerId": 1,
      "total": 25000,
      "paymentStatus": "pending",
      "createdAt": "2026-05-02T00:00:00.000Z",
      "updatedAt": "2026-05-02T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```
3. Get Order By ID

GET /ordes/:id

Response (200)
```json
{
  "data": {
    "id": 1,
    "customerId": 1,
    "total": 25000,
    "paymentStatus": "pending",
    "createdAt": "2026-05-02T00:00:00.000Z",
    "updatedAt": "2026-05-02T00:00:00.000Z"
  }
}
```
Response (404)
```json
{
  "status": 404,
  "message": "Order not found"
}
```

4. Update Order

PUT /orders/:id

Request Body
```json
{
  "customerId": 2,
  "paymentStatus": "paid",
  "items": [
    {
      "id": 1,
      "qty": 3,
      "price": 10000
    }
  ]
}
```
Response (200)
```json
{
  "data": {
    "id": 1,
    "customerId": 2,
    "total": 30000,
    "paymentStatus": "paid",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "qty": 3,
        "price": 10000
      }
    ],
    "createdAt": "2026-05-02T00:00:00.000Z",
    "updatedAt": "2026-05-02T00:00:00.000Z"
  }
}
```
Response (404)
```json
{
  "message": "Order not found."
}
```
5. Delete Order

DELETE /orders/:id

Response (200)
```json
{
  "message": "Order with id 1 deleted successfully."
}
```
Response (404)
```json
{
  "message": "Order not found."
}
```
1. Create Product

POST /products

Request Body
```json

{
  "name": "Burger Spesial",
  "price": 20000,
  "description": "Burger dengan daging premium",
  "categoryId": 2
}
```
Response (201)
```json
{
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Burger Spesial",
    "price": 20000,
    "description": "Burger dengan daging premium",
    "categoryId": 2
  }
}
```

2. Get All Products

GET /products

Query Params
q (optional): search by product name
categoryId (optional): filter by category
minPrice / maxPrice (optional): filter by price range
page (optional): default 1
limit (optional): default 10
Example
/products?q=burger&categoryId=2&page=1&limit=5
Response(200)
```json
{
  "message": "Products fetched successfully",
  "totalItems": 1,
  "totalPages": 1,
  "currentPage": 1,
  "data": [
    {
      "id": 1,
      "name": "Burger Spesial",
      "price": 20000,
      "description": "Burger dengan daging premium",
      "categoryId": 2
    }
  ]
}
```

3. Get Product By ID

GET /products/:id

Response (200)
```json
{
  "id": 1,
  "name": "Burger Spesial",
  "price": 20000,
  "description": "Burger dengan daging premium",
  "categoryId": 2
}
```
Response (404)
```json
{
  "message": "Product not found"
}
```

4. Update Product

PATCH /products/:id

Request Body
```json
{
  "price": 25000,
  "description": "Burger dengan daging premium dan ekstra keju"
}
```
Response (200)
```json
{
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Burger Spesial",
    "price": 25000,
    "description": "Burger dengan daging premium dan ekstra keju",
    "categoryId": 2
  }
}
```
Response(404)
```json
{
  "message": "Product not found"
}
```

5. Delete Product

DELETE /products/:id

Response (200)
```json
{
  "message": "Product with id 1 deleted successfully."
}
```
Response (404)
```json
{
  "message": "Product not found."
}
```

---

1. Create Customers

POST /customers

Request Body
```json
{
  "name": "Budi",
  "phone": "08222",
  "email": "budi234@gmail.com",
  "address": "Surabaya"
},

```
Response (201)
```json
{
  "status": 201,
  "message": "Customer created",
  "data": {
    "id": 1,
    "name": "Budi",
    "phone": "08222",
    "email": "budi234@gmail.com",
    "address": "Surabaya",
    "updatedAt": "2026-05-02T04:20:38.095Z",
    "createdAt": "2026-05-02T04:20:38.095Z"
  }
}
```
2. Get All Customers

GET /customers

Query Params
q (optional): search by customers name
page (optional): default 1
limit (optional): default 10
Example
/customers?q=Budi&page=1&limit=10
Response (200)
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Budi",
      "email": "budi234@gmail.com",
      "phone": 8222,
      "address": "Surabaya",
      "createdAt": "2026-05-02T04:20:38.000Z",
      "updatedAt": "2026-05-02T04:20:38.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```
3. Get Customers By ID

GET /customers/:id

Response (200)
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Budi",
    "email": "budi234@gmail.com",
    "phone": 8222,
    "address": "Surabaya",
    "createdAt": "2026-05-02T04:20:38.000Z",
    "updatedAt": "2026-05-02T04:20:38.000Z"
  }
}
```
Response (404)
```json
{
  "status": 404,
  "message": "Customer not found"
}
```

4. Update Customers

PUT /customers/:id

Request Body
```json
{
  "name": "BudiUp",
  "phone": "08222",
  "email": "budi234@gmail.com",
  "address": "Surabaya"
}
```
Response (200)
```json
{
  "status": 200,
  "message": "Customer updated",
  "data": {
    "id": 1,
    "name": "BudiUp",
    "email": "budi234@gmail.com",
    "phone": "08222",
    "address": "Surabaya",
    "createdAt": "2026-05-02T04:20:38.000Z",
    "updatedAt": "2026-05-02T04:25:53.834Z"
  }
}
```
Response (404)
```json
{
  "status": 404,
  "message": "Customer not found"
}
```
5. Delete Customers

DELETE /customers/:id

Response (200)
```json
{
  "status": 200,
  "message": "Customer deleted"
}
```
Response (404)
```json
{
  "status": 404,
  "message": "Customer not found"
}
```