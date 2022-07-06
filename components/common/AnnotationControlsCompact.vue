<template class="annotation-controls">
  <div>
    <div>
      <v-card outlined color="black" max-width="60">
        <v-list>
          <v-list-item>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="annotation-controls__control-button"
                  @click="$emit('toggle-select', true)"
                  v-bind="attrs" v-on="on"
                >
                  <span v-if="isUsingSelectButton">
                    <CommonCursorIconBlue />
                  </span>
                  <span v-else>
                    <CommonCursorIcon />
                  </span>
                </v-btn>
              </template>
              <span>Select</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="$emit('set-annotation-signboard-mode-with-square')" class="annotation-controls__control-button" v-bind="attrs" v-on="on">
                  <span v-if="isAnnotateWithSquare">
                    <CommonRectangleIconBlue />
                  </span>
                  <span v-else>
                    <CommonRectangleIcon />
                  </span>
                </v-btn>
              </template>
              <span>Rectangle Annotate</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs}">
                <v-btn @click="$emit('set-annotation-signboard-mode-with-polygon')" class="annotation-controls__control-button" v-bind="attrs" v-on="on">
                  <span v-if="isAnnotateWithPolygon">
                    <CommonPolygonIconBlue />
                  </span>
                  <span v-else>
                    <CommonPolygonIcon />
                  </span>
                </v-btn>
              </template>
              <span>Polygon Annotate</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="annotation-controls__control-button" @click="$emit('toggle-pan-button')" v-bind="attrs" v-on="on">
                  <span v-if="isPanButtonClicked">
                    <CommonFourArrowsIconBlue />
                  </span>
                  <span v-else>
                    <CommonFourArrowsIcon />
                  </span>
                </v-btn>
              </template>
              <span>Pan</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item class="ml-1">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs}">
                <v-btn class="annotation-controls__control-button" @click="$emit('undo-polygon')" v-bind="attrs" v-on="on">
                  <CommonUndoIcon />
                </v-btn>
              </template>
              <span>Undo</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item class="ml-1">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs}">
                <v-btn class="annotation-controls__control-button" @click="$emit('delete-annotation')" v-bind="attrs" v-on="on">
                  <CommonGarbageIcon />
                </v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
      
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "isAnnotateWithSquare",
    "isUsingSelectButton",
    "isAnnotateWithPolygon",
    "isPanButtonClicked"
  ]
};
</script>
