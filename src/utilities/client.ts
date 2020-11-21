import { GraphQLClient, gql } from 'graphql-request'
  const graphQLClient = new GraphQLClient('https://graphql.fauna.com/graphql', {
    headers: {
      authorization: 'Bearer fnAD6ytMUxACAlPcTo9Jd7VC_oyQfMNFoO3F1WcB',
    },
  })

  export default graphQLClient