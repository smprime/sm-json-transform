import * as changeCase from 'change-case'
import * as generate from 'generate-schema'
import * as glob from 'glob'
import * as gulp from 'gulp'
import * as clean from 'gulp-clean'
import * as conflict from 'gulp-conflict'
import * as rename from 'gulp-rename'
import { compile } from 'json-schema-to-typescript'
import * as path from 'path'
import * as stringify from 'stringify-object'
import * as through from 'through2'
import * as transform from 'transform-json-types'

const paths = {
    files: ['src/schemas/*.js*'],
    dest: ['dist/'],
    modsrc: ['src/models'],
    mysqlsrc: ['src/mysql'],
    jsonsrc: ['src/jsonSchema'],
    tssrc: ['src/interfaces'],
    iosrc: ['src/types'],
    src: ['src/']
}

const checkFileError = file => {
    if (file.isNull()) {
        return file
    }
    if (file.isStream()) {
        return 'Streams not supported!!'
    }

    return null
}
const TransformJsonSchema = () =>
    through.obj(async (file, encoding, callback) => {

        let {name, ext} = path.parse(file.path)
        let schemaName = changeCase.camel(name + 'JSON')
        let fileData = generate.json(JSON.parse(file.contents.toString()))

        let str = `// this file is generated by the build process ${new Date() + ''} \n\n`
        str += `const ${schemaName} = ${stringify(fileData)} \n\n`
        str += `module.exports = ${schemaName};`

        file.contents = Buffer.from(str)
        callback(checkFileError(file), file)
    })
const TransformJsonTs = () =>
    through.obj(async (file, encoding, callback) => {

        let {name, ext} = path.parse(file.path)
        let fileData = generate.json(JSON.parse(file.contents.toString()))
        let ts = await compile(fileData, changeCase.pascalCase(name))

        file.contents = Buffer.from(ts.toString())
        callback(checkFileError(file), file)
    })
const TransformJsonIoTs = () =>
    through.obj(async (file, encoding, callback) => {

        let type = await transform(JSON.parse(file.contents.toString()), {lang: 'io-ts'})
        let str = `// this file is generated by the build process ${new Date() + ''} \n\n`
        str += `// @ts-ignore\n`;
        str += `const t = require('io-ts');\n\n`;
        str += `// @ts-ignore\n`;
        str += `${type.toString()}\n`;
        str += `// @ts-ignore\n`;
        str += `module.exports = RootInterface;\n`

        file.contents = Buffer.from(str)
        callback(checkFileError(file), file)
    })

const TransformJsonMysql = () =>
    through.obj(async (file, encoding, callback) => {
        let content = JSON.parse(file.contents.toString())
        let fileData = await generate.mysql(content)

        file.contents = Buffer.from(fileData.toString())
        callback(checkFileError(file), file)
    })

const TransformJsonModels = () =>
    through.obj(async (file, encoding, callback) => {

        let content = JSON.parse(file.contents.toString())

        let {name, ext} = path.parse(file.path)
        let schemaName = changeCase.camel(name + 'Schema')
        let refName = changeCase.snakeCase(name)
        let fileData = await generate.mongoose(content)
        let schema = stringify(fileData)
        console.log('coding - >', changeCase.pascalCase(name))
        let str = `const mongoose = require('mongoose');\n`
        str += `const { Schema } = mongoose;\n`
        str += `const { ObjectId } = Schema.Types;\n\n`
        str += `const ${schemaName} = Schema(${schema}) \n\n`
        str += `module.exports = mongoose.model('${refName}', ${schemaName}, '${refName}');`

        file.contents = Buffer.from(str)
        callback(checkFileError(file), file)
    })

const GenerateIndices = () =>
    through.obj(async (file, encoding, callback) => {
        const fileSpec = file.path + '/*'
        file.path += '/index.js'
        const exportNames: string[] = []
        const files = glob.sync(fileSpec)
        const dash = /-/

        let str = `// this file is generated by the build process ${new Date() + ''} \n\n`
        files.forEach(f => {
            let {name, ext} = path.parse(f)
            if (name === 'index' && ext === '.js') {
                return
            }
            const rname = dash.test(name) ? changeCase.pascalCase(name) : name
            exportNames.push(rname)
            if (ext !== '.js') {
                name = `${name}${ext}`
            }
            str += `const ${rname} = require('./${name}');\n`
        })
        str += `\n\nmodule.exports = {\n    ${exportNames.join(',\n    ')} \n};\n\n`
        file.contents = new Buffer(str)
        callback(checkFileError(file), file)
    })

