import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const books = [
  {
    id:1,
    title: 'The Awakening',
    author: 'Kate Chopin',
    category: ["ACTION"],
    type:"EBook",
    format:"PDF"
  },
  {
    id:2,
    title: 'City of Glass',
    author: 'Paul Auster',
    category: ["FANTASY","ACTION"],
    type:"Audiobook",
    duration: 60
  }
];

const typeDefs = `#graphql

  interface IBook {
    id: ID
    title: String!
    author: String!
    category: [Category]!
    type: String
  }

  union BooksUnion = EBook | Audiobook 

  enum Category {
    HORROR
    FANTASY
    ACTION
  }

  input BookInput {
    title: String!
    author: String!
    category: [Category]!
    type: String
  } 

  type EBook implements IBook {
    id: ID
    title: String!
    author: String!
    category: [Category]!
    type: String!
    format: String!
  }

  type Audiobook implements IBook {
    id: ID
    title: String!
    author: String!
    category: [Category]!
    type: String!
    duration: Int!
  }

  type Query {
    getBooks: [BooksUnion]!
    getBook(id: Int!):BooksUnion,
    getBooksByType(typeBook:String!): [IBook]
  }

  type Mutation {
    createBook( book:BookInput! ): IBook
  }

`;

const resolvers = {
  BooksUnion: {
    __resolveType(obj){
      if(obj.type === "EBook") return "EBook";
      if(obj.type === "Audiobook") return "Audiobook";
      return null
    }
  },
  IBook: {
    __resolveType(obj){
      if(obj.type === "EBook") return "EBook";
      if(obj.type === "Audiobook") return "Audiobook";
      return null
    }
  },
  Query: {
    getBooks: () => books,
    getBook:(_, { id }) => {  
      return books.find(book => book.id === id) || null
    },
    getBooksByType(_, { typeBook }){
      return books.filter(b => b.type === typeBook);
    }    
  },
  Mutation: {
    createBook:(_, { book }) => {
      let new_book;

      if(book.type === "EBook"){
        new_book = {
          type:"Ebook",
          id: books.length + 1,
          format:"PDF",
          ...book
        }
      }else if(book.type === "Audiobook"){
        new_book = {
          type:"Audiobook",
          id: books.length + 1,
          duration:60,
          ...book
        }
      }else {
        throw new Error("Error")
      }
      books.push(new_book);
      return new_book;
    }
  }


};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);