<?php
namespace App\controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class Habitacion
{
    protected $container;
    public function __construct(ContainerInterface $c)
    {
        $this->container = $c; #conexion
    }

    function create(Request $request, Response $response, $args)
    {
        $body = json_decode($request->getBody());

        $sql = "INSERT INTO habitacion (";
        $values = "VALUES (";
        foreach ($body as $key => $value) {
            $sql .= $key . ', ';
            $values .= ":$key, ";
        }
        $values = substr($values, 0, -2) . ');';
        $sql = substr($sql, 0, -2) . ') ' . $values;

        $data = [];
        foreach ($body as $key => $value) {
            $data[$key] = filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS);
        }
        $con = $this->container->get('bd');
        $con->beginTransaction();

        $query = $con->prepare($sql);
        $query->execute($data);
        $con->commit();
        $status = $query->rowCount() > 0 ? 201 : 204;
        $query = null;
        $con = null;
        return $response->withStatus($status);
    }


    function read(Request $request, Response $response, $args)
    {
        $sql = "SELECT * FROM habitacion ";
        if (isset($args['id'])) {
            $sql .= "WHERE id = :id";
        }

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);

        if (isset($args['id'])) {
            $query->execute(['id' => $args['id']]);
        } else {
            $query->execute();
        }

        $res = $query->fetchAll();
        $status = $query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;
        $response->getBody()->write(json_encode($res));
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }


    function update(Request $request, Response $response, $args)
    {
        $body = json_decode($request->getBody());
        if (isset($body->id)) {
            unset($body->id);
        }

        $sql = "UPDATE habitacion SET ";
        foreach ($body as $key => $value) {
            $sql .= "$key = :$key, ";
        }
        $sql = substr($sql, 0, -2);
        $sql .= " WHERE id = :id;";

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);

        foreach ($body as $key => $value) {
            $query->bindValue(":$key", $value, PDO::PARAM_STR);
        }
        $query->bindValue(':id', $args['id'], PDO::PARAM_INT);

        $query->execute();
        $status = $query->rowCount() > 0 ? 200 : 204;

        $query = null;
        $con = null;

        return $response->withStatus($status);
    }


    function delete(Request $request, Response $response, $args)
    {
        $sql = "DELETE FROM habitacion WHERE id = :id";

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->bindValue(':id', $args['id'], PDO::PARAM_INT);
        $query->execute();
        $status = $query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;

        return $response->withStatus(200);
    }

    function filtrar(Request $request, Response $response, $args)
    {
        $datos = $request->getQueryParams();
        $sql = "SELECT * FROM habitacion WHERE ";
        foreach ($datos as $key => $value) {
            $sql .= "$key LIKE :$key AND ";
        }

        $sql = rtrim($sql, 'AND ') . ';';

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        foreach ($datos as $key => $value) {
            $query->bindValue(":$key", "%$value%", PDO::PARAM_STR);
        }

        $query->execute();

        $res = $query->fetchAll();

        $status = $query->rowCount() > 0 ? 200 : 204;

        $query = null;
        $con = null;
        $response->getBody()->write(json_encode($res));

        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }



    /**
     * Devuelve solo las habitaciones que no han sido ocupadas todavia
     */
    function readRoomAvaible(Request $request, Response $response, $args)
    {
        $sql = "call obtenerHabitacionesDisponibles(); ";

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $res = $query->fetchAll();
        $status = $query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;
        $response->getBody()->write(json_encode($res));
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }

    /**
     * Todas habitaciones que estan en reservaciones expiradas volveran
     * a estar disponibles.
     */
    function liberar(Request $request, Response $response, $args)
    {
        $sql = "CALL liberarHabitaciones(); ";

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $status = $query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;

        return $response->withStatus(200);
    }
}