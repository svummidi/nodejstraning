let express = require('express');
let hbs = require('hbs');
const axios = require('axios');

let app = express();

hbs.registerPartials(`${__dirname}/views/partials`);
hbs.registerHelper("getCurrentYear",()=>{
    return new Date().getFullYear();
});
hbs.registerHelper("toUpper",(message)=>{
    return message.toUpperCase();
});
hbs.registerHelper("toCaptilize",(message)=>{
    return message.split(" ").map((value)=>{
        return value.charAt(0).toUpperCase() + value.slice(1);
    }).join(" ");
});
app.set("view engine","hbs");

app.use(express.static(`${__dirname}/public`))
app.use((req,resp,next)=>{
    console.log("Express JS ");
    next();
});

app.get(["/","/home"],(req,resp) =>{
   /* resp.writeHead(200,{'Content-Type': "text/html"});
    resp.write("<h1>Express Server Web Application in progress...</h1>");
    resp.end();*/
    resp.render('home',{
        message: "This is Home Page"
    });
});

app.get("/about",(req,resp) =>{
    resp.render('about',{
        message: 'Created for training purposes'
    })
});

app.get('/blogs',async (req,resp)=>{
    let url = "https://jsonplaceholder.typicode.com/posts";
    let blogsData = [];
    try {
        let response = await axios.get(url);    
        blogsData = response.data;
        console.log(blogsData);

    } catch(error){

    }
    resp.render("blogs",{
        blogs: blogsData
    })
});




app.listen(8080,()=>{
    console.log("Express JS server started");
});