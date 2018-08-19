<?php

function array_filter_recursive(array $arr): array
{
  foreach ($arr as $i => $value) {
    if (is_array($value)) {
      $value = array_filter_recursive($value);
    }
    if ($value) {
      $arr[$i] = $value;
    } else {
      unset($arr[$i]);
    }
  }
  return $arr;
}