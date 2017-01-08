<?php
namespace CoreUI\Form;
use CoreUI\Handlers;
use CoreUI\Exception;
use CoreUI\Utils\Session\SessionNamespace;


/**
 * Class Handler
 * @package CoreUI
 */
class Handler extends Handlers {

    /**
     * @param  string     $name
     * @return mixed|null
     */
    public function getSessData($name) {

        $session = new SessionNamespace($this->resource);
        if (isset($session->form) && isset($session->form->$name)) {
            return $session->form->$name;
        }
        return null;
    }


    /**
     * @return mixed
     */
    public function getRecordId() {
        $session = new SessionNamespace($this->resource);
        if (isset($session->form) && isset($session->form->record_id)) {
            return $session->form->record_id;
        }
        return null;
    }


    /**
     * @param  array $data
     * @return int
     * @throws Exception
     */
    public function saveData($data) {

        if ( ! $this->isValidRequest('form')) {
            throw new Exception('Not valid request');
        }

        $session = new SessionNamespace($this->resource);

        if (empty($session->form->table)) {
            throw new Exception('Table empty');
        }

        $table = $session->form->table;
        if ( ! is_string($table)) {
            throw new Exception('Table parameter not string');
        }

        if (empty($session->form->primary_key)) {
            throw new Exception('Primary key empty');
        }

        $primary_key = $session->form->primary_key;
        if ( ! is_string($primary_key) && ! is_numeric($primary_key)) {
            throw new Exception('Primary key not valid');
        }

        if (empty($data) || ! is_array($data)) {
            throw new Exception('Data not valid');
        }

        $record_id = $session->form->record_id;
        if ($record_id) {
            $is_save = $this->db->update($table, $data, "{$primary_key} = {$record_id}");
        } else {
            $is_save = $this->db->insert($table, $data);
            $record_id  = $this->db->lastInsertId($table);
        }

        if ( ! $is_save) {
            throw new Exception('Error save data');
        }

        if (isset($session->form->back_url)) {
            $this->response['back_url'] = $session->form->back_url;
        }

        $this->response['status'] = 'success';

        return $record_id;
    }


    /**
     * Отсеевание необазначенных полей
     * @param array $data
     * @return array
     * @throws \CoreUI\Exception
     */
    public function filterControls(array $data) {
        $session = new SessionNamespace($this->resource);

        if (empty($session->form) || empty($session->form->controls)) {
            throw new Exception('Empty controls');
        }

        foreach ($data as $name => $value) {
            if ( ! isset($session->form->controls[$name])) {
                unset($data[$name]);
            }
        }

        return $data;
    }


    /**
     * @throws Exception
     */
    public function uploadFile() {

        if ( ! $this->isValidRequest('form')) {
            throw new Exception('Not valid request');
        }

        if ( ! empty($_FILES['combine_upload'])) {
            if ($_FILES['combine_upload']['error']) {
                $this->response['status'] = 'error';
            } else {
                $new_name = sys_get_temp_dir() . '/' . uniqid('cms');
                rename($_FILES['combine_upload']['tmp_name'], $new_name);
                $this->response['tmp_name'] = $new_name;
                $this->response['filename'] = $_FILES['combine_upload']['name'];
            }

        } else {
            throw new Exception('Empty file');
        }
    }
}