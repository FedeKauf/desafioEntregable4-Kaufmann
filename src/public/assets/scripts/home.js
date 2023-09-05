const socket = io();

console.log(document.getElementById("nuevo"));

const button = document.getElementById("nuevo");
button.onclick = () => socket.emit("nuevoProducto");

socket.on('actualizar', async () => {
    console.log("act")
  const productList = document.getElementById("productList");
  let ul = "";
  
  const products = await fetch("http://localhost:8080/api/products")
  products.forEach((producto) => {
    ul += `<li>${producto.title}</li>`;
  });

  productList.innerHTML = ul;
});
