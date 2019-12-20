var glob = require('glob')
var {promisify} = require('util')
var fm = require('frontmatter')
var { readFileSync, statSync } = require('fs')

var { resolve, basename, extname, relative, dirname, sep } = require('path')


module.exports.transform = async ({archetypesDir = 'archetypes', extension = 'md'}, posts) => { 
    const archetypes = await getArchetypes(archetypesDir, extension)

    console.log("archetypes")
    console.log(archetypes)

    const transformed = posts
        .map(withArchetype(archetypes))

    console.log("transformed")
    console.log(transformed)

    return transformed
}

const getArchetypes = async (dir, extension) => {
    const files = await promisify(glob)(`${dir}/**/*.${extension}`, { root: process.cwd() })

    return files
        .map(file => readFileSync(file, 'utf-8'))
        .map(fm)
        .map(addArchetype(files))
        .map(addName)
}

const addArchetype = (paths) => (value, idx) => {
    const { data } = value
    return { ...value, data: { ...data, _archetype: paths[idx] } }
  }

  const addName = (value) => {
    const { data } = value
    return { ...value, data: { ...data, name: createArchetypeName({ ...data }) } }
  }

  const extractFileName = (path) => basename(path, extname(path))


  const createArchetypeName = ({ _archetype }) => {
    const name = extractFileName(_archetype)
    //const match = name.match(DATE_IN_FILE_REGEX)

    return name
}


const withArchetype = (archetypes) => (post) => {
    const archetype = archetypes.filter(arch => arch.name === post.category)[0]

    console.log("post", post)
    console.log("found archetype: ", archetype)

    const data = {
        ...post.data,
        ...archetype.data
    }

    console.log("data")
    console.log(data)

    return {...post, data}
}