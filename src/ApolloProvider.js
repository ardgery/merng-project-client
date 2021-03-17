import React from 'react'
import App from './App'
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://quiet-dusk-06833.herokuapp.com/'
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('jwtToken');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)
