<?php

namespace admin;

route([
  // schema
  ['GET', '/schema.json', function () {
    json([
      'schema' => parse_schema(config()['schema']),
    ]);
  }],
], function () {
  // index.html
  $root = dirname($_SERVER['SCRIPT_NAME']);
  $self = rtrim($_SERVER['SCRIPT_NAME'], '/');
  include __DIR__ . '/index.html';
});

function parse_schema($schema) {
  foreach ($schema as $type => &$section) {
    foreach ($section as &$props) {
      #$props['__belongsTo'] = $type;
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

function dump($data)
{
  echo '<pre>' . print_r($data, TRUE) . '</pre>';
}

function json($data = NULL)
{
  header('Content-type: application/json; charset=utf-8');
  echo json_encode($data, JSON_PRETTY_PRINT);
}

function route($routes, $default)
{
  $path = $_SERVER['PATH_INFO'] ?? '/';
  // match route
  foreach ($routes as $route) {
    if ($route[1] === $path) {
      return $route[2]();
    }
  }
  // default route
  $default();
}

function config()
{
  static $config;
  if (!$config) {
    $config = include getcwd() . '/admin.config.php';
  }
  return $config;
}
