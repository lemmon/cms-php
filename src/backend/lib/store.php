<?php

namespace app\store;

use function app\{config, id, error, dump};

define('ROOT', config()['store']);

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
  file_put_contents($file, json_encode($data));
  return $data;
}

function read(string $collection, string $id)
{
  $dir = get_dir($collection);
  return read_file("${dir}/${id}.json");
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
  $dir = get_dir($collection);
  return array_map(__NAMESPACE__ . '\read_file', glob("${dir}/*.json"));
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
  file_put_contents($file, json_encode($data));
  return $data;
}

function delete(string $collection, string $id): bool
{
  $file = get_file($collection, $id);
  if (!file_exists($file)) {
    error(400, 'Entry not found');
  }
  return unlink($file);
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
  $dir = get_dir($collection);
  return "${dir}/${id}.json";
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
