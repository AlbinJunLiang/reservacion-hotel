<?php
namespace App\controllers;

class ServicioCURL
{
    private const URL = "http://web-datos/api";
    public function ejecutarCURL($endpoint, $metodo, $datos = null)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, self::URL . $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if ($datos != null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $datos);
        }

        switch ($metodo) {
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, true);
                break;
            case 'PATCH':
            case 'PUT':
            case 'DELETE':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $metodo); //put, patch o delete
                break;
        }


        $resp = curl_exec($ch);

        $status = curl_getinfo($ch);

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        return ['resp' => $resp, 'status' => $status];
    }
}