<?php
namespace App\controllers;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Tecnico{
    private const URL = 'http://web-datos/tecnico';

    private function ejecutarCURL($url, $metodo, $datos = null){
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if($datos != null){
            curl_setopt($ch, CURLOPT_POSTFIELDS, $datos);
        }
        
        switch($metodo){
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, true);
                break;
            
            case 'PUT':
            case 'DELETE':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $metodo); //put o delete
                break;
        }
        

        $resp = curl_exec($ch);

        $status = curl_getinfo($ch);

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        return ['resp' => $resp, 'status' => $status];
    }

    public function read(Request $request, Response $response, $args){

        $url = $this::URL . '/read';
        if(isset($args['id'])){
            $url .= "/{$args['id']}";
        }

        $respA = $this->ejecutarCURL($url, 'GET');

        $response->getBody()->write($respA['resp']);

        return $response->withHeader('Content-type', 'Application/json')
            ->withStatus($respA['status']);
    }

    public function create(Request $request, Response $response, $args){
        $datos = $request->getBody();
        
        $respA = $this->ejecutarCURL($this::URL, 'POST', $datos);

        return $response->withStatus($respA['status']);
    }

    public function update (Request $request, Response $response, $args){
        $datos = $request->getBody();
        $url = $this::URL . "/{$args['id']}";

        $respA = $this->ejecutarCURL($url, 'PUT', $datos);

        return $response->withStatus($respA['status']);
    }

    public function delete (Request $request, Response $response, $args){

        $url = $this::URL . "/{$args['id']}";

        $respA = $this->ejecutarCURL($url, 'DELETE');

        return $response->withStatus($respA['status']);
    }

    public function filtrar(Request $request, Response $response, $args){
        $params =  $request->getQueryParams();

        $url = $this::URL .'/filtro?'. http_build_query($params);

        $respA = $this->ejecutarCURL($url, 'GET');

        $response->getBody()->write($respA['resp']);

        return $response->withHeader('Content-type', 'Application/json')
            ->withStatus($respA['status']);
    }
}