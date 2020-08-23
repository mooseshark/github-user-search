<template>
  <div id="app">
    <h3 class="title">v-Datatable example</h3>
    <!-- Datatable -->
    <DataTable
      :header-fields="headerFields"
      :sort-field="sortField"
      :sort="sort"
      :data="search.nodes || []"
      :is-loading="isLoading"
      :css="datatableCss"
      not-found-msg="Items not found"
      @on-update="dtUpdateSort"
      track-by="login"
    >
     <!-- Action button slot -->
      <input
        slot="actions"
        slot-scope="props"
        type="button"
        class="btn btn-info"
        value="Edit"
        @click="dtEditClick(props)"
      >

      <input type="text" slot="updated:header" value="Custom updated" />

      <span slot="createdHeader">Custom Created</span>

      <!-- Pagination component as a slot, but could be drag out from Database element -->
      <Pagination
        slot="pagination"
        :page="currentPage"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :css="paginationCss"
        @on-update="changePage"
        @update-current-page="updateCurrentPage"
      />

      <!-- ItemsPerPage component as a slot, but could be drag out from Database element -->
      <div class="items-per-page" slot="ItemsPerPage">
        <label>Items per page</label>
        <ItemsPerPageDropdown
          :list-items-per-page="listItemsPerPage"
          :items-per-page="itemsPerPage"
          :css="itemsPerPageCss"
          @on-update="updateItemsPerPage"
        />
      </div>

      <!-- Spinner element as slot used when is-loading attribute is true -->
      <Spinner slot="spinner"/>
    </DataTable>
  </div>
</template>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#app .title {
  margin-bottom: 30px;
}

#app .items-per-page {
  height: 100%;
  display: flex;
  align-items: center;
  color: #337ab7;
}

#app .items-per-page label {
  margin: 0 15px;
}

/* Datatable CSS */

#app .v-datatable-light .header-column-2 {
  color: red;
}

#app .v-datatable-light .header-column-3 {
  color: green;
}

#app .v-datatable-light .header-column-4 {
  color: yellow;
}

#app .v-datatable-light .header-column-5 {
  color: pink;
}

#app .v-datatable-light .header-column-6 {
  color: blueviolet;
}

#app .v-datatable-light .row-2 {
  color: goldenrod;
}

#app .v-datatable-light .row-2 .column-2{
  color: purple;
}

#app .v-datatable-light .row-3 {
  color: silver;
}

#app .v-datatable-light .row-5 .column-1, #app .v-datatable-light .row-5 .column-6 {
  color: rosybrown;
}

#app .v-datatable-light .row-7 .column-4 {
  color: steelblue;
}

#app .v-datatable-light .row-9 .column-5 {
  color: springgreen;
}

#app .v-datatable-light .row-4 {
  color: mediumturquoise;
}

.v-datatable-light .header-item {
  cursor: pointer;
  color: #337ab7;
  transition: color 0.15s ease-in-out;
}

.v-datatable-light .header-item:hover {
  color: #ed9b19;
}

.v-datatable-light .header-item.no-sortable{
  cursor: default;
}
.v-datatable-light .header-item.no-sortable:hover {
  color: #337ab7;
}

.v-datatable-light .header-item .th-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  font-weight: bold;
}

.v-datatable-light .header-item .th-wrapper .arrows-wrapper {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  justify-content: space-between;
}

.v-datatable-light .header-item .th-wrapper .arrows-wrapper.centralized {
  justify-content: center;
}

.v-datatable-light .arrow {
  transition: color 0.15s ease-in-out;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
}

.v-datatable-light .arrow.up {
  border-bottom: 8px solid #337ab7;
}

.v-datatable-light .arrow.up:hover {
  border-bottom: 8px solid #ed9b19;
}

.v-datatable-light .arrow.down {
  border-top: 8px solid #337ab7;
}

.v-datatable-light .arrow.down:hover {
  border-top: 8px solid #ed9b19;
}

.v-datatable-light .footer {
  display: flex;
  justify-content: space-between;
  width: 500px;
}
/* End Datatable CSS */

/* Pagination CSS */
 .v-datatable-light-pagination {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
    width: 300px;
    height: 30px;
  }

  .v-datatable-light-pagination .pagination-item {
    width: 30px;
    margin-right: 5px;
    font-size: 16px;
    transition: color 0.15s ease-in-out;
  }

  .v-datatable-light-pagination .pagination-item.selected {
    color: #ed9b19;
  }

  .v-datatable-light-pagination .pagination-item .page-btn {
    background-color: transparent;
    outline: none;
    border: none;
    color: #337ab7;
    transition: color 0.15s ease-in-out;
  }

  .v-datatable-light-pagination .pagination-item .page-btn:hover {
    color: #ed9b19;
  }

  .v-datatable-light-pagination .pagination-item .page-btn:disabled{
    cursor: not-allowed;
    box-shadow: none;
    opacity: .65;
  }
  /* END PAGINATION CSS */

  /* ITEMS PER PAGE DROPDOWN CSS */
  .item-per-page-dropdown {
    background-color: transparent;
    min-height: 30px;
    border: 1px solid #337ab7;
    border-radius: 5px;
    color: #337ab7;
  }
  .item-per-page-dropdown:hover {
    cursor: pointer;
  }
  /* END ITEMS PER PAGE DROPDOWN CSS */
</style>

