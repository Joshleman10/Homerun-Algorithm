const players = require('./object.json');
const inquirer = require('inquirer');

const groupSelections =
{
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
}

let possibleTopPicks = {
    "groupOne": {
        "names": []
    },
    "groupTwo": {
        "names": []
    },
    "groupThree": {
        "names": []
    }
}

let prospects = [];
let firstGroupStats = [];
let secondGroupStats = [];
let thirdGroupStats = [];
let hr = 0;
let ab = 0;
let ops = 0;

players.map(item => {
    if (item.Stats.AB > 550 && item.Stats.HomeRuns > 40) {
        prospects.push(item.Name)
    }
})

compareToGroups(prospects);

function compareToGroups(itemsToCompare) {

    itemsToCompare.map(item => {
        if (groupSelections.groupOne.names.includes(item)) {
            possibleTopPicks.groupOne.names.push(item)
        }
        else if (groupSelections.groupTwo.names.includes(item)) {
            possibleTopPicks.groupTwo.names.push(item)
        }
        else if (groupSelections.groupThree.names.includes(item)) {
            possibleTopPicks.groupThree.names.push(item)
        }
    })
    addStats(possibleTopPicks.groupOne.names, possibleTopPicks.groupTwo.names, possibleTopPicks.groupThree.names)
}

function addStats(g1, g2, g3) {

    players.map(item => {
        if (g1.includes(item.Name)) {
            firstGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB)
        }
        else if (g2.includes(item.Name)) {
            secondGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB)
        }
        else if (g3.includes(item.Name)) {
            thirdGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB)
        }
    })

    // playerSelector(firstGroupStats, secondGroupStats, thirdGroupStats)
}

    // function playerSelector(g1, g2, g3){

    // }

inquirer.prompt([

        {
            message: "At least how many HR do you want your picks to have from last season?",
            type: "list",
            name: "HR",
            choices: [45, 40, 35, "Not Important"]
        }, {
            message: "At least how many at bats do you want your picks to have from last season?",
            type: "list",
            name: "AB",
            choices: [600, 550, 500, "Not Important"]
        },
        {
            message: "At least how high would you like your picks OPS to be?",
            type: "list",
            name: "OPS",
            choices: [1.000, 0.900, 0.800, "Not Important"]
        }

]).then(function (answers) {
    answers.HR ? hr=answers.HR : 0
    console.log("homeruns: " + hr)
})
