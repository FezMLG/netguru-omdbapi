const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../index");
const Movie = require("../models/Movie");
const users = require("./users");
const getToken = require("./mocks");

chai.use(chaiHttp);

const expect = chai.expect;
const api = chai.request(server).keepOpen();
const getMovie = (token) => api.get("/api/movies").set("Authorization", token);
const createMovie = (title, token) =>
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

    // it("should return 500 and error message if OMDB TOKEN is not provided", async () => {
    //   process.env.OMDB_TOKEN = undefined;
    //   const res = await createMovie(
    //     "The Shawshank Redemption",
    //     valid(users.basic)
    //   );
    //   expect(res.status).to.be.equal(500);
    // });
  });

  afterEach(() => Movie.deleteMany({}));
  after(() => api.close());
});
