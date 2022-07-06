<template class="annotation-tool">
  <v-container>
    <v-row>
      <v-col cols="auto">
        <div class="annotation-tool__canvas" id="fabric-canvas-wrapper">
          <canvas id="c" ref="canvasRef" width="864" height="586" />
        </div>
      </v-col>
      <v-col cols="auto" class="px-0">
        <CommonAnnotationControlsCompact
          @set-annotation-signboard-mode-with-polygon="toggleAnnotateWithPolygon"
          @set-annotation-signboard-mode-with-square="toggleAnnotateWithSquare"
          @delete-annotation="toggleDeleteDialog"
          @toggle-select="toggleCursorButton"
          :isAnnotateWithSquare="isAnnotateWithSquare"
          :isAnnotateWithPolygon="isAnnotateWithPolygon"
          :isUsingSelectButton="isUsingSelectButton"
          :isPanButtonClicked="isPanButtonClicked"
          @undo-polygon="undoPolygon"
          @toggle-pan-button="togglePanButton"
        />
      </v-col>
    </v-row>
    <v-dialog v-model="confirmDeleteDialog" persistent max-width="481">
      <v-card>
        <v-card-title class="text-h5">
          Confirm remove annotation on this signboard?
        </v-card-title>
        <v-card-actions>
          <v-btn text @click="confirmDeleteDialog = false">
            <span class="text text--bold text--blue">Cancel</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteAnnotation">
            <span class="text text--bold text--white">Yes</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { fabric } from "fabric";
import { mapMutations } from "vuex";
import { AnnotationText, NEW_POLYGON_PRESETS, GROUP_PRESETS, RECTANGLE_PRESETS } from "../../constants";
import annotationMixin from "../../mixins/annotation"

