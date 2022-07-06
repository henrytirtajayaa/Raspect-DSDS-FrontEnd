import _findIndex from "lodash/findIndex";

export default {
  data() {
    return {
      minimizeSearch: false,
      alert: false,
      alertText: "",
      filterBySurveyId: ""
    };
  },
  methods: {
    toggleSearch() {
      this.minimizeSearch = !this.minimizeSearch;
    },
    alertFunction(text) {
      this.alert = true;
      this.alertText = text;
    },
    deselectLayers () {
      this.$refs.map.mapObject.eachLayer((layer)=>{
        if(layer.feature) {
          layer.setStyle({fillColor : '#333333', color: '#333333'})
        }
      })
    },
    onFilterResult(payload) {
      this.$refs.map.mapObject.eachLayer(layer => {
        if (layer.feature) {
          if (layer.feature.properties.surveyId === payload) {
            this.onSearchDisplay(layer);
          }
          else {
            layer.setStyle({
              fillColor: "#333333",
              color: "#333333"
            });
          }
        }
        else if (layer.options.surveyId === payload) {
          this.onSearchDisplay(layer);
        }
      });
    },
    clearSearch() {
      this.filterBySurveyId = "";
      this.deselectLayers();
      this.$refs.map.mapObject.flyTo(
        {
          lat: 22.3193,
          lng: 114.1694
        },
        15
      );
      this.onTabClose();
    },
    onSearchDisplay(layer) {
      layer.setStyle({ fillColor: "#3388ff", color: "#3388ff" });
      const centerPoint = layer.getBounds().getCenter();
      this.$refs.map.mapObject.flyTo(
        {
          lat: centerPoint.lat,
          lng: centerPoint.lng
        },
        16
      );
      this.showTabDetail(layer);
    }
  },
  computed: {
    surveyIds() {
      let surveyIds = [];
      this.surveyArea.map(survey => {
        surveyIds.push(survey.surveyId);
      });
      return surveyIds;
    }
  }
};
