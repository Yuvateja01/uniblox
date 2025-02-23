

## Local Development Setup

This guide will help you set up the project locally using Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Installation

1. **Clone the repository:**

   ```sh
   https://github.com/Yuvateja01/uniblox.git
   cd uniblox

2. Run the containers
   ```sh
   docker-compose up

3. Add a few entries to the Orders table for the Coupon APIS to work.Coupon is applicable based on minCartValue,minOrders and every Nth Order.


| id | status    | orderDate               | paymentMethod | price | userId |
|----|-----------|-------------------------|---------------|-------|--------|
| 1  | DELIVERED | 2025-02-22 15:47:16.623 | CASH          | 10    | 6      |
| 2  | DELIVERED | 2025-02-22 15:47:45.887 | CASH          | 20    | 6      |
| 3  | DELIVERED | 2025-02-22 15:48:10.083 | CASH          | 30    | 6      |
| 4  | DELIVERED | 2025-02-22 15:48:35.288 | CASH          | 40    | 6      |
