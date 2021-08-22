const fs = require("fs");
const axios = require("axios");
const http = require("http");

const urlProveedores =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const urlClientes =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";
let handleRequest = (request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/html",
  });
  if (request.url === "/api/proveedores") {
    fs.readFile("index.html", "utf-8", function (error, data) {
      if (error) {
        response.writeHead(404);
        respone.write("File not found!");
      } else {
        data = appendHTML(data, "tituloPagina", "Listado de Proveedores");
        getPromise(urlProveedores).then((res) => {
          res.reverse();
          res.forEach((element) => {
            data = appendHTML(
              data,
              "tbody",
              `<tr>
               <th scope="row">${element.idproveedor}</th>
               <td>${element.nombrecompania}</td>
               <td>${element.nombrecontacto}</td>
             </tr>`
            );
          });
          response.write(data);
          response.end();
        });
      }
    });
  } else if (request.url === "/api/clientes") {
    fs.readFile("index.html", "utf-8", function (error, data) {
      if (error) {
        response.writeHead(404);
        respone.write("File not found!");
      } else {
        data = appendHTML(data, "tituloPagina", "Listado de Clientes");
        getPromise(urlClientes).then((res) => {
          res.reverse();
          res.forEach((element) => {
            data = appendHTML(
              data,
              "tbody",
              `<tr>
               <th scope="row">${element.idCliente}</th>
               <td>${element.NombreCompania}</td>
               <td>${element.NombreContacto}</td>
             </tr>`
            );
          });
          response.write(data);
          response.end();
        });
      }
    });
  } else {
    response.end("Ruta no valida");
  }
};

http.createServer(handleRequest).listen(8081);

function getPromise(urlJson) {
  return axios({
    url: urlJson,
    method: "get",
    timeout: 8000,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.data)
    .catch((err) => console.error(err));
}
const insertAt = (string, index, stringToInsert) => {
  return string.substr(0, index) + stringToInsert + string.substr(index);
};

const searchForId = (id, string) => {
  let idx = string.indexOf(id);
  while (string[idx] !== ">") {
    idx++;
  }
  idx++;

  return idx;
};

const appendHTML = (string, id, htmlToAdd) => {
  return insertAt(string, searchForId(id, string), htmlToAdd);
};
