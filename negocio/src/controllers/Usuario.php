<?php
namespace App\controllers;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Usuario extends ServicioCURL{
    private const ENDPOINT = '/usr';


    public function resetPassw(Request $request, Response $response, $args){
        $datos = $request->getBody();
        $url = $this::ENDPOINT . "/reset/passw/{$args['idUsuario']}";

        $respA = $this->ejecutarCURL($url, 'PATCH', $datos);

        return $response->withStatus($respA['status']);
    }

    
    public function changePassw (Request $request, Response $response, $args){
        $datos = $request->getBody();
        $url = $this::ENDPOINT . "/change/passw/{$args['idUsuario']}";

        $respA = $this->ejecutarCURL($url, 'PATCH', $datos);

        return $response->withStatus($respA['status']);
    }
    
    public function changeRol (Request $request, Response $response, $args){
        $datos = $request->getBody();
        $url = $this::ENDPOINT . "/change/rol/{$args['idUsuario']}";

        $respA = $this->ejecutarCURL($url, 'PATCH', $datos);

        return $response->withStatus($respA['status']);
    }
}