<?php
namespace App\controllers;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
USE PDO;
class Curso
{

    protected $container;
    public function __construct(ContainerInterface $c)
    {
        $this->container = $c;
    }

    function read(Request $request, Response $response, $args)
    {
        $sql = "SELECT * FROM curso ";
        if (isset($args['id'])) {
            $sql .= "WHERE id= :id";

        }
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);


        if (isset($args['id'])) {
            $query->execute(['id' => $args['id']]);

        } else {
            $query->execute();

        }
        $res = $query->fetchall();
        $status = $query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;
        $response->getBody()->write(json_encode($res));
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }
}