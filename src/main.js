import Vue from 'vue'
import App from './App.vue'

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
  // const token = window.localStorage.getItem('apollo-token');
  const token = 'e8158d27f17652e9530c73de0962d1ee560b75c2';
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

new Vue({
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
