<template class="annotation-tool">
  <v-card>
    <v-card-title>
      {{
        isDefectTool ? "Defect Annotation Tool" : "Signboard Annotation Tool"
      }}
      <v-spacer></v-spacer>
      <span><v-icon @click="onClose">mdi-close</v-icon></span>
    </v-card-title>
    <CommonAnnotationControls
      @set-annotation-signboard-mode="toggleAnnotateSignboardMode"
      @set-annotation-signboard-mode-with-polygon="toggleAnnotateWithPolygon"
      @set-annotation-signboard-mode-with-square="toggleAnnotateWithSquare"
      @delete-annotation="toggleDeleteDialog"
      @toggle-select="toggleCursorButton"
      :isAnnotateWithSquare="isAnnotateWithSquare"
      :isAnnotateWithPolygon="isAnnotateWithPolygon"
      :isUsingSelectButton="isUsingSelectButton"
      :isEditingExistingAnnotation="isEditingExistingAnnotation"
      :isPanButtonClicked="isPanButtonClicked"
      :isDefectTool="isDefectTool"
      @undo-polygon="undoPolygon"
      @toggle-pan-button="togglePanButton"
      @export-image="exportImage('c')"
    ></CommonAnnotationControls>
    <v-container fluid>
      <v-row class="annotation-tool__left-panel">
        <v-col cols="3">
          <div>
            <template v-if="!isDefectTool">
              <AnnotationImageDetails
                :carAngle="carAngle"
                :cameraLocation="cameraLocation"
                :imageTitle="imageTitle"
                :dateTime="dateTime"
              ></AnnotationImageDetails>
            </template>
            <template v-else>
              <SignboardFields></SignboardFields>
              <v-divider class="annotation-tool__divider"></v-divider>
              <div class="annotation-tool__label-container">
                <span class="annotation-tool__image-other-angles-text">
                  Signboard with other angles ({{ displayPhotos.length }})
                </span>
                </div>
                <div class="annotation-tool__photo-slide-container">
                  <CommonImageAnnotationView
                    v-for="(photo, index) in displayPhotos"
                    :key="photo.lowResPath"
                    :imageSrc="getField(photo, 'lowResPath')"
                    :hideHeader="true"
                    :hideBottomText="true"
                    :signboardAnnotationList="getAnnotation(photo)"
                    @onimageclick="onImageClick"
                    :canvasName="`otherAngle${index}`"
                    :imgId="getField(photo, '_id')"
                    :width="320"
                    :height="213"
                    :isZoom="false"
                    :disabled="isAnnotateWithPolygon || isAnnotateWithSquare"
                  >
                  </CommonImageAnnotationView>
              </div>
            </template>
          </div>
        </v-col>
        <v-divider
          vertical
          class="annotation-tool__left-panel__divider"
        ></v-divider>
        <v-col cols="6">
          <div>
            <div
              v-if="!this.isEditingExistingAnnotation"
              class="annotation-tool__paragraph-content"
            >
              <span>Select</span>
              <span class="annotation-tool__icon-spacing"
                ><CommonRectangleIcon></CommonRectangleIcon
              ></span>
              <span>Rectangle box /</span>
              <span class="annotation-tool__icon-spacing"
                ><CommonPolygonIcon></CommonPolygonIcon
              ></span>
              <span>Polygon tool to annotate or modify bounding area.</span>
            </div>
            <div
              v-else-if="this.isEditingExistingAnnotation"
              class="annotation-tool__paragraph-content"
            >
              <span
                >Drag the control points of the bounding box to resize the
                signboard area.</span
              >
              <span class="annotation-tool__icon-spacing"
                ><v-btn @click="cancelEdit">Cancel</v-btn></span
              >
              <v-btn @click="showConfirmPopup">Save</v-btn>
            </div>
          </div>
          <div class="annotation-tool__canvas" id="fabric-canvas-wrapper">
            <canvas id="c" ref="canvasRef" width="864" height="586"></canvas>
          </div>
        </v-col>
        <v-divider vertical class="annotation-tool__divider"></v-divider>
        <v-col cols="3" v-if="!isAnnotateWithSquare && !isAnnotateWithPolygon">
          <template v-if="showNewSignboardForm && !isDefectTool">
            <AnnotationSaveSignboardForm
              @save-new-signboard="saveNewSignboard"
              @cancel-new-signboard="cancelNewSignboard"
            ></AnnotationSaveSignboardForm>
          </template>
          <template v-else-if="(showSignboardDetails || fromSignboardDetail) && !isDefectTool">
            <SignboardFields></SignboardFields>
          </template>
          <template v-else-if="showNewDefectForm && isDefectTool">
            <AnnotationSaveDefectForm
              @save="saveDefect"
              @cancel-add-defect="cancelAddDefect"
            ></AnnotationSaveDefectForm>
          </template>
          <template v-else-if="showModifyDefectForm && isDefectTool">
            <AnnotationModifyDefectForm
              @save="updateDefect"
              @cancel-add-defect="cancelAddDefect"
            />
          </template>
        </v-col>
      </v-row>
      <v-dialog v-model="confirmSaveEditDialog" persistent max-width="481">
        <v-card>
          <v-card-title class="text-h5">
            Confirm changes on this signboard ?
          </v-card-title>
          <v-card-actions>
            <v-btn color="#056694" text @click="confirmSaveEditDialog = false">
              <span class="text text--bold text--blue">Cancel</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveEditedAnnotation">
              <span class="text text--bold text--white">Save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      <v-dialog v-model="confirmSaveSignboardDialog" max-width="290">
        <v-card width="268">
          <v-card-title class="text-h5">
            <span class="text text--large text--bold">New Signboard Saved</span>
          </v-card-title>
          <v-card-text>
            <span class="text text--medium"
              >Changes pending in the system.</span
            >
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="confirmSaveSignboardDialog = false"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script>
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { fabric } from "fabric";
import { makeRoof, makePointObject, anchorWrapper, actionHandler } from "../utils/utils";
import { AnnotationText, NEW_POLYGON_PRESETS, GROUP_PRESETS, RECTANGLE_PRESETS, SHEET_SETTINGS, SHEET_PRESETS } from "../../constants";
import { exportImage } from "../utils/utils";
import annotationMixin from "../../mixins/annotation"

