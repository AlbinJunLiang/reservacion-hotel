<?php
namespace App\controllers;

use Psr\Container\ContainerInterface;
use PDO;

class Persona
{
    
    protected $container;
    public function __construct(ContainerInterface $c)
    {
        $this->container = $c;
    }

    function createP($recurso, $rol, $datos) {

        $sql="INSERT INTO $recurso (";
        $values= " VALUES (";
        foreach($datos as $key => $value){
            $sql .= $key . ', ';
            $values .= ":$key, ";
        }
        $values =substr($values, 0, -2) . ");";
        $sql = substr($sql, 0, -2) . ")". $values;
        
        $data=[];
        foreach($datos as $key => $value){
            $data[$key]=filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS);
        }
        
        $con = $this->container->get('bd');
        $con->beginTransaction();       
        try {
            $query = $con->prepare($sql);
            $query->execute($data);
          
            $sql = "INSERT INTO usuario (idUsuario,correo,rol,passw) VALUES (:idUsuario, :correo, :rol, :passw);";
            $query = $con->prepare($sql);

            $passw = password_hash($data['idUsuario'], PASSWORD_BCRYPT, ['cost' => 10]);
            $query->bindValue(":idUsuario",$data['idUsuario']);
            $query->bindValue(":correo",$data['correo']);
            $query->bindValue(":rol", $rol, PDO::PARAM_INT);
            $query->bindValue(":passw",$passw);
            $query->execute();

            $status=204;
            $con->commit();
        } catch (\PDOException $e) {
            $con->rollBack();
            $status = $e->getCode() == 23000 ? 409 : 500;
            
        }
        
        $query =null;  
        $con = null; 
        return $status;
    }
    function readP($recurso, $id = null) {
        
        $sql = "SELECT * FROM $recurso ";
        if ($id != null) {
            $sql .="WHERE id = :id";
        }

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        if ($id != null) {
            $query->execute(['id' => $id]);
        }else{
            $query->execute();
        }
        
        $res['resp'] = $query->fetchAll();
        $res['status'] = $query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;

        return $res;
    }


    function updateP($recurso, $datos, $id) {

        $sql = "UPDATE $recurso SET ";
        foreach ($datos as $key => $value) {
            $sql .= "$key = :$key, ";
            
        }
        
        $sql = substr($sql, 0, -2);
        $sql .= " WHERE id = :id;";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);

        foreach ($datos as $key => $value) {
            $query->bindValue(":$key", $value, PDO::PARAM_STR);
        }
        
        $query->bindValue(":id", $id, PDO::PARAM_INT);
        $query->execute(); //EJECUTAMOS LA CONSULTA
        
        $status =$query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;
        return $status;
    }

     function deleteP($recurso, $id) {

        $sql = "DELETE FROM $recurso WHERE id = :id ;";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->bindValue(':id', $id, PDO::PARAM_INT);
        $query->execute();
 
        $status =$query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;
        return ($status);
    }


    function filtrarP($datos, $recurso)
    {        
        $sql = "SELECT * FROM $recurso WHERE ";
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
        $res['resp'] = $query->fetchAll();
        $res['status'] = $query->rowCount() > 0 ? 200 : 204;
        $query = null;
        $con = null;
        return $res;
    }
}