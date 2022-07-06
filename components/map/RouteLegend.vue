<template class='route-legend'>
  <v-card>
    <v-container>
      <template v-if="filterSurveyId.length === 0">
        <div v-for="(item, index) in surveyColors" :key="index">
          <div class="route-legend__legend-container">
            <div><div class='route-legend__path-icon' :style="{border: `5px solid ${item.color}`}"></div></div> {{ index }}
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="(tripObject, index) of tripColors" :key="index">
          <div :class="`route-legend__legend-container ${hovered === index ? 'route-legend--hover' : '' }`" @click="onLegendClick(tripObject.centerPoint)" @mouseover="setCurrentHovered(index)">
            <div><div class='route-legend__path-icon' :style="{border: `5px dashed ${tripObject.color}`}"></div></div> {{ index }}
          </div>
        </div>
      </template>
    </v-container>
  </v-card>
</template>
<script>
import _isEmpty from 'lodash/isEmpty';
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      hovered: "",
      surveyColors: {}
    }
  },
  computed: {
    tripColors () {
      return _isEmpty(this.$store.state.trips.tripColors) ? false : this.$store.state.trips.tripColors;
    },
    surveyList() {
      return this.$store.state.record.surveyIds;
    },
    filterSurveyId () {
      return this.$store.state.trips.filter.surveyId;
    }
  },
  methods: {
    onLegendClick(centerPoint) {
      this.$emit('on-trip-click', centerPoint)
    },
    setCurrentHovered(id) {
      this.hovered = id;
    },
    ...mapMutations({
      setTripColors: "trips/setTripColors"
    }),
    getRandomColor(str) {
      for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
      let color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
      return '#' + Array(6 - color.length + 1).join('0') + color;
    }
  },
  watch: {
    surveyList: {
      handler(val) {
        if (_isEmpty(this.tripColors)) {
          let tripColorsObject = {}
          val.forEach((element, index) => {
            tripColorsObject['Survey ' +  element] = { color: this.getRandomColor(element) };  
          })
          this.setTripColors(tripColorsObject);

          this.surveyColors = tripColorsObject
        }
      }
    }
  }
}
</script>