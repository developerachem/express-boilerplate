
# Node Express Boilerplate API Documentation

This API boilerplate is developed using **Node.js** and **Express**, featuring authentication and password reset functionality.

## Authentication

All API requests require Bearer Token authorization.

```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Forgot Password
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/forgot-password`
- **Description**: Sends a password reset email to the user.
- **Authorization**: Bearer Token
- **Request Body**:
  ```json
  {
    "email": "mdachem6@gmail.com"
  }
  ```
- **Example Request**:
  ```bash
  curl --location 'http://localhost:5000/api/v1/auth/forgot-password'   --data-raw '{
    "email": "mdachem6@gmail.com"
  }'
  ```
- **Response**: No response body.

---

### 2. Reset Password
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/reset-password/:token`
- **Description**: Resets the user's password using an OTP and token.
- **Authorization**: Bearer Token
- **Request Body**:
  ```json
  {
    "email": "mdachem6@gmail.com",
    "password": "123456",
    "otp": 696463
  }
  ```
- **Example Request**:
  ```bash
  curl --location 'http://localhost:5000/api/v1/auth/reset-password/:token'   --data-raw '{
    "email": "mdachem6@gmail.com",
    "password": "123456",
    "otp": 696463
  }'
  ```
- **Response**: No response body.

---

### 3. API Health Check
- **Method**: `GET`
- **Endpoint**: `/`
- **Description**: Checks if the API is up and running.
- **Authorization**: Bearer Token
- **Example Request**:
  ```bash
  curl --location 'http://localhost:5000'
  ```
- **Response**: No response body.

## Example cURL Requests

### Forgot Password
```bash
curl --location 'http://localhost:5000/api/v1/auth/forgot-password' --data-raw '{
    "email": "mdachem6@gmail.com"
}'
```

### Reset Password
```bash
curl --location 'http://localhost:5000/api/v1/auth/reset-password/:token' --data-raw '{
    "email": "mdachem6@gmail.com",
    "password": "123456",
    "otp": 696463
}'
```

### API Health Check
```bash
curl --location 'http://localhost:5000'
```

## Response Structure
All endpoints currently return **no response body**.

## Running Locally

To run the API locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the server:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`.

## License
This project is licensed under the MIT License.