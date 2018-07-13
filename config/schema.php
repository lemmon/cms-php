<?php

return [

  'collections' => [

    [
      'id' => 'pages',
      'name' => 'Pages',
      'fields' => [
        'name' => [
          'type' => 'text',
          'required' => TRUE,
        ],
        'slug' => [
          'type' => 'slug',
          'unique' => TRUE,
          'required' => TRUE,
          'minlength' => 2,
          'maxlength' => 48,
        ],
        'text' => [
          'type' => 'text',
          'multiline' => TRUE,
        ],
      ],
    ],

    [
      'id' => 'posts',
      'name' => 'Posts',
      'fields' => [
        'name' => 'text',
        'text' => 'text',
      ],
    ],

    [
      'id' => 'projects',
      'name' => 'Projects',
      'fields' => [
        'name' => 'text',
        'text' => 'text',
      ],
    ],

    [
      'id' => 'people',
      'name' => 'People',
      'fields' => [
        'name' => 'text',
        'text' => 'text',
      ],
    ],

  ],

];
