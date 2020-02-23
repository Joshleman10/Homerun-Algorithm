//The user is expected to choose one player from 3 pre-selected groups of 5 players.
//After a player is chosen from each group, the rest of the players in that group are not able to be selected.
//Then the user must select 5 additional players for a total of an 8 player team that will hit the most HR in the next season
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

let fullTeam = [];
let prospects = [];
let firstGroupStats = [];
let secondGroupStats = [];
let thirdGroupStats = [];
let hr = 0;
let ab = 0;
let ops = 0;
let remainingPicks = [];
const grpSelArr = [groupSelections.groupOne.names, groupSelections.groupTwo.names, groupSelections.groupThree.names];
const mergedGrpSelArr = [].concat.apply([], grpSelArr);
players.forEach(item => {
    mergedGrpSelArr.includes(item.Name) ? "" : remainingPicks.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB + " OPS: " + item.Stats.OPS);
})

//Asking the user to set parameters for the players they would like to select
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
    pickPreferences(players)
})

//Creating prospects using the preferred specifications set by the first round of inquirer questions
function pickPreferences(playersToSort) {
    playersToSort.map(item => {
        if (item.Stats.AB > ab && item.Stats.HomeRuns > hr && item.Stats.OPS > ops) {
            prospects.push(item.Name)
        }
    })
    compareToGroups(prospects);
}

//Comparing prospects that meet the user's preferred player specifications
function compareToGroups(topProspects) {
    topProspects.map(item => {
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

//Adding Statistics for user review of players for selection purposes
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

//Asking the user to select players from each group based on their prefferred specifications, then building an object of those players.
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
            message: "Which player do you want from GROUP 3 that matches your preferred specifications?",
            type: "list",
            name: "G3",
            choices: g3.map(item => item)
        }

    ]).then(function (answers) {
        console.log("Your top 3 players are as follows: ")
        console.log(answers)
        fullTeam.push(answers);
        chooseFinalFive(remainingPicks);
    })
}

//Creating a list of the remaining top prospects and calling the final inquirer prompt to select the last 5 players
const validateFiveSelected = (input) => {
    let length = input.length;
    let tooMany = (length - 5);
    let tooFew = (5 - length);
    if (length > 5) {
        return 'You have selected ' + tooMany + ' too many player(s).  Please select 5 players.';
    }
    else if (length < 5) {
        return ('You have selected too few players.  Please select ' + tooFew + ' more player(s).');
    }
    return true;
};

function chooseFinalFive() {
    inquirer.prompt([
        {
            message: "Select 5 Remaining Players to fill out your team:",
            type: "checkbox",
            name: "remaining",
            choices: remainingPicks.map(item => item),
            validate: validateFiveSelected
        }

    ]).then(function (answers) {
        fullTeam.push(answers)
        console.log("Your full team is as follows: ")
        console.log(fullTeam);
    })
    
}