<?php

namespace app;

function router($routes, $default)
{
  // match route
  foreach ($routes as $route) {
    if (
      $route[0] === HTTP['method']
      and preg_match('#' . path_to_regex($route[1]) . '#', HTTP['path'])
      and $route[2]() !== FALSE
    ) {
      return TRUE;
    }
  }
  // default route
  $default();
}

function path_to_regex($path)
{
  return strtr($path, [
    '**/' => '(.*/)?',
    '**'  => '.*',
    '*'   => '[^/]+',
    '.'   => '\.',
  ]);
}
