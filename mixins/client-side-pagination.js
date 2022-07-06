export default {
	data() {
			return {
				isLoading: false,
				pagination: {
					page: 1,
					itemPerPage: 10,
					total: 0,
					secondPage: 1,
				}
			}
	},
	computed: {
			start() {
				return (this.pagination.page * this.pagination.itemPerPage) - (this.pagination.itemPerPage);
			},
			end(){
				return this.start + this.pagination.itemPerPage - 1;
			},
	},
	methods: {
		resetPagination() {
			this.pagination.page = 1;
		},
		resultsWatcher(result) {
			this.pagination.total = result.length;
      this.isLoading = false;
		},
		tabWatcher(result) {
			[this.pagination.page, this.pagination.secondPage] = [this.pagination.secondPage, this.pagination.page]
			this.pagination.total = result.length;
      this.isLoading = false;
		}
	}
}