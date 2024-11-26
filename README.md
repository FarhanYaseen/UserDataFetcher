### Running the Node Project

To run this Node.js project, follow these steps:

1. **Clone the Repository**: Clone the repository to your local machine using Git.
   ```sh
   git clone git@github.com:FarhanYaseen/UserDataFetcher.git
   ```

2. **Install Dependencies**: Navigate to the project directory and install the project dependencies.
   ```sh
   npm install
   ```

3. **Start the Server**: Start the development server by running the following command:
   ```sh
   npm run dev
   ```

4. **Access the API**: Use a tool like Postman or cURL to send a GET request to the endpoint.
   ```
   http://localhost:3000/users
   ```

5. **Query Parameters**: Add query parameters to filter or sort the results. For example, to get the first page of users sorted by creation date:
   ```
   http://localhost:3000/users?limit=10&page=1&sortBy=createdAt
   ```
6. **Run Test**: Run test by
    ```
    npm run test
    ```

6. **Receive the Response**: The server will return paginated user data in JSON format.

### API Documentation

**Endpoint:** `GET /users`

**Query Parameters:**

* `limit` (optional): The number of users to return per page. Example: `10`.
* `page` (optional): The page number to return. Example: `1`.
* `sortBy` (optional): The field to sort the users by. Example: `createdAt`.
* `search` (optional): A JSON object to filter users by specific fields. Example: `{"name":"John","address.country":"USA"}`.

**Example Request:**
```
GET http://localhost:3000/users?limit=10&page=1&sortBy=createdAt&search={"name":"John","address.country":"USA"}
```

**Example Response:**
```json
{
  "total": 8107,
  "limit": 10,
  "page": 6,
  "sortBy": "createdAt",
  "items": [
    {
      "id": "6744b1f5ef731a5e45399972",
      "gender": "female",
      "name": "Gabriele Cardoso",
      "address": {
        "city": "Jaú",
        "state": "Tocantins",
        "country": "Brazil",
        "street": "Rua Santo Antônio "
      },
      "email": "gabriele.cardoso@example.com",
      "age": "34",
      "picture": "https://randomuser.me/api/portraits/women/89.jpg",
      "createdAt": "2024-11-25T17:20:53.836Z"
    }
  ]
}
```