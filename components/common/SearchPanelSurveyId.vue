<template>
  <l-control position="topleft" style="order: 2;">
      
    <div class="map__search-container">
        <v-btn @click="$emit('toggleSearch')" class="map__minimize-btn mr-3" outlined height="40">
        <template v-if="minimizeSearch">
            <v-icon>mdi-magnify</v-icon>
        </template>
        <template v-else>
            <v-icon>mdi-chevron-up</v-icon>
        </template>
    </v-btn>
      <template v-if="!minimizeSearch">
        <v-autocomplete
          id="test"
          background-color="white"
          dense
          outlined
          label="Search by Survey ID"
          append-icon="mdi-magnify"
          class="map__autocomplete-field text text--small"
          :items="surveyIds"
          item-text="signboardId"
          item-value="_id"
          @change="onSearch(filterBySurveyId)"
          return-object
          v-model="filterBySurveyId"
          :menu-props="{ maxHeight: 200 }"
        >
        </v-autocomplete>
        <v-btn
          outlined
          color="primary"
          class="map__clear-btn"
          @click="clearSearch()"
          >Clear Search</v-btn
        >
      </template>
    </div>
  </l-control>
</template>

<script>
export default {
    props: ["minimizeSearch", 'surveyIds'],
    data () {
        return {
            filterBySurveyId: ''
        }
    },
    methods: {
        onSearch(filterBySurveyId) {
            this.$emit('onFilterResult', filterBySurveyId)
        },
        clearSearch() {
          this.$emit('clearSearch');
          this.filterBySurveyId = '';
        }
    }
}
</script>

<style>
.v-autocomplete__content .v-list__tile{
  height: 100px;
}
</style>
