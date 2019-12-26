import glob from "glob";
import {promisify} from 'util'
import yaml from 'js-yaml'
import {readFileSync} from 'fs'

import {resolve, basename, extname, relative, dirname, sep} from 'path'

export const loadArchetypes = async (dir, extension) => {
    const pattern = `${dir}/**/*.${extension}`
    const files = await promisify(glob)(pattern, {root: process.cwd()})

    return files
        .map(file => readFileSync(file, 'utf-8'))
        .map(fromYaml)
        .map(addArchetype(files))
        .map(addName(dir))
}

export const resolveArchetype = (post, archetypes) => {
    const categoryRanking = []

    var parts = post.data.category.split('/')
    while (parts.length > 0) {
        categoryRanking.push(parts.join('/'))

        parts.pop()
    }

    var archetype = null
    categoryRanking.some(cat => {
        const f = archetypes.filter(arch => arch.name === cat)[0]
        if(f) {
            archetype = f
            return true;
        }
    })
    if(!archetype) {
        archetype = archetypes.filter(arch => arch.name === "index")[0]
    }

    return archetype
}


const fromYaml = (body) => {
    const fields = yaml.safeLoad(body)

    return {fields}
}

const addArchetype = (paths) => (value, idx) => {
    return {...value, _entry: paths[idx]}
}

const addName = (dir) => (value) => {
    const {_entry} = value
    return {...value, name: createArchetypeName(dir, _entry)}
}


const extractFileName = (path) => basename(path, extname(path))

const createArchetypeName = (archetypesDir, _entry) => {
    // return extractFileName(_entry)

    const ext = extname(_entry)

    return _entry
        .replace(archetypesDir+'/', '')
        .replace(ext, '')
}