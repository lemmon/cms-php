<?php

namespace app;

function dump($data)
{
  echo '<pre>' . print_r($data, TRUE) . '</pre>';
}

function error(int $code, $error = NULL): void
{
  http_response_code($code);
  json(array_filter(is_array($error) ? array_replace([
    'error' => TRUE,
  ], $error) : [
    'error' => TRUE,
    'message' => $error,
  ]));
  exit(1);
}

ini_set('display_errors', 0);
//error_reporting(0);

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
  error(500, [
    'message' => $errstr,
    'file' => $errfile,
    'line' => $errline,
  ]);
}, E_ALL);

set_exception_handler(function (\Throwable $e) {
  error(500, [
    'message' => $e->getMessage(),
    'file' => $e->getFile(),
    'line' => $e->getLine(),
  ]);
});

register_shutdown_function(function () {
  if ($err = error_get_last()) {
    error(500, $err['message']);
  }
});
