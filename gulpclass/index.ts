import * as changeCase from 'change-case'
import * as generate from 'generate-schema'
import * as glob from 'glob'
import {PluginError} from 'gulp-util';
import {compile} from 'json-schema-to-typescript'
import * as path from 'path'
import * as stringify from 'stringify-object'
import * as through from 'through2'
import * as transform from 'transform-json-types'

const PLUGIN_NAME = 'gulp-auto-schema';

export const checkFileError = file => {
    if (file.isNull()) {
        return file
    }
    if (file.isStream()) {
        throw new PluginError(PLUGIN_NAME, 'Streams not supported!!');
    }
    return null
};

export const gulpAutoSchema = (options?) => {

    let reporter;

    const Transform = {
        JsonSchema: (file, enc, callback) => {
            let {name, ext} = path.parse(file.path);
            let schemaName = changeCase.camel(name + 'JSON');
            let fileData = generate.json(JSON.parse(file.contents.toString()));
            let str = `// this file is generated by the build process ${new Date() + ''} \n\n`;
            str += `const ${schemaName} = ${stringify(fileData)} \n\n`;
            str += `module.exports = ${schemaName};`;

            file.contents = Buffer.from(str);
            callback(checkFileError(file), file)
        },
        JsonTs: async (file, enc, callback) => {
            let {name, ext} = path.parse(file.path);
            let fileData = generate.json(JSON.parse(file.contents.toString()));
            let ts = await compile(fileData, changeCase.pascalCase(name));

            file.contents = Buffer.from(ts.toString());
            callback(checkFileError(file), file)
        },
        JsonMysql: async (file, enc, callback) => {
            let content = JSON.parse(file.contents.toString());
            let fileData = await generate.mysql(content);

            file.contents = Buffer.from(fileData.toString());
            callback(checkFileError(file), file)
        },
        JsonModels: async (file, enc, callback) => {
            let content = JSON.parse(file.contents.toString());
            let {name, ext} = path.parse(file.path);
            let schemaName = changeCase.camel(name + 'Schema');
            let refName = changeCase.snakeCase(name);
            let fileData = await generate.mongoose(content);
            let schema = stringify(fileData);
            let str = `const mongoose = require('mongoose');\n`;
            str += `const { Schema } = mongoose;\n`;
            str += `const { ObjectId } = Schema.Types;\n\n`;
            str += `const ${schemaName} = Schema(${schema}) \n\n`;
            str += `module.exports = mongoose.model('${refName}', ${schemaName}, '${refName}');`;
            file.contents = Buffer.from(str);
            callback(checkFileError(file), file)
        },
        JsonIoTs: async (file, enc, callback) => {
            let type = await transform(JSON.parse(file.contents.toString()), {lang: 'io-ts'});
            let str = `// this file is generated by the build process ${new Date() + ''} \n\n`;
            str += `// @ts-ignore\n`;
            str += `const t = require('io-ts');\n\n`;
            str += `// @ts-ignore\n`;
            str += `${type.toString()}\n`;
            str += `// @ts-ignore\n`;
            str += `module.exports = RootInterface;\n`;
            file.contents = Buffer.from(str);
            callback(checkFileError(file), file)
        },
        Indices: async (file, enc, callback) => {
            const fileSpec = file.path + '/*';
            file.path += '/index.js';
            const exportNames: string[] = [];
            const files = glob.sync(fileSpec);
            const dash = /-/;

            let str = `// this file is generated by the build process ${new Date() + ''} \n\n`;
            files.forEach(f => {
                let {name, ext} = path.parse(f);
                if (name === 'index' && ext === '.js') {
                    return
                }
                const rname = dash.test(name) ? changeCase.pascalCase(name) : name;
                exportNames.push(rname);
                if (ext !== '.js') {
                    name = `${name}${ext}`
                }
                str += `const ${rname} = require('./${name}');\n`
            });
            str += `\n\nmodule.exports = {\n    ${exportNames.join(',\n    ')} \n};\n\n`;
            file.contents = new Buffer(str);
            callback(checkFileError(file), file)
        },
        Operations: async (file, encoding, callback) => {
                const fileSpec   = file.path + '/*';
                file.path  += '/../model.js';
                const exportNames: string[] = [];
                const files = glob.sync(fileSpec);
                const dash = /-/;

                let str = `// this file is generated by the build process ${new Date() + ''} \n\n`;
                str += `const mongoose = require('mongoose');\n`;
                str += `const fs = require('fs');\n`;
                str += `const path = require('path');\n`;
                str += `const types = require('./types');\n`;
                str += `const jsonSchema = require('./jsonSchema');\n`;
                str += `const configData = fs.readFileSync(path.resolve(__dirname, '../../lib/config/config.json'));\n`;
                str += `const config = JSON.parse(configData);\n`;
                str += `mongoose.connect(config.mongodbConnection);\n\n`;
                str += `const model = {};\n\n`;
                files.forEach( f => {
                    let { name, ext } = path.parse(f);
                    if ( name === 'index' && ext === '.js' ) {
                        return
                    }
                    const rname = dash.test(name) ? changeCase.pascalCase(name) : name;
                    exportNames.push(rname);
                    str += `model.${rname} = require('./models/${rname}');\n`
                });
                str += `\n\nexports.model = model;\n`;
                str += `exports.fileSystem = fs;\n`;
                str += `exports.types = types;\n`;
                str += `exports.mongoose = mongoose;\n`;
                str += `exports.jsonSchema = jsonSchema;\n`;

                file.contents = new Buffer(str);
                callback(null, file);
        },
        Tests: async (file, encoding, callback) => {

            let {name, ext} = path.parse(file.path);
            let refName = changeCase.snakeCase(name);
            console.log('coding - >', changeCase.pascalCase(name));
            let str = `import test from 'ava';\n`;
            str += `import http from 'ava-http';\n`;
            str += `// import { GlobalStatus } from '../services/globals';\n`;
            str += `// const globalStatus = new GlobalStatus();\n`;
            str += `// const types = require('../types');\n`;
            str += `const schemas = require('../schemas');\n\n\n`;

            str += `test('TypeGuard should match data', async t => {\n`
            str += `    // t.assert(typeof schemas['${name}'] === 'object');\n`
            str += `   //  const dataCheck = globalStatus.validateJsonData(types['${name}'], schemas['${name}']);\n`
            str += `   //  t.true(dataCheck)\n`
            str += `    t.pass()\n`
            str += `});\n\n`

            str += `test('Call to route should succeed', async t => {\n`;
            str += `    const res = await http.get('http://localhost/${refName}');\n`;
            str += `    t.true(typeof res === 'object'); \n`;
            str += `    t.deepEqual(res, {expected: 'output'});\n`;
            str += `});\n\n`

            str += `test('Post json object, assert status', async t => {\n`;
            str += `const body = schemas.${name}\n`;
            str += `const res = await http.postResponse('http://localhost/', {body})\n`;
            str += `    t.is(res.statusCode, 201);\n`;
            str += `    t.deepEqual(res.response.body, {expected: 'output'});\n`;
            str += `});\n`

            file.contents = Buffer.from(str);
            callback(checkFileError(file), file)
        }
    };

    return through.obj(Transform[options]);
};
