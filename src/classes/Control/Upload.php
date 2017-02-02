<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;


require_once __DIR__ . '/../Control.php';


/**
 * Class Upload
 * @package CoreUI\Form\Classes\Control
 */
class Upload extends Control {

    protected $accept     = '';
    protected $autostart  = false;
    protected $size_limit = 0;
    protected $file_limit = 1;
    protected $files      = array();
    protected $attributes = array(
        'type' => 'hidden',
    );
    protected $locutions = array(
        'ru' => array(
            'Select file'     => 'Выберите файл',
            'Upload all'      => 'Загрузить все',
            'Remove all'      => 'Удалить все',
            'Remove'          => 'Удалить',
            'Error load file' => 'Ошибка загрузки файла'
        ),
        'en' => array(
            'Select file'     => 'Select file',
            'Upload all'      => 'Upload all',
            'Remove all'      => 'Remove all',
            'Remove'          => 'Remove',
            'Error load file' => 'Error load file'
        )
    );


    /**
     * @param string $id
     * @param string $name
     * @param int    $size
     * @param string $type
     * @param string $download_url
     * @param string $preview_url
     * @return self
     */
    public function addFile($id, $name, $size = 0, $type ='', $download_url = '', $preview_url = '') {
        $this->files[] = array(
            'id'           => $id,
            'name'         => $name,
            'size'         => $size,
            'type'         => $type,
            'download_url' => $download_url,
            'preview_url'  => $preview_url
        );
        return $this;
    }


    /**
     * @param int $count
     * @return self
     */
    public function setFilesLimit($count) {
        $this->file_limit = $count;
        return $this;
    }


    /**
     * @param int $count
     * @return self
     */
    public function setSizeLimit($count) {
        $this->size_limit = $count;
        return $this;
    }


    /**
     * @param bool $is_autostart
     * @return self
     */
    public function setAutostart($is_autostart) {
        $this->autostart = $is_autostart;
        return $this;
    }


    /**
     * @param string $accept
     * @return self
     */
    public function setAccepted($accept) {
        $this->accept = $accept;
        return $this;
    }


    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/upload.html');

