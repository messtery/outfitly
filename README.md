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
