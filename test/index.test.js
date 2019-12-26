import {loadArchetypes} from "../src/archetypes";

// SUT
import {transform} from '../src/index'

const posts = [
    {
        data: {
            category: 'posts'
        }
    }
]

describe('nextein-plugin-archetypes', () => {
    test('transform', async () => {
        // const archetypes = await loadArchetypes('test/archetypes', 'yml')

        const options = {
            archetypesDir: 'test/archetypes',
            extension: 'yml'
        }

        const archetyped = await transform(options, posts)

        expect(archetyped).toEqual({})
    })
})