export default {
  data() {
    return {
      annotationText: AnnotationText,
      annotationCanvas: {},
      isAnnotateSignboardMode: false,
      roofPoints: [],
      drawingObject: {},
      x: 0,
      y: 0,
      currentEditedPolygon: {},
      currentEditedPolygonLabel: "",
      isAnnotateWithPolygon: false,
      isAnnotateWithSquare: false,
      isUsingSelectButton: true,
      currentRectangle: {},
      origX: 0,
      origY: 0,
      isDown: false,
      circleArray: [],
      lineArray: [],
      imageWidth: 0,
      imageHeight: 0,
      isPanButtonClicked: false,
      panning: false,
      confirmDeleteDialog: false,
      fromDsrnForm: true,
      NEW_POLYGON_PRESETS: NEW_POLYGON_PRESETS,
      GROUP_PRESETS: GROUP_PRESETS,
      RECTANGLE_PRESETS: RECTANGLE_PRESETS,
      removeDefault: true
    };
  },
  mixins: [ annotationMixin ],
  methods: {
    ...mapMutations({
      setDsrnAnnotation: "signboard/setDsrnAnnotation"
    }),
    toggleAnnotateWithPolygon() {
      this.isAnnotateWithPolygon = !this.isAnnotateWithPolygon;
      const canvasRef = document.getElementById("c").fabric;
      let activeObject = canvasRef.getActiveObject();
      this.isUsingSelectButton = false;

      if (this.isAnnotateWithPolygon && (activeObject === null || activeObject === undefined)) {
        this.toggleCursorButton(false);
      } else if (this.isAnnotateWithPolygon && activeObject !== null && activeObject !== undefined && activeObject.type === "group") {
        if (!this.groupHasType(activeObject, "polygon")) {
          this.toggleCursorButton(true);
          return;
        }
        canvasRef.remove(activeObject);
        this.clearGuide(canvasRef);
        canvasRef.requestRenderAll();
        canvasRef.renderAll();
      } else {
        this.toggleCursorButton(true);
      }
      this.isAnnotateWithSquare = false;
    },
    toggleAnnotateWithSquare() {
      this.panning = false;
      this.isPanButtonClicked = false;
      
      const canvasRef = document.getElementById("c").fabric;
      let activeObject = canvasRef.getActiveObject();

      if (this.isAnnotateWithPolygon || (activeObject !== undefined && activeObject !== null && typeof activeObject.getObjects === "function" && activeObject.getObjects("rect").length === 0)) {
        return;
      } else { 
        this.isAnnotateWithSquare = !this.isAnnotateWithSquare
      }

      if (canvasRef !== undefined) {
        if (this.isAnnotateWithSquare && activeObject !== null && activeObject !== undefined && activeObject.name !== undefined && activeObject.shapeState !== undefined) {
          if (!this.groupHasType(activeObject, "rect")) {
            this.toggleCursorButton(true);
            return;
          }
          activeObject._restoreObjectsState();
          canvasRef.remove(activeObject);
          canvasRef.renderAll();
        } else if (this.isAnnotateWithSquare) {
          this.toggleCursorButton(false);
          canvasRef.defaultCursor = "crosshair";
        } else {
          this.toggleCursorButton(true);
          canvasRef.defaultCursor = "default";
        }
      }
      this.isAnnotateWithPolygon = false;
    },
    toggleCursorButton(boolean) {
      this.isUsingSelectButton = boolean;

      if (this.isUsingSelectButton) {
        this.isAnnotateWithPolygon = false;
        this.isAnnotateWithSquare = false;
        this.isPanButtonClicked = false;
      }
    },
    deleteAnnotation() {
      const canvasRef = document.getElementById("c").fabric;
      let activeObject = canvasRef.getActiveObject();

      canvasRef.remove(activeObject);
      this.confirmDeleteDialog = false;
      this.getImage()
    },
    saveAnnotation(annotation) {
      let coordinateRatioArray = [];
      if (annotation.type === 'polygon') {
        coordinateRatioArray = this.processCoordinates(
          annotation.points,
          annotation.type
        );
      } else {
        coordinateRatioArray = this.processCoordinates(
          annotation.oCoords,
          annotation.type
        );
      }
      this.setDsrnAnnotation({
        coordinates: coordinateRatioArray,
        type: "Polygon"
      });
    }
  },
  props: ["fromSignboardDetail", "dsrnAnnotation"],
  mounted() {
    this.drawingObject.type = "";
    this.drawingObject.background = "";
    this.drawingObject.border = "";
    this.annotationCanvas = new fabric.Canvas("c", {
      width: 864,
      height: 586,
      selection: false
    });
    document.getElementById("c").fabric = this.annotationCanvas;
    let { imgWidth, imgHeight } = this.drawToCanvas();
    var x = 0;
    var y = 0;
    let self = this;

    var leftBorder = 0
    var topBorder = 0 
    var scaleBorderX = 0     
    var scaleBorderY = 0     
    var widthBorder = 0     
    var heightBorder = 0 

    this.annotationCanvas.on("mouse:wheel", function(opt) {
      var delta = opt.e.deltaY;
      var zoom = self.annotationCanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 1) zoom = 1;
      self.annotationCanvas.zoomToPoint(
        { x: opt.e.offsetX, y: opt.e.offsetY },
        zoom
      );

      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = self.annotationCanvas.viewportTransform;
      if (vpt[4] >= 0) {
        self.annotationCanvas.viewportTransform[4] = 0;
      } else if (vpt[4] < self.annotationCanvas.getWidth() - imgWidth * zoom) {
        self.annotationCanvas.viewportTransform[4] =
          self.annotationCanvas.getWidth() - imgWidth * zoom;
      }
      if (vpt[5] >= 0) {
        self.annotationCanvas.viewportTransform[5] = 0;
      } else if (
        vpt[5] <
        self.annotationCanvas.getHeight() - imgHeight * zoom
      ) {
        self.annotationCanvas.viewportTransform[5] =
          self.annotationCanvas.getHeight() - imgHeight * zoom;
      }

      let w = 4; // desired width in pixels
      let strokeWidth = w / self.annotationCanvas.getZoom();
      for (let object of self.annotationCanvas.getObjects()) {
        if (object.defectId && object.type === "group") {
          object.item(0).setOptions({
            strokeWidth
          });
        } else if (object.defectId && object.type === "polygon") {
          object.set("strokeWidth", strokeWidth);
        }
      }
      self.annotationCanvas.renderAll();
      self.getImage()
    });

    this.annotationCanvas.on("mouse:move", function(o) {
      if (self.isPanButtonClicked) {
        if (self.panning && o && o.e) {
          var units = 10;
          var delta = new fabric.Point(o.e.movementX, o.e.movementY);
          self.annotationCanvas.relativePan(delta);
        }
      }

      if (!self.isDown) return;
      var pointer = self.annotationCanvas.getPointer(o.e);
      if (self.origX > pointer.x) {
        self.currentRectangle.set({ left: pointer.x  < 0 ? 0  : pointer.x});
      }
      if (self.origY > pointer.y) {
        self.currentRectangle.set({ top: pointer.y < 0 ? 0  : pointer.y});
      }

      let finalWidth = 0;
      let finalHeight = 0;

      if(pointer.x < 0 ) {
        finalWidth = Math.abs(self.origX - 0)
      } else if (pointer.x >= 0 && pointer.x < self.annotationCanvas.getWidth()) {
        finalWidth = Math.abs(self.origX - pointer.x)
      } else if (pointer.x >= 0 && pointer.x >= self.annotationCanvas.getWidth()) {
        finalWidth = Math.abs(self.origX - self.annotationCanvas.getWidth())
      }

      if(pointer.y < 0 ) {
        finalHeight = Math.abs(self.origY - 0)
      } else if (pointer.y >= 0 && pointer.y < self.annotationCanvas.getHeight()) {
        finalHeight = Math.abs(self.origY - pointer.y)
      } else if (pointer.y >= 0 && pointer.y >= self.annotationCanvas.getHeight()) {
        finalHeight = Math.abs(self.origY - self.annotationCanvas.getHeight())
      }

      self.currentRectangle.set({ width: finalWidth });
      self.currentRectangle.set({ height: finalHeight });
      self.annotationCanvas.renderAll();
    });

    this.annotationCanvas.on("mouse:up", function(options) {
      self.isDown = false;

      if (self.isPanButtonClicked) {
        self.panning = false;
      }

      if (self.isAnnotateWithSquare) {
        self.toggleAnnotateWithSquare();
        self.saveAnnotation(self.annotationCanvas.getActiveObject());
      }

      self.getImage()
    });

    this.annotationCanvas.on("selection:cleared", function(option) {
      self.handleDeselection(option);
      self.getImage()
    });
   
    this.annotationCanvas.on("mouse:down", function(options) {
      if (self.isPanButtonClicked) {
        self.panning = true;
      }

      if (self.isAnnotateWithPolygon === false && self.isAnnotateWithSquare === false) {
        return;
      }

      if (self.isAnnotateWithSquare) {
        self.removeAllObjects();
        var cursor = self.annotationCanvas.getPointer();

        self.isDown = true;
        self.origX = cursor.x;
        self.origY = cursor.y;

        self.currentRectangle = new fabric.Rect({
          left: self.origX,
          top: self.origY,
          ...RECTANGLE_PRESETS,
          stroke: "yellow",
          selectable: true,
        });
        self.annotationCanvas.add(self.currentRectangle);
        self.annotationCanvas.setActiveObject(self.currentRectangle);
      }

      if (self.isAnnotateWithPolygon) {
        let x = 0;
        let y = 0;
        const numberOfPoint = self.roofPoints.length;
        const pointer = self.annotationCanvas.getPointer();

        var circle = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          fill: "red",
          originX: "center",
          originY: "center",
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          radius: 5,
          hoverCursor: "default"
        });

        if (self.isAnnotateWithPolygon) {
          self.annotationCanvas.add(circle);
          self.circleArray.push(circle);
          if (self.roofPoints.length < 1) {
            self.roofPoints.push(new fabric.Point(pointer.x, pointer.y));
          } else {
            const point =
              numberOfPoint === 1
                ? fabric.util.transformPoint(
                    new fabric.Point(
                      self.roofPoints[numberOfPoint - 1].x,
                      self.roofPoints[numberOfPoint - 1].y
                    ),
                    self.annotationCanvas.viewportTransform
                  )
                : {
                    x: self.roofPoints[numberOfPoint - 1].x,
                    y: self.roofPoints[numberOfPoint - 1].y
                  };
            const line = new fabric.Line(
              [
                pointer.x,
                pointer.y,
                self.roofPoints[numberOfPoint - 1].x,
                self.roofPoints[numberOfPoint - 1].y
              ],
              {
                stroke: "blue",
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true,
                hoverCursor: "default"
              }
            );
            self.annotationCanvas.add(line);
            self.lineArray.push(line);
            self.roofPoints.push(new fabric.Point(pointer.x, pointer.y));
          }
        }

        if (numberOfPoint > 1) {
          if (
            self.circleArray.length > 0 &&
            typeof self.circleArray[0].intersectsWithObject === "function" &&
            self.circleArray[0].intersectsWithObject(
              self.circleArray[self.circleArray.length - 1]
            ) &&
            self.isAnnotateWithPolygon
          ) {
            var polygon = new fabric.Polygon(self.roofPoints, {
              ...NEW_POLYGON_PRESETS,
              selectable: true
            });
            self.removeAllObjects()
            self.annotationCanvas.add(polygon);
            self.toggleAnnotateWithPolygon();
            self.isAnnotateWithPolygon = false;
            self.clearGuide(self.annotationCanvas);
            self.annotationCanvas.renderAll();
            
            self.updatePolygon(polygon);
            self.annotationCanvas.setActiveObject(polygon);
            self.saveAnnotation(self.annotationCanvas.getActiveObject());
          }
        }
      }
    });

    this.annotationCanvas.on("object:moving", function(e) {
      let obj = e.target
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return
      }
      obj.setCoords()

      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top)
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left)
      }

      if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top)
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left)
      }
    })

    this.annotationCanvas.on("object:scaling", function(e) {
      let obj = e.target
      obj.setCoords()
      let brNew = obj.getBoundingRect()

      if (((brNew.width + brNew.left) >= obj.canvas.width) || ((brNew.height + brNew.top) >= obj.canvas.height) || ((brNew.left < 0) || (brNew.top < 0))) {
        obj.left = leftBorder
        obj.top = topBorder
        obj.scaleX = scaleBorderX
        obj.scaleY = scaleBorderY
        obj.width = widthBorder
        obj.height = heightBorder
      } else {
        leftBorder = obj.left
        topBorder = obj.top
        scaleBorderX = obj.scaleX
        scaleBorderY = obj.scaleY
        widthBorder = obj.width
        heightBorder = obj.height
      }
    })
    
    window.onresize = function resizeCanvas() {
      const outerCanvasContainer = document.getElementById(
        "fabric-canvas-wrapper"
      );
      if (outerCanvasContainer !== null) {
        const ratio =
          self.annotationCanvas.getWidth() / self.annotationCanvas.getHeight();
        const containerWidth = outerCanvasContainer.clientWidth;

        const scale = containerWidth / self.annotationCanvas.getWidth();
        const zoom = self.annotationCanvas.getZoom() * scale;

        self.annotationCanvas.setDimensions({
          width: containerWidth,
          height: containerWidth / ratio
        });
        self.annotationCanvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
      }
    };
  }
};
</script>
