const express = require('express');
const bodyparser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

let allSockets = [];

io.on("connection",(socket)=>{
    allSockets.push(socket);
    console.log("Connected from client");
    socket.emit("data","Some data...");
});

var customers = [];

function initData(){
    customers.push({
        id:1, name: "Google", location: "Bangalore"
    },
    {
        id:2, name: "Microsoft", location: "Bangalore"
    },
    {
        id:3, name: "GIT", location: "Bangalore"
    },
    {
        id:4, name: "TCS", location: "Bangalore"
    },
    {
        id:5, name: "HCL", location: "Bangalore"
    },
    {
        id:6, name: "LG", location: "Bangalore"
    })
}

initData();
app.use(express.static(`${__dirname}/public`))
app.use(bodyparser.json());

app.get('/customers',(req,resp)=>{
    resp.json(customers);
});

app.get("/customers/:id", (req,resp)=>{
    let id = parseInt(req.params.id);
    let filteredCustomers = customers.filter((item)=> item.id === id);
    if(filteredCustomers[0]){
        resp.json(filteredCustomers[0]);
    } else {
        resp.status(404);
        resp.json(null);
    }
});

app.post("/customers",(req,resp) => {
    let customer = req.body;
    try {
        if(customer.id <= 0){
            resp.status(400);
            resp.json(null);
        } else {
            customers.push(customer);
            allSockets.forEach(socket => {
                socket.emit("newCustomer",customer);
            })
            resp.status(201);
            resp.setHeader("locations","cuustomers/"+customer.id);
            resp.json(null);
        }
    }catch(e){
        resp.status(503);
        resp.json(null);
    }
    
})

/*app.listen(8090, ()=>{
    console.log("Rest Server Started");
})*/
let port = process.env.PORT || 8090;
httpServer.listen(port, ()=>{
    console.log("Rest Server Started");
})