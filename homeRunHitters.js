const players = require ('./object.json');

players.map((item, index)=>{
    if (item.Stats.OPS > 1 && item.Stats.HomeRuns > 40){
        console.log(item.Name);
    }
})