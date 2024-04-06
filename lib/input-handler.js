const BUTTON_RIGHT_CLICK = 2;

const MODE_ELEMENT_MAP = {
    'coordinate': 'set-add-coordinate',
    'start-line': 'set-add-line',
    '': 'set-select',
    'start-node': 'set-add-node'
}

function getAllModeElements() {
    let elements = [];

    for (let key in MODE_ELEMENT_MAP) {
        elements.push(document.getElementById(MODE_ELEMENT_MAP[key]));
    }

    return elements;
}

function switchMode(mode) {
    createState = mode;

    // Update the UI
    let modeElement = document.getElementById(MODE_ELEMENT_MAP[mode]);
    let elements = getAllModeElements();

    for (let i = 0; i < elements.length; i++) {
        // Remove class from DOM element
        elements[i].classList.remove('active');
    }

    modeElement.classList.add('active');

    if (mode === 'start-node') {
        disableMultiSelect();
        enableCreateNode();
    } else {
        disableCreateNode();
        enableMultiSelect();
    }

}

function handleOnClick(e) {

    // Cancel creation on right click
    if (e.evt.button == BUTTON_RIGHT_CLICK) {
        return;
    }

    let x = e.evt.layerX;
    let y = e.evt.layerY;

    switch (createState) {
        case 'coordinate':
            createCoordinate(x, y);
            break;
        case 'start-line':
            startCreateLine(x, y);
            break;
        case 'line-creation':
            nextLinePoint(x, y);
            break;
        default:
            break;
    }
}

document.onkeydown = (e) => {
    if (e.key === 'd' || e.key === 'Escape') {
        if (createState === 'line-creation') {
            currentLine.destroy();
            stopLineCreation();
        }
    }

    if (e.key === 'd' || e.key === 'Delete') {
        deleteSelected();
    }

    if (e.key === 'Enter') {
        if (createState === 'line-creation') {
            // Save the current state of the grid
            stopLineCreation();
        }
    }
}