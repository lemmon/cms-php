<?php

return [

  'cache' => __DIR__ . '/../cache',
  'store' => __DIR__ . '/../store',
  'schema' => [

    'collections' => [

      'pages' => [
        'caption' => 'Pages',
        'fields' => [
          'name' => TRUE,
          'slug' => [
            'type' => 'slug',
            'unique' => TRUE,
            'required' => TRUE,
            'minlength' => 2,
            'maxlength' => 48,
          ],
          'order' => [
            'type' => 'number',
          ],
          'text' => [ 'multiline' => TRUE ],
        ],
      ],

      'posts' => [
        'caption' => 'Posts',
        'fields' => [
          'name' => TRUE,
          'text' => [ 'multiline' => TRUE ],
        ],
      ],

      'people' => [
        'caption' => 'People',
        'fields' => [
          'name' => TRUE,
          'email' => [ 'type' => 'email', 'required' => TRUE ],
          'text' => [ 'multiline' => TRUE ],
        ],
      ],

    ],

  ],

];
