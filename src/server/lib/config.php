<?php

namespace app;

function config()
{
  static $config;
  if (!$config) {
    $config = include __CWD__ . '/garner.config.php';
  }
  return $config;
}
