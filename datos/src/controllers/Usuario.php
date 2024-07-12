<?php
namespace App\controllers;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Usuario extends Autenticar
{

    protected $container;
    public function __construct(ContainerInterface $c)
    {
        $this->container = $c;
    }
    private function editarUsuario(string $idUsuario, int $rol = -1, string $passw = "")
    {
        $sql = $rol == -1 ? "UPDATE usuario SET passw = '$passw'" : "UPDATE usuario SET rol = $rol";
        $sql .= " WHERE idUsuario = :idUsuario OR correo = :idUsuario ";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute(["idUsuario" => $idUsuario]);
        $afectados = $query->rowCount();
        $query = null;
        $con = null;
        return $afectados;
    }

    public function cambiarPassw(Request $request, Response $response, $args)
    {
        $body = json_decode($request->getBody());
        if ($this->autenticar($args['idUsuario'], $body->passw, true)) {
            $passwN = password_hash($body->passwN, PASSWORD_BCRYPT, ['cost' => 10]);
            $datos = $this->editarUsuario(idUsuario: $args['idUsuario'], passw: $passwN);
            $status = 200;
        } else {
            $status = 401;
        }
        return $response->withStatus($status);
    }

    public function resetearPassw(Request $request, Response $response, $args)
    {
        $body = json_decode($request->getBody());
        $passw = password_hash($args['idUsuario'], PASSWORD_BCRYPT, ['cost' => 10]);

        $status = $this->editarUsuario(idUsuario: $args["idUsuario"], passw: $passw) == 0 ? 204 : 200;
        return $response->withStatus($status);
    }
    public function cambiarRol(Request $request, Response $response, $args)
    {
        $body = json_decode($request->getBody());
        $status = $this->editarUsuario(idUsuario: $args["idUsuario"], rol: $body->rol) == 0 ? 204 : 200;
        return $response->withStatus($status);
    }
}