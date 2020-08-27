<template>
  <ul class="v-datatable-light-pagination">

    <li>
      <button
        :disabled="isActionDisabled('firstPage')"
        class="btn btn-md btn-info"
        @click="loadFirstPage()"
      >
        &lt;&lt;
      </button>
    </li>

    <li>
      <button
        :disabled="isActionDisabled('previousPage')"
        class="btn btn-md btn-info"
        @click="loadPreviousPage(previousCursor[previousCursor.length - 1])"
      >
        &lt;
      </button>
    </li>

    <li>
        <button
          :disabled="isActionDisabled()"
          class="btn btn-md btn-info"
        >
          {{ pageNumber }} of {{ qntPages }}
        </button>
    </li>

    <li>
      <button
        class="btn btn-md btn-info"
        @click="loadNextPage(pageInfo.endCursor)"
      >
        &gt;
      </button>
    </li>

    <li>
      <button
        :disabled="isActionDisabled('lastPage')"
        class="btn btn-md btn-info"
        @click="loadLastPage()"
      >
        &gt;&gt;
      </button>
    </li>
    <li>
      <button
        :disabled="isActionDisabled()"
        class="btn btn-md btn-info"
        style="margin-left:100px;"
      >
        User Count: {{ userCount }}
      </button>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'DataTablePagination',
  props: {
    pageInfo: {
      type: Object,
      default: () => ({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "",
        endCursor: ""
      })
    },
    userCount: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      pageNumber: 1,
      previousCursor: []
    }
  },
  computed: {
    qntPages: function () {
      return this.userCount > 1 ? Math.ceil(this.userCount / 10) : 1;
    },
  },
  methods: {
    loadFirstPage: function () {
      this.pageNumber = 1;
      this.$emit('loadFirstPage');
    },

    loadNextPage: function (event) {
      this.previousCursor.push(this.pageInfo.startCursor);
      this.pageNumber++;
      this.$emit('loadNextPage', event);
    },

    loadPreviousPage: function (event) {
      this.previousCursor.pop();
      this.pageNumber--;
      this.$emit('loadPreviousPage', event);
    },

    loadLastPage: function () {
      this.pageNumber = this.qntPages;
      this.$emit('loadLastPage');
    },

    isActionDisabled: function (action) {
        switch (action) {
          case 'firstPage':
            return !this.pageInfo.hasPreviousPage ? true : false;
          case 'previousPage':
            return !this.pageInfo.hasPreviousPage ? true : false;
          case 'nextPage':
            return !this.pageInfo.hasNextPage ? true : false;
          case 'lastPage':
            return !this.pageInfo.hasNextPage ? true : false;
          default:
            return true;
        }



    },
  }
}
</script>
