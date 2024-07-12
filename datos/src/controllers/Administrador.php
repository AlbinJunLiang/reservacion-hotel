<?php
namespace App\controllers;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
class Administrador extends Persona
{

    protected $container;
    const RECURSO = 'administrador';
    const ROL = 1;
    public function __construct(ContainerInterface $c)
    {
        $this->container = $c;
    }
    function create(Request $request, Response $response, $args)
    {
        $body = json_decode($request->getBody(),1);

       $status = $this->createP(self::RECURSO,self::ROL,$body);
        return $response->withStatus($status);
    }

    function read(Request $request, Response $response, $args)
    {
        
        if (isset($args['id'])) {
            $res = $this->readP(self::RECURSO, $args['id']);
        } else {
            $res = $this->readP(self::RECURSO);
        }
        $response->getBody()->write(json_encode($res['resp']));

        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($res['status']);
    }


    function update(Request $request, Response $response, $args) {
        $body = json_decode($request->getBody());
      
        $status = $this->updateP(self::RECURSO,$body, $args['id']);
        return $response->withStatus($status);

    }
    function delete(Request $request, Response $response, $args)
    {
        return $response
                ->withStatus($this
                ->deleteP(self::RECURSO,$args['id']));
    }

    function filtrar(Request $request, Response $response, $args)
    {
        $datos = $request->getQueryParams();
        $res = $this->filtrarP($datos,self::RECURSO);
        $response->getBody()->write(json_encode($res['resp']));
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($res['status']);

    }

}