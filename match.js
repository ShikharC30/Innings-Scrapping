let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");

// let link="https://www.espncricinfo.com/series/icc-world-test-championship-2019-2021-1195334/india-vs-new-zealand-final-1249875/full-scorecard";
function getALLlinks(link){  
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
    let AllInnings=ch(".match-scorecard-page .card.content-block.match-scorecard-table .Collapsible");
    // console.log(AllInnings.length);
    for(let i=0;i<AllInnings.length;i++){
        let teamName=ch(AllInnings[i]).find("h5").text();
        // console.log(teamName);
        teamName=teamName.split("(")[0].trim();
        // console.log(teamName);

        let allTrs=ch(AllInnings[i]).find(".table.batsman tbody tr");
        // console.log(allTrs);
        for(let j=0;j<allTrs.length-1;j++){
            let allTds=ch(allTrs[j]).find("td");
            // console.log(allTds);
            if(allTds.length>1){
                let batsmanName= ch(allTds[0]).find("a").text().trim();
                let runs=ch(allTds[2]).text().trim();
                let balls=ch(allTds[3]).text().trim();
                let fours=ch(allTds[5]).text().trim();
                let sixes=ch(allTds[6]).text().trim();
                let strikeRate=ch(allTds[7]).text().trim();
                // console.log(`Batsman=${batsmanName} rums=${runs} balls=${balls} fours=${fours} sixes=${sixes} Strike Rate=${strikeRate}`);
                //ek batsman kidetail milti hai yaha pe
                processDetails(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
            }
        }
        console.log("##############################################");
    }
}

function processDetails(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let isTeamFolder=checkTeamFolder(teamName);
    if(isTeamFolder){
        let isBatsman= checkBatsmanFile(teamName,batsmanName);
        if(isBatsman){
            updateBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
        }
        else{
            createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
        }
    }
    else{
        createTeamFolder(teamName);
        createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
    }
}

function checkTeamFolder(teamName){
    return fs.existsSync(teamName);
}

function createTeamFolder(teamName){
    fs.mkdirSync(teamName);
}

function checkBatsmanFile(teamName,batsmanName){
    let batsmanPath=`${teamName}/${batsmanName}.json`;
    return fs.existsSync(batsmanPath);
}

function createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let batsmanPath=`${teamName}/${batsmanName}.json`;
    let batsmanFile=[];
    let inning={
        Runs:runs,
        Balls:balls,
        Fours:fours,
        Sixes:sixes,
        StrikeRate:strikeRate
    }
    batsmanFile.push(inning);
    batsmanFile=JSON.stringify(batsmanFile);
    fs.writeFileSync(batsmanPath,batsmanFile);
}

function updateBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let batsmanPath=`${teamName}/${batsmanName}.json`;
    // let batsmanFile=[]; already hai
    let batsmanFile=fs.readFileSync(batsmanPath);
    //stringified=>original
    batsmanFile=JSON.parse(batsmanFile);
    let inning={
        Runs:runs,
        Balls:balls,
        Fours:fours,
        Sixes:sixes,
        StrikeRate:strikeRate
    }
    batsmanFile.push(inning);
    batsmanFile=JSON.stringify(batsmanFile);
    fs.writeFileSync(batsmanPath,batsmanFile);
}

module.exports=getALLlinks;
