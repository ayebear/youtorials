var { graphql, buildSchema } = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');


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
	}
`);

class Tutorial {
	constructor(title, author, content) {
		this.title = title
		this.author = author
		this.content = content
	}
}

// The root provides a resolver function for each API endpoint
var root = {
	hello: (args) => {
		return `Hello ${args.name}!`;
	},
	list: () => {
		return [
			new Tutorial("JavaScript ES6", "Eric", "Some JS content here"),
			new Tutorial("C++17", "Kevin", "Some C++ content here")
		]
	}
};

// Run the GraphQL query '{ hello }' and print out the response
graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
});




const app = express();

app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true
}));

app.listen(4000);
