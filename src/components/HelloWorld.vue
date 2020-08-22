<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>{{ search.login }}</div>

  </div>
</template>

<script>
import gql from 'graphql-tag';

export const GET_MY_TODOS = gql`
  query getMyTodos {
    search(query: "moose", type: USER, first: 10) {
      nodes {
        ... on User {
          id
          login
          email
        }
      }
    }
  }`;

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  apollo: {
    search: {
      // graphql query
      query: GET_MY_TODOS,
      error(error) {
        console.log(error);
        this.error = JSON.stringify(error.message);
      }
    }
  },
  data() {
    return {
      type: "private",
      filterType: "all",
      search: [],
      error: null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
