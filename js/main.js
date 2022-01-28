// Sets number of rows and columns
let rows = 160;
let cols = 240;
let initialValues = [];
let tick = 0;
let tempValues;
let zerosArray = [...Array(rows * cols)].fill(0);

// Creates grid
for (let i = 0; i < rows; i++) {
    let newDivContainer = document.createElement('div');
    newDivContainer.id = `row${i}`;
    newDivContainer.className = 'grid';
    document.getElementById('game-window').appendChild(newDivContainer);
    for (let j = 0; j < cols; j++) {
        let newDiv = document.createElement('div');
        newDiv.id = `x${j}y${i}`;
        newDiv.className = 'cell';
        document.getElementById(`row${i}`).appendChild(newDiv);
        newDiv.style.backgroundColor = 'gray';
    }
}

// Creates array like object 'cell' and array of selectors from 'cell'
let cell = document.getElementsByClassName('cell');
let selectorArray = Array.from(cell);

// Allows setting of initial cell conditions
let switchColor = (event) => {
    if (event.target.style.backgroundColor === 'gray') {
        event.target.style.backgroundColor = 'lightgreen';
    } else {
        event.target.style.backgroundColor = 'gray';
    }
}

selectorArray.forEach(element => element.addEventListener('click', switchColor));

// Resets all cells background color to gray
let resetCells = () => {
    window.location.reload();
}

document.getElementById('reset').addEventListener('click', resetCells);

// Sets border cell visibilty to hidden
// Top row
for (let i = 0; i < cols; i++) {
    selectorArray[i].style.visibility = 'hidden';
}
// Bottom row
for (let i = (cols * (rows - 1)); i < (rows * cols); i++) {
    selectorArray[i].style.visibility = 'hidden';
}
// Left side
for (let i = cols; i <= (cols * (rows - 2)); i += cols) {
    selectorArray[i].style.visibility = 'hidden';
}
// Right side
for (let i = (cols * 2) - 1; i < (cols * (rows - 1)); i += cols) {
    selectorArray[i].style.visibility = 'hidden';
}

// Sleep function for delays in transition
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Transition from intro to main game
const transition = async () => {
    let introElements = Array.from(document.getElementsByClassName('intro'));
    let rulesList = Array.from(document.getElementsByClassName('rules-list'));

    await sleep(700);
    introElements.forEach(e => e.style.transition = 'transform .6s ease-in-out');
    introElements.forEach(e => e.style.transform = 'scale(0)');
    rulesList.forEach(e => e.style.transition = 'transform .6s ease-in-out');
    rulesList.forEach(e => e.style.transform = 'scale(.58, .65) translate(-63rem, 0)');

    await sleep(100);
    let gameButtons = document.getElementById('button-container');
    gameButtons.style.visibility = 'visible';
    gameButtons.style.transition = 'opacity .6s ease-in-out';
    gameButtons.style.opacity = '1';
    
    let gameWindow = document.getElementById('game-window');
    gameWindow.style.visibility = 'visible';
    gameWindow.style.transition = 'opacity .6s ease-in-out';
    gameWindow.style.opacity = '1';
}

document.getElementById('play').addEventListener('click', transition);

// Creates array of cell status values (0 or 1) based on current grid colors
let initialGridValues = () => {

    for (let i = 0; i < cell.length; i++) {
        if (selectorArray[i].style.backgroundColor === 'gray') {
            initialValues.push(0);
        } else if (selectorArray[i].style.backgroundColor === 'lightgreen') {
            initialValues.push(1);
        }
    }

    document.getElementById('step').removeEventListener('click', initialGridValues);
    document.getElementById('run').removeEventListener('click', initialGridValues);
    return initialValues;
}

// Calculates grid values for the next "tick"
let calculateNextGridValues = () => {
    let sum;
    let nextValues = zerosArray.slice();
    let currentValues;

    if (tick === 0) {
        currentValues = initialValues.slice(); 
    } else {
        currentValues = tempValues.slice();
    }

    // Calculate whether cell is alive or dead
    for (let i = cols + 1; i < ((rows - 1) * cols); i++) {
        if (i % cols === 0) {
            currentValues.splice(i, 1, 0);
            currentValues.splice(i - 1, 1, 0);
        } else {
            sum = currentValues[(i-1)-cols] + currentValues[i-cols] + currentValues[(i+1)-cols] + currentValues[i-1] + currentValues[i+1] + currentValues[(i-1)+cols] + currentValues[i+cols] + currentValues[(i+1)+cols];          
            if (currentValues[i] === 0 && sum === 3) {
                nextValues.splice(i,1,1);
            } else if (currentValues[i] === 1 && (sum === 2 || sum === 3)) {
                nextValues.splice(i,1,1);
            }
        }
    }

    // Recolors grid
    for (let i = cols + 1; i < ((rows - 1) * cols); i++) {
        if (i % cols === 0) {
            continue;
        } else if (i % cols === cols - 1) {
            continue;
        } else if (nextValues[i] === 0) {
            selectorArray[i].style.backgroundColor = 'gray';
        } else if (nextValues[i] === 1) {
            selectorArray[i].style.backgroundColor = 'lightgreen';
        }
    }
    tick++
    tempValues = nextValues.slice();
    return tempValues;
}

// Step button functionality
document.getElementById('step').addEventListener('click', initialGridValues);
document.getElementById('step').addEventListener('click', calculateNextGridValues);

// Run and freeze button functionality
let run = () => {
    let intervalId = window.setInterval(calculateNextGridValues, 100);

    let freeze = () => {
        window.clearInterval(intervalId);
    }
    document.getElementById('freeze').addEventListener('click', freeze);
}

document.getElementById('run').addEventListener('click', initialGridValues);
document.getElementById('run').addEventListener('click', run);

// Randomize button functionality
let randomize = () => {
    tempValues = [...Array(rows * cols)].fill(0);

    for (let i = cols + 1; i < ((rows - 1) * cols); i++) {
        if (i % cols === 0) {
            continue;
        } else if (i % cols === cols - 1) {
            continue;
        } else {
            tempValues[i] = Math.round(Math.random());
            if (tempValues[i] === 0) {
                selectorArray[i].style.backgroundColor = 'gray';
            } else if (tempValues[i] === 1) {
                selectorArray[i].style.backgroundColor = 'lightgreen';
            }
        }
    }
}

document.getElementById('randomize').addEventListener('click', randomize);