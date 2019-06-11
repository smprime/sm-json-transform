# sm-json-transform
Gulp JSON Transformations

> Compiles json schema to Mongoose, TS-Interface, MySQL, 

## Example

Schema/${yourSchema}:
```json
{
  "companyId": "54495ad94c934721ede76d90",
  "appId": "54495ad94c934721ede76d90",
  "questionId": "54495ad94c934721ede76d90",
  "adminId": "54495ad94c934721ede76d90",
  "userId": "54495ad94c934721ede76d90",
  "clientId": "54495ad94c934721ede76d90",
  "answer": "Test",
  "key": "test",
  "dateCreated": 1559534398414,
  "dateUpdated": 1559534398414,
  "lastCreatedBy": "Jason",
  "lastUpdatedBy": "Jason"
}

```

Output:
```ts
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userschemaSchema = Schema({
	companyId: {
		type: 'ObjectId'
	},
	appId: {
		type: 'ObjectId'
	},
	questionId: {
		type: 'ObjectId'
	},
	adminId: {
		type: 'ObjectId'
	},
	userId: {
		type: 'ObjectId'
	},
	clientId: {
		type: 'ObjectId'
	},
	answer: {
		type: 'String'
	},
	key: {
		type: 'String'
	},
	dateCreated: {
		type: 'Number'
	},
	dateUpdated: {
		type: 'Number'
	},
	lastCreatedBy: {
		type: 'String'
	},
	lastUpdatedBy: {
		type: 'String'
	}
}) 

module.exports = mongoose.model('userschema', userschemaSchema, 'userschema');
```
... and much, much more!!

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
