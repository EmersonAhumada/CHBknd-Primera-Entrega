const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
  fs.readFile(__dirname + "/../../productos.txt", "utf-8", (err, data) => {
    if (err) throw `There was an error while reading your file!`;
    const info = JSON.parse(data);
    res.send(info);
  });
});


router.get("/:id", (req, res) => {
  fs.readFile(__dirname + "/../../productos.txt", "utf-8", (err, data) => {
    try {
      if (err) throw "There was an error while reading your file!";
      const info = JSON.parse(data);
      const product = info.find((item) => {
        return item.id.toString() === req.params.id;
      });
      if (!product) {
        res.send("<h1>Producto no encontrado!</h1>");
      }
      res.send(product);
    } catch (error) {
      res.send(error);
    }
  });
});

router.post("/", (req, res) => {
  fs.readFile(__dirname + "/../../productos.txt", "utf-8", (err, data) => {
    if (err) throw "There was an error while reading your file!";
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
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      codigo: req.body.codigo,
      foto: req.body.foto,
      precio: req.body.precio,
      stock: req.body.stock,
    };
    info.push(obj);
    fs.unlink(__dirname + "/../../productos.txt", (err) => {
      if (err) throw "there was an error when trying to delete your file";
    });
    fs.writeFile(__dirname + "/../../productos.txt", "", "utf-8", (err) => {
      if (err) throw "there was an error when trying to create the new file";
    });
    fs.appendFile(
      __dirname + "/../../productos.txt",
      JSON.stringify(info, null, 2),
      "utf-8",
      (err) => {
        if (err) throw "There was an error while writing your file!";
      }
    );
    res.send("Su producto fue agregado con exito!");
  });
});

router.put("/:id", (req, res) => {

  fs.readFile(__dirname + "/../../productos.txt", "utf-8", (err, data) => {
    if (err) throw "There was an error while reading your file!";
    const info = JSON.parse(data);
    let existProduct = info.find((item) => {
      return item.id.toString() === req.params.id;
    });
    if (!existProduct) {
      res.send("<h1>Producto no encontrado!</h1>");
      return;
    }
    const newProduct = {
      id: Number(req.params.id),
      timestamp: new Date().toLocaleString(),
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      codigo: req.body.codigo,
      foto: req.body.foto,
      precio: req.body.precio,
      stock: req.body.stock,
    };
    const newArr = info.map((product) => {
      if (req.params.id == product.id) {
        return newProduct;
      } else {
        return product;
      }
    });
    fs.unlink(__dirname + "/../../productos.txt", (err) => {
      if (err) throw "there was an error when trying to delete your file";
    });
    fs.writeFile(__dirname + "/../../productos.txt", "", "utf-8", (err) => {
      if (err) throw "there was an error when trying to create the new file";
    });
    fs.appendFile(
      __dirname + "/../../productos.txt",
      JSON.stringify(newArr, null, 2),
      "utf-8",
      (err) => {
        if (err) throw "There was an error while writing your file!";
      }
    );
    res.send("Su producto fue modificado con exito!");
  });
});

router.delete("/:id", (req, res) => {
  fs.readFile(__dirname + "/../../productos.txt", "utf-8", (err, data) => {
    if (err) throw "There was an error while reading your file!";
    const info = JSON.parse(data);
    const exists = info.find((item) => {
      return item.id.toString() === req.params.id;
    });
    if (!exists) {
      res.send("<h1>Producto no encontrado!</h1>");
      return;
    } else {
      const match = info.filter((item) => item.id.toString() !== req.params.id);
      fs.writeFile(
        __dirname + "/../../productos.txt",
        JSON.stringify(match, null, 2),
        "utf-8",
        (err) => {
          if (err) throw "Error en la escritura";
          console.log("The element was sucessfully deleted!");
        }
      );
      res.send("<h1>El elemento se elimino correctamente!</h1>");
    }
  });
});
module.exports = router;