export default {
  data() {
    return {
      annotationText: AnnotationText,
      confirmSaveEditDialog: false,
      annotationCanvas: {},
      isAnnotateSignboardMode: false,
      isEditingExistingAnnotation: false,
      imageToBeAnnotated: "",
      roof: null,
      roofPoints: [],
      lines: [],
      lineCounter: 0,
      drawingObject: {},
      x: 0,
      y: 0,
      currentEditedPolygon: {},
      currentEditedPolygonLabel: "",
      isAnnotateWithPolygon: false,
      isAnnotateWithSquare: false,
      isUsingSelectButton: true,
      polygonDrawingState: "default",
      currentRectangle: {},
      origX: 0,
      origY: 0,
      isDown: false,
      circleArray: [],
      lineArray: [],
      showSignboardDetails: false,
      imageWidth: 0,
      imageHeight: 0,
      showNewSignboardForm: false,
      showNewDefectForm: false,
      confirmSaveSignboardDialog: false,
      isPanButtonClicked: false,
      panning: false,
      confirmDeleteDialog: false,
      editedPolygonRef: {},
      sheetRef: {},
      exportImage,
      annotateSquareProcess: "default",
      showModifyDefectForm: false,
      fromDsrnForm: false,
      NEW_POLYGON_PRESETS: NEW_POLYGON_PRESETS,
      GROUP_PRESETS: GROUP_PRESETS,
      RECTANGLE_PRESETS: RECTANGLE_PRESETS,
      SHEET_SETTINGS: SHEET_SETTINGS,
      SHEET_PRESETS: SHEET_PRESETS
    };
  },
  mixins: [ annotationMixin ],
  methods: {
    toggleAnnotateDefectMode() {
      if (!this.isAnnotateSignboardMode) {
        this.isDefectTool = !this.isDefectTool;
      }
    },
    toggleAnnotateSignboardMode() {
      if (!this.isDefectTool) {
        this.isAnnotateSignboardMode = !this.isAnnotateSignboardMode;
      }
    },
    toggleAnnotateWithSquare() {
      this.showModifyDefectForm = false
      this.panning = false;
      this.isPanButtonClicked = false;
      const canvasRef = document.getElementById("c").fabric;
      let activeObject = canvasRef.getActiveObject();
      if (this.polygonDrawingState === "processing" ||
          (activeObject !== undefined &&
          activeObject !== null &&
          typeof activeObject.getObjects === "function" &&
          activeObject.getObjects("rect").length === 0))
      {
        return;
      } else {
        this.isAnnotateWithSquare =
          !this.isAnnotateWithSquare &&
          this.annotateSquareProcess !== "processing";
      }

      if (canvasRef !== undefined) {
        if (
          this.isAnnotateWithSquare &&
          activeObject !== null &&
          activeObject !== undefined &&
          activeObject.name !== undefined &&
          (activeObject.name === "signboardGrp" ||
            activeObject.name === "defectGrp") &&
          activeObject.shapeState !== undefined
        ) {
          this.annotateSquareProcess = "processing";
          if (!this.groupHasType(activeObject, "rect")) {
            this.toggleCursorButton(true);
            return;
          }

          let items = activeObject._objects;
          this.isEditingExistingAnnotation = true;

          if (activeObject.name === "defectGrp") {
            this.currentEditedPolygon = {
              name: "defectGrp",
              defectId: activeObject.defectId,
              defectType: activeObject.defectType
            };
          } else if (activeObject.name === "signboardGrp") {
            this.currentEditedPolygon = {
              name: "signboardGrp",
              signboardId: activeObject.signboardId,
              signboardObjectId: activeObject.signboardObjectId
            };
          }

          activeObject._restoreObjectsState();
          canvasRef.remove(activeObject);
          let sheet = new fabric.Rect({
            height: canvasRef.getHeight(),
            width: canvasRef.getWidth(),
            ...SHEET_PRESETS
          });

          sheet.setControlsVisibility(SHEET_SETTINGS);
          this.sheetRef = sheet;
          canvasRef.bringToFront(sheet);
          for (let i = 0; i < items.length; i++) {
            canvasRef.add(items[i]);
            canvasRef.item(canvasRef.size() - 1).hasControls = true;
            let self = this;
            if (items[i].type === "rect") {
              this.editedPolygonRef = items[i];
              items[i].clone(object => {
                self.currentEditedPolygon = {
                  ...self.currentEditedPolygon,
                  left: object.left,
                  top: object.top,
                  width: object.getScaledWidth(),
                  height: object.getScaledHeight(),
                  isDefect: activeObject.name === "defectGrp" ? true : false,
                  type: "rect",
                  defectObjectId: activeObject.defectObjectId,
                  status: activeObject.status
                };
              });
              canvasRef.setActiveObject(items[i]);
              canvasRef.bringToFront(items[i]);
            }
            if (i === 1) {
              items[i].setOptions({
                visible: false
              });
            }
          }

          canvasRef.renderAll();
        } else if (this.isAnnotateWithSquare) {
          this.toggleCursorButton(false);
          canvasRef.remove(this.sheetRef); // remove old sheet ref
          let sheet = new fabric.Rect({
            height: canvasRef.getHeight(),
            width: canvasRef.getWidth(),
            ...SHEET_PRESETS
          });

          sheet.setControlsVisibility(SHEET_SETTINGS);
          this.sheetRef = sheet;
          canvasRef.bringToFront(sheet);
          canvasRef.defaultCursor = "crosshair";
        } else {
          if (this.annotateSquareProcess === "default") {
            canvasRef.remove(this.sheetRef);
          }
          // this.toggleCursorButton(true);
          canvasRef.defaultCursor = "default";
        }
      }

      this.isAnnotateWithPolygon = false;
    },
    toggleCursorButton(boolean) {
      this.isUsingSelectButton = boolean;
      const canvasRef = document.getElementById("c").fabric;

      if (this.isUsingSelectButton) {
        canvasRef.remove(this.sheetRef);
        this.isAnnotateWithPolygon = false;
        this.isAnnotateWithSquare = false;
        this.isPanButtonClicked = false;
        if (this.polygonDrawingState === "processing") {
          var polygon = new fabric.Polygon(this.roofPoints, {
            ...NEW_POLYGON_PRESETS,
            shapeState: "new"
          });

          this.polygonDrawingState = "complete";
          canvasRef.add(polygon);
          this.clearGuide(canvasRef);
          this.updatePolygon(polygon);
          this.annotationCanvas.setActiveObject(polygon);
        }
      }
    },
    deleteAnnotation() {
      const canvasRef = document.getElementById("c").fabric;
      let activeObject = canvasRef.getActiveObject();

      if (activeObject.type === "group") {
        canvasRef.discardActiveObject();
        activeObject._restoreObjectsState();
        activeObject._objects.forEach(object => {
          canvasRef.remove(object);
          canvasRef.renderAll();
        });
        canvasRef.remove(activeObject);

        if (this.isDefectTool) {
          this.deleteAnnotationAction({
            signboardId: this.fromSignboardDetail
              ? this.$store.state.signboard.selectedSignboard.signboardId
              : "",
            imageId: this.imgId,
            payload: {
              deleteAnnotations: [
                {
                  defectId: activeObject.defectId,
                  _id: activeObject.defectObjectId,
                  groupedSignboardId: activeObject.groupedSignboardId
                }
              ]
            }
          });
        } else {
          this.markSignboardDeleted({
            signboardId: activeObject.signboardId,
            fromSignboardDetail: this.fromSignboardDetail
          });
        }
      } else {
        canvasRef.remove(activeObject);
      }
      this.resetAnnotation();
      this.showNewDefectForm = false;
      this.confirmDeleteDialog = false;
      this.showModifyDefectForm = false;
      this.updateStatus()
    },
    showConfirmPopup() {
      this.confirmSaveEditDialog = true;
    },
    cancelEdit() {
      const canvasRef = document.getElementById("c").fabric;
      let activeObject = canvasRef.getActiveObject();
      // if(activeObject === undefined || activeObject === null) {
      //   return ;
      // }
      if (this.currentEditedPolygon.type === "polygon") {
        canvasRef.remove(...canvasRef.getObjects("polygon"));
      } else {
        canvasRef.remove(...canvasRef.getObjects("rect"));
      }
      canvasRef.remove(this.sheetRef);
      const x = this.currentEditedPolygon.left;
      const y = this.currentEditedPolygon.top;
      let isPending = this.currentEditedPolygon.status === "Pending";

      let content = isPending ? "Pending" : this.currentEditedPolygonLabel;
      let backgroundColor = isPending ? "#0091FF" : "green";
      let stroke = isPending ? "white" : "black";

      let t = this.generateText(content, x, y, backgroundColor, stroke);

      let shape = {};
      if (this.isAnnotateWithPolygon) {
        shape = new fabric.Polygon(this.currentEditedPolygon.points, {
          ...NEW_POLYGON_PRESETS,
          selectable: false,
          cornerColor: "rgb(178,204,255)",
          shapeState: "not pending",
          defectType: this.currentEditedPolygon.defectType,
          defectId: this.currentEditedPolygon.defectId,
          defectObjectId: this.currentEditedPolygon.defectObjectId,
          left: this.currentEditedPolygon.left,
          top: this.currentEditedPolygon.top,
          signboardObjectId:
            this.currentEditedPolygon.signboardObjectId ?? null,
          signboardId: this.currentEditedPolygon.signboardId ?? null
        });
      } else {
        shape = new fabric.Rect({
          left: this.currentEditedPolygon.left,
          top: this.currentEditedPolygon.top,
          ...RECTANGLE_PRESETS,
          width: this.currentEditedPolygon.width,
          height: this.currentEditedPolygon.height,
          signboardObjectId:
            this.currentEditedPolygon.signboardObjectId ?? null,
          signboardId: this.currentEditedPolygon.signboardId ?? null
        });
      }

      shape.setOptions({
        stroke: isPending ? "#0091FF" : "green",
        defectObjectId: this.currentEditedPolygon.defectObjectId ?? null,
        signboardObjectId: this.currentEditedPolygon.signboardObjectId ?? null,
        status: this.currentEditedPolygon.status ?? null,
        signboardId: this.currentEditedPolygon.signboardId ?? null
      });
      var g = new fabric.Group([shape, t], {
        name: this.currentEditedPolygon.isDefect ? "defectGrp" : "signboardGrp",
        ...GROUP_PRESETS,
        selectable: true,
        shapeState: "not pending",
        defectType: this.currentEditedPolygon.defectType ?? false,
        defectId: this.currentEditedPolygon.defectId ?? false,
        status: this.currentEditedPolygon.status ?? null,
        signboardId: this.currentEditedPolygon.signboardId ?? null,
        signboardObjectId: this.currentEditedPolygon.signboardObjectId ?? null
      });

      canvasRef.add(g);
      // canvasRef.remove(this.editedPolygonRef);
      canvasRef.renderAll();
      this.isEditingExistingAnnotation = false;
      this.resetAnnotation();
      this.toggleCursorButton(true);
    },
    saveEditedAnnotation() {
      this.confirmSaveEditDialog = false;
      const canvasRef = document.getElementById("c").fabric;
      canvasRef.remove(this.sheetRef);
      const activeObj = canvasRef.getActiveObject();

      const coordinateRatioArray = this.processCoordinates(
        activeObj.oCoords,
        activeObj.type
      );

      const x = activeObj.getBoundingRect().left;
      const y = activeObj.getBoundingRect().top;

      // START Make the image back to 1x zoom before save
      const screenWidth = window.innerWidth / 2000;
      var imgWidth = 864 * screenWidth;
      var imgHeight = 586 * screenWidth;

      this.zoomImageSize(canvasRef, 1, imgWidth, imgHeight, x, y);
      // END

      let isPending = activeObj.status === "Pending";
      let content = isPending ? "Pending" : this.currentEditedPolygonLabel;
      let backgroundColor = isPending ? "#0091FF" : "green";
      let stroke = isPending ? "white" : "black";

      let t = this.generateText(content, x, y, backgroundColor, stroke);

      let annotation = activeObj;
      annotation.setOptions({
        stroke: isPending ? "#0091FF" : "green",
        defectObjectId: activeObj.defectObjectId ?? null,
        signboardObjectId: activeObj.signboardObjectId ?? null
      });

      var g = new fabric.Group([annotation, t], {
        name: this.currentEditedPolygon.isDefect ? "defectGrp" : "signboardGrp",
        ...GROUP_PRESETS,
        shapeState: "not pending",
        selectable: true,
        defectType: this.currentEditedPolygon.defectType ?? false,
        defectId: this.currentEditedPolygon.defectId ?? false,
        defectObjectId: activeObj.defectObjectId ?? null,
        signboardObjectId: activeObj.signboardObjectId ?? null,
        signboardId: activeObj.signboardId ?? null,
        status: activeObj.status
      });

      let payload = {};

      if (this.isDefectTool) {
        payload = {
          modifyAnnotations: [
            {
              defectId: activeObj.defectId,
              location: {
                coordinates: coordinateRatioArray,
                type: "Polygon"
              },
              _id: activeObj.defectObjectId,
              groupedSignboardId: activeObj.groupedSignboardId
            }
          ]
        };
      } else {
        payload = {
          modifyAnnotations: [
            {
              _id: activeObj.signboardObjectId,
              location: {
                coordinates: coordinateRatioArray,
                type: "Polygon"
              },
              defectType: "signboard",
              groupedSignboardId: activeObj.groupedSignboardId
            }
          ]
        };
      }

      let signboardImageId = "";

      if (!this.isDefectTool) {
        signboardImageId = this.signboardAnnotationList.find(
          annotationObj => annotationObj.signboardId === annotation.signboardId
        )._id;
      } else {
        signboardImageId = this.imgId;
      }

      this.updateAnnotation({
        signboardId: this.fromSignboardDetail
          ? this.$store.state.signboard.selectedSignboard.signboardId
          : annotation.signboardId,
        imageId: signboardImageId,
        payload,
        fromSignboardDetail: this.fromSignboardDetail
      });

      canvasRef.add(g);
      canvasRef.discardActiveObject();
      canvasRef.renderAll();
      this.toggleCursorButton(true);
      this.resetAnnotation();
      this.isEditingExistingAnnotation = false;
      this.isAnnotateWithSquare = false;
      this.updateStatus()
    },
    async saveNewSignboard(signboardId, toggleLoading) {
      let canvasRef = document.getElementById("c").fabric;
      if (canvasRef.getActiveObject() === null) {
        return;
      }

      const x = canvasRef.getActiveObject().getBoundingRect().left;
      const y = canvasRef.getActiveObject().getBoundingRect().top;

      // START Make the image back to 1x zoom before save
      const screenWidth = window.innerWidth / 2000;
      var imgWidth = 864 * screenWidth;
      var imgHeight = 586 * screenWidth;

      this.zoomImageSize(canvasRef, 1, imgWidth, imgHeight, x, y);
      // END

      let signboard = canvasRef.getActiveObject();

      let tripRefId = this.$store.state.trips.photos[0].tripRefId;

      const coordinateRatioArray = this.processCoordinates(
        signboard.oCoords,
        signboard.type
      );

      const signboardDetails = await this.makePendingSignboard({
        annotation: coordinateRatioArray,
        tripRefId,
        photoId: this.imgId
      });

      signboard.setOptions({
        stroke: "#0091FF",
        signboardId: signboardDetails.signboard.signboardId,
        status: signboardDetails.signboard.status,
        signboardObjectId:
          signboardDetails.signboardImage.signboardAnnotation._id
      });

      let t = this.generateText("Pending", x, y, "#0091FF", "white");

      let g = this.generateGroup(
        signboard,
        t,
        signboardDetails.signboard.signboardId,
        true,
        "new",
        null,
        signboardDetails.signboard.status
      );

      this.resetAnnotation();
      canvasRef.add(g);
      canvasRef.discardActiveObject();
      canvasRef.renderAll();
      this.showNewSignboardForm = false;
      this.showSignboardDetails = false;
      this.confirmSaveSignboardDialog = true;
      this.toggleCursorButton(true);
      this.updateStatus()
      toggleLoading();
    },
    drawDefects(imgWidth, imgHeight) {
      let image = this.$store.state.signboard.selectedSignboard.images.find(
        image => image._id === this.imgId
      );
      const canvasRef = this.annotationCanvas;
      const paddingGap = 20;

      for (let defect of image.defectAnnotations) {
        let coordinates = defect.location.coordinates[0];
        let defectId = defect.defectId;

        if (coordinates !== undefined && coordinates.length > 2) {
          let points = coordinates.map(
            point =>
              new fabric.Point(
                canvasRef.getWidth() * point[0],
                canvasRef.getHeight() * point[1]
              )
          );

          let polygon = new fabric.Polygon(points, {
            ...NEW_POLYGON_PRESETS,
            stroke: "green",
            shapeState: "not pending",
            selectable: true,
            defectType: defect.defectType,
            defectId,
            defectObjectId: defect._id
          });

          let x = polygon.getBoundingRect().left;
          let y = polygon.getBoundingRect().top + polygon.getBoundingRect().height + paddingGap;

          let t = this.generateText(defect.defectType, x, y, "green");

          var g = new fabric.Group([polygon, t], {
            name: "defectGrp",
            ...GROUP_PRESETS,
            shapeState: "not pending",
            defectType: defect.defectType,
            defectId,
            isDefect: true,
            defectObjectId: defect._id,
            selectable: true
          });

          canvasRef.add(g);
        }
      }
    },
    async zoomImageSize(canvasRef, zoom, imgWidth, imgHeight, x, y){
      canvasRef.zoomToPoint(
        { x: x, y: y },
        zoom
      );

      var vpt = canvasRef.viewportTransform;
      if (vpt[4] >= 0) {
        canvasRef.viewportTransform[4] = 0;
      } else if (vpt[4] < canvasRef.getWidth() - imgWidth * 1) {
        canvasRef.viewportTransform[4] =
          canvasRef.getWidth() - imgWidth * 1;
      }
      if (vpt[5] >= 0) {
        canvasRef.viewportTransform[5] = 0;
      } else if (
        vpt[5] <
        canvasRef.getHeight() - imgHeight * 1
      ) {
        canvasRef.viewportTransform[5] =
          canvasRef.getHeight() - imgHeight * 1;
      }

      let w = 4; // desired width in pixels
      let strokeWidth = w / canvasRef.getZoom();
      for (let object of canvasRef.getObjects()) {
        if (object.defectId && object.type === "group") {
          object.item(0).setOptions({
            strokeWidth
          });
        } else if (object.defectId && (object.type === "polygon" || object.type === "rect")) {
          object.set("strokeWidth", strokeWidth);
        }
      }
      canvasRef.renderAll();
    },
    async saveDefect(defectType, toggleLoading) {
      let canvasRef = document.getElementById("c").fabric;
      if (
        canvasRef.getActiveObject() === null ||
        canvasRef.getActiveObject() === undefined
      ) {
        return;
      }

      const x = canvasRef.getActiveObject().getBoundingRect().left;
      const y = canvasRef.getActiveObject().getBoundingRect().top;
      const defect = canvasRef.getActiveObject();

      // START Make the image back to 1x zoom before save
      const screenWidth = window.innerWidth / 2000;
      var imgWidth = 864 * screenWidth;
      var imgHeight = 586 * screenWidth;

      this.zoomImageSize(canvasRef, 1, imgWidth, imgHeight, x, y);
      // END

      const coordinateRatioArray = this.processCoordinates(
        defect.oCoords,
        defect.type
      );

      let response = await this.addAnnotation({
        signboardId: this.fromSignboardDetail
          ? this.$store.state.signboard.selectedSignboard.signboardId
          : "",
        imageId: this.imgId,
        payload: {
          addAnnotations: [
            {
              defectType,
              location: {
                coordinates: coordinateRatioArray,
                type: "Polygon"
              }
            }
          ]
        }
      });

      let responseDefect = response.defectAnnotations[response.defectAnnotations.length - 1];
      let defectObjectId = responseDefect._id;
      defect.setOptions({
        stroke: "green",
        defectId: "random number generated",
        defectType,
        defectObjectId,
        name: "defectGrp",
        groupedSignboardId: responseDefect.groupedSignboardId
      });

      let t = this.generateText(defectType, x, y, "green");

      var g = new fabric.Group([defect, t], {
        name: "defectGrp",
        ...GROUP_PRESETS,
        shapeState: "not pending",
        defectId: "random number generated",
        defectType,
        defectObjectId,
        selectable: true,
        groupedSignboardId: responseDefect.groupedSignboardId,
        renderOnAddRemove: false
      });
      // canvasRef.remove(this.sheetRef);
      canvasRef.add(g);
      canvasRef.discardActiveObject();

      canvasRef.renderAll();
      this.showNewDefectForm = false;
      this.toggleCursorButton(true);
      // this.isEditingExistingAnnotation = true
      canvasRef.defaultCursor = "default";

      this.updateStatus()
      this.resetAnnotation();
      toggleLoading();
    },
    cancelNewSignboard() {
      this.resetAnnotation();
      let canvasRef = document.getElementById("c").fabric;
      let activeObj = canvasRef.getActiveObject();
      canvasRef.remove(activeObj);
      this.showNewSignboardForm = false;
      this.toggleCursorButton(true);
    },
    cancelAddDefect() {
      this.showNewDefectForm = false;
      this.showModifyDefectForm = false;
      this.annotateSquareProcess = 'default'
      this.resetAnnotation();
      this.toggleCursorButton(true);
      let canvasRef = document.getElementById("c").fabric;
      canvasRef.remove(
        ...canvasRef.getObjects("rect"),
        ...canvasRef.getObjects("polygon")
      );
    },
    onClose() {
      this.$emit("close-tool");
      this.showSignboardDetails = false;
      this.showModifyDefectForm = false;
      let canvasRef = document.getElementById("c").fabric;
      canvasRef.clear();
    },
    getField(tripObject, field) {
      return _get(tripObject, field, "");
    },
    getAnnotation(photoObject) {
      return [photoObject];
    },
    onImageClick(annotationDetails) {
      if (this.isAnnotateWithPolygon === false && this.isAnnotateWithSquare === false) {
        let { imgId } = annotationDetails;

        let foundImageObject = this.displayPhotos.find(
          image => image._id === imgId
        );
        let imageAnnotationDetails = {
          imgSrc: foundImageObject.highResPath,
          imgId,
          fromSignboardDetail: true,
          isDefectTool: true,
          signboardAnnotationList: [foundImageObject],
          carAngle: 0,
          cameraLocation: []
        };
        this.setImageAnnotationDetails(imageAnnotationDetails);
      }
    },
    updateDefect(info) {
      let defectType = info.newDefectType;

      let canvasRef = document.getElementById("c").fabric;
      const defect = canvasRef.getActiveObject();

      let defectList = []
      let selectedDefect = []

      defectList = this.displayPhotos.find(
        obj => obj._id === this.imgId
      ).defectAnnotations

      selectedDefect = defectList.find(
        obj => obj._id === defectList[0]._id
      )
      let payload = {
        modifyAnnotations: [{
          _id: defect.defectObjectId,
          defectType: defectType,
          sequenceNum: selectedDefect.sequenceNum,
          originalDefectType: info.originalDefectType
        }]
      }

      this.updateAnnotation({
        signboardId: this.$store.state.signboard.selectedSignboard.signboardId,
        imageId: this.imgId,
        payload,
        fromSignboardDetail: this.fromSignboardDetail
      })

      const defectObjectId = defect.defectObjectId;
      defect.setOptions({
        stroke: "green",
        defectId: defect.defectId,
        defectType,
        defectObjectId,
        name: "defectGrp",
        groupedSignboardId: selectedDefect.groupedSignboardId
      })

      const existingTextObject = defect.getObjects('text');
      defect.removeWithUpdate(existingTextObject[0])

      const x = defect.left;
      const y = defect.top;
      let t = this.generateText(defectType, x, y, "green");

      defect.addWithUpdate(t, 1)
      canvasRef.add(defect);
      canvasRef.discardActiveObject();
      canvasRef.renderAll();

      this.showModifyDefectForm = false
      this.toggleCursorButton(true);
      canvasRef.defaultCursor = "default";
      this.updateStatus()
    },
    resetAnnotation() {
      this.annotateSquareProcess = "default";
      this.polygonDrawingState = "default";
    },
    updateStatus() {
      let signboardId = this.$store.state.signboard.selectedSignboard.signboardId
      let verified = true
      this.updateVerifyStatus({ signboardId, verified })
    }
  },
  props: ["fromSignboardDetail", "isDefectTool", "dateTime"],
  mounted() {
    this.drawingObject.type = "";
    this.drawingObject.background = "";
    this.drawingObject.border = "";

    const screenWidth = window.innerWidth / 2000;

    this.annotationCanvas = new fabric.Canvas("c", {
      width: 864 * screenWidth,
      height: 586 * screenWidth,
      selection: false
    });

    document.getElementById("c").fabric = this.annotationCanvas;

    let { imgWidth, imgHeight } = this.drawToCanvas();
    var x = 0;
    var y = 0;
    let self = this;
    var stop = false;

    var leftBorder = 0
    var topBorder = 0
    var scaleBorderX = 0
    var scaleBorderY = 0
    var widthBorder = 0
    var heightBorder = 0

    this.annotationCanvas.on("mouse:wheel", function(opt) {
      //disable wheel for now
      // return;

      const x = opt.e.offsetX;
      const y = opt.e.offsetY

      var delta = opt.e.deltaY;
      var zoom = self.annotationCanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 1) zoom = 1;

      opt.e.preventDefault();
      opt.e.stopPropagation();

      self.zoomImageSize(self.annotationCanvas, zoom, imgWidth, imgHeight, x, y);
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
      self.annotateSquareProcess = "processing";
      self.annotationCanvas.renderAll();
    });

    this.annotationCanvas.on("mouse:up", function(options) {
      self.isDown = false;

      if (self.isPanButtonClicked) {
        self.panning = false;
      }

      if (self.isAnnotateWithSquare) {
        self.toggleAnnotateWithSquare();
      }
    });

    this.annotationCanvas.on("selection:cleared", function(option) {
      self.handleDeselection(option);
    });

    this.annotationCanvas.on("selection:created", async function(option) {
      if (option.target.signboardId) {
        self.currentEditedPolygonLabel = option.target.signboardId;
      } else if (option.target.defectId) {
        self.currentEditedPolygonLabel = option.target.defectType ?? "";
      }
      let activeObj = self.annotationCanvas.getActiveObject();

      if (
        activeObj !== undefined &&
        activeObj !== null &&
        activeObj.name !== undefined &&
        (activeObj.name === "signboardGrp" || activeObj.name === "defectGrp")
      ) {
        let signboardGroup = activeObj;
        signboardGroup.item(0).setOptions({
          stroke: "yellow"
        });
        signboardGroup.item(1).setOptions({
          backgroundColor: "yellow"
        });
        if (
          self.fromSignboardDetail === false &&
          (activeObj.shapeState !== undefined && activeObj.shapeState !== "new")
        ) {
          const response = await self.getSignboardData({
            accessToken: window.localStorage.getItem("accessToken"),
            signboardId: option.target.signboardId
          });

          if (response) {
            self.showSignboardDetails = true;
          }
        }
        self.annotationCanvas.renderAll();
      }

      if (activeObj.name === "defectGrp") {
        self.setDefectObjectId(activeObj.defectObjectId)
        self.showModifyDefectForm = true;
      }
    });

    this.annotationCanvas.on("selection:updated", async function(option) {
      self.handleDeselection(option);

      if (option.target.signboardId) {
        self.currentEditedPolygonLabel = option.target.signboardId;
      } else if (option.target.defectId) {
        self.currentEditedPolygonLabel = option.target.defectType;
      }
      let activeObj = self.annotationCanvas.getActiveObject();

      if (
        activeObj !== undefined &&
        activeObj !== null &&
        activeObj.name !== undefined &&
        (activeObj.name === "signboardGrp" || activeObj.name === "defectGrp")
      ) {
        let signboardGroup = activeObj;
        signboardGroup.item(0).setOptions({
          stroke: "yellow"
        });
        signboardGroup.item(1).setOptions({
          backgroundColor: "yellow"
        });
        if (
          self.fromSignboardDetail === false &&
          (activeObj.shapeState !== undefined && activeObj.shapeState !== "new")
        ) {
          let response = await self.getSignboardData({
            accessToken: window.localStorage.getItem("accessToken"),
            signboardId: option.target.signboardId
          });
          if (!_isEmpty(response)) {
            self.showSignboardDetails = true;
          }
        }
        self.annotationCanvas.renderAll();
      }
    });

    this.annotationCanvas.on("mouse:down", function(options) {
      if (self.isPanButtonClicked) {
        self.panning = true;
      }

      if (
        self.isAnnotateWithPolygon === false &&
        self.isAnnotateWithSquare === false
      ) {
        return;
      }

      if (
        self.isAnnotateWithSquare &&
        !self.isEditingExistingAnnotation &&
        self.annotateSquareProcess !== "processing"
      ) {
        var cursor = self.annotationCanvas.getPointer(options.e);

        self.isDown = true;
        self.origX = cursor.x;
        self.origY = cursor.y;
        let strokeWidth = 4 / self.annotationCanvas.getZoom();

        self.currentRectangle = new fabric.Rect({
          left: self.origX,
          top: self.origY,
          ...RECTANGLE_PRESETS,
          stroke: "red",
          selectable: true,
          shapeState: self.isDefectTool ? "not pending" : "new",
          defectId: "N/A",
          strokeWidth,
        });
        self.annotationCanvas.add(self.currentRectangle);
        self.annotationCanvas.setActiveObject(self.currentRectangle);
        if (!self.isDefectTool) {
          self.showNewSignboardForm = true;
        } else {
          self.showNewDefectForm = true;
        }
      }

      if (self.isAnnotateWithPolygon && !self.isEditingExistingAnnotation) {
        let x = 0;
        let y = 0;
        const numberOfPoint = self.roofPoints.length;
        const pointer = self.annotationCanvas.getPointer(options.e);

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
          self.polygonDrawingState = "processing";
          self.annotationCanvas.add(circle);
          self.circleArray.push(circle);
          if (self.roofPoints.length < 1) {
            self.roofPoints.push(new fabric.Point(pointer.x, pointer.y));
          } else {
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
            let polygonPoints = [];
            const xDistance = self.roofPoints[numberOfPoint].x - self.roofPoints[0].x //distance between delete x coordinate of the last and the first point
            const yDistance = self.roofPoints[numberOfPoint].y - self.roofPoints[0].y //distance between delete y coordinate of the last and the first point

            // delete the last point if the distance between the last and the first point smaller than 9px
            if ((-9 > xDistance < 9) && (-9 > yDistance < 9)) {
              polygonPoints = self.roofPoints.slice(0, numberOfPoint)
            } else {
              polygonPoints = self.roofPoints
            }
            var polygon = new fabric.Polygon(polygonPoints, {
              ...NEW_POLYGON_PRESETS,
              selectable: true,
              isDefect: self.isDefectTool ? true : false,
              defectId: "N/A",
              shapeState: self.isDefectTool ? "not pending" : "new"
            });

            // self.currentEditedPolygon = polygon;
            self.annotationCanvas.add(polygon);
            self.polygonDrawingState = "complete";
            self.toggleAnnotateWithPolygon();
            self.isAnnotateWithPolygon = false;
            self.clearGuide(self.annotationCanvas);

            self.annotationCanvas.setActiveObject(polygon);
            self.annotationCanvas.renderAll();

            self.updatePolygon(polygon);
          }
        }
      }
    });

    this.annotationCanvas.on("object:added", ({ target }) => {
      if (
        target.defectId &&
        target.defectId === "N/A" &&
        target.shapeState &&
        target.shapeState === "not pending" &&
        self.isDefectTool
      ) {
        self.showNewDefectForm = true;
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
  },
  watch: {
    isDefectTool: {
      deep: true,
      handler(object) {
        this.drawToCanvas();
      }
    },
    polygonDrawingState() {
      if (this.polygonDrawingState === 'complete' && !this.isEditingExistingAnnotation) {
        if (!this.isDefectTool) {
          this.showNewSignboardForm = true;
        }
        else {
          this.showNewDefectForm = true;
        }
      }
    }
  },
};

</script>
