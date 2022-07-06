import TripData from '~/assets/icons/TripData.vue'
import RecordList from '~/assets/icons/RecordList.vue'
import SurveyArea from '~/assets/icons/SurveyArea.vue'
import PerformanceData from '~/assets/icons/PerformanceData.vue'
import AssignTeam from '~/assets/icons/AssignTeam.vue'
import FindSignboard from '~/assets/icons/FindSignboard.vue'

export default{
	theme: {
		options: {
			customProperties: true,
		},
		dark: false,
		themes: {
			light: {
				primary: '#056694',
				accent: '#ED2939',
				secondary: '#F7B500',
				info: '#4A4A4A',
				warning: '#F8E71C',
				error: '#ED2939',
				success: '#6DD400'
			}
		}
	},
	icons: {
		iconfont: 'mdi',
		values: {
			tripdata:{
				component: TripData,
				props: {
					name: 'tripdata'
				}
			},
			recordlist:{
				component: RecordList,
				props: {
					name: 'recordlist'
				}
			},
			surveyarea:{
				component: SurveyArea,
				props: {
					name: 'surveyarea'
				}
			},
			performancedata:{
				component: PerformanceData,
				props: {
					name: 'performancedata'
				}
			},
			assignteam:{
				component: AssignTeam,
				props: {
					name: 'assignteam'
				}
			},
			findsignboard:{
				component: FindSignboard,
				props: {
					name: 'findsignboard'
				}
			}
		}
	}
}