<template>
  <Chart :data="data" :options="options" :type="type"  style="position: relative; height:40vh; width:100%"/>
</template>

<script>
import Chart from 'vue-chartjs3'
import 'chartjs-adapter-date-fns';

export default {
  components: {
    Chart
  },
  data () {
    return {
      type: 'line',
      data: {
        datasets: [
          {
            label: '# of Votes',
            data: [

            ],
            backgroundColor: '#386380'
          },
          {
            label: '# of Points',
            data: [

            ],
            backgroundColor: '#ff6384'
          },
          {
            label: '# of Points',
            data: [

            ],
            backgroundColor: '#5563FF'
          },
          {
            label: '# of Points',
            data: [

            ],
            backgroundColor: '#55FF33'
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'timeseries',
          }
        }
      }
    }
  },
  mounted() {
    const timer = setInterval(this.updateData, 1000);
    this.$on('hook:destroyed', () => clearInterval(timer))
  },
  methods: {
    updateData() {
      const duration = 60;
      const sampling = 5;
      const now = Date.now();
      for (let dataset of this.data.datasets) {
        if (dataset.data.length > duration * sampling) {
          dataset.data.splice(0, dataset.data.length - duration * sampling);
        }
        let y = Math.round(Math.random() * 20);
        for (let i = 0; i < sampling; i++) {
          dataset.data.push({
            x: now + (i - 1) * 1000 / sampling,
            y: y + Math.round(Math.random() * 3 - 2),
          })
        }
      }
    },
  },
}
</script>
