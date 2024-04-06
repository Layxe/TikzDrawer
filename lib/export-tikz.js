function convertCoordinatesToTikz(x, y) {

    let scaleFactor = 0.25; // 1 grid step = 25px = 0.25cm
    let middleIndexHeight = Math.round(height / GRID_SIZE / 2);
    let middleIndexWidth = Math.round(width / GRID_SIZE / 2);

    let middleX = middleIndexWidth * GRID_SIZE;
    let middleY = middleIndexHeight * GRID_SIZE;

    x = x - middleX;
    y = middleY - y;

    return `(${x / GRID_SIZE * scaleFactor}, ${y / GRID_SIZE * scaleFactor})`;
}

function convertDimensionsToTikz(width, height) {
    let scaleFactor = 0.25; // 1 grid step = 25px = 0.25cm


    width = width / GRID_SIZE * scaleFactor;
    height = height / GRID_SIZE * scaleFactor;

    return `minimum width=${width} cm, minimum height=${height} cm`;
}

function checkPathForCycle(points) {

    if (points.length < 4) {
        return false;
    }

    let startX = points[0];
    let startY = points[1];

    let endX = points[points.length - 2];
    let endY = points[points.length - 1];

    // Check if the start and end points are the same
    if (startX === endX && startY === endY) {
        return true;
    }

    return false;

}

function exportToTikz() {

    let fileStr = '\\begin{tikzpicture}\n';

    fileStr += "    % Coordinates\n"
    fileStr += "    % ##############################################################################################\n\n"

    layer.find(elem => {
        if (isType(elem, 'coordinate')) {
            fileStr += `    \\coordinate (${elem.attrs.name}) at ${convertCoordinatesToTikz(elem.x(), elem.y())};\n`
        }
    })

    fileStr += "\n\n    % Nodes\n"
    fileStr += "    % ##############################################################################################\n\n"

    layer.find(elem => {
        if (isType(elem, 'node')) {
            let width = elem.width();
            let height = elem.height();

            let x = elem.x() + width / 2;
            let y = elem.y() + height / 2;

            fileStr += `    \\node [draw, rectangle, ${convertDimensionsToTikz(width, height)}] (${elem.attrs.name}) at ${convertCoordinatesToTikz(x, y)} {};\n`
        }
    })

    fileStr += "\n\n    % Lines\n"
    fileStr += "    % ##############################################################################################\n\n"

    layer.find(elem => {
        if (isType(elem, 'line')) {
            fileStr += `    \\draw `

            for (let i = 0; i < elem.points().length; i += 2) {
                if (i < elem.points().length - 2) {
                    fileStr += `${convertCoordinatesToTikz(elem.points()[i], elem.points()[i + 1])} -- `
                } else {
                    if (!checkPathForCycle(elem.points())) {
                        fileStr += `${convertCoordinatesToTikz(elem.points()[i], elem.points()[i + 1])};\n`
                    } else {
                        fileStr += `cycle;\n`
                    }
                }
            }
        }
    })

    fileStr += '\\end{tikzpicture}';

    // Copy to clipboard
    navigator.clipboard.writeText(fileStr);

    // Write into a file
    // const a = document.createElement('a');
    // const file = new Blob([fileStr], { type: 'text/plain' });
    // a.href = URL.createObjectURL(file);
    // a.download = 'tikz.tex';
    // a.click();

    console.log(fileStr);
}