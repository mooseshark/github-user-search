<template>
    <div class="row justify-content-left" style="margin:0px 10px 0px 0px">
      <div class="col-8 col-md-6 col-lg-4">
        <form class="card card-sm" v-on:submit.prevent>
        <div class="card-body row no-gutters align-items-center">
          <div class="col-auto">
            <i class="fas fa-search h4 text-body"></i>
          </div>
          <div class="col">
            <input
              class="form-control form-control-lg form-control-borderless"
              type="search"
              v-model="searchTerm"
              @keyup.enter="onSearch(searchTerm)"
              placeholder="Search Users"
            >
          </div>
          <div class="col-auto" style="padding-left:10px;">
            <button
              class="btn btn-lg btn-info"
              type="button"
              value="Search"
              @click="onSearch(searchTerm)">
              Search
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data: function() {
    return {
      searchTerm: ''
    }
  },
  computed: {
    captureSearchTerm: function () {
      return this.searchTerm;
    }
  },
  methods: {

    onSearch: function (event) {
      this.$emit('onSearch', event);
    },
  }
}
</script>
