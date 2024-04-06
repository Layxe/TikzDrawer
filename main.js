// Variables
// #################################################################################################

const GRID_SIZE = 25;

let numCoordinates = 0;

let numLines        = 0;
let currentLine     = null;
let numLineSegments = 0;

let numNodes = 0;

let createState    = '';

// Coordinates for node creation and selection
let x1, y1, x2, y2;
let selecting = false;

// Utility
// #################################################################################################

function isType(node, type) {
    return node.attrs.type != undefined && node.attrs.type === type;
}

function convertToGrid(value) {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function convertToGridCeil(value) {
    return Math.ceil(value / GRID_SIZE) * GRID_SIZE;
}

function convertToGridFloor(value) {
    return Math.floor(value / GRID_SIZE) * GRID_SIZE;
}

// Konva Settings
// #################################################################################################

/* ---------------------------- Initialize Konva ---------------------------- */
const width = window.innerWidth - 20;
const height = window.innerHeight - 20;

const stage = new Konva.Stage({ container: 'container', width, height, });
const layer = new Konva.Layer();
stage.add(layer);

/* ------------------------------- Setup scene ------------------------------ */

function drawGrid() {
    let gridColor = '#ddd';
    let gridWidth = 1;
    let middleIndexHeight = Math.round(height / GRID_SIZE / 2);
    let middleIndexWidth = Math.round(width / GRID_SIZE / 2);

    for (let i = 0; i < width / GRID_SIZE; i++) {
        if (i == middleIndexWidth) {
            gridColor = '#bbb';
        } else {
            gridColor = '#ddd';
            gridWidth = 1;
        }

        layer.add(new Konva.Line({
            points     : [i * GRID_SIZE, 0, i * GRID_SIZE, height],
            stroke     : gridColor,
            strokeWidth: gridWidth,
            type       : 'grid',
            selectable : false,
            draggable  : false,
        }));
    }


    for (let i = 0; i < height / GRID_SIZE; i++) {
        if (i == middleIndexHeight) {
            gridColor = '#bbb';
        } else {
            gridColor = '#ddd';
            gridWidth = 1;
        }

        layer.add(new Konva.Line({
            points     : [0, i * GRID_SIZE, width, i * GRID_SIZE],
            stroke     : gridColor,
            strokeWidth: gridWidth,
            type       : 'grid',
            selectable : false,
            draggable  : false,
        }));
    }
}

/* --------------------------- Setup transforming --------------------------- */

const tr = new Konva.Transformer({
    enabledAnchors: ['middle-left', 'middle-right', 'top-center', 'bottom-center'],
    ignoreStroke: true,
    rotateEnabled: false,
});


const moveTr = new Konva.Transformer({
    enabledAnchors: [''], rotateEnabled: false, keepRatio: false, ignoreStroke: true,
});

// add a new feature, lets add ability to draw selection rectangle
const selectionRectangle = new Konva.Rect({
    fill: 'rgba(255,150,0,0.5)', visible: false,
});

// Disable transformer for coordinates
tr.on('transform', (e) => {
    let element = e.target;
    if (element.attrs.name != undefined && element.attrs.name.includes('coord')) {
        tr.stopTransform();
    }

    if (element.attrs.name != undefined && element.attrs.name.includes('line')) {
        // Make points snap to grid
        let points = element.points();

        for (let i = 0; i < points.length; i++) {
            points[i] = convertToGrid(points[i]);
        }
    }
})

function addTransformationElements() {
    layer.add(tr);
    layer.add(moveTr);
    layer.add(selectionRectangle);
}

document.body.onload = () => {
    drawGrid();
    addTransformationElements();
    enableMultiSelect();
}