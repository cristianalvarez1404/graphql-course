import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const books = [
  {
    id:1,
    title: 'The Awakening',
    author: 'Kate Chopin',
    category: "HORROR"
  },
  {
    id:2,
    title: 'City of Glass',
    author: 'Paul Auster',
    category: "FANTASY"
  }
];

const typeDefs = `#graphql

  enum Category {
    HORROR
    FANTASY
    ACTION
  }

  type Book {
    id: ID
    title: String
    author: String
    category: Category
  }

  type Query {
    getBooks: [Book]
    getBook(id: Int!):Book
  }

`;

const resolvers = {
  Query: {
    getBooks: () => books,
    getBook:(_, { id }) => {
      if(!id) return null
      return books.find(book => book.id === id) || null
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);