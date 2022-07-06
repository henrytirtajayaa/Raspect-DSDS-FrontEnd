<template class="annotation-controls">
  <div>
    <div class="annotation-controls__controls-container">
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="3"> </v-col>
          <v-col cols="6">
            <div class="annotation-controls__middle-bar">
              <div class="annotation-controls__controls-wrapper">
                <v-divider class="mx-4" vertical></v-divider>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="annotation-controls__control-button" @click="$emit('toggle-pan-button')" v-bind="attrs" v-on="on">
                      <span v-if="isPanButtonClicked">
                        <CommonFourArrowsIconBlue></CommonFourArrowsIconBlue>
                      </span>
                      <span v-else>
                        <CommonFourArrowsIcon></CommonFourArrowsIcon>
                      </span>
                    </v-btn>
                  </template>
                  <span>Pan</span>
                </v-tooltip>
                <v-divider class="mx-4" vertical></v-divider>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="annotation-controls__control-button"
                      @click="$emit('toggle-select', true)"
                      v-bind="attrs" v-on="on"
                    >
                      <span v-if="isUsingSelectButton">
                        <CommonCursorIconBlue></CommonCursorIconBlue>
                      </span>
                      <span v-else>
                        <CommonCursorIcon></CommonCursorIcon>
                      </span>
                    </v-btn>
                  </template>
                  <span>Select</span>
                </v-tooltip>
                <v-divider class="mx-4" vertical></v-divider>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="$emit('set-annotation-signboard-mode-with-square')"
                      class="annotation-controls__control-button"
                      v-bind="attrs" v-on="on"
                      :disabled="isDefectTool"
                    >
                      <span v-if="isAnnotateWithSquare">
                        <CommonRectangleIconBlue></CommonRectangleIconBlue>
                      </span>
                      <span v-else>
                        <CommonRectangleIcon></CommonRectangleIcon>
                      </span>
                    </v-btn>
                  </template>
                  <span>Rectangle Annotate</span>
                </v-tooltip>
                <v-divider class="mx-4" vertical></v-divider>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs}">
                    <v-btn
                      @click="$emit('set-annotation-signboard-mode-with-polygon')"
                      class="annotation-controls__control-button"
                      v-bind="attrs" v-on="on"
                      :disabled="!isDefectTool"
                    >
                      <span v-if="isAnnotateWithPolygon">
                        <CommonPolygonIconBlue></CommonPolygonIconBlue>
                      </span>
                      <span v-else>
                        <CommonPolygonIcon></CommonPolygonIcon>
                      </span>
                    </v-btn>
                  </template>
                  <span>Polygon Annotate</span>
                </v-tooltip>
                <v-divider class="mx-4" vertical></v-divider>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs}">
                    <v-btn
                      class="annotation-controls__control-button"
                      @click="$emit('undo-polygon')"
                      v-bind="attrs" v-on="on"
                    >
                      <CommonUndoIcon></CommonUndoIcon>
                    </v-btn>
                  </template>
                  <span>Undo</span>
                </v-tooltip>
                <v-divider class="mx-4" vertical></v-divider>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs}">
                    <v-btn
                      class="annotation-controls__control-button"
                      @click="$emit('delete-annotation')"
                      v-bind="attrs" v-on="on"
                    >
                      <CommonGarbageIcon></CommonGarbageIcon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </div>
              <div class="annotation-tool__legend-container">
                <div class="annotation-tool__legend-wrapper">
                  <div
                    class="annotation-tool__legend-wrapper__box annotation-tool__legend-wrapper__box--yellow"
                  ></div>
                  <div class="annotation-tool__legend-text">Selected Item</div>
                </div>
                <div class="annotation-tool__legend-wrapper ">
                  <div
                    class="annotation-tool__legend-wrapper__box annotation-tool__legend-wrapper__box--green"
                  ></div>
                  <div class="annotation-tool__legend-text">
                    Item can be selected
                  </div>
                </div>
                <div class="annotation-tool__legend-wrapper ">
                  <div
                    class="annotation-tool__legend-wrapper__box annotation-tool__legend-wrapper__box--blue"
                  ></div>
                  <div class="annotation-tool__legend-text">
                    Working in progress
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </v-col>
          <v-col cols="3">
            <div class="annotation-controls__export-btn-container">
              <v-btn @click="$emit('export-image')" outlined class="annotation-controls__export-btn">Export Image</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "isAnnotateDefectMode",
    "isAnnotateWithSquare",
    "isUsingSelectButton",
    "isAnnotateWithPolygon",
    "isEditingExistingAnnotation",
    "isPanButtonClicked",
    "isDefectTool"
  ]
};
</script>
