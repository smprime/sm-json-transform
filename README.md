# sm-json-transform
Gulp JSON Transformations

> Compiles json schema to Mongoose, TS-Interface, MySQL, 

## Example

Schema/${yourSchema}:
```json
{
  "title": "Example Schema",
  "type": "object",
  "properties": {
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
      "enum": ["black", "brown", "blue"],
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": ["firstName", "lastName"]
}
```

Output:!!!!
```ts
export interface ExampleSchema {
  firstName: string;
  lastName: string;
  /**
   * Age in years
   */
  age?: number;
  hairColor?: "black" | "brown" | "blue";
}
```

## Installation

```sh
# Using Yarn:
yarn add json-schema-to-typescript

# Or, using NPM:
npm install json-schema-to-typescript --save
```

## Usage

```js
import { transform } from 'sm-json-transform'

// compile from file
transform('foo.json')
  .then(ts => fs.writeFileSync('foo.d.ts', ts))

// or, compile a JS object
let mySchema = {
  properties: [...]
}
compile(mySchema, 'MySchema')
  .then(ts => ...)
```


## Build

`npm Gulp`

## Tests

`npm test`
