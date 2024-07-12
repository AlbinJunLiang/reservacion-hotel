<?php
namespace App\controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Persona extends ServicioCURL
{
    private $recurso;

    public function __construct($recurso)
    {
        $this->recurso = $recurso;
    }

    public function readP(Request $request, Response $response, $args)
    {
        $url = $this->recurso . '/read';
        if (isset($args['id'])) {
            $url .= "/{$args['id']}";
        }

        $respA = $this->ejecutarCURL($url, 'GET');

        $response->getBody()->write($respA['resp']);

        return $response->withHeader('Content-type', 'application/json')
            ->withStatus($respA['status']);
    }

    public function createP(Request $request, Response $response, $args)
    {
        $datos = $request->getBody(); // Obtener datos del cuerpo de la solicitud

        // Realizar la solicitud POST usando cURL al endpoint especificado
        $respA = $this->ejecutarCURL($this->recurso, 'POST', $datos);

        // Configurar el estado de la respuesta basado en el resultado de la solicitud cURL
        $response = $response->withStatus($respA['status']);

        // Devolver la respuesta actualizada
        return $response;
    }


    public function updateP(Request $request, Response $response, $args)
    {
        $datos = $request->getBody(); // Obtener datos del cuerpo de la solicitud
        $url = $this->recurso . "/{$args['id']}"; // Construir la URL completa para la actualización
        $respA = $this->ejecutarCURL($url, 'PUT', $datos);
        $response = $response->withStatus($respA['status']);

        return $response;
    }


    public function deleteP(Request $request, Response $response, $args)
    {
        $url = $this->recurso . "/{$args['id']}";

        $respA = $this->ejecutarCURL($url, 'DELETE');

        return $response->withStatus($respA['status']);
    }

    public function filtrarP(Request $request, Response $response, $args)
    {
        $params = $request->getQueryParams();
        $url = $this->recurso . '/filtro?' . http_build_query($params);
        $respA = $this->ejecutarCURL($url, 'GET');
        $response->getBody()->write($respA['resp']);

        return $response->withHeader('Content-Type', 'application/json')
                        ->withStatus($respA['status']);
    }
}
