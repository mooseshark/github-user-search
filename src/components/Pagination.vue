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

    <li v-for="pageNr in qntPages" :key="pageNr">
        <button
          class="btn btn-md btn-info"
        >
          {{ pageNr }}
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
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
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
      perPage: this.itemsPerPage,
      currPage: this.page
    }
  },
  computed: {
    qntPages: function () {
      const nrPages = this.userCount > 1 ? Math.ceil(this.userCount / 10) : 1;

      if (nrPages > 4) {
        if (this.currPage <= 3) {
          return Array.apply(null, { length: 5 }).map((_, index) => index + 1)
        } else if (this.currPage + 2 >= nrPages) {
          return Array.apply(null, { length: nrPages }).map((_, index) => index + 1).slice(nrPages - 5, nrPages)
        } else {
          return Array.apply(null, { length: nrPages }).map((_, index) => index + 1).slice(this.currPage - 3, this.currPage + 2)
        }
      } else {
        return Array.apply(null, { length: nrPages }).map((_, index) => index + 1)
      }
    },

    lastPage: function () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  watch: {
    page: function (newPage) {
      this.currPage = newPage
    },
    itemsPerPage: function (newItemsPerPage) {
      this.perPage = newItemsPerPage
      this.checkCurrentPageExist()
    }
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
      this.$emit('loadFirstPage');
    },

    loadNextPage: function (event) {
      console.log('Next: ' + event)
      console.log(this.pageInfo);
      this.$emit('loadNextPage', event);
    },

    loadPreviousPage: function (event) {
      console.log('Previous: ' + event)
      console.log(this.pageInfo);
      this.$emit('loadPreviousPage', event);
    },

    loadLastPage: function () {
      console.log('Last');
      this.$emit('loadLastPage');
    },

    isActionDisabled: function () {

    if(this.pageInfo.hasNextPage && this.pageInfo.hasPreviousPage)
      return false;

    //  console.log(this.pageInfo.hasPreviousPage);
    // if(action !== 'test'){
    //   switch (action) {
    //     case 'firstPage':
    //       return this.currPage === 1
    //     case 'previousPage':
    //       return this.currPage === 1
    //     case 'lastPage':
    //       return this.currPage === this.lastPage || !this.totalItems || this.currPage * this.itemsPerPage >= this.totalItems
    //     case 'nextPage':
    //       return this.currPage === this.lastPage || !this.totalItems || this.currPage * this.itemsPerPage >= this.totalItems
    //   }
    // }

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
