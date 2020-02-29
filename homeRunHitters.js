//The user is expected to choose one player from 3 pre-selected groups of 5 players.
//After a player is chosen from each group, the rest of the players in that group are not able to be selected.
//Then the user must select 5 additional players for a total of an 8 player team that will hit the most HR in the next season
const players = require('./object.json');
const inquirer = require('inquirer');

const groupSelections =
    [[
        "Arenado, Nolan COL",
        "Bellinger, Cody LAD",
        "Yelich, Christian MIL",
        "Alonso, Pete NYM",
        "Acuña Jr., Ronald ATL",
        "Schwarber, Kyle CHC"
    ]
        ,
    [
        "Trout, Mike LAA",
        "Bregman, Alex HOU",
        "Lindor,Francisco CLE",
        "Donaldson, Josh MIN",
        "Judge, Aaron NYY",
        "Renfroe, Hunter TB"
    ]
        , [
        "Soto, Juan WSH",
        "Harper, Bryce PHI",
        "Bell, Josh PIT",
        "Soler, Jorge KC",
        "Suárez, Eugenio CIN",
        "Rendon, Anthony LAA"
    ]]

let possibleTopPicks = [[], [], []];
let fullTeam = [];
let topProspects = [];
let remainingPicks = [];
let firstGroupStats = [];
let secondGroupStats = [];
let thirdGroupStats = [];
let hr = 0;
let ab = 0;
let ops = 0;
const grpSelArr = [groupSelections[0], groupSelections[1], groupSelections[2]];
const mergedGrpSelArr = [].concat.apply([], grpSelArr);

// Exctracting players from the players object that are not included in the inital 3 mandatory pick groups or "groupSelections" object
players.forEach(item => {
    if (mergedGrpSelArr.includes(item.Name)) {
        return;
    }
    else {
        //Giving the remaining players a "score" using: ((HR * 10) + (AB*2) + (OPS*1000)) / 3
        let avgPlrScore = ((item.Stats.HomeRuns * 10) + (item.Stats.AB * 2) + (item.Stats.OPS * 1000)) / 3
        remainingPicks.push({
            name: item.Name,
            value: {
                "HR": item.Stats.HomeRuns,
                "AB": item.Stats.AB,
                "OPS": item.Stats.OPS,
                "PlayerScore": avgPlrScore.toFixed(1)
            }
        })
    }
    //sorting remaining picks by highest to lowest player score to use in a list later
    remainingPicks.sort((a, b) => (b.value.PlayerScore) - (a.value.PlayerScore));
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


//Creating topProspects using the preferred specifications set by the first round of inquirer questions
function pickPreferences(playersToSort) {
    playersToSort.map(item => {
        if (item.Stats.AB > ab && item.Stats.HomeRuns > hr && item.Stats.OPS > ops) {
            topProspects.push(item.Name)
        }
    })
    compareToGroups(topProspects);
}

//Comparing topProspects that meet the user's preferred player specifications
function compareToGroups(topProspects) {
    topProspects.map(item => {
        if (groupSelections[0].includes(item)) {
            possibleTopPicks[0].push(item)
        }
        else if (groupSelections[1].includes(item)) {
            possibleTopPicks[1].push(item)
        }
        else if (groupSelections[2].includes(item)) {
            possibleTopPicks[2].push(item)
        }
    })
    groupContentValidator();
}

//Ensuring all arrays have a value, if not, return the entire group for user discernment
function groupContentValidator() {
    let ptpLenthgs = possibleTopPicks.map(item => item.length)
    if (ptpLenthgs.includes(0)) {
        possibleTopPicks.map((group, index) => {
            if (group.length === 0) {
                groupSelections[index].map(item => {
                    possibleTopPicks[index].push(item);
                })
                console.log("*****NO PLAYERS IN GROUP #" + (index + 1) + " MATCHED THE CRITERIA YOU SELECTED. RETURNING ALL OF GROUP #" + (index + 1) + " FOR EVALUATION*****")
                addStats(possibleTopPicks)
            }
            else { return }
        })
    }
    else { addStats(possibleTopPicks) }
}

//Adding Statistics for user review of players for selection purposes
function addStats(groups) {
    players.map(item => {
        if (groups[0].includes(item.Name)) {
            firstGroupStats.push(item.Name + " | HR: " + item.Stats.HomeRuns + " | AB: " + item.Stats.AB + " | OPS: " + item.Stats.OPS)
        }
        else if (groups[1].includes(item.Name)) {
            secondGroupStats.push(item.Name + " | HR: " + item.Stats.HomeRuns + " | AB: " + item.Stats.AB + " | OPS: " + item.Stats.OPS)
        }
        else if (groups[2].includes(item.Name)) {
            thirdGroupStats.push(item.Name + " | HR: " + item.Stats.HomeRuns + " | AB: " + item.Stats.AB + " | OPS: " + item.Stats.OPS)
        }
    })
    playerSelector(firstGroupStats, secondGroupStats, thirdGroupStats)
}

//Asking the user to select players from each group based on their prefferred specifications, then building an array of those players.
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
        chooseFinalFive();
    })
}

//Creating a list of the remaining top topProspects and calling the final inquirer prompt to select the last 5 players
//Validation for ensuring only 5 players are selected
const validateFiveSelected = (input) => {
    let length = input.length;
    let tooMany = (length - 5);
    let tooFew = (5 - length);
    if (length > 5) {
        return 'YOU HAVE SELECTED ' + tooMany + ' TOO MANY PLAYER(S).  PLEASE SELECT 5 PLAYERS.';
    }
    else if (length < 5) {
        return ('YOU HAVE SELECTED TOO FEW PLAYERS.  PLEASE SELECT ' + tooFew + ' MORE PLAYER(S).');
    }
    return true;
};

//Actual prompt for inquirer to select final 5 players
function chooseFinalFive() {
    console.log("*****THE REMAINING PLAYERS HAVE BEEN GIVEN A SCORE BASED ON: ((HR * 10) + (AB*2) + (OPS*1000)) / 3*****")
    inquirer.prompt([
        {
            message: "Select 5 Remaining Players to fill out your team:",
            type: "checkbox",
            name: "remaining",
            choices: remainingPicks.map(item => item.name + " | PlayerScore: " + item.value.PlayerScore + " | HR: " + item.value.HR + " | AB: " + item.value.AB + " | OPS: " + item.value.OPS ),
            validate: validateFiveSelected
        }

    ]).then(function (answers) {
        fullTeam.push(answers)
        console.log("YOUR FULL TEAM IS AS FOLLOWS: ")
        console.log(fullTeam);
    })

}
