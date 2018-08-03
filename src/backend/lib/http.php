<?php

namespace app;

define('HTTP', [
  'accept' => $_SERVER['HTTP_ACCEPT'] ?? 'text/html',
  'method' => $_SERVER['REQUEST_METHOD'] ?? 'GET',
  'path'   => $_SERVER['PATH_INFO'] ?? '/',
]);

function error(int $code): void
{
  http_response_code($code);
  json([
    'error' => TRUE,
  ]);
  exit(1);
}
