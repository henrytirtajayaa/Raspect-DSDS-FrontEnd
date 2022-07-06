<template class="search-panel">
  <TripSurveySearch></TripSurveySearch>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  props: ["fromTripRoute", "userDefinedWidth", "mapRef"],
  data() {
    return {
      dates: ["2019-09-10", "2019-09-20"],
      currentDistrict: {
        value: "",
        label: "18 Districts",
        boundary: []
      },
      items: [
        { title: "Islands" },
        { title: "Yau Tsim Mong" },
        { title: "Kwai Tsing" },
        { title: "Sha Tin" }
      ],
      closeContent: false,
      signboardFilterRadioItems: [
        { label: "All", value: "A" },
        { label: "With defects", value: "D" }
      ],
      addressFilterRadioItems: [
        { label: "Undefined", value: "U" },
        { label: "Assigned", value: "A" }
      ],
      shown: false,
      datePickerMenu: false 
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" to ");
    },
    districts() {
      return this.$store.state.trips.districts;
    }
  },
  methods: {
    ...mapActions({
      searchTrip: "trips/searchTripAction"
    }),
    ...mapMutations({
      setCenter: "trips/setCenter"
    }),
    onCloseContentClick() {
      this.closeContent = true;

      if (!this.fromTripRoute) {
        this.searchSignboard({
          boundary: this.currentDistrict.boundary,
          startDate: this.dates[0],
          endDate: this.dates[1],
          keyword: "",
          status: "",
          isDefective: this.radioGroup === 1 ? true : false
        });
      } else {
        this.searchTrip({
          boundary: this.currentDistrict.boundary,
          startDate: this.dates[0],
          endDate: this.dates[1]
        });
      }

      this.$emit("panTo", this.currentDistrict.center);
    },
    setCloseContentToFalse() {
      this.closeContent = false;
    },
    setCurrentDistrict(label, value, center) {
      this.currentDistrict = {
        ...this.currentDistrict,
        label,
        value,
        boundary: value,
        center
      };
    },
    onOk() {
      this.shown = false;
    },
    onDateTextClick() {
      this.datePickerMenu = !this.datePickerMenu;
    },
  }
};
</script>
