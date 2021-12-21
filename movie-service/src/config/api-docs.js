const authHost = `http://localhost:3000`;

const swagger = {
  openapi: "3.0.0",
  info: {
    description: "This is a simple movie API",
    version: "1.0.0-oas3",
    title: "Simple Movie API",
  },
  tags: [
    {
      name: "Movie",
      description: "Operations to fetch and add movie",
    },
  ],
  paths: {
    "/api/movies": {
      get: {
        tags: ["Movie"],
        summary: "Fetches user movies",
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        description:
          "By passing in the appropriate options, you can get user movies\n",
        responses: {
          200: {
            description: "user movies",
          },
          401: {
            description: "user is not authorized",
          },
          500: {
            description: "internal server error",
          },
        },
      },
      post: {
        tags: ["Movie"],
        summary: "adds movie",
        description: "Adds an movie to user movie list",
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/definitions/MovieAdding",
              },
            },
          },
        },
        responses: {
          201: {
            description: "movie created",
          },
          400: {
            description: "invalid input, object invalid",
          },
          401: {
            description: "user is not authorized",
          },
          404: {
            description: "movie was not found",
          },
          409: {
            description: "an existing item already exists",
          },
          500: {
            description: "internal server error",
          },
        },
      },
    },
    "/auth": {
      servers: [
        {
          url: authHost,
          description: "Auth API",
        },
      ],
      post: {
        tags: ["Auth"],
        summary: "Authenticates user",
        description: "User authentication",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/definitions/AuthData",
              },
            },
          },
        },
        responses: {
          200: {
            description: "user authenticated",
          },
          400: {
            description: "invalid payload",
          },
          401: {
            description: "bad credentials",
          },
        },
      },
    },
  },
  definitions: {
    Movie: {
      type: "object",
      required: ["title"],
      properties: {
        _id: {
          type: "string",
          format: "ObjectId",
          example: "60e27d909f3c9b0011647db2",
        },
        title: {
          type: "string",
          example: "Interstellar",
        },
        genre: {
          type: "string",
          example: "Adventure, Drama, Sci-Fi",
        },
        director: {
          type: "string",
          example: "hristopher Nolan",
        },
        release: {
          type: "string",
          format: "date-time",
          example:
            "Fri Nov 07 2014 00:00:00 GMT+0000 (Coordinated Universal Time)",
        },
      },
    },
    MovieAdding: {
      type: "object",
      required: ["title"],
      properties: {
        title: {
          type: "string",
          example: "Interstellar",
        },
      },
    },
    AuthData: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: {
          type: "string",
          example: "basic-thomas",
        },
        password: {
          type: "string",
          example: "sR-_pcoow-27-6PAwCD8",
        },
      },
    },
  },
  schemes: ["http"],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
      },
    },
  },
};

module.exports = swagger;
