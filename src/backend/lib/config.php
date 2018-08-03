<?php

namespace app;

function config()
{
  static $config;
  if (!$config) {
    $config = include getcwd() . '/admin.config.php';
  }
  return $config;
}

function parse_schema($schema) {
  foreach ($schema as $type => &$section) {
    foreach ($section as &$props) {
      $props['fields'] = parse_fields($props['fields']);
    }
  }
  return $schema;
}

function parse_fields($fields) {
  foreach ($fields as $id => &$field) {
    // simple definition
    if (is_string($field)) {
      $field = [ 'name' => $id ];
    }
    // fill in obvious parameters
    elseif (is_array($field)) {
      if (empty($field['name']) and is_string($id)) {
        $field['name'] = $id;
      }
    }
    // default field type
    if (empty($field['type'])) {
      $field['type'] = 'text';
    }
  }
  return array_values($fields);
}
