const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require('graphql')
const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)

const developerKey = 'Kxhb7RoqJiw4V0ZrLOnQ'

const fetchAuthor = id =>
fetch(`https://www.goodreads.com/author/show.xml?id=${id}&key=${developerKey}`)
.then(response => response.text())
.then(parseXML)


const BookType = new GraphQLObjectType({
  name: 'Book',
  description: '...',

  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: (xml) => xml.title[0]
    },
    isbn: {
      type: GraphQLString,
      resolve: (xml) => xml.isbn13[0]
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: '...',

  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: xml => xml.GoodreadsResponse.author[0].name[0]
    },
     books: {
      type: new GraphQLList(BookType),
      resolve: xml => xml.GoodreadsResponse.author[0].books[0].book
    }
  })
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLInt } // 152889
        },
        resolve: (root, args) => fetchAuthor(args.id)
      }
    })
  })
})
