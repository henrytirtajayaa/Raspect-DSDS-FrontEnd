import _isEmpty from 'lodash/isEmpty';
import _max from 'lodash/max';

export default {
    data () {
        return {
            isLoading: false
        }
    },
    methods: {
        drawImageAndAnnotations (coordinateArray, imageSource, canvasInfo, signboardRevisionStatusList, isZoom = false) {
            this.isLoading = true
            let c = document.getElementById(canvasInfo.id);
            if (c === null) {
                return ;
            }
            let ctx = c.getContext("2d");
            
            if(!_isEmpty(imageSource)) {
                let img = new Image;
                let self = this;
                img.onload = function() {      
                    c.width = canvasInfo.width;
                    c.height = canvasInfo.height;
                    let zoom = 1;
                    if (coordinateArray.length > 0 && isZoom) {
                        const coordinates = coordinateArray[0].coordinates;
                        zoom = zoomIn(ctx, coordinates, c.height, c.width);
                    }
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height);
                    if (coordinateArray.length > 0) {
                        for(let coordinates of coordinateArray) {
                            if(coordinates === undefined) {
                                break;
                            }
                            
                            drawAnnotation(ctx, coordinates.coordinates, c.height, c.width, zoom, coordinates.strokeColor);
                        }
                    }
                    self.isLoading = false;
                };
                img.src = imageSource;
                img.setAttribute('crossOrigin', 'anonymous');
            } else {
                ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
            }
        }
    },
}

function zoomIn(ctx, coordinates, canvasHeight, canvasWidth){
    const ANNOTATION_SIZE_N_CANVAS_SIZE_RATIO = 0.7;
    const relativeHeight = coordinates[1][1] - coordinates[0][1];
    const relativeWidth = coordinates[3][0] - coordinates[0][0];
    const zoom = ANNOTATION_SIZE_N_CANVAS_SIZE_RATIO / _max([relativeHeight, relativeWidth]);
    let translateX = - (coordinates[0][0] * canvasWidth) * zoom + (canvasWidth - canvasWidth * relativeWidth * zoom)  / 2;
    let translateY = - (coordinates[0][1] * canvasHeight) * zoom + (canvasHeight - canvasHeight * relativeHeight * zoom) / 2;
    const {boundedTranslateX, boundedTranslateY} = boundTranslatedPos(zoom, translateX, translateY, canvasHeight, canvasWidth, coordinates[0]);
    ctx.translate(boundedTranslateX, boundedTranslateY);
    ctx.scale(zoom, zoom);
    return zoom;
}

function boundTranslatedPos(zoom, translateX, translateY, canvasHeight, canvasWidth, leftTopCoordinate){
    let minTransX = 0;
    let maxTransX = 0; 
    minTransX = - zoom * leftTopCoordinate[0] - (canvasWidth * zoom - canvasWidth);
    maxTransX = - zoom * leftTopCoordinate[0];
    let boundedTranslateX = translateX;
    if (boundedTranslateX < minTransX) {
        boundedTranslateX = minTransX;
    } else if (boundedTranslateX > maxTransX) {
        boundedTranslateX = maxTransX;
    }
    let boundedTranslateY = translateY;
    let minDiffY = -(canvasHeight * zoom - canvasHeight);
    if (boundedTranslateY < minDiffY) {
        boundedTranslateY = minDiffY;
    } else if (boundedTranslateY > 0) {
        boundedTranslateY= 0;
    }
    return {
        boundedTranslateX,
        boundedTranslateY
    };
}

function drawAnnotation(ctx, coordinates, canvasHeight, canvasWidth, zoom, strokeColor){
    ctx.beginPath();

    if (coordinates.length <= 4) {
        const relativeHeight = coordinates[1][1] - coordinates[0][1];
        const relativeWidth = coordinates[3][0] - coordinates[0][0];
        
        ctx.rect(coordinates[0][0] * canvasWidth, coordinates[0][1] * canvasHeight, relativeWidth * canvasWidth, relativeHeight * canvasHeight);
        
    } else {
        ctx.beginPath();
        ctx.moveTo(coordinates[0][0] * canvasWidth, coordinates[0][1] * canvasHeight)

        for (let i = 0; i < coordinates.length ; i += 1) {
            ctx.lineTo(coordinates[i][0] * canvasWidth, coordinates[i][1] * canvasHeight);
        }

        ctx.lineTo(coordinates[0][0] * canvasWidth, coordinates[0][1] * canvasHeight);
    }
    
    ctx.strokeStyle = strokeColor
    ctx.lineWidth= 2 / zoom;
    ctx.stroke();
}