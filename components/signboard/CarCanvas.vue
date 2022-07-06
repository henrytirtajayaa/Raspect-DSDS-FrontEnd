<template class='car-canvas'>
  <div v-if="this.tripAnglePhotos.length > 0">
    <v-row class="car-canvas__node-container">
      <v-col cols="4">
        <div class="car-canvas__common-box-wrapper">
          <div class="car-canvas__box1">
            <div class="car-canvas__common-relative-wrapper">
              <div class="car-canvas__circle1"></div>
              <div class="car-canvas__camera-text car-canvas__camera-text1">Camera 3</div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="car-canvas__common-box-wrapper">
          <div class="car-canvas__box2">
            <div class="car-canvas__common-relative-wrapper">
              <div class="car-canvas__circle2"></div>
              <div class="car-canvas__camera-text car-canvas__camera-text2">Camera 2</div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="car-canvas__common-box-wrapper">
          <div class="car-canvas__box3">
            <div class="car-canvas__common-relative-wrapper">
              <div class="car-canvas__circle3"></div>
              <div class="car-canvas__camera-text car-canvas__camera-text3">Camera 1</div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="px-5">
       <v-col cols="4">
           <div class='car-canvas__button-left-container'>
               <v-btn class="mx-2" fab small elevation="0" color="#E3E3E9" @click="changeImages(-1)">
                    <v-icon dark>
                        mdi-arrow-left
                    </v-icon>
                </v-btn>
           </div>
      </v-col>
      <v-col cols="4">
        <div class="car-canvas__car-spacing">
          <v-img
            src="/car-signboard.svg"
            class="car-canvas__car-img"
          ></v-img>
        </div>
      </v-col>
      <v-col cols="4">
          <div class='car-canvas__button-right-container'>
              <v-btn class="mx-2" fab small elevation="0" color="#E3E3E9" @click="changeImages(1)">
                <v-icon dark>
                  mdi-arrow-right
                </v-icon>
              </v-btn>
          </div>
            
      </v-col>
    </v-row>
    <v-row class="car-canvas__node-container">
      <v-col cols="4">
        <div class="car-canvas__common-box-wrapper">
          <div class="car-canvas__box4">
            <div class="car-canvas__common-relative-wrapper">
              <div class="car-canvas__circle4"></div>
              <div class="car-canvas__camera-text car-canvas__camera-text4">Camera 4</div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="car-canvas__common-box-wrapper">
          <div class="car-canvas__box5">
            <div class="car-canvas__common-relative-wrapper">
              <div class="car-canvas__circle5"></div>
              <div class="car-canvas__camera-text car-canvas__camera-text5">Camera 5</div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="car-canvas__common-box-wrapper">
          <div class="car-canvas__box6">
            <div class="car-canvas__common-relative-wrapper">
              <div class="car-canvas__circle6"></div>
              <div class="car-canvas__camera-text car-canvas__camera-text6">Camera 6</div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-row class="car-canvas__node-container" style="padding-top:350px">
      <v-col cols="12">
        <div class="car-canvas__common-box-wrapper">
        </div>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="px-5">
       <v-col cols="4">
           <div class='car-canvas__button-left-container'>
               <v-btn class="mx-5"
                      fab small elevation="5" 
                      color="#E3E3E9" 
                      @click="changeImages(0)">
                    <v-icon dark>
                        mdi-arrow-left
                    </v-icon><br>
                </v-btn>
           </div>
      </v-col>
      <v-col cols="8">
        <div class="car-canvas__car-spacing">
          <h3>No trip data found!</h3>
        </div>
      </v-col>
    </v-row>
    <v-row class="car-canvas__node-container">
      <v-col cols="12">
        <div class="car-canvas__common-box-wrapper">
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  data(){
    return{
      lastBatchNo: "",
      lastTripRefId: ""
    }
  },
    computed: {
        tripAnglePhotos() {
            return this.$store.state.trips.photos;
        }
    },
    methods: {
        changeImages(direction) {
            if(this.tripAnglePhotos.length > 0) {
                this.getPhotoBatch({
                    batchNo: this.tripAnglePhotos[0].batchNo,
                    direction,
                    tripId: this.tripAnglePhotos[0].tripRefId
                });
                
                // Store the last BatchNo and RefId
                this.lastBatchNo = this.tripAnglePhotos[0].batchNo;
                this.lastTripRefId = this.tripAnglePhotos[0].tripRefId;
            }else{
              this.getPhotoBatch({
                    batchNo: this.lastBatchNo,
                    direction,
                    tripId: this.lastTripRefId
                });
            }
        },
        ...mapActions({
            getPhotoBatch: 'trips/getPhotoBatch'
        }),
    }
}
</script>