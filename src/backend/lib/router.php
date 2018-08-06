<?php

namespace app;

function router($routes, $default)
{
  // match route
  foreach ($routes as $route) {
    if (
      $route[0] === HTTP['method']
      and preg_match('#^' . path_to_regex($route[1]) . '$#', HTTP['path'], $matches)
      and $route[2]($matches) !== FALSE
    ) {
      return TRUE;
    }
  }
  // default route
  $default();
}

function path_to_regex($path)
{
  $path = preg_replace_callback('#:(\w+)#', function ($m) {
    return "(?P<${m[1]}>[\w\-]+)";
  }, $path);
  $path = strtr($path, [
    '**/' => '(.*/)?',
    '**'  => '.*',
    '*'   => '[^/]+',
    '.'   => '\.',
  ]);
  return $path;
}
