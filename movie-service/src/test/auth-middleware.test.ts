import { use, expect as _expect, request } from "chai";
import chaiHttp from "chai-http";

import Movie from "../models/Movie";
import server from "../index";
import users from "./users";
import getToken from "./mocks";

use(chaiHttp);

const expect = _expect;
const api = request(server).keepOpen();
const getMovie = (token: string) => api.get("/api/movies").set("Authorization", token);
const createMovie = (title: string, token: string) =>
  api.post("/api/movies").set("Authorization", token).send({ title });
const moviesList = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Godfather: Part II",
  "The Dark Knight",
  "12 Angry Men",
];

describe("Auth Middleware", () => {
  //testing authenticate
  it("should return 401 if Authorization header is empty", async () => {
    const response = await api.get("/api/movies");
    expect(response.status).to.be.equal(401);
  });
  it("should return 401 if Authorization token is invalid", async () => {
    const invalid = getToken("jwtSecret");
    const response = await getMovie(invalid(users.basic));
    expect(response.status).to.be.equal(401);
  });
  //testing limits
  it("should return 403 if role is invalid", async () => {
    const invalid = getToken("userRole");
    const response = await createMovie("Yes", invalid(users.basic));
    expect(response.status).to.be.equal(403);
  });
  it("should return 403 if basic user tries to add more than 5 books per calendar month", async () => {
    console.log("**********");
    const valid = getToken();
    await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        createMovie(moviesList[i], valid(users.basic))
      )
    );
    const res = await createMovie("Schindler's List", valid(users.basic));
    expect(res.status).to.be.equal(403);
  });
  it("should return 200 if premium user tries to add more than 5 books per calendar month", async () => {
    console.log("**********");
    const valid = getToken();
    await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        createMovie(moviesList[i], valid(users.premium))
      )
    );
    const res = await createMovie("Schindler's List", valid(users.premium));
    expect(res.status).to.be.equal(200);
  });

  afterEach(() => Movie.deleteMany({}));
  after(() => api.close());
});
