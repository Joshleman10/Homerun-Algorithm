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
let prospects = [];
let firstGroupStats = [];
let secondGroupStats = [];
let thirdGroupStats = [];
let hr = 0;
let ab = 0;
let ops = 0;
let remainingPicks = [];
const grpSelArr = [groupSelections[0], groupSelections[1], groupSelections[2]];
const mergedGrpSelArr = [].concat.apply([], grpSelArr);
players.forEach(item => {
    mergedGrpSelArr.includes(item.Name) ? "" : remainingPicks.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB + " OPS: " + item.Stats.OPS);
})
//write functions to select top hitters
function mostHR(hitters){
    hitters.Stats.HomeRuns.map(item => {values.sort((a,b) => b-a).slice(0,5)})
}
function mostAB(hitters){
    hitters.Stats.AB.map(item => {values.sort((a,b) => b-a).slice(0,5)})
}
function mostOPS(hitters){
    hitters.Stats.OPS.map(item => {values.sort((a,b) => b-a).slice(0,5)})
}

//Asking the user to set parameters for the players they would like to select
function initialInquiry(){
inquirer.prompt([
    {
        message: "At least how many HR do you want your picks to have from last season?",
        type: "list",
        name: "HR",
        choices: 
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
}

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
function groupContentValidator(){
        let ptpLenthgs = possibleTopPicks.map(item => item.length)
        if (ptpLenthgs.includes(0)) {
            possibleTopPicks.map((group, index) => {
                if (group.length === 0) {
                    groupSelections[index].map(item => {
                        possibleTopPicks[index].push(item);
                    })
                    console.log("*****No players in group #" + (index+1) + " matched the criterea you selected. Returning all of group #" + (index+1) + " for evaluation*****")
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
            firstGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB + " OPS: " + item.Stats.OPS)
        }
        else if (groups[1].includes(item.Name)) {
            secondGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB + " OPS: " + item.Stats.OPS)
        }
        else if (groups[2].includes(item.Name)) {
            thirdGroupStats.push(item.Name + " HR: " + item.Stats.HomeRuns + " AB: " + item.Stats.AB + " OPS: " + item.Stats.OPS)
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
        initialInquiry(remainingPicks);
    })
}

//Creating a list of the remaining top prospects and calling the final inquirer prompt to select the last 5 players
//Validation for ensuring only 5 players are selected
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

//Actual prompt for inquirer to select final 5 players
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

initialInquiry()