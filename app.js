const http = require('http');
const fs = require('fs');
var requests = require('requests');

const indexFile = fs.readFileSync('app.html','utf-8');

//we dont want that our file is read multiple time so written outside
const replaceVal = (tempVal, orgVal)=>{
    // console.log(orgVal.sys.country);
    console.log(orgVal.weather[0].main);
    // console.log(orgVal.main.temp_min);
    let temp = tempVal.replace(" {%tempval%}",(orgVal.main.temp-273).toFixed(1));
     temp = temp.replace(" {%temp_min%}",(orgVal.main.temp_min-273).toFixed(1));
     temp = temp.replace(" {%temp_max%}",(orgVal.main.temp_max-273).toFixed(1));
     temp = temp.replace(" {%location%}",orgVal.name);
     temp = temp.replace(" {%country%}",orgVal.sys.country);
     temp = temp.replace(" {%tempStatus%}",orgVal.weather[0].main);
    
     return temp;
}
const server = http.createServer((req,res)=>{
    if(req.url == '/'){
        requests('https://api.openweathermap.org/data/2.5/weather?lat=27.68441604&lon=85.34205842&exclude=hourly,daily&appid=7e8b416cbcc0a76df2c9eb2d339abd75')
        .on('data',(chunk)=>{
            // converting api data into javascript obj
            const objData = JSON.parse(chunk);
            // converting obj data into array
            const arrData = [objData];  
            //now everything is object array
            // console.log(arrData);
            // console.log(arrData[0].main.temp - 273);

            //with the map method not necessary to call value
            const realTimeData = arrData.map((val)=>replaceVal(indexFile,val)).join("");
                //console.log(val.name);
                // console.log(realTimeData);
            
            res.write(realTimeData);
            
        })
        .on('end',(err)=>{
            if(err)return console.error("Connection closed due to ",err);
            console.log("end");
            res.end();
        });
    }
}).listen(5000);