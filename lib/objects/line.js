function startCreateLine(x, y) {

    let mousePos = stage.getPointerPosition();

    const line = new Konva.Line({
        points: [
            convertToGrid(x), convertToGrid(y), convertToGrid(mousePos.x), convertToGrid(mousePos.y)
        ],
        stroke: 'black',
        strokeWidth: 2,
        name: 'line',
        type: 'line',
        draggable: true,
        dragDistance: 5,
    });

    stage.on('mousemove', (e) => {
        let pos = stage.getPointerPosition();
        let p = line.points();
        p[2 + numLineSegments] = convertToGrid(pos.x);
        p[3 + numLineSegments] = convertToGrid(pos.y);
        line.points(p);
        layer.batchDraw();
    });

    line.on('dragmove', () => {
        let x = line.x();
        let y = line.y();

        line.x(convertToGrid(x));
        line.y(convertToGrid(y));

        layer.batchDraw();
    });

    createState = 'line-creation'
    currentLine = line;

    layer.add(line);

    return line;
}

function nextLinePoint(x, y) {

    x = convertToGrid(x);
    y = convertToGrid(y);

    let prevX = currentLine.points()[0 + numLineSegments];
    let prevY = currentLine.points()[1 + numLineSegments];

    // If the point is the same as the previous, do nothing
    if (x == prevX && y == prevY) {
        return;
    }

    currentLine.points()[2 + numLineSegments] = x;
    currentLine.points()[3 + numLineSegments] = y;

    numLineSegments += 2;
}

function removeDuplicatePoint() {
    let x = convertToGrid(currentLine.points()[2 + numLineSegments]);
    let y = convertToGrid(currentLine.points()[3 + numLineSegments]);

    let prevX = currentLine.points()[0 + numLineSegments];
    let prevY = currentLine.points()[1 + numLineSegments];

    // Remove the last point if it's the same as the previous
    if (x == prevX && y == prevY) {
        currentLine.points(currentLine.points().slice(0, -2));
    }
}

function stopLineCreation() {

    removeDuplicatePoint();

    stage.on('mousemove', (e) => { /* Nothing */ });
    stage.off('mousemove');
    createState     = 'start-line';
    numLineSegments = 0;
    currentLine     = null;
    setSelectionMoveEvent();
}
