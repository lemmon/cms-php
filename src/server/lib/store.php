<?php

namespace app\store;

use function app\{config, id, error, dump};

define('ROOT', config()['store']);
define('ENTRY_FILE', '%s/entry-%s.json');

function create(string $collection, array $_data): array
{
  validate_data($_data);
  $id = id();
  $file = get_file($collection, $id);
  $data = array_filter_recursive(array_replace([
    'id' => $id,
  ], $_data, [
    'created' => microtime(TRUE),
  ]));
  $success = file_put_contents($file, json_encode($data));
  return [
    'success' => $success ? TRUE : FALSE,
  ];
}

function read(string $collection, string $id)
{
  return [
    'data' => read_file(get_file($collection, $id)),
  ];
}

function read_file(string $file)
{
  return file_exists($file)
    ? json_decode(file_get_contents($file), TRUE)
    : NULL
    ;
}

function read_many(string $collection): array
{
  return [
    'data' => array_map(__NAMESPACE__ . '\read_file', glob(sprintf(ENTRY_FILE
      , get_dir($collection)
      , '*'
    ))),
  ];
}

function update(string $collection, string $id, array $_data)
{
  $file = get_file($collection, $id);
  if (!file_exists($file)) {
    error(400, 'Entry not found');
  }
  $data_update = validate_data($_data);
  $data_current = read_file($file);
  $data = array_filter_recursive(array_replace($data_current, $data_update, [
    'updated' => microtime(TRUE),
  ]));
  $success = file_put_contents($file, json_encode($data));
  return [
    'success' => $success ? TRUE : FALSE,
  ];
}

function delete(string $collection, string $id): bool
{
  $file = get_file($collection, $id);
  if (!file_exists($file)) {
    error(400, 'Entry not found');
  }
  return rename($file, sprintf('%s/%s-%s.json'
    , get_dir('trash')
    , $collection
    , $id
  ));
}

function get_dir(string $collection): string
{
  $dir = sprintf('%s/%s'
    , ROOT
    , $collection
  );
  // create directory
  if (!is_dir($dir) and !mkdir($dir, 0777, TRUE)) {
    throw new \Exception('Could not create collection directory');
  }
  //
  return $dir;
}

function get_file(string $collection, string $id): string
{
  return sprintf(ENTRY_FILE
    , get_dir($collection)
    , $id
  );
}

function validate_data(array $data): array
{
  foreach ([
    'id',
    'created',
    'updated',
  ] as $param) {
    if (isset($data[$param])) {
      error(400, 'Property not allowed: ' . $param);
    }
  }
  return $data;
}
