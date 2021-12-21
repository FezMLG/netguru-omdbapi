import { use, expect as _expect, request } from "chai";
import chaiHttp from "chai-http";

import server from "../index";
import Movie from "../models/Movie";
import users from "./users.js";
import getToken from "./mocks";

use(chaiHttp);

const expect = _expect;
const api = request(server).keepOpen();
const getMovie = (token: any) => api.get("/api/movies").set("Authorization", token);
const createMovie = (title: any, token: any) =>
  api.post("/api/movies").set("Authorization", token).send({ title });
const valid = getToken();

describe("Movie Controller", () => {
  before(() => Movie.deleteMany({}));

  describe("GET /api/movies", () => {
    it("should create movies for both roles and return one", async () => {
      await Promise.all([
        createMovie("The Shawshank Redemption", valid(users.basic)),
        createMovie("The Shawshank Redemption", valid(users.premium)),
      ]);
      const res = await getMovie(valid(users.basic));
      expect(res.body.movies?.length).to.be.equal(1);
    });
  });

  describe("POST /api/movies", () => {
    it("should add movie", async () => {
      const res = await createMovie(
        "The Shawshank Redemption",
        valid(users.basic)
      );
      const movies = await Movie.find();
      expect(res.status).to.be.equal(200);
      expect(movies.length).to.be.equal(1);
    });

    it("should return 400 and error message if title is empty", async () => {
      const res = await createMovie("", valid(users.basic));
      expect(res.status).to.be.equal(400);
    });

    it("should return 409 and error message if movie with this title has been already added", async () => {
      await createMovie("The Shawshank Redemption", valid(users.basic));
      const res = await createMovie(
        "The Shawshank Redemption",
        valid(users.basic)
      );
      expect(res.status).to.be.equal(409);
    });

    it("should return 404 and error message if movie was not found", async () => {
      const res = await createMovie("dsadasdASDasd", valid(users.basic));
      expect(res.status).to.be.equal(404);
    });
  });

  afterEach(() => Movie.deleteMany({}));
  after(() => api.close());
});
