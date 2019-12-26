// SUT
import {loadArchetypes, resolveArchetype, applyArchetype} from '../src/archetypes'

const p1 = {
    data: {
        category: 'posts/tutorials'
    }
}

describe('archetypes', () => {
    test('loadArchetypes', async () => {
        const archetypes = await loadArchetypes('test/archetypes', 'yml')

        // expect(archs).toEqual([])
    })

    test('resolveArchetype', async () => {
        const archetypes = await loadArchetypes('test/archetypes', 'yml')

        const resolvedArch = resolveArchetype(p1, archetypes)

        expect(resolvedArch.name).toEqual("posts/tutorials")
    })

    test('applyArchetype', async () => {
        const archetypes = applyArchetype('test/archetypes', 'yml')

        const resolvedArch = resolveArchetype(p1, archetypes)

        expect(resolvedArch.name).toEqual("posts/tutorials")
    })
})