import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { fabric } from "fabric";
import { anchorWrapper, actionHandler } from "../components/utils/utils";
import {
  AnnotationText,
  NEW_POLYGON_PRESETS,
  GROUP_PRESETS,
  RECTANGLE_PRESETS,
  SHEET_PRESETS,
  SHEET_SETTINGS
} from "../constants";
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      annotationText: AnnotationText,
      NEW_POLYGON_PRESETS: NEW_POLYGON_PRESETS,
      GROUP_PRESETS: GROUP_PRESETS,
      RECTANGLE_PRESETS: RECTANGLE_PRESETS
    };
  },
  methods: {
    ...mapActions({
      getSignboardData: "signboard/getSignboardData",
      addAnnotation: "signboard/addAnnotation",
      updateAnnotation: "signboard/updateAnnotation",
      deleteAnnotationAction: "signboard/deleteAnnotation",
      markSignboardDeleted: "signboard/markSignboardDeleted",
      makePendingSignboard: "signboard/makePendingSignboard",
      updateVerifyStatus: "signboard/updateVerifyStatus"
    }),
    ...mapMutations({
      setImageAnnotationDetails: "signboard/setImageAnnotationDetails",
      setDefectObjectId: "signboard/setDefectObjectId",
      setImageURL: "signboard/setImageURL"
    }),
    drawToCanvas() {
      let canvas = this.annotationCanvas;
      var imgWidth, imgHeight;
      var x = 0;
      var y = 0;
      let self = this;
      var stop = false;
      new fabric.Image.fromURL(
        this.imgSrc,
        function(img) {
          // img.scaleToWidth(868);
          // img.scaleToHeight(500);
          // img.center();
          canvas.setBackgroundImage(
            img,
            function() {
              self.imageWidth = img.width;
              self.imageHeight = img.height;
              canvas.requestRenderAll();
              canvas.renderAll();
              imgWidth = img.width * img.scaleX;
              imgHeight = img.height * img.scaleY;
              self.populate(imgWidth, imgHeight);
            },
            {
              originX: "left",
              padding: 0,
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height
            }
          );
        },
        {
          crossOrigin: "Annoymous"
        }
      );
      return { imgWidth, imgHeight };
    },
    clearGuide(canvas) {
      this.roofPoints.forEach(point => {
        canvas.remove(point);
      });
      this.roofPoints = [];

      this.circleArray.forEach(circleObj => {
        canvas.remove(circleObj);
      });

      this.circleArray = [];

      this.lineArray.forEach(lineObj => {
        canvas.remove(lineObj);
      });
    },
    undoPolygon() {
      if (this.isAnnotateWithPolygon) {
        let poppedCircle =
          this.circleArray.length > 0 ? this.circleArray.pop() : {};
        let poppedLine = this.lineArray.length > 0 ? this.lineArray.pop() : {};
        let poppedRoofPoint =
          this.roofPoints.length > 0 ? this.roofPoints.pop() : {};

        const canvasRef = document.getElementById("c").fabric;
        canvasRef.remove(poppedCircle);
        canvasRef.remove(poppedLine);
        canvasRef.remove(poppedRoofPoint);

        if (this.circleArray.length === 0) {
          this.polygonDrawingState = "started";
        }
      }
    },
    removeAllObjects() {
      let canvasRef = document.getElementById("c");
      if (canvasRef !== null) {
        canvasRef = canvasRef.fabric;
        canvasRef.remove(...canvasRef.getObjects());
      }
    },
    async populate(imgWidth, imgHeight) {
      await this.removeAllObjects();
      let isSelectable = this.isDefectTool ? false : true;
      if (
        this.fromSignboardDetail &&
        !_isEmpty(this.$store.state.signboard.selectedSignboard.images)
      ) {
        const dsrnfromAnnotation = _get(
          this.dsrnAnnotation,
          "coordinates[0].[1]",
          ""
        );
        let coordinates = [];
        const signboardId = this.fromSignboardDetail
          ? this.$store.state.signboard.selectedSignboard.signboardId
          : "test";
        const image = this.$store.state.signboard.selectedSignboard.images.find(
          image => image._id === this.imgId
        );
        const signboardObjectId = image.signboardAnnotation._id;
        const canvasRef = this.annotationCanvas;
        if (this.fromDsrnForm && dsrnfromAnnotation !== "") {
          coordinates = this.dsrnAnnotation.coordinates[0];
          let height = this.getProportionalLength(
            imgHeight,
            coordinates[2][1],
            coordinates[0][1]
          );
          let width = this.getProportionalLength(
            imgWidth,
            coordinates[2][0],
            coordinates[0][0]
          );
          let x = this.getProportionalPoint(
            canvasRef.getWidth(),
            coordinates[0][0]
          );
          let y = this.getProportionalPoint(
            canvasRef.getHeight(),
            coordinates[0][1]
          );

          let signboard = {};

          let t = {};

          if (coordinates.length <= 4) {
            signboard = this.generateRectangle(
              x,
              y,
              width,
              height,
              signboardId,
              signboardObjectId,
              null
            );
          } else {
            signboard = new fabric.Polygon(
              coordinates.map(coords => {
                return {
                  x: imgWidth * coords[0],
                  y: imgHeight * coords[1]
                };
              }),
              {
                ...NEW_POLYGON_PRESETS,
                stroke: "green",
                signboardId,
                signboardObjectId
              }
            );
          }

          t = this.generateText(signboardId, x, y);

          let g = this.generateGroup(
            signboard,
            t,
            signboardId,
            isSelectable,
            "not pending",
            signboardObjectId,
            null
          );
          await canvasRef.add(g);
        } else {
          coordinates = image.signboardAnnotation.location.coordinates[0];
          let height = this.getProportionalLength(
            canvasRef.getHeight(),
            coordinates[2][1],
            coordinates[0][1]
          );
          let width = this.getProportionalLength(
            canvasRef.getWidth(),
            coordinates[2][0],
            coordinates[0][0]
          );
          let x = this.getProportionalPoint(
            coordinates[0][0],
            canvasRef.getWidth()
          );
          let y = this.getProportionalPoint(
            coordinates[0][1],
            canvasRef.getHeight()
          );

          let signboard = this.generateRectangle(
            x,
            y,
            width,
            height,
            signboardId,
            signboardObjectId
          );

          let t = this.generateText(signboardId, x, y);
          let g = this.generateGroup(
            signboard,
            t,
            signboardId,
            isSelectable,
            "not pending",
            signboardObjectId
          );

          await canvasRef.add(g);

          if (this.isDefectTool) {
            signboard.setOptions({
              strokeDashArray: [3],
              stroke: "black"
            });

            t.setOptions({
              backgroundColor: "black",
              stroke: "white"
            });

            this.drawDefects(imgWidth, imgHeight);
          }
        }
        await canvasRef.renderAll();
      } else if (
        !this.fromSignboardDetail &&
        !_isEmpty(this.signboardAnnotationList)
      ) {
        const canvasRef = document.getElementById("c").fabric;

        for (let annotation of this.signboardAnnotationList) {
          let signboardId = annotation.signboardId;
          let coordinates =
            annotation.signboardAnnotation.location.coordinates[0];
          let signboardObjectId = annotation.signboardAnnotation._id;

          let height = this.getProportionalLength(
            imgHeight,
            coordinates[2][1],
            coordinates[0][1]
          );
          let width = this.getProportionalLength(
            imgWidth,
            coordinates[2][0],
            coordinates[0][0]
          );
          let x = this.getProportionalPoint(
            canvasRef.getWidth(),
            coordinates[0][0]
          );
          let y = this.getProportionalPoint(
            canvasRef.getHeight(),
            coordinates[0][1]
          );

          let signboard = {};

          let t = {};

          if (coordinates.length <= 4) {
            signboard = this.generateRectangle(
              x,
              y,
              width,
              height,
              signboardId,
              signboardObjectId,
              annotation.status
            );
          } else {
            signboard = new fabric.Polygon(
              coordinates.map(coords => {
                return { x: imgWidth * coords[0], y: imgHeight * coords[1] };
              }),
              {
                ...NEW_POLYGON_PRESETS,
                stroke: "green",
                signboardId,
                signboardObjectId,
                status: annotation.status
              }
            );
          }

          if (annotation.status && annotation.status === "Pending") {
            signboard.setOptions({
              stroke: "#0091FF"
            });

            t = this.generateText("Pending", x, y, "#0091FF", "white");
          } else {
            t = this.generateText(signboardId, x, y, "green");
          }

          let g = this.generateGroup(
            signboard,
            t,
            signboardId,
            isSelectable,
            "not pending",
            signboardObjectId,
            annotation.status
          );

          canvasRef.add(g);
        }

        canvasRef.renderAll();
      }
      this.getImage();
    },
    toggleAnnotateWithPolygon() {
      if (!this.isAnnotateWithPolygon && this.polygonDrawingState === "default" && this.annotateSquareProcess === "default") {
        this.isAnnotateWithPolygon = !this.isAnnotateWithPolygon;
      }
      else {
        return;
      }
      const canvasRef = document.getElementById("c").fabric;
      let activeObject = canvasRef.getActiveObject();
      this.isUsingSelectButton = false;

      if (!_isEmpty(this.sheetRef)) {
        canvasRef.remove(this.sheetRef);
      }

      if (
        this.isAnnotateWithPolygon &&
        (activeObject === null || activeObject === undefined)
      ) {
        let sheet = new fabric.Rect({
          height: canvasRef.getHeight(),
          width: canvasRef.getWidth(),
          ...SHEET_PRESETS
        });

        sheet.setControlsVisibility(SHEET_SETTINGS);
        this.sheetRef = sheet;
        canvasRef.bringToFront(sheet);
        canvasRef.bringToFront(sheet);
        this.polygonDrawingState = "started";
        this.toggleCursorButton(false);
        // this.isAnnotateWithSquare = false;
      } else if (
        this.isAnnotateWithPolygon &&
        activeObject !== null &&
        activeObject !== undefined &&
        activeObject.type === "group"
      ) {
        let defectObjectId = activeObject.defectObjectId;
        let defectId = activeObject.defectId;
        let defectType = activeObject.defectType;
        let isDefect = true;
        let items = activeObject._objects;

        if (!this.groupHasType(activeObject, "polygon")) {
          this.toggleCursorButton(true);
          return;
        }

        let points = activeObject.item(0).points;

        activeObject._restoreObjectsState();
        let sheet = new fabric.Rect({
          height: canvasRef.getHeight(),
          width: canvasRef.getWidth(),
          ...SHEET_PRESETS
        });

        sheet.setControlsVisibility(SHEET_SETTINGS);
        this.sheetRef = sheet;
        canvasRef.bringToFront(sheet);
        canvasRef.bringToFront(sheet);
        canvasRef.remove(activeObject);
        let self = this;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type === "polygon") {
            var itemControl = items[i].points.length - 1;
            items[i].cornerStyle = "circle";
            items[i].cornerColor = "rgba(0,0,255,0.5)";
            items[i].stroke = "yellow";
            items[i].controls = items[i].points.reduce(function (
              acc,
              point,
              index
            ) {
              acc["p" + index] = new fabric.Control({
                positionHandler: polygonPositionHandler,
                actionHandler: anchorWrapper(
                  index > 0 ? index - 1 : itemControl,
                  actionHandler
                ),
                actionName: "modifyPolygon",
                pointIndex: index
              });
              return acc;
            },
              {});

            items[i].clone(clone => {
              self.currentEditedPolygon = {
                left: clone.left,
                top: clone.top,
                height: clone.getScaledHeight(),
                width: clone.getScaledWidth(),
                isDefect: activeObject.name === "defectGrp" ? true : false,
                defectObjectId,
                defectId,
                defectType,
                name: "defectGrp",
                points: clone.points,
                type: "polygon",
                status: activeObject.status
              };
            });
          }

          canvasRef.add(items[i]);
          if (i === 0) {
            canvasRef.setActiveObject(items[0]);
          } else if (i === 1) {
            items[i].setOptions({
              visible: false
            });
          }
        }
        this.polygonDrawingState = "complete";
        this.clearGuide(canvasRef);
        canvasRef.requestRenderAll();
        canvasRef.renderAll();
        this.isEditingExistingAnnotation = true;
      } else {
        this.toggleCursorButton(true);
      }
      this.isAnnotateWithSquare = false;
    },
    processCoordinates(coords, type) {
      let coordinatesArray = [];
      const canvasRef = document.getElementById("c").fabric;

      if (type === "rect") {
        coordinatesArray.push([
          coords.tl.x / canvasRef.getWidth(),
          coords.tl.y / canvasRef.getHeight()
        ]);
        coordinatesArray.push([
          coords.bl.x / canvasRef.getWidth(),
          coords.bl.y / canvasRef.getHeight()
        ]);
        coordinatesArray.push([
          coords.br.x / canvasRef.getWidth(),
          coords.br.y / canvasRef.getHeight()
        ]);
        coordinatesArray.push([
          coords.tr.x / canvasRef.getWidth(),
          coords.tr.y / canvasRef.getHeight()
        ]);
      } else {
        let pointArray = Object.keys(coords);
        pointArray.map(key => {
          coordinatesArray.push([
            coords[key].x / canvasRef.getWidth(),
            coords[key].y / canvasRef.getHeight()
          ]);
        });
      }

      return coordinatesArray;
    },
    togglePanButton() {
      this.isPanButtonClicked = !this.isPanButtonClicked;
      if (this.isPanButtonClicked) {
        this.isAnnotateWithSquare = false;
        this.isAnnotateWithPolygon = false;
        this.isUsingSelectButton = false;
        this.isEditingExistingAnnotation = false;
      }
    },
    handleDeselection(option) {
      if (option.deselected) {
        for (let objectGroup of option.deselected) {
          if (
            objectGroup.name === "signboardGrp" &&
            objectGroup.status === "Pending"
          ) {
            objectGroup.item(0).setOptions({
              stroke: "#0091FF"
            });
            objectGroup.item(1).setOptions({
              backgroundColor: "#0091FF",
              stroke: "white"
            });
          } else if (
            typeof objectGroup.item !== "undefined" &&
            objectGroup.status !== "Pending"
          ) {
            objectGroup.item(0).setOptions({
              stroke: "green"
            });
            objectGroup.item(1).setOptions({
              backgroundColor: "green"
            });
          }
        }
      }
    },
    toggleDeleteDialog() {
      this.confirmDeleteDialog = true;
    },
    groupHasType(activeObject, typeToSearch) {
      let objects = activeObject._objects ? activeObject._objects : [];

      for (const object of objects) {
        if (object.type === typeToSearch) {
          return true;
        }
      }
    },
    updatePolygon(polygon) {
      var lastControl = polygon.points.length - 1;
      polygon.cornerStyle = "circle";
      polygon.cornerColor = "rgba(0,0,255,0.5)";
      polygon.controls = polygon.points.reduce(function(acc, point, index) {
        acc["p" + index] = new fabric.Control({
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler
          ),
          actionName: "modifyPolygon",
          pointIndex: index
        });
        return acc;
      }, {});
    },
    generateRectangle(
      x,
      y,
      width,
      height,
      signboardId,
      signboardObjectId,
      status = null
    ) {
      return new fabric.Rect({
        left: x,
        top: y,
        ...RECTANGLE_PRESETS,
        width,
        height,
        signboardId,
        signboardObjectId,
        status
      });
    },
    generateText(content, x, y, backgroundColor = "green", stroke = "black") {
      if (!this.fromDsrnForm) {
        return new fabric.Text(content, {
          ...AnnotationText,
          left: x,
          top: y - 12,
          backgroundColor,
          padding: 20,
          stroke
        });
      } else {
        return new fabric.Text(content, {
          opacity: 0
        });
      }
    },
    generateGroup(
      signboard,
      text,
      signboardId,
      selectable = true,
      shapeState,
      signboardObjectId,
      status = null
    ) {
      return new fabric.Group([signboard, text], {
        name: "signboardGrp",
        signboardId,
        ...GROUP_PRESETS,
        selectable,
        shapeState,
        signboardObjectId,
        status
      });
    },
    getProportionalLength(height, point1, point2) {
      return height * point1 - height * point2;
    },
    getProportionalPoint(point, length) {
      return point * length;
    },
    getImage() {
      let canvas = document.getElementById("c");
      let dataURL = canvas.toDataURL();
      this.setImageURL(dataURL);
    }
  },
  watch: {
    imgSrc: {
      deep: true,
      handler(object) {
        this.drawToCanvas();
        this.getImage();
      }
    }
  },
  computed: {
    displayPhotos() {
      return this.$store.state.signboard.selectedSignboard.images
        ? this.$store.state.signboard.selectedSignboard.images
        : [];
    },
    displaySignboardId() {
      return this.currentEditedPolygonLabel;
    },
    imageAnnotation() {
      return this.$store.state.signboard.imageAnnotation;
    },
    imgSrc() {
      return this.imageAnnotation.imgSrc;
    },
    imgId() {
      return this.imageAnnotation.imgId;
    },
    signboardAnnotationList() {
      return this.imageAnnotation.signboardAnnotationList;
    },
    carAngle() {
      return this.imageAnnotation.carAngle;
    },
    cameraLocation() {
      return this.imageAnnotation.cameraLocation;
    },
    imageTitle() {
      return this.imageAnnotation.imageTitle;
    }
  }
};

function polygonPositionHandler(dim, finalMatrix, fabricObject) {
  var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
    y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
  return fabric.util.transformPoint(
    { x: x, y: y },
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix()
    )
  );
}
