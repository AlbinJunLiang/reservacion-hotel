<?php
namespace App\controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Reservacion extends ServicioCURL
{
    private const URL = '/reservacion';



    public function read(Request $request, Response $response, $args)
    {

        $url = $this::URL . '/read';
        if (isset($args['id'])) {
            $url .= "/{$args['id']}";
        }

        $respA = $this->ejecutarCURL($url, 'GET');

        $response->getBody()->write($respA['resp']);

        return $response->withHeader('Content-type', 'Application/json')
            ->withStatus($respA['status']);
    }

    public function create(Request $request, Response $response, $args)
    {
        $datos = $request->getBody();

        $respA = $this->ejecutarCURL($this::URL, 'POST', $datos);

        return $response->withStatus($respA['status']);
    }

    public function update(Request $request, Response $response, $args)
    {
        $datos = $request->getBody();
        $url = $this::URL . "/{$args['id']}";

        $respA = $this->ejecutarCURL($url, 'PUT', $datos);

        return $response->withStatus($respA['status']);
    }

    public function delete(Request $request, Response $response, $args)
    {

        $url = $this::URL . "/{$args['id']}";

        $respA = $this->ejecutarCURL($url, 'DELETE');

        return $response->withStatus($respA['status']);
    }

    public function filtrar(Request $request, Response $response, $args)
    {
        $params = $request->getQueryParams();

        $url = $this::URL . '/filtro?' . http_build_query($params);

        $respA = $this->ejecutarCURL($url, 'GET');

        $response->getBody()->write($respA['resp']);

        return $response->withHeader('Content-type', 'Application/json')
            ->withStatus($respA['status']);
    }


    public function reservar(Request $request, Response $response, $args)
    {
        $datos = $request->getBody();

        $respA = $this->ejecutarCURL($this::URL.'/reserve', 'POST', $datos);

        return $response->withStatus($respA['status']);
    }

    public function cancelar(Request $request, Response $response, $args)
    {
        $datos = $request->getBody();

        $respA = $this->ejecutarCURL($this::URL.'/cancel'."/{$args['id']}", 'PATCH', $datos);

        return $response->withStatus($respA['status']);
    }


}