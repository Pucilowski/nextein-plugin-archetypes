"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = void 0;

var _archetypes = require("./archetypes");

const transform = async ({
  archetypesDir = 'archetypes',
  extension = 'yml'
}, posts) => {
  const archetypes = await (0, _archetypes.loadArchetypes)(archetypesDir, extension);
  return posts.map(addArchetype(archetypes)).map(applyArchetype(posts));
};

exports.transform = transform;

const addArchetype = archetypes => value => {
  const {
    data
  } = value;
  return { ...value,
    archetype: (0, _archetypes.resolveArchetype)(value, archetypes)
  };
};

const applyArchetype = posts => value => {
  const {
    data,
    archetype
  } = value;
  Object.keys(archetype.fields).forEach(field => {
    const fieldDef = archetype.fields[field];

    if (!data[field] && fieldDef.default) {
      data[field] = fieldDef.default;
    }

    if (field === 'page') {
      data[field] = fieldDef.default;
    }

    if (data[field]) {
      switch (fieldDef.type) {
        case "ref":
          data[field] = data[field].map(postName => {
            const postUrl = `/${fieldDef.category}/${postName}`;
            return posts.find(post => {
              return post.data.url === postUrl;
            });
          });
      }
    }
  });
  return { ...value
  };
};