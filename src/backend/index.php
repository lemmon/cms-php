<?php

namespace app;

require __DIR__ . '/lib/config.php';
require __DIR__ . '/lib/debug.php';
require __DIR__ . '/lib/http.php';
require __DIR__ . '/lib/id.php';
require __DIR__ . '/lib/json.php';
require __DIR__ . '/lib/router.php';
require __DIR__ . '/lib/store.php';

router([
  // schema
  ['GET', '/schema.json', function () {
    json([
      'schema' => parse_schema(config()['schema']),
    ]);
  }],
  // read collection
  ['GET', '/:name.json', function ($m) {
    json(store\read_many($m['name']));
  }],
  // read entry
  ['GET', '/:name/:id.json', function ($m) {
    json(store\read($m['name'], $m['id']));
  }],
  // create entry
  ['POST', '/:name', function ($m) {
    $data = json_decode(file_get_contents('php://input'), TRUE);
    json([
      'success' => TRUE,
      'data' => store\create($m['name'], $data),
    ]);
  }],
  // update entry
  ['POST', '/:name/:id', function ($m) {
    $data = json_decode(file_get_contents('php://input'), TRUE);
    json([
      'success' => TRUE,
      'data' => store\update($m['name'], $m['id'], $data),
    ]);
  }],
  // delete entry
  ['DELETE', '/:name/:id', function ($m) {
    json([
      'success' => store\delete($m['name'], $m['id']),
    ]);
  }],
  // app
  ['GET', '/**', function () {
    $root = dirname($_SERVER['SCRIPT_NAME']);
    $self = rtrim($_SERVER['SCRIPT_NAME'], '/');
    include __DIR__ . '/index.html.php';
  }],
], function () {
  // error
  error(405);
});
