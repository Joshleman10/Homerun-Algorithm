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

function pickPreferences() {

    players.map(item => {
        if (item.Stats.AB > ab && item.Stats.HomeRuns > hr) {
            prospects.push(item.Name)
        }
    })

    compareToGroups(prospects);
}

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
            firstGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB + " OPS: " + item.Stats.OPS)
        }
        else if (g2.includes(item.Name)) {
            secondGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB + " OPS: " + item.Stats.OPS)
        }
        else if (g3.includes(item.Name)) {
            thirdGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB + " OPS: " + item.Stats.OPS)
        }
    })
    playerSelector(firstGroupStats, secondGroupStats, thirdGroupStats)
}

function playerSelector(g1, g2, g3) {
    inquirer.prompt([
        {
            message: "Which player do you want from GROUP 1 that matches your preferred specifications?",
            type: "list",
            name: "G1",
            choices: g1.map(item => item)
        }, {
            message: "Which player do you want from GROUP 2 that matches your preferred specifications?",
            type: "list",
            name: "G2",
            choices: g2.map(item => item)
        },
        {
            message: "Which player do you want from GROUP 2 that matches your preferred specifications?",
            type: "list",
            name: "G3",
            choices: g3.map(item => item)
        }

    ]).then(function (answers) {
        console.log("Your top 3 players are as follows: ")
        console.log(answers)
    })
}

inquirer.prompt([
    {
        message: "At least how many HR do you want your picks to have from last season?",
        type: "list",
        name: "HR",
        choices: [40, 35, 30, 25]
    }, {
        message: "At least how many at bats do you want your picks to have from last season?",
        type: "list",
        name: "AB",
        choices: [550, 525, 500, 475]
    },
    {
        message: "At least how high would you like your picks OPS to be?",
        type: "list",
        name: "OPS",
        choices: [1.0, 0.950, 0.900, 0.850]
    }

]).then(function (answers) {
    answers.HR ? hr = answers.HR : 0
    answers.AB ? ab = answers.AB : 0
    answers.OPS ? ops = answers.OPS : 0
    pickPreferences()
})
