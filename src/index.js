"use strict";
const Hapi = require("@hapi/hapi");
const jwt = require("jsonwebtoken");
// const auth = require("./middleware/auth")
const axios = require('axios')

const secret = "foo";
const person = {
  login: "test",
  password: 12345,
};
const init = async () => {
  const server = Hapi.server({ port: 5000, host: "localhost" });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      console.log(h);
      return "Hello World!";
    },
  });
  server.route({
    method: "POST",
    path: "/login",
    handler: (req, h) => {
      const { login, password } = req.payload;
      if (login === person.login && password === person.password) {
        const token = jwt.sign(
        {
            login,
            password,
        },
        secret
        );
        return { message: "ok", token };
      }
      return { message: "user not found or don`t correct" };
    },
  });

 server.route({
    method: "GET",
    path: "/post/{id}",
    handler:async (request, h) => {
      const {id} =request.params
      let res = null
     await axios({
        url: `https://jsonplaceholder.typicode.com/posts/${id}`,
        method: "get"
      }).then(function (response) {
        // handle success
      res = response.data
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
        return res
    },
  });

  server.route({
    method: "GET",
    path: "/verefy",
    handler: (request, h) => {
      const { authorization } = request.headers;
      const token = authorization.replace("Bearer ", "");
      const obj = jwt.verify(token, secret);
      return { token: obj };
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};
init();
