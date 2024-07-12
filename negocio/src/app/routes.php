<?php
namespace App\controllers;

use Slim\Routing\RouteCollectorProxy;


$app->group('/api', function (RouteCollectorProxy $api) {


    $api->group('/cliente', function (RouteCollectorProxy $cliente) {
        $cliente->post('', Cliente::class . ':create');
        $cliente->get('/read[/{id}]', Cliente::class . ':read');
        $cliente->get('/filtro', Cliente::class . ':filtrar');
        $cliente->put('/{id}', Cliente::class . ':update');
        $cliente->delete('/{id}', Cliente::class . ':delete');

    });

    $api->group('/administrador', function (RouteCollectorProxy $administrador) {
        $administrador->post('', Administrador::class . ':create');
        $administrador->get('/read[/{id}]', Administrador::class . ':read');
        $administrador->get('/filtro', Administrador::class . ':filtrar');
        $administrador->put('/{id}', Administrador::class . ':update');
        $administrador->delete('/{id}', Administrador::class . ':delete');
    });
    $api->group('/recepcionista', function (RouteCollectorProxy $recepcionista) {
        $recepcionista->post('', Recepcionista::class . ':create');
        $recepcionista->get('/read[/{id}]', Recepcionista::class . ':read');
        $recepcionista->get('/filtro', Recepcionista::class . ':filtrar');
        $recepcionista->put('/{id}', Recepcionista::class . ':update');
        $recepcionista->delete('/{id}', Recepcionista::class . ':delete');
    });


    $api->group('/reservacion', function (RouteCollectorProxy $reservacion) {
        $reservacion->post('', Reservacion::class . ':create');
        $reservacion->get('/read[/{id}]', Reservacion::class . ':read');
        $reservacion->get('/filtro', Reservacion::class . ':filtrar');
        $reservacion->put('/{id}', Reservacion::class . ':update');
        $reservacion->delete('/{id}', Reservacion::class . ':delete');
        $reservacion->post('/reserve', Reservacion::class . ':reservar');
        $reservacion->patch('/cancel/{id}', Reservacion::class . ':cancelar');


    });

    $api->group('/habitacion', function (RouteCollectorProxy $habitacion) {
        $habitacion->post('', Habitacion::class . ':create');
        $habitacion->get('/read[/{id}]', Habitacion::class . ':read');
        $habitacion->get('/filtro', Habitacion::class . ':filtrar');
        $habitacion->put('/{id}', Habitacion::class . ':update');
        $habitacion->delete('/{id}', Habitacion::class . ':delete');
        $habitacion->get('/searchroom', Habitacion::class . ':readRoomAvaible');
        $habitacion->patch('/release', Habitacion::class . ':liberar');


    });


    $api->group('/auth', function (RouteCollectorProxy $auth) {
        $auth->post('/iniciar', Auth::class . ':iniciar');
        $auth->patch('/cerrar/{idUsuario}', Auth::class . ':cerrar');
        $auth->patch('/refresh', Auth::class . ':refrescar');
    });


    $api->group('/usr', function (RouteCollectorProxy $usr) {
        $usr->patch('/reset/passw/{idUsuario}', Usuario::class . ':resetPassw');
        $usr->patch('/change/passw/{idUsuario}', Usuario::class . ':changePassw');
        $usr->patch('/change/rol/{idUsuario}', Usuario::class . ':changeRol');
    });

});