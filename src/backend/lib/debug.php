<?php

namespace app;

function dump($data)
{
  echo '<pre>' . print_r($data, TRUE) . '</pre>';
}

function error(int $code, string $message = NULL): void
{
  http_response_code($code);
  json([
    'error' => TRUE,
    'message' => $message,
  ]);
  exit(1);
}

ini_set('display_errors', 0);
//error_reporting(0);

set_error_handler(function ($errno, $errstr) {
  die('_ERROR');
}, E_ALL);

set_exception_handler(function (\Throwable $e) {
  error(500, $e->getMessage());
});

register_shutdown_function(function () {
  if ($err = error_get_last()) {
    error(500, $err['message']);
  }
});
