const mainDiv = document.getElementById('main-div');
const mapDiv = document.getElementById('map-div');
const viewerDiv = document.getElementById('viewer-div');
const canvas = document.getElementById('mycanvas');

let cursorPositionX = 0;
let cursorPositionY = 0;

let schoolName = 'facility_name';

let viewer = new PhotoSphereViewer.Viewer({
    container: document.querySelector('#viewer'),
    panorama: './photos/none.jpeg',
    navbar: [
        'zoom',
        'caption',
        'fullscreen'
    ]
});

let canvasFixSize = 24; //value comes from padding? bootstrap? idk :S

let _w = mainDiv.clientWidth / 2 - canvasFixSize;
let _h = mainDiv.clientHeight;

const app = new PIXI.Application({
    backgroundColor: 0xcccccc,
    view: canvas,
    width: _w,
    height: _h,
    resolution: window.devicePixelRatio,
    autoDensity: true,
});

// Sprite drag offset
let mouseOffsetX = 0;
let mouseOffsetY = 0;

let mapContainer = new PIXI.Container();

const texture = PIXI.Texture.from('./photos/facility_name/floorplan.png');
const map = new PIXI.Sprite(texture);

mapContainer.interactive = true;
mapContainer
.on('pointerdown', onDragStart)
.on('pointerup', onDragEnd)
.on('pointerupoutside', onDragEnd)
.on('pointermove', onDragMove);

function onDragStart(event) {
    console.log('onDragStart');
    this.data = event.data;
    this.dragging = true;
    // get the mouse coursor location within the window
    const appCursorLocation = this.data.getLocalPosition(this.parent);
    // calculate the offset with the app cursor location - sprite location
    mouseOffsetX = appCursorLocation.x - this.x
    mouseOffsetY = appCursorLocation.y - this.y
}

function onDragEnd() {
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
    mouseOffsetX = 0;
    mouseOffsetY = 0;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        // adjust the sprite prosition using the offset
        this.x = newPosition.x - mouseOffsetX;
        this.y = newPosition.y - mouseOffsetY;
    }
}

app.stage.addChild(mapContainer);
mapContainer.addChild(map);


let node = new PIXI.Graphics();
node.x = 260;
node.y = 230;
mapContainer.addChild(node);

node.lineStyle(4, 0x00ff00);
node.beginFill(0xff0000);
node.drawCircle(0,0,10);
node.endFill();

node.interactive = true;
node.buttonMode = true;
node.photoName = '131';
node.on('pointerdown',(e) => {loadImageFromTarget(e)});

let node2 = new PIXI.Graphics();
node2.x = 260;
node2.y = 430;
mapContainer.addChild(node2);

node2.lineStyle(4, 0x00ff00);
node2.beginFill(0xff0000);
node2.drawCircle(0,0,10);
node2.endFill();

node2.interactive = true;
node2.buttonMode = true;
node2.photoName = '130';
node2.on('pointerdown',(e) => {loadImageFromTarget(e)});

function loadImageFromTarget(e) {
    console.log(e.target.photoName);
    viewer.setPanorama(`./photos/${schoolName}/${e.target.photoName}.jpeg`);
    viewer.setOption(`caption`,`${schoolName} - ${e.target.photoName}`);
}

function resetView() {
    mapContainer.x = 0;
    mapContainer.y = 0;
}