let request=require("request");
let cheerio=require("cheerio");
const getALLlinks = require("./match");

function getAllMatches(link){
    request(link,cb);
}


function cb(error,response,html){
    if(error==null && response.statusCode ==200){
        parseData(html);
    }
    else if(response==404){
        console.log("Page Not Found");
    }
    else{
        console.log(error);
    }
}

function parseData(html){
    // console.log(html);
    let ch=cheerio.load(html);
    let allATags=ch('a[data-hover="Scorecard"]');
    // console.log(allATags.length);
    for(let i=0;i<allATags.length;i++){
        let link=ch(allATags[i]).attr("href");
        // console.log(link);
        let completeLink="https://www.espncricinfo.com/"+link;
        // console.log(completeLink);
        getALLlinks(completeLink);
    }
 
 }

 module.exports=getAllMatches;