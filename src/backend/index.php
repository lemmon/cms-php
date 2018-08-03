<?php

namespace app;

require __DIR__ . '/lib/config.php';
require __DIR__ . '/lib/debug.php';
require __DIR__ . '/lib/http.php';
require __DIR__ . '/lib/json.php';
require __DIR__ . '/lib/router.php';

router([
  // schema
  ['GET', '/schema.json', function () {
    json([
      'schema' => parse_schema(config()['schema']),
    ]);
  }],
  // collection
  ['GET', '/*.json', function () {
    json([]);
  }],
  // app
  ['GET', '/**', function () {
    $root = dirname($_SERVER['SCRIPT_NAME']);
    $self = rtrim($_SERVER['SCRIPT_NAME'], '/');
    include __DIR__ . '/index.html';
  }],
], function () {
  // error
  error(400);
});
