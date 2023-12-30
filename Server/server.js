var http = require('http');
var url = require('url');
const itemJson = require("./items.json");

http.createServer(function(req,res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

console.log("req.method="+ req.method);
var parsed = url.parse(req.url, true);
console.log(parsed);

if(req.method==='GET'){
    res.setHeader('content-Type', 'application/json');
    res.statusCode=200;
    res.write(JSON.stringify(itemJson));
    res.end();
    console.log("GET: returned:")
    console.log(itemJson);
}

if(req.method==='PUT'){
    var newItemName=parsed.query.newItemName;
    var newItemPrice = parsed.query.newItemPrice;

    if(!newItemName){
        console.log("PUT: newItemName is Invalid");
        res.statusCode = 404;
        res.end();
        return;
    }

    if(!newItemPrice){
        console.log("PUT: newItemPrice is Invalid");
        res.statusCode = 404;
        res.end();
        return;
    }
    var newId = (new Date(Date.now())).toISOString();
    itemJson.push({"id": newId, "name":newItemName, "price":newItemPrice});
    res.statusCode = 200;
}

if(req.method==='POST'){
    var itemId = parsed.query.id;
       
    switch(parsed.pathname){
            case  "/updateName" :
                
                var newItemName = parsed.query.newItemName;

                if(!newItemName){
                    console.log("POST: newItemName is invalid");
                    res.statusCode =404;
                    res.end();
                    return;
                }
                var jsonIndex = itemJson.findIndex(item=>item.id===itemId);

                if(jsonIndex>=0){
                    itemJson[jsonIndex].name = newItemName;
                    res.statusCode =200;
                }
                else{
                    res.statusCode = 404;
                }
                res.end();
                break;

            case "/updatePrice":

            var newItemPrice = parsed.query.newPrice;

            if(!newItemPrice){
                console.log("POST: newPrice is invalid");
                res.statusCode =404;
                res.end();
                return;
            }
            var jsonIndex = itemJson.findIndex(item=>item.id===itemId);

            if(jsonIndex>=0){
                itemJson[jsonIndex].price = newItemPrice;
                res.statusCode =200;
            }
            else{
                res.statusCode = 404;
            }
            res.end();
            break;

        default :
        res.statusCode = 404;
        res.end();
}
}


if(req.method==='DELETE'){
    var itemId = parsed.query.id;

    if(!itemId){
        //alert // res.statusCode = 501;
        //res.end();
        console.log("POST: Item ID is invalid");
        res.statusCode =501;
        res.end();
        return;
    }
    var jsonIndex = itemJson.findIndex(item=>item.id===itemId);

    if(jsonIndex>=0){
        itemJson.splice(jsonIndex,1);
        res.statusCode =200;
    }
    else{
        res.statusCode = 501;
    }
    res.end();
}


if(req.method==='OPTIONS'){
    res.statusCode = 200;
    res.end();
}

}).listen(3000,function(){
    console.log("server started at port 3000...");
})