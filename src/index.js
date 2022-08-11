const express = require("express");
const carrito = require("./carrito.");
const productos = require("./productos");

const router = express.Router();

router.use("/carrito", carrito);
router.use("/productos", productos);

module.exports = router;
