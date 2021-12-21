# Movie API Documentation

1. `POST /movies`

   1. Allows creating a movie object based on movie title passed in the request body
   2. Based on the title additional movie details are fetching from
      https://omdbapi.com/ and saved to the database.
      Data that we are fetching from OMDb API:

   ```
     Title: string
     Released: date
     Genre: string
     Director: string
   ```

   3. Only authorized users can create a movie.
   4. `Basic` users are restricted to create 5 movies per month (calendar
      month). `Premium` users have no limits.
   5. Example:

   ```
   Header:
   Athorization: Bearer JWT_SECRET

   Body:
   {
    "title": "The Shawshank Redemption"
   }

   Responses:
   200 - title does not exist
   {
    "title": "The Shawshank Redemption",
    "released": "14 Oct 1994",
    "genre": "Drama",
    "director": "Frank Darabont",
    "userID": "123",
    "_id": "61c2444c796b1d8f1d58d3bb"
   }

   400 - title is empty
   {
    "message": "Title is empty"
   }

   409 - title exist
   {
    "message": "Title The Shawshank Redemption already exist in database"
   }

   404 - movie was not found
   {
    "message": "Movie not found!"
   }
   ```

1. `GET /movies`

   1. Should fetch a list of all movies created by an authorized user.

   ```
   Header:
   Athorization: Bearer JWT_SECRET

   Body:
   {
    "title": "The Shawshank Redemption"
   }

   Responses:
   {
    "movies": [
      {
          "_id": "61c2444c796b1d8f1d58d3bb",
          "title": "The Shawshank Redemption",
          "released": "14 Oct 1994",
          "genre": "Drama",
          "director": "Frank Darabont",
          "userID": "123"
      }
    ]
   }
   ```
