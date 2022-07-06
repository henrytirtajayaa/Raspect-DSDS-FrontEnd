<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="history"
      :options.sync="options"
      :loading="loading"
      class="elevation-1 custom"
    >
    </v-data-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalDesserts: 0,
      desserts: [],
      loading: false,
      options: {},
      headers: [
        { text: 'Trip Id', value: 'tripRefId' },
        { text: 'Sample Rate', value: 'samplingRate' },
        { text: 'No. of signboard samples', value: 'sampledSignboardCount' },
        { text: 'No. of defective samples', value: 'defectiveSignboardCount' },
        { text: 'No. of image samples', value: 'sampledImageCount' },
      ],
    }
  },
  mounted () {
  },
  methods: {
    
  },
  computed: {
    history() {
      return this.$store.state.performance.history;
    }
  }
}
</script>

<style>
.custom thead tr {
  background-color: var(--v-info-lighten5);
}

</style>
