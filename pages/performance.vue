<template>
  <v-container fluid class="pa-0 performance" id="reportArea">
    <v-row no-gutters class="grey lighten-2 accent-4">
      <v-col cols="10">
        <v-tabs
          height="60px"
          background-color="grey lighten-2 accent-4"
          class="pl-8"
          center-active
        >
          <v-tab>Performance list</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="2" align-self="center">
        <v-btn elevation="1" color="primary" @click="exportGraphs">
          <span class="text text--bold text--white text--medium">
            Export Graph
          </span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pa-8 d-flex" align="center">
      <v-col cols="2">
        <v-select
          outlined
          :items="surveyIds"
          dense
          v-model="surveyId"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              label="Survey Date"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
            ></v-text-field>
          </template>
          <v-date-picker v-model="dates" no-title scrollable range>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="handleFilter">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="3">
        <v-btn elevation="0" color="white" @click="clearFields">
          <span class="text text--bold text--blue text--medium">
            Clear Recent Search
          </span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pa-8 d-flex justify-space-between" id="my-node">
      <v-card width="31%" height="400px" class="graph-card-container">
        <v-card-title class="performance__card-title-container">
          <div class="text text--large text--secondary-style text--bold">
            Accumulated Signboard Detected
          </div>
          <div>
            <span class="text text--small text--secondary-style">{{
              dateDisplay
            }}</span>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container>
            <div class="performance__chart-wrapper">
              <div class="chart-container">
                <canvas id="myChart" ref="chartRef" class="myCanvas"></canvas>
              </div>
            </div>
          </v-container>
          <div class="performance__legend-container">
            <div class="performance__legend-group performance__legend-group--space">
              <div class="blue-legend"></div>
              <div class='text text--secondary-style text--medium performance__custom-text'>Defective Signboard</div>
              <div class="text text--secondary-style text--large text--bold">{{ totalDefectiveSignboardCount }}</div>
            </div>
            <div class="performance__legend-group">
              <div class="white-legend"></div>
              <div class='text text--secondary-style text--medium performance__custom-text'>Normal Signboard</div>
              <div class="text text--secondary-style text--large text--bold">{{ totalNormalSignboardCount }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card width="31%" height="400px" class="graph-card-container">
        <v-card-title class="performance__card-title-container">
          <div class="text text--large text--secondary-style text--bold">
            Signboard Detection Level of Accuracy
          </div>
          <div>
            <span class="text text--small text--secondary-style">{{
              dateDisplay
            }}</span>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container>
            <canvas id="sbDetect" class="myCanvas"></canvas>
          </v-container>
        </v-card-text>
      </v-card>
      <v-card width="31%" height="400px" class="graph-card-container">
        <v-card-title class="performance__card-title-container">
          <div class="text text--large text--secondary-style text--bold">
            Defect Detection Level of Accuracy
          </div>
          <div>
            <span class="text text--small text--secondary-style">{{
              dateDisplay
            }}</span>
          </div>
        </v-card-title>
        <v-card-text> </v-card-text>
        <v-container>
          <canvas id="defectDetect" class="myCanvas"></canvas>
        </v-container>
      </v-card>
    </v-row>
    <v-row class="px-8">
      <v-col>
        <span class="text text--secondary-style performance__custom-text">Data Sampling History</span>
      </v-col>
      
    </v-row>
    <v-row class="px-8">
      <v-col>
        <PerformanceDataSamplingHistory></PerformanceDataSamplingHistory>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Chart, DoughnutController, ArcElement, LineController, CategoryScale, LinearScale, PointElement, LineElement} from "chart.js";
import moment from "moment";
import { mapActions } from "vuex";
import jsPDF from 'jspdf';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import * as htmlToImage from 'html-to-image';

Chart.register(ArcElement, DoughnutController, LineController, CategoryScale, LinearScale, PointElement, LineElement);

