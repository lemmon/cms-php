<?php

namespace app;

function config()
{
  static $config;
  if (!$config) {
    $config = include getcwd() . '/admin.config.php';
  }
  return $config;
}
