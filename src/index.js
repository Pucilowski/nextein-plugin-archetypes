import {loadArchetypes, resolveArchetype} from "./archetypes";

export const transform = async ({archetypesDir = 'archetypes', extension = 'yml'}, posts) => {
    const archetypes = await loadArchetypes(archetypesDir, extension)

    return posts
        .map(addArchetype(archetypes))
        .map(applyArchetype(posts))
}

const addArchetype = (archetypes) => (value) => {
    const {data} = value

    return {...value, archetype: resolveArchetype(value, archetypes)}
}

const applyArchetype = (posts) => (value) => {
    const {data, archetype} = value

    Object.keys(archetype.fields).forEach(field => {
        const fieldDef = archetype.fields[field]

        if (!data[field] && fieldDef.default) {
            data[field] = fieldDef.default
        }

        if (field === 'page') {
            data[field] = fieldDef.default
        }

        if (data[field]) {
            switch (fieldDef.type) {
                case "ref":
                    data[field] = data[field].map(postName => {
                        const postUrl = `/${fieldDef.category}/${postName}`

                        return posts.find(post => {
                            return post.data.url === postUrl
                        })
                    })
            }
        }
    })

    return {...value}
}