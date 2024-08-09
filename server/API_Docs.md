Sure! Here's the adjusted documentation with the correct error format:

---

# Spotify Wrapper and Roaster API Documentation

## Endpoints

List of available endpoints:

- `GET /`
- `POST /register`
- `POST /login`
- `POST /google-login`
- `GET /roasts`
- `GET /roasts/:roastId`
- `DELETE /roasts/:roastId`
- `GET /spotify-login`
- `GET /spotify-callback`
- `GET /spotify-roast`
- `POST /spotify-search`
- `GET /profile`
- `PATCH /profile`

&nbsp;

## 1. GET /

**Description:**  
Get welcome message.

**Response:**

_Response (200 - OK)_

```json
{
  "message": "Welcome to Roastify API"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 2. POST /register

**Description:**  
Register a new user.

**Request:**

_Body_

```json
{
  "email": "<string>",
  "password": "<string>",
  "fullNname": "<string>"
}
```

**Response:**

_Response (201 - Created)_

```json
{
  "id": "<integer>",
  "email": "<string>",
  "fullNname": "<string>"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Error Credentials are required, please input the correct credentials"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 3. POST /login

**Description:**  
Login with email and password.

**Request:**

_Body_

```json
{
  "email": "<string>",
  "password": "<string>"
}
```

**Response:**

_Response (200 - OK)_

```json
{
  "access_token": "<string>"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Error Credentials are required, please input the correct credentials"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Error credentials does not match"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 4. POST /google-login

**Description:**  
Login with Google account.

**Request:**

_Headers_

```json
...
{
  "google_token": "<string>"
}
...
```

**Response:**

_Response (200 - OK)_

```json
{
  "access_token": "<string>"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 5. GET /roasts

**Description:**  
Get all roasts for authenticated user.

**Request:**

_Headers_

```json
{
  "authorization": "Bearer <token>"
}
```

**Response:**

_Response (200 - OK)_

```json
{
  "data": [
    {
      "id": "<integer>",
      "roastType": "<string>",
      "roastData": "<string>",
      "tracks": "<array of objects>",
      "artists": "<array of objects>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    },
    ...
  ]
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthorized"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 6. GET /roasts/:roastId

**Description:**  
Get specific roast by ID for authenticated user.

**Request:**

_Headers_

```json
{
  "authorization": "Bearer <token>"
}
```

_Params_

```
:roastId = <integer>
```

**Response:**

_Response (200 - OK)_

```json
{
  "data": [
    {
      "id": "<integer>",
      "roastType": "<string>",
      "roastData": "<string>",
      "tracks": "<array of objects>",
      "artists": "<array of objects>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ]
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthorized"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Roast not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 7. DELETE /roasts/:roastId

**Description:**  
Delete specific roast by ID for authenticated user.

**Request:**

_Headers_

```json
{
  "authorization": "Bearer <token>"
}
```

_Params_

```
:roastId = <integer>
```

**Response:**

_Response (200 - OK)_

```json
{
  "message": "Success delete Roast History"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthorized"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Error Data not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 8. GET /spotify-login

**Description:**  
Login to Spotify account.

**Request:**

_Headers_

```json
{
  "authorization": "Bearer <token>"
}
```

**Response:**

_Response (200 - OK)_

```json
{
  "loginUrl": "https://accounts.spotify.com/authorize?...params"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthorized"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 9. GET /spotify-callback

**Description:**  
Spotify authentication callback.

**Request**:
**_Query Parameters_**:

```
code: The authorization code received from Spotify.
state: The state parameter for CSRF protection.
```

**Response:**

_Response (200 - OK)_

```json
{
  "message": "Spotify login successful"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Missing code or state"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 10. GET /spotify-roast

**Description:**  
Get Spotify roast for authenticated user.

**Request:**

**_Query Parameters_**

```
  "spotify_access_token": "<string>",
```

_Headers_

```json
{
  "authorization": "Bearer <token>"
}
```

**Response:**

_Response (201 - Created)_

```json
{
  "output": {
    "id": "<string>",
    "roastType": "<string>",
    "roastData": "<string>",
    "tracks": "<array of objects>",
    "artists": "<array of objects>"
  }
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthorized"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 11. POST /spotify-search

**Description:**  
Search Spotify for a track or artist.

**Request:**

_Headers_

```json
{
  "authorization": "Bearer <token>"
}
```

_Body_

```json
{
  "spotify_access_token": "your_spotify_access_token"
}
```

**_Request Query Parameters:_**

```
search: The search term (e.g., artist name or track name).
type: The type of search (e.g., "artist" or "track").
```

**Response:**

_Response (200 - OK)_

```json
{
  "results": [
    {
      "tracks": "<array of objects>",
      "artist": "<array of objects>",
    },
    ...
  ]
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthorized"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 12. GET /profile

**Description:**  
Get authenticated user's profile.

**Request:**

_Headers_

```json
{
  "authorization": "Bearer <token>"
}
```

**Response:**

_Response (200 - OK)_

```json
{
  "profile": {
    "id": "<integer>",
    "email": "<string>",
    "fullName": "<string>",
    "password": "<string>",
    "googleId": "<string>",
    "spotifyId": "<string>",
    "lastRoastDate": <string>,
    "imageUrl": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthorized"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Error Data not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 13. PATCH /profile

**Description:**  
Update authenticated user's profile picture.

**Request:**

_Headers_

```json
{
  "authorization": "Bearer <token>"
}
```

_Body_

```json
{
  "image": "<image>"
}
```

**Response:**

_Response (200 - OK)_

```json
{
  "message": "Success update profile picture"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Please upload a valid image file"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthorized"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Error Data not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

---
