<template>
  <ul class="v-datatable-light-pagination" :class="css.paginaton">

    <li v-if="moveFirstPage">
      <button
        :disabled="isActionDisabled('firstPage')"
        class="btn btn-md btn-info"
        @click="loadFirstPage()"
      >
        &lt;&lt;
      </button>
    </li>

    <li v-if="movePreviousPage">
      <button
        :disabled="isActionDisabled('previousPage')"
        class="btn btn-md btn-info"
        @click="loadPreviousPage(pageInfo.startCursor)"
      >
        &lt;
      </button>
    </li>

    <li>
        <button class="btn btn-md btn-info">
          {{ pageNumber }} of {{ qntPages }}
        </button>
    </li>

    <li v-if="moveNextPage">
      <button
        :disabled="isActionDisabled('nextPage')"
        class="btn btn-md btn-info"
        @click="loadNextPage(pageInfo.endCursor)"
      >
        &gt;
      </button>
    </li>

    <li v-if="moveLastPage">
      <button
        :disabled="isActionDisabled('lastPage')"
        class="btn btn-md btn-info"
        @click="loadLastPage()"
      >
        &gt;&gt;
      </button>
    </li>

  </ul>
</template>

<script>
export default {
  name: 'DataTablePagination',
  props: {
    page: {
      type: Number,
      default: 1
    },
    moveLastPage: {
      type: Boolean,
      default: true
    },
    moveFirstPage: {
      type: Boolean,
      default: true
    },
    moveNextPage: {
      type: Boolean,
      default: true
    },
    movePreviousPage: {
      type: Boolean,
      default: true
    },
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
    },
    css: {
      type: Object,
      default: () => ({
        paginationItem: 'pagination-item',
        moveFirstPage: 'move-first-page',
        movePreviousPage: 'move-previous-page',
        moveNextPage: 'move-next-page',
        moveLastPage: 'move-last-page',
        pageNumber: 'page-number',
        pageBtn: 'page-btn'
      })
    }
  },
  data: function () {
    return {
      currPage: this.page,
      pageNumber: 1
    }
  },
  computed: {
    qntPages: function () {
      return this.userCount > 1 ? Math.ceil(this.userCount / 10) : 1;
    },
  },
  watch: {
    page: function (newPage) {
      this.currPage = newPage
    },
  },
  methods: {
    pageClass: function (currentPage) {
      return this.currPage === currentPage ? `${this.css.paginationItem} selected` : this.css.paginationItem
    },
    changePage: function (pageToMove) {
      if (pageToMove <= this.lastPage && pageToMove >= 1 && pageToMove !== this.currPage) {
        this.$emit('on-update', pageToMove)
      }
    },

    loadFirstPage: function () {
      this.pageNumber = 1;
      this.$emit('loadFirstPage');
    },

    loadNextPage: function (event) {
      this.pageNumber++;
      console.log('Next: ' + event)
      console.log(this.pageInfo);
      this.$emit('loadNextPage', event);
    },

    loadPreviousPage: function (event) {
      this.pageNumber--;
      console.log('Previous: ' + event)
      console.log(this.pageInfo);
      this.$emit('loadPreviousPage', event);
    },

    loadLastPage: function () {
      this.pageNumber = this.qntPages;
      console.log('Last');
      this.$emit('loadLastPage');
    },

    isActionDisabled: function () {

    if(this.pageInfo.hasNextPage && this.pageInfo.hasPreviousPage)
      return false;

    },
    checkCurrentPageExist: function () {
      if (this.qntPages.indexOf(this.currPage) === -1) {
        const nextPage = this.qntPages.length ? this.qntPages.length : 0
        this.$emit('update-current-page', nextPage)
      }
    }
  }
}
</script>
