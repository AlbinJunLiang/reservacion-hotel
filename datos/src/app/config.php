<?php

require __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable('/var/www/html'); //se necesita instalar esto para que funcione
$dotenv->load();  


$container->set('config_bd', function(){
    return (object)[
        "host" => $_ENV["DB_HOST"], // Usar el operador de fusión de null para evitar la advertencia
        "db" => $_ENV["DB_NAME"],
        "usr" => $_ENV["DB_USER"],
        "passw" => $_ENV["DB_PASSW"] ,
        "charset" => "utf8mb4" // Esto parece estar bien
    ];
});

$container->set('key', function(){
    return $_ENV["KEY"]; // También usa el operador de fusión de null aquí si es necesario
});
