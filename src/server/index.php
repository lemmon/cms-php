<?php

namespace app;

require __DIR__ . '/lib/functions.php';

require __DIR__ . '/lib/config.php';
require __DIR__ . '/lib/debug.php';
require __DIR__ . '/lib/http.php';
require __DIR__ . '/lib/id.php';
require __DIR__ . '/lib/json.php';
require __DIR__ . '/lib/router.php';
require __DIR__ . '/lib/schema.php';
require __DIR__ . '/lib/store.php';

define('OPTIONS', array_replace([
  'dir' => __CWD__,
  'build' => time(),
], [
  /*@START@
  'dir' => __DIR__,
  'build' => filemtime(__DIR__),
  @END@*/
]));

router([
  // schema
  ['GET', '/schema.json', function () {
    $schema = schema\get_schema();
    $schema['collections'] = array_values(array_map(function ($coll) {
      $coll['fields'] = array_values($coll['fields']);
      return $coll;
    }, $schema['collections']));
    json($schema);
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
    $input = json_decode(file_get_contents('php://input'), TRUE);
    json(store\create($m['name'], $input['data']));
  }],
  // update entry
  ['POST', '/:name/:id', function ($m) {
    $input = json_decode(file_get_contents('php://input'), TRUE);
    json(store\update($m['name'], $m['id'], $input['data']));
  }],
  // delete entry
  ['DELETE', '/:name/:id', function ($m) {
    json(store\delete($m['name'], $m['id']));
  }],
  // static
  ['GET', '/garner.(\d+).(css|js)', function ($m) {
    $file = OPTIONS['dir'] . "/garner.${m[2]}";
    if (!file_exists($file)) {
      return FALSE;
    }
    switch ($m[2]) {
      case 'css': header('Content-type: text/css; charset=utf-8'); break;
      case 'js': header('Content-type: application/javascript; charset=utf-8'); break;
      default: return FALSE;
    }
    header('Content-Length: ' . filesize($file));
    readfile($file);
  }],
  // info
  ['GET', '/info', function () {
    dump([
      'dir' => __DIR__,
      'cwd' => __CWD__,
      'http' => HTTP,
      'options' => OPTIONS,
      'file_dir' => file_exists(__DIR__ . '/garner.js'),
      'file_cwd' => file_exists(__CWD__ . '/garner.js'),
      '_f' => OPTIONS['dir'] . '/garner.js',
      '_y' => file_exists(OPTIONS['dir'] . '/garner.js'),
    ]);
  }],
  // app
  ['GET', '/**', function () {
    $root = HTTP['root'];
    $build = OPTIONS['build'];
    include __DIR__ . '/template.php';
  }],
], function () {
  // error
  error(405);
});