        if ($this->readonly) {
            if ( ! empty($this->files)) {
                foreach ($this->files as $file) {

                    if ( ! empty($file['download_url'])) {
                        $tpl->readonly_file->link->assign('[DOWNLOAD_URL]', $file['download_url']);
                        $tpl->readonly_file->link->assign('[NAME]',         $file['name']);
                        if ( ! empty($file['size'])) {
                            $tpl->readonly_file->link->size->assign('[SIZE_HUMAN]', $this->formatSizeHuman($file['size']));
                        }
                    } else {
                        $tpl->readonly_file->text->assign('[NAME]', $file['name']);
                        if ( ! empty($file['size'])) {
                            $tpl->readonly_file->text->size->assign('[SIZE_HUMAN]', $this->formatSizeHuman($file['size']));
                        }
                    }

                    if ($file['preview_url']) {
                        $tpl->readonly_file->img->assign('[PREVIEW_URL]', $file['preview_url']);
                        $tpl->readonly_file->img->assign('[ALT]',         $file['name']);
                    }

                    $file_type = ! empty($file['type']) && strpos($file['type'], 'image') !== false
                        ? 'image'
                        : 'doc';

                    $tpl->readonly_file->assign('[ID]',   $file['id']);
                    $tpl->readonly_file->assign('[KEY]',  uniqid());
                    $tpl->readonly_file->assign('[TYPE]', $file_type);
                    $tpl->readonly_file->reassign();
                }
            }

        } else {
            if ( ! empty($this->files)) {
                foreach ($this->files as $file) {

                    if ( ! empty($file['download_url'])) {
                        $tpl->control->file->link->assign('[DOWNLOAD_URL]', $file['download_url']);
                        $tpl->control->file->link->assign('[NAME]',         $file['name']);
                        if ( ! empty($file['size'])) {
                            $tpl->control->file->link->size->assign('[SIZE_HUMAN]', $this->formatSizeHuman($file['size']));
                        }
                    } else {
                        $tpl->control->file->text->assign('[NAME]', $file['name']);
                        if ( ! empty($file['size'])) {
                            $tpl->control->file->text->size->assign('[SIZE_HUMAN]', $this->formatSizeHuman($file['size']));
                        }
                    }

                    if ($file['preview_url']) {
                        $tpl->control->file->img->assign('[PREVIEW_URL]', $file['preview_url']);
                        $tpl->control->file->img->assign('[ALT]',         $file['name']);
                    }

                    $file_type = ! empty($file['type']) && strpos($file['type'], 'image') !== false
                        ? 'image'
                        : 'doc';

                    $tpl->control->file->assign('[ID]',   $file['id']);
                    $tpl->control->file->assign('[KEY]',  uniqid());
                    $tpl->control->file->assign('[TYPE]', $file_type);
                    $tpl->control->file->reassign();
                }
            }

            if ( ! isset($this->attributes['id'])) {
                $this->attributes['id'] = "control-" . uniqid();
            }


            if ($this->required) {
                $this->attributes['required'] = 'required';
            }

            $attributes = array();
            if ( ! empty($this->attributes)) {
                foreach ($this->attributes as $attr_name => $value) {
                    $attributes[] = "$attr_name=\"$value\"";
                }
            }


            $is_multiple = $this->file_limit == 0 || $this->file_limit > 1;

            if ($this->size_limit == 0) {
                $this->size_limit = $this->getMaxFileSize();
            }

            if ($is_multiple) {
                $tpl->control->touchBlock('control_buttons');
            }

            $this->addCss($this->theme_src . '/css/uploadH5.css', true);
            $this->addJs($this->theme_src . '/js/uploadH5.js', true);

            $tpl->control->assign('[ATTRIBUTES]', implode(' ', $attributes));
            $tpl->control->assign('[THEME_SRC]',  $this->theme_src);
            $tpl->control->assign('[ID]',         $this->attributes['id']);
            $tpl->control->assign('[NAME]',       $this->attributes['name']);
            $tpl->control->assign('[LANG]',       $this->lang);
            $tpl->control->assign('[ACCEPT]',     $this->accept);
            $tpl->control->assign('[SIZE_LIMIT]', $this->size_limit);
            $tpl->control->assign('[FILE_LIMIT]', $this->file_limit);
            $tpl->control->assign('[AUTOSTART]',  $this->autostart ? 'true' : 'false');
            $tpl->control->assign('[MULTIPLE]',   $is_multiple ? 'multiple' : '');


            // Перевод
            if ( ! empty($this->locutions[$this->lang])) {
                foreach ($this->locutions[$this->lang] as $locution => $translate) {
                    $tpl->control->assign("[#{$locution}#]", $translate);
                }
            }
        }

        return $tpl->render();
    }


    /**
     * Get the maximum file size of the form
     *
     * @return integer
     */
    private function getMaxFileSize() {
        $ini = $this->convertIniToInteger(trim(ini_get('post_max_size')));
        $max = $this->convertIniToInteger(trim(ini_get('upload_max_filesize')));
        $min = max($ini, $max);
        if ($ini > 0) {
            $min = min($min, $ini);
        }

        if ($max > 0) {
            $min = min($min, $max);
        }

        return $min;
    }

    /**
     * Converts a ini setting to a integer value
     *
     * @param  string $setting
     * @return integer
     */
    private function convertIniToInteger($setting) {
        if (!is_numeric($setting)) {
            $type = strtoupper(substr($setting, -1));
            $setting = (integer) substr($setting, 0, -1);

            switch ($type) {
                case 'K' :
                    $setting *= 1024;
                    break;

                case 'M' :
                    $setting *= 1024 * 1024;
                    break;

                case 'G' :
                    $setting *= 1024 * 1024 * 1024;
                    break;

                default :
                    break;
            }
        }

        return (integer) $setting;
    }

    /**
     * @param  int    $bytes
     * @return string
     */
    private function formatSizeHuman($bytes) {

        if ($bytes >= 1073741824) {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        } elseif ($bytes > 1) {
            $bytes = $bytes . ' bytes';
        } elseif ($bytes == 1) {
            $bytes = $bytes . ' byte';
        } else {
            $bytes = '0 bytes';
        }

        return $bytes;
    }
}