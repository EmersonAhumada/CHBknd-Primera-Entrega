const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/", (req, res) => {
  fs.readFile(__dirname + "/../../carrito.txt", "utf-8", (err, data) => {
    if (err) throw "error de lectura";
    const info = JSON.parse(data);
    let maxId = 1;
    if (info) {
      info.forEach((item) => {
        if (item.id >= maxId) {
          maxId = item.id;
        }
      });
      maxId++;
    }
    console.log(req.body);
    const obj = {
      id: maxId,
      timestamp: new Date().toLocaleString(),
      productos: [],
    };
    info.push(obj);
    fs.unlink(__dirname + "/../../carrito.txt", (err) => {
      if (err) throw "error eliminando archivo";
    });
    fs.writeFile(__dirname + "/../../carrito.txt", "", "utf-8", (err) => {
      if (err) throw "error creando archivo";
    });
    fs.appendFile(
      __dirname + "/../../carrito.txt",
      JSON.stringify(info, null, 2),
      "utf-8",
      (err) => {
        if (err) throw "Error en la escritura";
      }
    );
    res.send("Su Carrito fue agregado con exito!");
  });
});

router.delete("/:id", (req, res) => {
  fs.readFile(__dirname + "/../../carrito.txt", "utf-8", (err, data) => {
    if (err) throw "error leyendo archivo!";
    const info = JSON.parse(data);
    const exists = info.find((item) => {
      return item.id.toString() === req.params.id;
    });
    if (!exists) {
      res.send("<h1>Carrito no encontrado!</h1>");
      return;
    } else {
      const match = info.filter((item) => item.id.toString() !== req.params.id);
      fs.writeFile(
        __dirname + "/../../carrito.txt",
        JSON.stringify(match, null, 2),
        "utf-8",
        (err) => {
          if (err) throw "Error en la escritura";
          console.log("elemento eliminado");
        }
      );
      res.send("<h1>El Carrito se elimino correctamente!</h1>");
    }
  });
});

router.get("/:id/productos", (req, res) => {
  fs.readFile(__dirname + "/../../carrito.txt", "utf-8", (err, data) => {
    if (err) throw `error leyendo archivo!`;
    const info = JSON.parse(data);
    const cart = info.find((item) => item.id.toString() === req.params.id);
    if (!cart) {
      res.send("<h1>Carrito no encontrado!</h1>");
    } else {
      res.send(cart.productos);
    }
  });
});

router.post("/:id/productos", (req, res) => {
  fs.readFile(__dirname + "/../../carrito.txt", "utf-8", (err, data) => {
    if (err) throw `error leyendo archivo!`;
    const info = JSON.parse(data);
    const cart = info.find((item) => item.id.toString() === req.params.id);
    if (!cart) {
      res.send("<h1>Carrito no encontrado!</h1>");
    } else {
      let maxId = 1;
      cart.productos.forEach((item) => {
        if (item.id >= maxId) {
          maxId = item.id;
        }
        maxId++;
      });
      let items = {
        id: maxId,
        timestamp: new Date().toLocaleString(),
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        codigo: req.body.codigo,
        foto: req.body.foto,
        precio: req.body.precio,
        stock: req.body.stock,
      };
      cart.productos.push(items);
      info.push(cart);
      fs.unlink(__dirname + "/../../carrito.txt", (err) => {
        if (err) throw "error eliminando archivo";
      });
      fs.writeFile(__dirname + "/../../carrito.txt", "", "utf-8", (err) => {
        if (err) throw "error creando nuevo archivo";
      });
      fs.appendFile(
        __dirname + "/../../carrito.txt",
        JSON.stringify(info, null, 2),
        "utf-8",
        (err) => {
          if (err) throw "error de escritura en archivo";
        }
      );
      res.send("Se agrega producto al carrito!");
    }
  });
});

router.delete("/:id/productos/:id_prod", (req, res) => {
  fs.readFile(__dirname + "/../../carrito.txt", "utf-8", (err, data) => {
    if (err) throw `error leyendo archivo`;
    const info = JSON.parse(data);
    const cart = info.find((item) => item.id.toString() === req.params.id);
    if (!cart) {
      res.send("<h1>Carrito no encontrado!</h1>");
    } else {
      const newInfo = info.filter(
        (item) => item.id.toString() !== req.params.id
      );
      const match = cart.productos.filter(
        (item) => item.id.toString() !== req.params.id_prod
      );
      cart.productos = match;
      newInfo.push(cart);
      console.log(newInfo);
      fs.writeFile(
        __dirname + "/../../carrito.txt",
        JSON.stringify(newInfo, null, 2),
        "utf-8",
        (err) => {
          if (err) throw "Error en la escritura";
          console.log("El  producto se elimino");
        }
      );
      res.send("<h1>El  producto se elimino</h1>");
    }
  });
});

module.exports = router;
