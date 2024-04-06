function deleteSelected() {
    const selected = tr.nodes();
    const moveSelected = moveTr.nodes();

    moveSelected.forEach((node) => {
        node.destroy();
    });
    selected.forEach((node) => {
        node.destroy();
    });

    tr.nodes([]);
    moveTr.nodes([]);
    layer.batchDraw();

    // For coordinate ids, get the highest number and set numCoordinates to that
    let max = 0;
    layer.find(elem => {
        if (elem.attrs.name != undefined && elem.attrs.name.includes('coord')) {
            let num = parseInt(elem.attrs.name.split('-')[1]);
            if (num > max) {
                max = num;
            }
        }
    })

    numCoordinates = max;
}

function setSelectionDownEvent() {
    stage.on('mousedown touchstart', (e) => {
        // do nothing if we mousedown on any shape
        if (e.target !== stage) {
            return;
        }
        e.evt.preventDefault();
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.width(0);
        selectionRectangle.height(0);
        selecting = true;
    });
}

function setSelectionMoveEvent() {
    stage.on('mousemove touchmove', (e) => {
        // do nothing if we didn't start selection
        if (!selecting) {
            return;
        }
        e.evt.preventDefault();
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
            visible: true,
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        });
    });
}

function setSelectionUpEvent() {
    stage.on('mouseup touchend', (e) => {
        // do nothing if we didn't start selection
        selecting = false;
        if (!selectionRectangle.visible()) {
            return;
        }
        e.evt.preventDefault();

        if (selectionRectangle.width() < 5 || selectionRectangle.height() < 5) {
            selectionRectangle.visible(false);
            handleOnClick(e);
            return;
        }

        // update visibility in timeout, so we can check it in click event
        selectionRectangle.visible(false);

        // Select all shapes
        const shapes = stage.find(element => {
            if (isType(element, 'node')) {
                return element;
            }
        });

        const coords = stage.find(element => {
            if (isType(element, 'coordinate') || isType(element, 'line')) {
                return element;
            }
        });

        const box = selectionRectangle.getClientRect();
        const selected = shapes.filter((shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
        );

        const selectedCoords = coords.filter((coord) =>
            Konva.Util.haveIntersection(box, coord.getClientRect())
        );

        tr.nodes(selected);
        moveTr.nodes(selectedCoords);
    });
}

function enableMultiSelect() {
    setSelectionDownEvent();
    setSelectionMoveEvent();
    setSelectionUpEvent();
}

function disableMultiSelect() {
    stage.off('mousedown touchstart');
    stage.off('mousemove touchmove');
    stage.off('mouseup touchend');
}