<?php

namespace app;

function id()
{
  return bin2hex(random_bytes(5));
}
