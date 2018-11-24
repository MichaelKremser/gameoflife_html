// Size of field
const rows = 48;
const columns = 64;
// Size of cell
const rectWidth = 10;
const rectHeight = 10;
// Cell states
const dead = 0;
const alive = 1;
// Orientation
const horizontal = 0;
const vertical = 1;
// Colors
const cellColors = [ 'orange' /*dead*/, 'yellow' /*alive*/ ];
// Fields
var field = new Array(rows); // current generation that is displayed
var nextgen = new Array(rows); // next generation

var cnt = 0;
var cellsAlive = 0;
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
    auto_iter_timer = setInterval(iterateGenerationAndDraw, 25);
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

function invertField(drawFieldAfterInvert) {
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            field[row][column] = (field[row][column] == dead ? alive : dead);
        }
    }
    if (drawFieldAfterInvert)
        drawField();
}

function mirrorField(drawFieldAfterMirroring, mirrorType) {
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            var originalRow = (mirrorType == 'X' ? row : rows - 1 - row);
            var originalColumn = (mirrorType == 'Y' ? column : columns - 1 - column);
            nextgen[row][column] = field[originalRow][originalColumn];
        }
    }
    copyNextget();
    if (drawFieldAfterMirroring)
        drawField();
}

function mirrorX(drawFieldAfterMirroring) {
    mirrorField(drawFieldAfterMirroring, 'X');
}

function mirrorY(drawFieldAfterMirroring) {
    mirrorField(drawFieldAfterMirroring, 'Y');
}

function drawLine(a, start, end, orientation) {
    for (var ptr = start; ptr <= end; ptr++) {
        field[orientation == horizontal ? a : ptr][orientation == vertical ? a : ptr] = alive;
    }
}

function drawField() {
    var ctx = getCtx();
    cellsAlive = 0;
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            var cellState = field[row][column];
            ctx.fillStyle =  cellColors[cellState];
            ctx.fillRect(column * rectWidth, row * rectHeight, rectWidth, rectHeight);
            if (cellState == alive)
                cellsAlive++;
        }
    }
}

function iterateGenerationAndDraw() {
    iterateGeneration(true);
    if (cellsAlive == 0) {
        deactivateTimer();
        alert('Sorry, your world died!');
    }
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
    copyNextget();
    iterations++;
    showIterations();
    if (showFieldAfterInteration)
        drawField();
}

function copyNextget() {
    // Copy nextgen to field
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            field[row][column] = nextgen[row][column];
        }
    }
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

/* Default figures */

function initBlinker(drawFieldAfterInit) {
    drawLine(1, 2, 4, horizontal);
    if (drawFieldAfterInit)
        drawField();
}

function initPlus(drawFieldAfterInit) {
    drawLine(1, 2, 4, horizontal);
    drawLine(3, 0, 2, vertical);
    if (drawFieldAfterInit)
        drawField();
}

function initLWSS(drawFieldAfterInit) {
    drawLine(1, 2, 5, horizontal);
    drawLine(5, 2, 3, vertical);
    field[2][1] = alive;
    field[4][1] = alive;
    field[4][4] = alive;
    if (drawFieldAfterInit)
        drawField();
}

function initRPentomino(drawFieldAfterInit) {
    field[1][2] = alive;
    field[1][3] = alive;
    field[2][1] = alive;
    field[2][2] = alive;
    field[3][2] = alive;
    if (drawFieldAfterInit)
        drawField();
}

function init42(drawFieldAfterInit) {
    drawLine(1, 0, 4, vertical);
    drawLine(4, 1, 5, horizontal);
    drawLine(5, 0, 8, vertical);
    drawLine(0, 7, 10, horizontal);
    drawLine(4, 7, 10, horizontal);
    drawLine(8, 7, 10, horizontal);
    drawLine(10, 0, 4, vertical);
    drawLine(7, 4, 8, vertical);
    if (drawFieldAfterInit)
        drawField();
}

function initTobiasWorld(drawFieldAfterInit) {
    field[1][4] = alive;
    field[1][5] = alive;
    field[2][3] = alive;
    field[2][6] = alive;
    field[3][2] = alive;
    field[3][7] = alive;
    field[4][7] = alive;
    field[5][7] = alive;
    field[4][2] = alive;
    field[5][2] = alive;
    field[6][2] = alive;
    field[7][2] = alive;
    field[6][7] = alive;
    field[7][2] = alive;
    field[5][3] = alive;
    field[5][4] = alive;
    field[5][5] = alive;
    field[5][6] = alive;
    field[7][7] = alive;

    field[1][9] = alive;
    field[1][10] = alive;
    field[1][1] = alive;
    field[1][12] = alive;
    field[2][10] = alive;
    field[3][11] = alive;
    field[4][11] = alive;
    field[5][11] = alive;
    field[6][11] = alive;
    field[7][11] = alive;
    field[1][13] = alive;

    field[13][8] = alive;
    field[9][10] = alive;
    field[9][11] = alive;
    field[9][12] = alive;
    field[9][13] = alive;
    field[11][10] = alive;
    field[11][11] = alive;
    field[11][12] = alive;
    field[11][13] = alive;

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