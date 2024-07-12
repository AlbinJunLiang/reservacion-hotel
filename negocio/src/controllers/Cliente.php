<?php
namespace App\controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Cliente extends ServicioCURL
{
    private $persona;

    public function __construct()
    {
        $this->persona = new Persona('/cliente');
    }

    public function read(Request $request, Response $response, $args)
    {
        $response = $this->persona->readP($request, $response, $args);
        return $response;
    }
    public function create(Request $request, Response $response, $args)
    {
        $response = $this->persona->createP($request, $response, $args);
        return $response;
    }


    public function update(Request $request, Response $response, $args)
    {
        $response = $this->persona->updateP($request, $response, $args);
        return $response;
    }

    public function delete(Request $request, Response $response, $args)
    {
        $response = $this->persona->deleteP($request, $response, $args);
        return $response;
    }

    public function filtrar(Request $request, Response $response, $args)
    {
        $response =  $this->persona->filtrarP($request, $response, $args);
        return $response;

    }
}