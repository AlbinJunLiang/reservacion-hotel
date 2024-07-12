<?php

use Slim\Factory\AppFactory;
use DI\Container;

require __DIR__ . '/../../vendor/autoload.php';

$container = new Container();

AppFactory::setContainer($container);
$app = AppFactory::create();

$app->addRoutingMiddleware();



require 'config.php';
require 'conexion.php';
require_once 'routes.php';
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$app->run();












