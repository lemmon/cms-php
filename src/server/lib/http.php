<?php

namespace app;

define('HTTP', [
  'accept' => $_SERVER['HTTP_ACCEPT'] ?? 'text/html',
  'method' => $_SERVER['REQUEST_METHOD'] ?? 'GET',
  'root'   => join('/', array_intersect_assoc(explode('/', $_SERVER['REQUEST_URI']), explode('/', $_SERVER['SCRIPT_NAME']))),
  'path'   => $_SERVER['PATH_INFO'] ?? '/',
]);
