function createNodeStart(e) {
    // do nothing if we mousedown on any shape
    if (e.target !== stage) {
        return null;
    }
    e.evt.preventDefault();
    x1 = stage.getPointerPosition().x;
    y1 = stage.getPointerPosition().y;
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    x1 = convertToGrid(x1);
    y1 = convertToGrid(y1);

    numNodes++;

    // Create new rectangle node
    let node = new Konva.Rect({
        x: x1, y: y1, width: 0, height: 0,
        fill: 'rgba(0,0,0,0.1)',
        stroke: 'black',
        name: 'node-' + numNodes,
        draggable: true,
        type: 'node',
    });

    node.on('transform', (e) => {
        let obj = e.target;
        // Reset scale
        obj.scaleX(1);
        obj.scaleY(1);
        obj.skewX(0);
        obj.skewY(0);
        obj.rotation(0);

        let cursorPos = stage.getPointerPosition();
        let cursorX = convertToGrid(cursorPos.x);
        let cursorY = convertToGrid(cursorPos.y);

        let width = obj.width();
        let height = obj.height();

        let x = obj.x();
        let y = obj.y();

        let activeAnchor = tr.getActiveAnchor();

        switch (activeAnchor) {
            case "middle-right":
                width = cursorX - x;
                break;
            case "bottom-center":
                height = cursorY - y;
                break;

        }

        obj.width(width);
        obj.height(height);

        obj.x(convertToGrid(x));
        obj.y(convertToGrid(y));

    });

    node.on('dragmove', (e) => {
        let x = node.x();
        let y = node.y();

        node.x(convertToGrid(x));
        node.y(convertToGrid(y));
    });

    layer.add(node);

    createState = 'node-creation';
    return node;
}

function enableCreateNode() {
    let currentNode = null;

    stage.on('mousedown touchstart', (e) => {
        currentNode = createNodeStart(e);
    });

    stage.on('mousemove touchmove', (e) => {

        // do nothing if we didn't start selection
        if (createState !== 'node-creation' || currentNode === null) {
            return;
        }

        e.evt.preventDefault();
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        x2 = convertToGrid(x2);
        y2 = convertToGrid(y2);

        currentNode.setAttrs({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        });
    });

    stage.on('mouseup touchend', (e) => {
        if (createState !== 'node-creation') {
            return;
        }
        e.evt.preventDefault();

        if (currentNode.width() == 0 || currentNode.height() == 0) {
            currentNode.destroy();
        }

        // Reset state
        createState = 'start-node';
        currentNode = null;
    });
}

function disableCreateNode() {
    stage.off('mousedown touchstart');
    stage.off('mousemove touchmove');
    stage.off('mouseup touchend');
}