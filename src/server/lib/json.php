<?php

namespace app;

function json($data = NULL)
{
  header('Content-type: application/json; charset=utf-8');
  echo json_encode($data, JSON_PRETTY_PRINT);
}
