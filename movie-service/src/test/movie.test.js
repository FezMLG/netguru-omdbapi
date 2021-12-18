const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

chai.use(chaiHttp);

const expect = chai.expect;
const api = chai.request(server).keepOpen();

describe("Auth Middleware", () => {
  it("should return 401 if Authorization header is empty", async () => {
    const response = await api.get("/api/movies");
    expect(response.status).to.be.equal(401);
  });
});
