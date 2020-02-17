const players = require('./object.json');

const groupSelections =
[{
    "groupOne": {
        "names": [
            "Arenado, Nolan COL",
            "Bellinger, Cody LAD",
            "Yelich, Christian MIL",
            "Alonso, Pete NYM",
            "Acuña Jr., Ronald ATL",
            "Schwarber, Kyle CHC"
        ]
    }, "groupTwo": {
        "names": [
            "Trout, Mike LAA",
            "Bregman, Alex HOU",
            "Lindor,Francisco CLE",
            "Donaldson, Josh MIN",
            "Judge, Aaron NYY",
            "Renfroe, Hunter TB"
        ]
    },
    "groupThree": {
        "names": [
            "Soto, Juan WSH",
            "Harper, Bryce PHI",
            "Bell, Josh PIT",
            "Soler, Jorge KC",
            "Suárez, Eugenio CIN",
            "Rendon, Anthony LAA"
        ]
    }
}]

let prospects = [];
let onePlayers = [];
let twoPlayers = [];
let threePlayers = [];

players.map(item => {
    if (item.Stats.AB > 550 && item.Stats.HomeRuns > 40) {
        prospects.push(item.Name)
    }
})

function compareToGroups(itemsToCompare) {

    itemsToCompare.map(item => {
        if (groupSelections[0].includes(item)) {
            onePlayers.push(item)
        }
        else if (groupSelections[1].includes(item)) {
            twoPlayers.push(item)
        }
        else if (groupSelections[2].includes(item)) {
            threePlayers.push(item)
        }
    })
}

compareToGroups(prospects);

let oneFormat = "Group 1 Players: " + onePlayers
let twoFormat = "Group 1 Players: " + twoPlayers
let threeFormat = "Group 1 Players: " + threePlayers

console.log(oneFormat + " " + twoFormat + " " + threeFormat)

// let lastNames = prospects.map(item =>{
//     return item.split(",").shift()
// })