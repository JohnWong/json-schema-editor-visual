const JSONPATH_JOIN_CHAR = '.';
let utils = {};
utils.JSONPATH_JOIN_CHAR = JSONPATH_JOIN_CHAR;
utils.lang = 'en_US';
utils.format = [
  { name: 'date-time' },
  { name: 'date' },
  { name: 'email' },
  { name: 'hostname' },
  { name: 'ipv4' },
  { name: 'ipv6' },
  { name: 'uri' }
];
const _ = require('underscore');
utils.SCHEMA_TYPE = ['string', 'number', 'array', 'object', 'boolean', 'integer'];
utils.defaultSchema = {
  string: {
    type: 'string'
  },
  number: {
    type: 'number'
  },
  array: {
    type: 'array',
    items: {
      type: 'string'
    }
  },
  object: {
    type: 'object',
    properties: {}
  },
  boolean: {
    type: 'boolean'
  },
  integer: {
    type: 'integer'
  }
};

// 防抖函数，减少高频触发的函数执行的频率
// 请在 constructor 里使用:

// this.func = debounce(this.func, 400);
utils.debounce = (func, wait) => {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
};

function getData(state, keys) {
  let curState = state;
  for (let i = 0; i < keys.length; i++) {
    curState = curState[keys[i]];
  }
  return curState;
}

utils.getData = getData;

utils.setData = function(state, keys, value) {
  let curState = state;
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]];
  }
  curState[keys[keys.length - 1]] = value;
};

utils.deleteData = function(state, keys) {
  let curState = state;
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]];
  }

  delete curState[keys[keys.length - 1]];
};

utils.getParentKeys = function(keys) {
  if (keys.length === 1) return [];
  let arr = [].concat(keys);
  arr.splice(keys.length - 1, 1);
  return arr;
};

utils.clearSomeFields = function(keys, data) {
  const newData = Object.assign({}, data);
  keys.forEach(key => {
    delete newData[key];
  });
  return newData;
};

function getFieldstitle(data) {
  const requiredtitle = [];
  Object.keys(data).map(title => {
    requiredtitle.push(title);
  });

  return requiredtitle;
}

function handleSchemaRequired(schema, checked) {
  // console.log(schema)
  if (schema.type === 'object') {
    let requiredtitle = getFieldstitle(schema.properties);

    // schema.required = checked ? [].concat(requiredtitle) : [];
    if (checked) {
      schema.required = [].concat(requiredtitle);
    } else {
      delete schema.required;
    }

    handleObject(schema.properties, checked);
  } else if (schema.type === 'array') {
    handleSchemaRequired(schema.items, checked);
  } else {
    return schema;
  }
}

function handleObject(properties, checked) {
  for (var key in properties) {
    if (properties[key].type === 'array' || properties[key].type === 'object')
      handleSchemaRequired(properties[key], checked);
  }
}

utils.handleSchemaRequired = handleSchemaRequired;

function cloneObject(obj) {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      var newArr = [];
      obj.forEach(function(item, index) {
        newArr[index] = cloneObject(item);
      });
      return newArr;
    } else {
      var newObj = {};
      for (var key in obj) {
        newObj[key] = cloneObject(obj[key]);
      }
      return newObj;
    }
  } else {
    return obj;
  }
}

utils.cloneObject = cloneObject;

export default utils;