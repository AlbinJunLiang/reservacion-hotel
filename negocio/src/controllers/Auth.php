<?php

namespace App\controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;

class Auth extends ServicioCURL
{

    private $container;
    private const ENDPOINT = '/auth';

    public function iniciar(Request $request, Response $response, $args)
    {
        $datos = $request->getBody();

        $respA = $this->ejecutarCURL($this::ENDPOINT . '/iniciar', 'POST', $datos);

        if ($respA['resp']) {
            $response->getBody()->write($respA['resp']);

        }
        return $response->withHeader('Content-type', 'Application/json')
            ->withStatus($respA['status']);

    }
    public function cerrar(Request $request, Response $response, $args)
    {
        $datos = $request->getBody();
        $url = $this::ENDPOINT . "/cerrar/{$args['idUsuario']}";
        $respA = $this->ejecutarCURL($url, 'PATCH');
        return $response->withStatus($respA['status']);
    }

    public function refrescar(Request $request, Response $response)
    {
        $datos = $request->getBody();
        $url = $this::ENDPOINT . "/refresh";
        $respA = $this->ejecutarCURL($url, 'PATCH', $datos);

        $response->getBody()->write($respA['resp']);

        return $response->withHeader('Content-type', 'Application/json')
            ->withStatus($respA['status']);
    }


}