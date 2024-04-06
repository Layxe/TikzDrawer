function createCoordinate(x, y) {
    numCoordinates++;
    const element = new Konva.Group({
        x: convertToGrid(x),
        y: convertToGrid(y),
        draggable: true,
        name: 'coord-' + numCoordinates,
        type: 'coordinate'
    });

    const circle = new Konva.Circle({
        radius: 10,
        fill: 'firebrick',
    });

    const text = new Konva.Text({
        text         : numCoordinates,
        fontSize     : 12,
        fill         : 'white',
        align        : 'center',
        verticalAlign: 'middle',
    });

    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2 - 1);

    element.add(circle);
    element.add(text);

    element.on('dragmove', () => {
        // Move in grid
        element.x(convertToGrid(element.x()));
        element.y(convertToGrid(element.y()));
        layer.batchDraw();
    });

    layer.add(element);

    return element;
}