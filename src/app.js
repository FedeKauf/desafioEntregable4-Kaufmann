import express from 'express';
import {engine} from 'express-handlebars'
import __dirname from './utils.js'
import path from 'path';
import {router as cartsRouter} from './routes/carts.router.js'
import { router as productsRouter } from './routes/products.router.js';
import {Server} from 'socket.io'


const PORT=8080
const app=express()



app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')))
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

app.use('/products', productsRouter)

app.get('/realTimeProducts',(req, res)=>{
    res.render('realTimeProducts');   
})

app.get('/',(req, res)=>{
    res.render('home');   
})

app.get('*',(req, res)=>{
    res.send('Error 404 - Page not found')
})

const serverExpress = app.listen(PORT, ()=>{
    console.log(`Server corriendo en puerto ${PORT}`)
})

const serverSocket=new Server(serverExpress)

const newProduct={
    "title": "Producto 1",
    "description": "algodon",
    "price": 100,
    "thumbnail": "sin imagen",
    "stock": 1,
    "code":2,
}

serverSocket.on('connection',socket=>{
    console.log(`Se ha conectado un cliente con id ${socket.id}`)

    socket.emit('bienvenida',{message:'Bienvenido al server...!!! Por favor identifiquese'})

    socket.on('identificacion',nombre=>{
        console.log(`Se ha conectado ${nombre}`)
        socket.emit('idCorrecto',{message:`Hola ${nombre}, bienvenido...!!!`})
        socket.broadcast.emit('nuevoUsuario', nombre)

    })
   
    socket.on('nuevoProducto', () => {
        console.log("np")
        fetch('http://localhost:8080/api/products', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        }).then(()=>{

            
            console.log("np 2")
            socket.emit('asd');
        })
    
    })

    socket.on('asd', async () => {
        console.log("act")
      const productList = document.getElementById("productList");
      let ul = "";
      
      const products = await fetch("http://localhost:8080/api/products")
      products.forEach((producto) => {
        ul += `<li>${producto.title}</li>`;
      });
    
      productList.innerHTML = ul;
    });
    

})
