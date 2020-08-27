<template>
  <div id="app">
    <h2 class="title"><strong>GitHub User Search</strong></h2>

    <SearchBar
      :user-count="userCount"
      @onSearch="onSearch($event)"
    />
    <!-- Datatable -->
    <DataTable
      :header-fields="headerFields"
      :data="search.nodes || []"
      :user-count="userCount"
      :is-loading="isLoading"
      :css="datatableCss"
      not-found-msg="No Records Found"
      track-by="login"
    >
      <!-- Pagination component as a slot, but could be drag out from Database element -->
      <Pagination
        slot="pagination"
        :page-info="pageInfo"
        :user-count="userCount"
        @loadFirstPage="loadFirstPage"
        @loadNextPage="loadNextPage($event)"
        @loadPreviousPage="loadPreviousPage($event)"
        @loadLastPage="loadLastPage"
      />
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

/* Datatable CSS */
.v-datatable-light .header-item {
  cursor: pointer;
  color: #ffffff;
  background-color: #17a2b8;
  transition: color 0.15s ease-in-out;
}

.v-datatable-light .header-item .th-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  font-weight: bold;
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
  /* END PAGINATION CSS */
</style>

<script>
import Spinner from 'vue-simple-spinner'
import DataTable from '../src/components/DataTable.vue'
import Pagination from '../src/components/Pagination.vue'
import SearchBar from '../src/components/SearchBar.vue'

import gql from 'graphql-tag';

const USER_SEARCH = gql`
  query getUsers ($searchTerm: String!, $recordsToReturn: Int!) {
    search(query: $searchTerm, type: USER, first: $recordsToReturn) {
       nodes {
         ... on User {
           login
           email
           location
           name
           url
           twitterUsername
           websiteUrl
           avatarUrl
           anyPinnableItems
           bioHTML
           companyHTML
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

const USER_SEARCH_NEXT = gql`
  query getUsers ($searchTerm: String!, $recordsToReturn: Int! $cursorNext: String!) {
    search(query: $searchTerm, type: USER, first: $recordsToReturn, after: $cursorNext) {
       nodes {
         ... on User {
           login
           email
           location
           name
           url
           twitterUsername
           websiteUrl
           avatarUrl
           anyPinnableItems
           bioHTML
           companyHTML
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

const USER_SEARCH_PREVIOUS = gql`
  query getUsers ($searchTerm: String!, $recordsToReturn: Int! $cursorPrevious: String!) {
    search(query: $searchTerm, type: USER, first: $recordsToReturn, before: $cursorPrevious)  {
       nodes {
         ... on User @connection(key: "User", filter: ["login"]) {
           login
           email
           location
           name
           url
           twitterUsername
           websiteUrl
           avatarUrl
           anyPinnableItems
           bioHTML
           companyHTML
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

let storedSearchTerm = '';

export default {
  name: 'app',
  components: {
    DataTable,
    Pagination,
    SearchBar,
    Spinner
  },
  apollo: {
    search: {
      query: USER_SEARCH,
      variables: {
        searchTerm: '',
        recordsToReturn: 10
      },
      error(error) {
        this.error = JSON.stringify(error.message);
      }
    }
  },
  data: function () {
    return {
      headerFields: [
        '__slot:avatarUrl',
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
          name: 'bioHTML.html',
          label: 'Bio',
          sortable: false
        },
        {
          name: 'location',
          label: 'Location',
          sortable: true
        },
        {
          name: 'status.status',
          label: 'Status',
          sortable: true
        },
        {
          name: 'email',
          label: 'E-mail',
          sortable: true
        },
        {
          name: 'companyHTML.html',
          label: 'Company',
          sortable: true
        },
        {
          name: 'twitterUsername.twitter',
          label: 'Twitter Handle',
          sortable: true
        },
        {
          name: 'websiteUrl.url',
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
          label: 'Repository Disk Usage',
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
        '__slot:actions'
      ],
      search: [],
      datatableCss: {
        table: 'table table-bordered table-hover table-striped table-center',
        theadTr: 'header-item',
        thWrapper: 'th-wrapper',
        footer: 'footer'
      },
      isLoading: false,
    }
  },
  computed: {
    userCount: function() {
      const userCount = this.search.userCount;
      return userCount ? userCount : 0;
    },
    pageInfo: function() {
      const pageInfo = this.search.pageInfo;
      return pageInfo ? pageInfo : {};
    },
  },
  methods: {
    onSearch: function (searchTerm) {
      storedSearchTerm = searchTerm;
      this.$apollo.queries.search.refetch({
        searchTerm: searchTerm,
        recordsToReturn: 10
     });
    },

    loadFirstPage: function () {
      this.$apollo.queries.search.refetch();
    },

    loadNextPage: function (cursorNext) {
      this.$apollo.queries.search.fetchMore({
        query: USER_SEARCH_NEXT,
        variables: {
          searchTerm: storedSearchTerm,
          recordsToReturn: 10,
          cursorNext: cursorNext
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newNodes = fetchMoreResult.search.nodes;
          const newPageInfo = fetchMoreResult.search.pageInfo;
          const newUserCount = fetchMoreResult.search.userCount;

          return {
            search: {
              __typename: previousResult.search.__typename,
              nodes: newNodes,
              pageInfo: newPageInfo,
              userCount: newUserCount
            },
          }
        },
      })
    },

    loadPreviousPage: function (cursorPrevious) {
      this.$apollo.queries.search.fetchMore({
        query: USER_SEARCH_PREVIOUS,
        variables: {
          searchTerm: storedSearchTerm,
          recordsToReturn: 10,
          cursorPrevious: cursorPrevious
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newNodes = fetchMoreResult.search.nodes;
          const newPageInfo = fetchMoreResult.search.pageInfo;
          const newUserCount = fetchMoreResult.search.userCount;

          return {
            search: {
              __typename: previousResult.search.__typename,
              nodes: newNodes,
              pageInfo: newPageInfo,
              userCount: newUserCount
            },
          }
        },
      })
    },

    loadLastPage: function () {
      console.log('Last Page');

    },
  }
}
</script>
