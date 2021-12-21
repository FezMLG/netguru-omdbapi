# Netguru Node.js recruitment task

## Basic Description

1. Full API documentation avaiable in README in:

- `movie-service/` for Movies
- `auth-service/` for Authorization

2. Manipulating data in Movies is token protected. Token should be passed in Authorization header.
3. Both services are dockerized, you can run them separetly.
4. By default `movie-service` starts on 4000 port, `auth-service` starts on 3000 port and `mongoDB` starts on 27017 port

### Created containers:

1. The Auth service
2. MongoDB
3. The Movie service

### To run you need env file with:

1. `OMDB_TOKEN` - your omdb api key
2. `JWT_SECRET` - your genereted jwt secret
3. `DB_CONNECTION` - your mongodb server uri

### Technology stack

- Node.js
- Express
- MongoDB
- Axios
- Mocha
- Chai
- JSON Web Token
- Docker

# Screenshots

For API testing i was using postman

## Prove of running everything in docker

![Running Docker Localy](screenshots/docker_localy.png?raw=true "Running Docker Localy")

## First you need to login to `auth service` - `POST /auth` with cridentials in `auth-service/src/auth.js` file.

![Auth Reponse](screenshots/logging_in.png?raw=true "Auth Response")

## Getting movies from `movie-service` - `GET /api/movies`

![Get Movies](screenshots/get_movies.png?raw=true "Get Movies")

## Adding movies with `movie-service` - `POST /api/movies`

![Adding Movies](screenshots/adding_movies.png?raw=true "Adding Movies")
