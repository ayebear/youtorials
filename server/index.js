var { graphql, buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require('graphql')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const db = require('monk')('localhost/youtorials')
const tutorials = db.get('tutorials')

/*
	List items in a group, which can contain other groups and tutorials
	View tutorials
	Save tutorials
	Delete tutorials
*/

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
	type Tutorial {
		title: String
		author: String
		content: String
	}
	type Query {
		hello(name: String): String
		list: [Tutorial]
		get(author: String): Tutorial
	}
`)

// The root provides a resolver function for each API endpoint
var root = {
	hello: (args) => {
		return `Hello ${args.name}!`
	},
	list: () => {

	},
	get: (args) => {
		return tutorials.findOne({ author: args.author }).then(result => {
			return result
		})
	}
}

// Run the GraphQL query '{ hello }' and print out the response
graphql(schema, '{ get(author: "Kevin") {author, title, content} }', root).then((response) => {
	console.log(response)
})



// Database testing
// tutorials.insert(new Tutorial("JavaScript ES6", "Eric", "Some JS content here"))
// tutorials.insert(new Tutorial("C++17", "Kevin", "Some C++ content here"))

// tutorials.findOne({ author: 'Kevin' }).then(result => {
// 	console.log(result)
// })



const app = express()

app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: false
}))

app.listen(4000)
