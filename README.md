# sm-json-transform
Gulp JSON Transformations

> Compiles json schema to Mongoose, TS-Interface, MySQL, 

## Example

Schema/${yourSchema}:
```json
{
  "firstName": {
    "type": "string"
  },
  "lastName": {
    "type": "string"
  },
  "age": {
    "description": "Age in years",
    "type": "integer",
    "minimum": 0
  },
  "hairColor": {
    "enum": [
      "black",
      "brown",
      "blue"
    ],
    "type": "string"
  }
}
```

Output:!!!!
```ts
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ${yourSchema} = Schema({
	firstName: {
		type: {
			type: 'String'
		}
	},
	lastName: {
		type: {
			type: 'String'
		}
	},
	age: {
		description: {
			type: 'String'
		},
		type: {
			type: 'String'
		},
		minimum: {
			type: 'Number'
		}
	},
	hairColor: {
		enum: {
			type: [
				'String'
			]
		},
		type: {
			type: 'String'
		}
	}
}) 

module.exports = mongoose.model(${yourSchema}, ${yourSchema}, ${yourSchema});
```

## Installation

```sh
# Using Yarn:
yarn add sm-json-transform

# Or, using NPM:
npm install sm-json-transform --save
```

## Usage

```js
import { transform } from 'sm-json-transform'

// compile from file
transform()
  

// or, compile a JS object
transform()
```


## Build

`npm run build`

## Tests

`npm run test`
