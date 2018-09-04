<?php

namespace app\schema;

use function app\{config, dump};

define('DEFAULT_FIELD_TYPE', 'text');
define('VALID_FIELD_TYPES', [
  'text',
  'email',
  'slug',
]);
define('RESERVED_COLLECTION_NAMES', [
  'cache',
  'login',
  'logout',
  'settings',
  'store',
  'trash',
  'users',
]);
define('RESERVED_FIELD_NAMES', [
  'id',
  'created',
  'updated',
  'published',
]);

function get_schema() {
  static $schema;
  if (!$schema) {
    $schema = parse_schema(config()['schema']);
  }
  return $schema;
}

function get_collections() {
  return get_schema()['collections'];
}

function parse_schema($schema) {
  $schema['collections'] = parse_collections($schema['collections']);
  return $schema;
}

function parse_collections($collections) {
  $res = [];
  foreach ($collections as $name => $props) {
    // name
    if (!is_string($name)) {
      throw new \Exception('schema: collection name not defined');
    } elseif (!preg_match('/^[a-z]+$/', $name)) {
      throw new \Exception('schema: invalid collection name: ' . $name);
    } elseif (in_array($name, RESERVED_COLLECTION_NAMES)) {
      throw new \Exception("schema: collection name is reserved: ${name}");
    }
    // props
    if (!is_array($props)) {
      throw new \Exception('schema: invalid collection definition: ' . $name);
    }
    // name
    if (isset($props['name'])) {
      throw new \Exception('schema: invalid collection property: name');
    }
    $props['name'] = $name;
    // caption
    if (empty($props['caption'])) {
      $props['caption'] = humanize($name);
    }
    // fields
    $props['fields'] = parse_fields($props['fields'], $name);
    // assign
    $res[$name] = $props;
  }
  return $res;
}

function parse_fields($fields, $collection_name) {
  $res = [];
  foreach ($fields as $name => $props) {
    // name
    if (!is_string($name)) {
      throw new \Exception("schema: field name not defined: ${collection_name}");
    } elseif (!preg_match('/^[a-z]+$/', $name)) {
      throw new \Exception("schema: invalid field name: ${name} (in collection ${collection_name})");
    }
    // props
    if (is_string($props)) {
      $props = [ 'type' => $props ];
    } if (is_bool($props)) {
      $props = [ 'required' => $props ];
    } elseif (!is_array($props)) {
      throw new \Exception("schema: invalid field definition: ${name} (in collection ${collection_name})");
    }
    // name
    if (isset($props['name'])) {
      throw new \Exception("schema: invalid field property: name (${name} in collection ${collection_name})");
    }
    if (in_array($name, RESERVED_FIELD_NAMES)) {
      throw new \Exception("schema: field name is reserved: ${name} (in collection ${collection_name})");
    }
    $props['name'] = $name;
    // type
    if (empty($props['type'])) {
      $props['type'] = DEFAULT_FIELD_TYPE;
    }
    // type: validity
    if (!in_array($props['type'], VALID_FIELD_TYPES)) {
      throw new \Exception('schema: invalid field type: ' . $props['type']);
    }
    // label
    if (empty($props['label'])) {
      $props['label'] = humanize($name);
    }
    // assign
    $res[$name] = array_filter($props);
  }
  return $res;
}
