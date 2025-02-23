import {describe, expect, test, it, beforeAll} from '@jest/globals';
import request from "supertest";
import  app  from "../app"
import { PrismaClient } from "@prisma/client";


let refreshtoken:string;
let accesstoken:string;
describe("User Apis", () => {
    it("Add a new user1", async () => {
        const res = await request(app).post("/user/signup").send({
           "username":"test7777",
           "password":"testpass",
           "email":"test4@gmail.com",
        });
        console.log(res.body)
        expect(res.statusCode).toBe(201);
      });

       it("Add a new user2", async () => {
        const res = await request(app).post("/user/signup").send({
           "username":"test8888",
           "password":"testpass",
           "email":"test7@gmail.com",
           "age":17
        });
        console.log(res.body)
        expect(res.statusCode).toBe(201);
      });

      it("Retry duplicate username", async () => {
        const res = await request(app).post("/user/signup").send({
          "username":"test7777",
           "password":"testpass",
           "email":"test2@gmail.com",
           "age":17
        });
        expect(res.statusCode).toBe(500);
      });

      it("User Login", async () => {
        const res = await request(app).post("/user/signin").send({
          "password":"testpass",
           "email":"test4@gmail.com",
        });
        expect(res.statusCode).toBe(200);
        accesstoken = res.body.accessToken
        refreshtoken = res.body.refreshToken
      });

      it("User Access Token refresh", async () => {
        const res = await request(app).post("/user/refresh").send({
          "refreshToken":refreshtoken
        });
        expect(res.statusCode).toBe(200);
        accesstoken = res.body.accessToken
      });
});
