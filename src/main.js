import Vue from 'vue'
import App from './App.vue'
import DataTable from './components/DataTable'
import Pagination from './components/Pagination'
import SearchBar from './components/SearchBar'

 import VueApollo from "vue-apollo";

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import {IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import introspectionQueryResultData from '../src/fragmentTypes.json';
const fragmentMatcher = new IntrospectionFragmentMatcher({introspectionQueryResultData});

Vue.use(VueApollo);

Vue.config.productionTip = false
const getHeaders = () => {
  const headers = {};
  const token = '';
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return headers;
};

// Create an http link:
const link = new HttpLink({
  uri: 'https://api.github.com/graphql',
  fetch,
  headers: getHeaders()
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    fragmentMatcher,
    addTypename: true

  })
});

const apolloProvider = new VueApollo({
  defaultClient: client,
});

export {
  DataTable,
  Pagination,
  SearchBar
}

new Vue({
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