const GenerateOperations =  () => {
    return through.obj( async (file, encoding, callback) => {
        const fileSpec   = file.path + '/*'
        file.path  += '/../model.js'
        const exportNames: string[] = []
        const files = glob.sync(fileSpec)
        const dash = /-/

        let str = `// this file is generated by the build process ${new Date() + ''} \n\n`
        str += `const mongoose = require('mongoose');\n`
        str += `const fs = require('fs');\n`
        str += `const path = require('path');\n`
        str += `const types = require('./types');\n`
        str += `const jsonSchema = require('./jsonSchema');\n`
        str += `const configData = fs.readFileSync(path.resolve(__dirname, '../../lib/config/config.json'));\n`
        str += `const config = JSON.parse(configData);\n`
        str += `mongoose.connect(config.mongodbConnection);\n\n`
        str += `const model = {};\n\n`
        files.forEach( f => {
            let { name, ext } = path.parse(f)
            if ( name === 'index' && ext === '.js' ) {
                return
            }
            const rname = dash.test(name) ? changeCase.pascalCase(name) : name
            exportNames.push(rname)
            str += `model.${rname} = require('./models/${rname}');\n`
        })
        str += `\n\nexports.model = model;\n`
        str += `exports.fileSystem = fs;\n`
        str += `exports.types = types;\n`
        str += `exports.mongoose = mongoose;\n`
        str += `exports.jsonSchema = jsonSchema;\n`

        file.contents = new Buffer(str)
        callback(null, file)
    })
}

gulp.task('clean', () => gulp.src(paths.dest, {allowEmpty: true})
    .pipe(clean())
)

gulp.task('post-clean', () => gulp.src(['./src/interfaces', './src/types', './src/jsonSchema', './src/models', './src/mysql'], {allowEmpty: true})
    .pipe(clean())
)

gulp.task('copy', () =>
    gulp.src('./src/**/*')
        .pipe(gulp.dest(paths.dest))
)

gulp.task('json2ts', () =>
    gulp.src(paths.files)
        .pipe(TransformJsonTs())
        .pipe(rename(paths => paths.extname = '.ts'))
        .pipe(gulp.dest(paths.tssrc))
)

gulp.task('json2iots', () =>
    gulp.src(paths.files)
        .pipe(TransformJsonIoTs())
        .pipe(rename(paths => paths.extname = '.ts'))
        .pipe(gulp.dest(paths.iosrc))
)
gulp.task('JsonSchema', () =>
    gulp.src(paths.files)
        .pipe(TransformJsonSchema())
        .pipe(rename(paths => paths.extname = '.js'))
        .pipe(gulp.dest(paths.jsonsrc))
)
gulp.task('json2Mysql', () =>
    gulp.src(paths.files)
        .pipe(TransformJsonMysql())
        .pipe(rename(paths => paths.extname = '.mysql'))
        .pipe(gulp.dest(paths.mysqlsrc))
)
gulp.task('json2Models', () =>
    gulp.src(paths.files)
        .pipe(TransformJsonModels())
        .pipe(rename(paths => paths.extname = '.js'))
        .pipe(gulp.dest(paths.modsrc))
)

gulp.task('generate-indices', () =>
    gulp.src('./src/**/', {base: './src'})
        .pipe(GenerateIndices())
        .pipe(conflict('./dist/**/*'))
        .pipe(gulp.dest(paths.dest))
)
gulp.task('generate-Operations', () =>
    gulp.src('./src/models/', { base: './src' })
        .pipe(GenerateOperations())
        .pipe(conflict('./dist/**/*'))
        .pipe(gulp.dest(paths.dest))
)
gulp.task('default', gulp.series(
    'clean', 'json2ts', 'json2iots',
    'JsonSchema', 'json2Mysql', 'json2Models',
    'copy',  'generate-indices', 'generate-Operations', 'post-clean')
    )