export default {
  methods: {
    ...mapActions({
      getRecords: "performance/getRecords",
      getSurveysIds: "record/getSurveysIds"
    }),
    exportGraphs() {
      var node = document.getElementById('my-node');

      htmlToImage.toPng(node).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        var doc = new jsPDF('l', 'px', 'a4');
        const imgProps= doc.getImageProperties(dataUrl);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(dataUrl, "JPEG", 0, 40, pdfWidth, pdfHeight);
        doc.save('test.pdf');
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
    },
    buildDonutChart() {
      let chartStatus = Chart.getChart("myChart");

        if (chartStatus != undefined) {
          chartStatus.destroy();
        }

        const data = {
          labels: ["Red", "Blue", "Yellow"],
          datasets: [
            {
              label: "My First Dataset",
              data: [
                this.totalNormalSignboardCount,
                this.totalDefectiveSignboardCount
              ],
              backgroundColor: ["#056694", "#D8D8D8"],
              hoverOffset: 4
            }
          ]
        };

        let self = this;
        const config = {
          type: "doughnut",
          data,
          title: {
            display: true,
            position: "bottom",
            text: "Upcoming Meetings"
          },
          legend: {
            display: false
          },
          centertext: "123",
          plugins: [
            {
              beforeDraw: function(chart) {
                var width = chart.width,
                  height = chart.height,
                  ctx = chart.ctx;

                  ctx.restore();
                  var fontSize = (height / 200).toFixed(2);
                  ctx.font = "bold " + fontSize + "em sans-serif";
                  ctx.textBaseline = "middle";
                  var text = self.totalSignboardCount,
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;

                  ctx.fillText(text, textX, textY - 10);

                  var text2 = "Signboards",
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;

                  ctx.fillText(text2, textX / 1.4, textY + 10);

                  ctx.save();
              }
            }
          ],
          options: {
            responsive: true
          }
        };

        var myChart = new Chart(document.getElementById("myChart"), config);
    },
    async handleFilter() {
      await this.drawCharts(this.surveyId);
    },
    clearFields() {
      this.surveyId = "";
      this.dates = [];
    },
    buildLineChart(chartName, dataset) {
      let chartStatus = Chart.getChart(chartName);

      if (chartStatus != undefined) {
        chartStatus.destroy();
      }

      let chartData = {
        labels: this.signboardTripRefIdList,
        datasets: [
          {
            data: dataset,
            fill: false,
            borderColor: '#056694',
            tension: 0.1
          }
        ]
      };
        
      const chartConfig = {
        type: "line",
        data: chartData,
      };

      var someChart = new Chart(document.getElementById(chartName), chartConfig);
    },
    async drawCharts(surveyId) {
      await this.getRecords({ surveyId: surveyId, startTime: this.dates[0], endTime: this.dates[1] });
        
      this.buildDonutChart();

      this.buildLineChart('sbDetect', this.signboardDetectionAccuracyList);

      this.buildLineChart('defectDetect', this.defectDetectionAccuracyList);
    }
  },
  computed: {
    totalSignboardCount() {
      return (
        this.$store.state.performance.totalNormalSignboardCount +
        this.$store.state.performance.totalDefectiveSignboardCount
      );
    },
    totalNormalSignboardCount() {
      return this.$store.state.performance.totalNormalSignboardCount;
    },
    totalDefectiveSignboardCount() {
      return this.$store.state.performance.totalDefectiveSignboardCount;
    },
    dateRangeText() {
      return this.dates.join(" to ");
    },
    surveyIds() {
      return this.$store.state.record.surveyIds;
    },
    dateDisplay() {
      return `From ${moment(this.dates[0]).format("DD MMM yyyy")} to ${moment(
        this.dates[1]
      ).format("DD MMM yyyy")}`;
    },
    signboardTripRefIdList() {
      return this.$store.state.performance.history.map((signboard) => signboard.tripRefId);
    },
    signboardDetectionAccuracyList() {
      return this.$store.state.performance.history.map((signboard) => signboard.signboardDetectionAccuracy);
    },
    defectDetectionAccuracyList() {
      return this.$store.state.performance.history.map((signboard) => signboard.defectDetectionAccuracy);
    }
  },
  data() {
    return {
      date: "",
      menu: "",
      dates: [],
      type: "doughnut",
      data: {
        labels: ["Defective Signboard", "Normal Signboardd"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19],
            backgroundColor: ["#386380", "#DEDEDE"],
            weight: 5
          },
          {
            data: [12, 19],
            backgroundColor: ["#487390", "#EEEEEE"],
            weight: 1
          }
        ]
      },
      options: {
        elements: {
          center: {
            text: "Red is 2/3 the total numbers",
            color: "#FF6384",
            fontStyle: "Arial",
            sidePadding: 20,
            minFontSize: 20,
            lineHeight: 25
          }
        },
        animation: {
          onComplete() {}
        },
        datasets: {
          doughnut: {
            cutout: "70%",
            borderWidth: 0
          }
        },
        responsive: true,
        maintainAspectRatio: false
      },
      surveyId: "",
      myChart: {}
    };
  },
  async mounted() {
    await this.getSurveysIds();
    if(this.surveyIds && this.surveyIds.length > 0){
      this.surveyId = this.surveyIds[0];
      await this.drawCharts(this.surveyId);
    }
  },
  watch: {
    surveyId: {
      async handler(val) {
        
        await this.drawCharts(val);
      }
    }
  }
};
</script>
