let request=require("request");
let cheerio=require("cheerio");
const getAllMatches = require("./allmatches");

let link="https://www.espncricinfo.com/series/icc-world-test-championship-2019-2021-1195334";

request(link,cb);

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
   let aTag=ch(".widget-items.cta-link a").attr("href");
//    console.log(aTag);
    let completeLink="https://www.espncricinfo.com/"+aTag;
    // console.log(completeLink);
    getAllMatches(completeLink);

}