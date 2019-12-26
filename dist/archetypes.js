"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveArchetype = exports.loadArchetypes = void 0;

var _glob = _interopRequireDefault(require("glob"));

var _util = require("util");

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _fs = require("fs");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const loadArchetypes = async (dir, extension) => {
  const pattern = `${dir}/**/*.${extension}`;
  const files = await (0, _util.promisify)(_glob.default)(pattern, {
    root: process.cwd()
  });
  return files.map(file => (0, _fs.readFileSync)(file, 'utf-8')).map(fromYaml).map(addArchetype(files)).map(addName(dir));
};

exports.loadArchetypes = loadArchetypes;

const resolveArchetype = (post, archetypes) => {
  const categoryRanking = [];
  var parts = post.data.category.split('/');

  while (parts.length > 0) {
    categoryRanking.push(parts.join('/'));
    parts.pop();
  }

  var archetype = null;
  categoryRanking.some(cat => {
    const f = archetypes.filter(arch => arch.name === cat)[0];

    if (f) {
      archetype = f;
      return true;
    }
  });

  if (!archetype) {
    archetype = archetypes.filter(arch => arch.name === "index")[0];
  }

  return archetype;
};

exports.resolveArchetype = resolveArchetype;

const fromYaml = body => {
  const fields = _jsYaml.default.safeLoad(body);

  return {
    fields
  };
};

const addArchetype = paths => (value, idx) => {
  return { ...value,
    _entry: paths[idx]
  };
};

const addName = dir => value => {
  const {
    _entry
  } = value;
  return { ...value,
    name: createArchetypeName(dir, _entry)
  };
};

const extractFileName = path => (0, _path.basename)(path, (0, _path.extname)(path));

const createArchetypeName = (archetypesDir, _entry) => {
  // return extractFileName(_entry)
  const ext = (0, _path.extname)(_entry);
  return _entry.replace(archetypesDir + '/', '').replace(ext, '');
};