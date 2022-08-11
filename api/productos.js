const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
    fs.readFile(__dirname + "../../../productos.txt", "utf-8", (err, data) => {
      if (err) throw `There was an error while reading your file!`;
      const info = JSON.parse(data);
      res.send(info);
    });
  });