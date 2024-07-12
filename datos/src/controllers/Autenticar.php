<?php
namespace App\controllers;

use Psr\Container\ContainerInterface;
use PDO;

class Autenticar
{
    protected $container;

    public function __construct(ContainerInterface $c)
    {
        $this->container = $c;
    }
    public function autenticar($usuario, $passw, $cambioPassw = false)
    {
        $retorno = null;

        // Se obtiene los datos del usuario por idUsuario o correo
        $sql = "SELECT * FROM usuario WHERE idUsuario = :idUsuario OR correo = :idUsuario";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->bindParam(':idUsuario', $usuario, PDO::PARAM_STR);
        $query->execute();
        $datosUsuario = $query->fetch(PDO::FETCH_OBJ);

        if ($datosUsuario && password_verify($passw, $datosUsuario->passw)) {
            // Si la contraseña es correcta, obtenemos el rol y nombre del usuario
            $rol = $datosUsuario->rol;
            $recurso = match ($rol) {
                1 => "administrador",
                2 => "especial",
                3 => "recepcionista",
                4 => "cliente"
            };

            $retorno = ["rol" => $rol];

            // Actualizamos último acceso si no es un cambio de contraseña
            if (!$cambioPassw) {
                $sql = "UPDATE usuario SET ultimoAcceso = CURDATE() WHERE idUsuario = :idUsuario OR correo = :idUsuario";
                $query = $con->prepare($sql);
                $query->bindParam(":idUsuario", $datosUsuario->idUsuario);
                $query->execute();
            }

            // Obtenemos el nombre del usuario desde la tabla correspondiente al rol
            $sql = "SELECT nombre FROM $recurso WHERE idUsuario = :idUsuario OR correo = :idUsuario";
            $query = $con->prepare($sql);
            $query->bindParam(":idUsuario", $datosUsuario->idUsuario);
            $query->execute();
            $datosNombre = $query->fetch(PDO::FETCH_OBJ);

            if ($datosNombre) {
                $retorno["nombre"] = $datosNombre->nombre;
            }
        }

        $query = null;
        $con = null;

        return $retorno; // devuelve los valores obtenidos o null si no se autenticó correctamente
    }

}