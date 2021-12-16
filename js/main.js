/*
RULES
1) user inputs which cells initially alive or dead with mouseclick ***DONE***
2) Any live cell with two or three live neighbours survives.
3) Any dead cell with three live neighbours becomes a live cell.
4) All other live cells die in the next generation. Similarly, all other dead cells stay dead.
*/

// Sets number of rows and columns
let rows = 160;
let cols = 160;
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
    //for (let i = 0; i < cell.length; i++) {
    //    cell[i].style.backgroundColor = 'gray';
    //}
}

document.getElementById('reset').addEventListener('click', resetCells);

// Creates a 2D array of HTML selectors for each cell
while (copySelectorArray.length) {
    selector2DArray.push(copySelectorArray.splice(0,cols));
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

    // Calculate corners manually in this order: top-left, top-right, bottom-left, bottom-right
    //top-left corner
    sum = currentValues[0][1] + currentValues[1][0] + currentValues[1][1];
    if (currentValues[0][0] === 0 && sum === 3) {nextValues[0].splice(0,1,1);}
    else if (currentValues[0][0] === 1 && (sum === 2 || sum === 3)) {nextValues[0].splice(0,1,1);}
    //top-right corner
    sum = currentValues[0][cols-2] + currentValues[1][cols-1] + currentValues[1][cols-2];
    if (currentValues[0][cols-1] === 0 && sum === 3) {nextValues[0].splice(cols-1,1,1);}
    else if (currentValues[0][cols-1] === 1 && (sum === 2 || sum === 3)) {nextValues[0].splice(cols-1,1,1);}
    //bottom-left corner
    sum = currentValues[rows-2][0] + currentValues[rows-2][1] + currentValues[rows-1][1];
    if (currentValues[rows-1][0] === 0 && sum === 3) {nextValues[rows-1].splice(0,1,1);}
    else if (currentValues[rows-1][0] === 1 && (sum === 2 || sum === 3)) {nextValues[rows-1].splice(0,1,1);}
    //bottom-right corner
    sum = currentValues[rows-1][cols-2] + currentValues[rows-2][cols-2] + currentValues[rows-2][cols-1];
    if (currentValues[rows-1][cols-1] === 0 && sum === 3) {nextValues[rows-1].splice(cols-1,1,1);}
    else if (currentValues[rows-1][cols-1] === 1 && (sum === 2 || sum === 3)) {nextValues[rows-1].splice(cols-1,1,1);}

    // Calculate top row excluding corners
    for (let i = 1; i < cols - 1; i++) {
        sum = currentValues[0][i-1] + currentValues[1][i-1] + currentValues[1][i] + currentValues[1][i+1] + currentValues[0][i+1];
        if (currentValues[0][i] === 0 && sum === 3) {nextValues[0].splice(i,1,1);}
        else if (currentValues[0][i] === 1 && (sum === 2 || sum === 3)) {nextValues[0].splice(i,1,1);}
    }

    // Calculate bottom row excluding corners
    for (let i = 1; i < cols - 1; i++) {
        sum = currentValues[rows-1][i-1] + currentValues[rows-2][i-1] + currentValues[rows-2][i] + currentValues[rows-2][i+1] + currentValues[rows-1][i+1];
        if (currentValues[rows-1][i] === 0 && sum === 3) {nextValues[rows-1].splice(i,1,1);}
        else if (currentValues[rows-1][i] === 1 && (sum === 2 || sum === 3)) {nextValues[rows-1].splice(i,1,1);}
    }

    // Calculate left side excluding corners
    for (let i = 1; i < rows - 1; i++) {
        sum = currentValues[i-1][0] + currentValues[i-1][1] + currentValues[i][1] + currentValues[i+1][1] + currentValues[i+1][0];
        if (currentValues[i][0] === 0 && sum === 3) {nextValues[i].splice(0,1,1);}
        else if (currentValues[i][0] === 1 && (sum === 2 || sum === 3)) {nextValues[i].splice(0,1,1);}
    }

    // Calculate right side excluding corners
    for (let i = 1; i < rows - 1; i++) {
        sum = currentValues[i-1][cols-1] + currentValues[i-1][cols-2] + currentValues[i][cols-2] + currentValues[i+1][cols-2] + currentValues[i+1][cols-1];
        if (currentValues[i][cols-1] === 0 && sum === 3) {nextValues[i].splice(cols-1,1,1);}
        else if (currentValues[i][cols-1] === 1 && (sum === 2 || sum === 3)) {nextValues[i].splice(cols-1,1,1);}
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