<script>
import Spinner from 'vue-simple-spinner'
import DataTable from '../src/components/DataTable.vue'
import ItemsPerPageDropdown from '../src/components/ItemsPerPageDropdown.vue'
import Pagination from '../src/components/Pagination.vue'
import orderBy from 'lodash.orderby'

import gql from 'graphql-tag';

export const USER_SEARCH = gql`
  query getUsers {
    search(query: "moose", type: USER, first: 10) {
       nodes {
         ... on User {
           id
           login
           email
           location
           name
           url
           twitterUsername
           websiteUrl
           avatarUrl
           anyPinnableItems
           bio
           bioHTML
           company
           followers {
             totalCount
           }
           following {
             totalCount
           }
           packages {
             totalCount
           }
           projects {
             totalCount
           }
           repositories {
             totalCount
             totalDiskUsage
           }
           starredRepositories {
             totalCount
           }
           status {
             message
             emojiHTML
           }
           companyHTML
           issues {
             totalCount
           }
         }
       }
       pageInfo {
         hasNextPage
         hasPreviousPage
         startCursor
         endCursor
       }
       userCount
     }
  }`;

const addZero = value => (`0${value}`).slice(-2)

const formatDate = value => {
  if (value) {
    const dt = new Date(value)
    return `${addZero(dt.getDate())}/${addZero(
      dt.getMonth() + 1
    )}/${dt.getFullYear()}`
  }
  return ''
}

const initialData = [];

export default {
  name: 'app',
  components: {
    DataTable,
    ItemsPerPageDropdown,
    Pagination,
    Spinner
  },
  apollo: {
    search: {
      // graphql query
      query: USER_SEARCH,
      error(error) {
        console.log(error);
        this.error = JSON.stringify(error.message);
      }
    }
  },
  data: function () {
    return {
      headerFields: [
        {
          name: 'avatarUrl',
          label: '',
          sortable: false
        },
        {
          name: 'login',
          label: 'Login Name',
          sortable: true
        },
        {
          name: 'name',
          label: 'Name',
          sortable: true
        },
        {
          name: 'bioHTML',
          label: 'Bio',
          sortable: false
        },
        {
          name: 'location',
          label: 'Location',
          sortable: true
        },
        {
          name: 'status',
          label: 'Status',
          sortable: true
        },
        {
          name: 'email',
          label: 'E-mail',
          sortable: true
        },
        {
          name: 'companyHTML',
          label: 'Company',
          sortable: true
        },
        {
          name: 'twitterUsername',
          label: 'Twitter Handle',
          sortable: true
        },
        {
          name: 'websiteUrl',
          label: 'Website',
          sortable: true
        },

        {
          name: 'followers.totalCount',
          label: 'Total Followers',
          sortable: true
        },
        {
          name: 'packages.totalCount',
          label: 'Total Packages',
          sortable: true
        },
        {
          name: 'projects.totalCount',
          label: 'Total Projects',
          sortable: true
        },
        {
          name: 'repositories.totalCount',
          label: 'Total Repositories',
          sortable: true
        },
        {
          name: 'repositories.totalDiskUsage',
          label: 'Total Repositories Disk Usage',
          sortable: true
        },
        {
          name: 'issues.totalCount',
          label: 'Total Issues',
          sortable: true
        },
        {
          name: 'following.totalCount',
          label: 'Total Following',
          sortable: true
        },
        {
          name: 'starredRepositories.totalCount',
          label: 'Total Starred Repositories',
          sortable: true
        },
        {
          name: 'created',
          customHeader: 'createdHeader',
          label: 'Created',
          sortable: true,
          format: formatDate
        },
        '__slot:actions'
      ],
      //data: initialData.slice(0, 10),
      type: "private",
      filterType: "all",
      search: [],
      datatableCss: {
        table: 'table table-bordered table-hover table-striped table-center',
        theadTr: 'header-item',
        thWrapper: 'th-wrapper',
        arrowsWrapper: 'arrows-wrapper',
        arrowUp: 'arrow up',
        arrowDown: 'arrow down',
        footer: 'footer'
      },
      paginationCss: {
        paginationItem: 'pagination-item',
        moveFirstPage: 'move-first-page',
        movePreviousPage: 'move-previous-page',
        moveNextPage: 'move-next-page',
        moveLastPage: 'move-last-page',
        pageBtn: 'page-btn'
      },
      itemsPerPageCss: {
        select: 'item-per-page-dropdown'
      },
      isLoading: false,
      sort: 'asc',
      sortField: 'login',
      listItemsPerPage: [5, 10, 20, 50, 100],
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 16
    }
  },
  methods: {
    dtEditClick: props => alert(`Click props: ${JSON.stringify(props)}`),

    dtUpdateSort: function ({ sortField, sort }) {
      const sortedData = orderBy(initialData, [sortField], [sort])
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = this.currentPage * this.itemsPerPage
      this.data = sortedData.slice(start, end)
    },

    updateItemsPerPage: function (itemsPerPage) {
      this.itemsPerPage = itemsPerPage
      if (itemsPerPage >= initialData.length) {
        this.data = initialData
      } else {
        this.data = initialData.slice(0, itemsPerPage)
      }
    },

    changePage: function (currentPage) {
      this.currentPage = currentPage
      const start = (currentPage - 1) * this.itemsPerPage
      const end = currentPage * this.itemsPerPage
      this.data = initialData.slice(start, end)
    },

    updateCurrentPage: function (currentPage) {
      this.currentPage = currentPage
    }
  }
}
</script>
