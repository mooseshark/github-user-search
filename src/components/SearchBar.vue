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
import gql from 'graphql-tag';

// const INITIAL_LAST = gql`
//   query getUsers ($searchTerm: String!, $recordsToReturn: Int!) {
//     search(query: $searchTerm, type: USER, first: $recordsToReturn) {
//       nodes {
//         ... on User {
//           login
//         }
//       }
//       pageInfo {
//         hasNextPage
//         startCursor
//         endCursor
//       }
//     }
//   }`;

const INITIAL_LAST = gql`
  query getUsers ($searchTerm: String!, $recordsToReturn: Int!) {
  pageInfoSearch: search (query: $searchTerm, type: USER, first: $recordsToReturn) {
    lastPageInfo: pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
  }
}`;


const DETERMINE_LAST = gql`
  query getUsers ($searchTerm: String!, $recordsToReturn: Int! $cursorNext: String!) {
    pageInfoSearch: search(query: $searchTerm, type: USER, first: $recordsToReturn, after: $cursorNext) {
      lastPageInfo: pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }`;

export default {
  name: 'SearchBar',
  apollo: {
    pageInfoSearch: {
      query: INITIAL_LAST,
      variables: {
        searchTerm: '',
        recordsToReturn: 10
      },
      error(error) {
        this.error = JSON.stringify(error.message);
      }
    }
  },
  data: function() {
    return {
      pageInfoSearch: [],
      searchTerm: '',
      hasNextPage: false,
      isLoading: false,
      endCursor: ''
    }
  },
  computed: {
    captureSearchTerm: function () {
      return this.searchTerm;
    },
    captureSearchResults: function () {
      return this.search;
    },
  },
  watch: {
    pageInfoSearch: function(val){
      console.log(val.lastPageInfo.hasNextPage);

      if(val.lastPageInfo.hasNextPage){
        this.endCursor = val.lastPageInfo.endCursor;

        this.$apollo.queries.pageInfoSearch.fetchMore({
          query: DETERMINE_LAST,
          variables: {
            searchTerm: this.searchTerm,
            recordsToReturn: 10,
            cursorNext: this.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newPageInfo = fetchMoreResult.pageInfoSearch.lastPageInfo;

            return {
              pageInfoSearch: {
                __typename: previousResult.pageInfoSearch.__typename,
                lastPageInfo: newPageInfo,
              },
            }
          },
        });
        this.endCursor = val.lastPageInfo.endCursor;
      // } else{
      //   this.$emit('findLast', event);
      }
      console.log(this.endCursor)
    }
  },
  methods: {
    onSearch: function (event) {
      this.$apollo.queries.pageInfoSearch.refetch({
        searchTerm: event,
        recordsToReturn: 10
      });

      this.$emit('onSearch', event);
    },
  }
}
</script>
