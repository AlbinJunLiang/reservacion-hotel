<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable('/var/www/html'); //se necesita instalar esto para que funcione
$dotenv->load();                


$app = AppFactory::create();

$app->addRoutingMiddleware();

$app->add(new Tuupola\Middleware\JwtAuthentication([
    "secure" => false,

    "path" => ["/api"],
    "ignore" => [ "/api/auth"], //esto permite administrar el acceso a los metodos
    "secret" => ["acme"=>$_ENV['KEY']], //De esta forma la mayuscula importa
    "algorithm" => [ "acme" => "HS256" ]
    ]));


require_once 'routes.php';
$errorMiddldware = $app->addErrorMiddleware(true, true, true);
$app->run();