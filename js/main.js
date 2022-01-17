/*
RULES
1) user inputs which cells initially alive or dead with mouseclick ***DONE***
2) Any live cell with two or three live neighbours survives.
3) Any dead cell with three live neighbours becomes a live cell.
4) All other live cells die in the next generation. Similarly, all other dead cells stay dead.
*/

// Sets number of rows and columns
let rows = 200;
let cols = 200;
let initialValues = [];
let rowValues = [];
let nextGridValues = [];
let tick = 0;
let tempValues = [...Array(rows)].map(e => Array(cols).fill(0));

// Creates grid
for (let i = 0; i < rows; i++) {
    let newDivContainer = document.createElement('div');
    newDivContainer.id = `row${i}`;
    newDivContainer.className = 'grid';
    document.getElementById('main').appendChild(newDivContainer);
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
let copySelectorArray = selectorArray;
let selector2DArray = [];

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

// Creates a 2D array of HTML selectors for each cell
while (copySelectorArray.length) {
    selector2DArray.push(copySelectorArray.splice(0,cols));
}

// Sets border cell visibilty to hidden
// Top row
for (let i = 0; i < cols; i++) {
    selector2DArray[0][i].style.visibility = 'hidden';
}
// Bottom row
for (let i = 0; i < cols; i++) {
    selector2DArray[rows - 1][i].style.visibility = 'hidden';
}
// Left side
for (let i = 0; i < rows; i++) {
    selector2DArray[i][0].style.visibility = 'hidden';
}
// Right side
for (let i = 0; i < rows; i++) {
    selector2DArray[i][rows - 1].style.visibility = 'hidden';
}

// Creates array of cell status values (0 or 1) based on current grid colors
let initialGridValues = () => {
    initialValues.length = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if ((selector2DArray[i][j]).style.backgroundColor === 'gray') {
                rowValues.push(0);
            } else if ((selector2DArray[i][j]).style.backgroundColor === 'lightgreen') {
                rowValues.push(1);
            }
        }
    }

    while(rowValues.length) {
        initialValues.push(rowValues.splice(0, cols));
    }

    document.getElementById('step').removeEventListener('click', initialGridValues);
    document.getElementById('run').removeEventListener('click', initialGridValues);
    return initialValues;
}

// Calculates grid values for the next "tick"
let calculateNextGridValues = () => {
    let sum;
    let nextValues = [...Array(rows)].map(e => Array(cols).fill(0));
    let currentValues = [...Array(rows)].map(e => Array(cols).fill(0));

    if (tick === 0) {
        for (let i = 0; i < initialValues.length; i++) {
            currentValues[i] = initialValues[i].slice();
        }  
    } else {
        for (let i = 0; i < tempValues.length; i++) {
            currentValues[i] = tempValues[i].slice();
        }
    }

    // Calculate all cells excluding border cells
    for (let i = 1; i < rows - 1; i++) {
        for (let j = 1; j < cols - 1; j++) {
        sum = currentValues[j][i-1] + currentValues[j+1][i-1] + currentValues[j+1][i] + currentValues[j+1][i+1] + currentValues[j][i+1] + currentValues[j-1][i+1] + currentValues[j-1][i] + currentValues[j-1][i-1];
        if (currentValues[j][i] === 0 && sum === 3) {nextValues[j].splice(i,1,1);}
        else if (currentValues[j][i] === 1 && (sum === 2 || sum === 3)) {nextValues[j].splice(i,1,1);}    
        }
    }
    
    // Recolors grid
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            if (nextValues[j][i] === 0) {
                selector2DArray[j][i].style.backgroundColor = 'gray';
            } else if (nextValues[j][i] === 1) {
                selector2DArray[j][i].style.backgroundColor = 'lightgreen';
            }
        }
    }
    tick++;
    tempValues = [...Array(rows)].map(e => Array(cols).fill(0));
    for (let i = 0; i < nextValues.length; i++) {
        tempValues[i] = nextValues[i].slice();
    }
    return tempValues;
}

// Step button functionality
document.getElementById('step').addEventListener('click', initialGridValues);
document.getElementById('step').addEventListener('click', calculateNextGridValues);

// Run and freeze button functionality
let run = () => {
    let intervalId = window.setInterval(calculateNextGridValues, 20);

    let freeze = () => {
        window.clearInterval(intervalId);
    }
    document.getElementById('freeze').addEventListener('click', freeze);
}

document.getElementById('run').addEventListener('click', initialGridValues);
document.getElementById('run').addEventListener('click', run);

// Randomize button functionality
let randomize = () => {
    tempValues = [...Array(rows)].map(e => Array(cols).fill(0));

    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            tempValues[j][i] = Math.round(Math.random());
            if (tempValues[j][i] === 0) {
                selector2DArray[j][i].style.backgroundColor = 'gray';
            } else if (tempValues[j][i] === 1) {
                selector2DArray[j][i].style.backgroundColor = 'lightgreen';
            }
        }
    }
}

document.getElementById('randomize').addEventListener('click', randomize);