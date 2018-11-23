// Size of field
const rows = 16;
const columns = 24;
// Size of cell
const rectWidth = 10;
const rectHeight = 10;
// Cell states
const dead = 0;
const alive = 1;
// Colors
const cellColors = [ 'orange' /*dead*/, 'yellow' /*alive*/ ];
// Fields
var field = new Array(rows); // current generation that is displayed
var nextgen = new Array(rows); // next generation

var cnt = 0;
var iterations = 0;
var auto_iter_timer = undefined;

function getCtx() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    return ctx;
}

function body_onload() {
    buildField();
    drawField();
}

function showIterations() {
    var iterations_element = document.getElementById('iterations');
    iterations_element.innerText = iterations;
}

function activateTimer() {
    auto_iter_timer = setInterval(iterateGenerationAndDraw, 500);
}

function deactivateTimer() {
    clearInterval(auto_iter_timer);
}

function buildField() {
    for (var row = 0; row < rows; row++) {
        field[row] = new Array(columns);
        nextgen[row] = new Array(columns);
        for (var column = 0; column < columns; column++) {
            field[row][column] = dead;
            nextgen[row][column] = dead;
            cnt++;
        }
    }
    iterations = 0;
    showIterations();
    //alert('buildField() completed: ' + cnt + ' items');
    //alert('getNeighboursCount(1/1): ' + getNeighboursCount(1, 1, alive));
}

function initBlinker(drawFieldAfterInit) {
    field[1][2] = alive;
    field[1][3] = alive;
    field[1][4] = alive;
    if (drawFieldAfterInit)
        drawField();
}

function initArrow(drawFieldAfterInit) {
    field[1][1] = alive;
    field[2][2] = alive;
    field[3][3] = alive;
    field[4][2] = alive;
    field[5][1] = alive;
    if (drawFieldAfterInit)
        drawField();
}

function initPentadecathlon(drawFieldAfterInit) {
    field[7][8] = alive;
    field[7][11] = alive;
    field[7][13] = alive;
    field[7][14] = alive;
    field[7][16] = alive;
    field[7][19] = alive;
    field[8][7] = alive;
    field[8][8] = alive;
    field[8][11] = alive;
    field[8][16] = alive;
    field[8][19] = alive;
    field[8][20] = alive;
    field[9][8] = alive;
    field[9][11] = alive;
    field[9][13] = alive;
    field[9][14] = alive;
    field[9][16] = alive;
    field[9][19] = alive;
    if (drawFieldAfterInit)
        drawField();
}

function drawField() {
    var ctx = getCtx();
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            ctx.fillStyle =  cellColors[field[row][column]];
            ctx.fillRect(column * rectWidth, row * rectHeight, rectWidth, rectHeight);
        }
    }
}

function iterateGenerationAndDraw() {
    iterateGeneration(true);
}

function iterateGeneration(showFieldAfterInteration) {
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            var livingNeighbours = getNeighboursCount(row, column, alive);
            var newstate = -1;
            if (field[row][column] == dead) {
                if (livingNeighbours == 3) {
                    newstate = alive;
                    console.log(row + '/' + column + ' will be born!');
                }
            }
            if (field[row][column] == alive) {
                if (livingNeighbours < 2 || livingNeighbours > 3) {
                    newstate = dead;
                    console.log(row + '/' + column + ' will die (' + livingNeighbours + ')!');
                }
            }
            nextgen[row][column] = (newstate == -1 ? field[row][column] : newstate);
        }
    }
    // Copy nextgen to field
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            field[row][column] = nextgen[row][column];
        }
    }
    iterations++;
    showIterations();
    if (showFieldAfterInteration)
        drawField();
}

function getNeighboursCount(row, column, cellState) {
    //console.log('getNeighboursCount(' + row + ', ' + column + ', ' + cellState + ')');
    var neighboursCount = 0;
    for (var xoffset = -1; xoffset < 2; xoffset++) {
        for (var yoffset = -1; yoffset < 2; yoffset++) {
            if (Math.abs(xoffset) + Math.abs(yoffset) > 0) { // no offset = cell whose neighbours should be analyzed
                var actualRow = ((row + yoffset) > -1 ? row + yoffset : rows - 1);
                if (actualRow > (rows - 1)) {
                    actualRow = 0;
                }
                var actualColumn = ((column + xoffset) > -1 ? column + xoffset : columns - 1);
                if (actualColumn > (columns - 1)) {
                    actualColumn = 0;
                }
                if (field[actualRow][actualColumn] == cellState) {
                    neighboursCount++;
                }
            }
        }
    }
    return neighboursCount;
}