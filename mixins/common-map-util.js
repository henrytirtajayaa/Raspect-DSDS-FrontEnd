import {getPrecision} from '../components/utils/utils.js';
import _ from 'lodash';

export default {
    data() {
        return {
            minimizeFields: false
        }
    },
    methods: {
        toggleMinimizeFields() {
            this.minimizeFields = !this.minimizeFields;
            let inputNode = document.getElementsByClassName('geocoder-control')[0];
        
            if(this.minimizeFields) {
                
                inputNode.style.display = 'none'
            } else {
                inputNode.style.display = 'block'
            }
        },
        beforeSearchSignboard(zoomLevel, isInitialLoad = false) {
            let searchCriteria = {
                boundary: {
                    bound: {
                        topLeft: [this.$refs.map.mapObject.getBounds().getNorthWest().lng, this.$refs.map.mapObject.getBounds().getNorthWest().lat],
                        bottomRight: [this.$refs.map.mapObject.getBounds().getSouthEast().lng, this.$refs.map.mapObject.getBounds().getSouthEast().lat]
                    },
                    precision: getPrecision(zoomLevel)
                }
            };
            if(!_.isEmpty(this.filterByTripId)){
                searchCriteria.tripRefId = this.filterByTripId
            }
            if(!_.isEmpty(this.filteringId)){
                searchCriteria.signboardId = this.filteringId
            }
            if(!_.isEmpty(this.filteringFileRef)){
                searchCriteria.fileRef = this.filteringFileRef
            }
            this.searchSignboard({
                ...searchCriteria,
                accessToken: window.localStorage.getItem("accessToken"),
                isInitialLoad
            })
        },
        boundsUpdated(bounds) {
            this.bounds = [
                [bounds._northEast.lat, bounds._northEast.lng],
                [bounds._southWest.lat, bounds._southWest.lng]
            ];
            this.beforeSearchSignboard(this.$refs.map.mapObject._zoom);
        },
        getSignboardLength(marker) {
          return marker && marker.signboardCount ? marker.signboardCount : 0; 
        }
    },
    computed: {
        markersFromStore() {
            return this.$store.state.signboard.markers;
        }
    },
}