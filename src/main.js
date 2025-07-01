
import Controller from "./js/controller";

import langEn from "./js/lang/en";
import langRu from "./js/lang/ru";

import Field   from "./js/abstract/Field";
import Control from "./js/abstract/Control";

import ControlButton from "./js/controls/button";
import ControlSubmit from "./js/controls/submit";
import ControlLink   from "./js/controls/link";
import ControlCustom from "./js/controls/custom";

import FieldCheckbox       from "./js/fields/checkbox";
import FieldCheckboxBtn    from "./js/fields/checkboxBtn";
import FieldColor          from "./js/fields/color";
import FieldCustom         from "./js/fields/custom";
import FieldDataset        from "./js/fields/dataset";
import FieldGroup          from "./js/fields/group";
import FieldHidden         from "./js/fields/hidden";
import FieldInput          from "./js/fields/input";
import FieldMask           from "./js/fields/mask";
import FieldModal          from "./js/fields/modal";
import FieldNumber         from "./js/fields/number";
import FieldRadio          from "./js/fields/radio";
import FieldRadioBtn       from "./js/fields/radioBtn";
import FieldRange          from "./js/fields/range";
import FieldSelect         from "./js/fields/select";
import FieldSwitch         from "./js/fields/switch";
import FieldTextarea       from "./js/fields/textarea";
import FieldWysiwyg        from "./js/fields/wysiwyg";
import FieldPasswordRepeat from "./js/fields/passwordRepeat";
import FieldFile           from "./js/fields/file";
import FieldFileUpload     from "./js/fields/fileUpload";



Controller.lang.ru = langRu;
Controller.lang.en = langEn;

Controller.abstract.field   = Field;
Controller.abstract.control = Control;

Controller.controls.button = ControlButton;
Controller.controls.submit = ControlSubmit;
Controller.controls.link   = ControlLink;
Controller.controls.custom = ControlCustom;

Controller.fields.checkboxBtn    = FieldCheckboxBtn;
Controller.fields.checkbox       = FieldCheckbox;
Controller.fields.color          = FieldColor;
Controller.fields.custom         = FieldCustom;
Controller.fields.dataset        = FieldDataset;
Controller.fields.group          = FieldGroup;
Controller.fields.hidden         = FieldHidden;
Controller.fields.input          = FieldInput;
Controller.fields.mask           = FieldMask;
Controller.fields.modal          = FieldModal;
Controller.fields.number         = FieldNumber;
Controller.fields.radio          = FieldRadio;
Controller.fields.radioBtn       = FieldRadioBtn;
Controller.fields.range          = FieldRange;
Controller.fields.select         = FieldSelect;
Controller.fields.switch         = FieldSwitch;
Controller.fields.textarea       = FieldTextarea;
Controller.fields.wysiwyg        = FieldWysiwyg;
Controller.fields.passwordRepeat = FieldPasswordRepeat;
Controller.fields.file           = FieldFile;
Controller.fields.fileUpload     = FieldFileUpload;

export default Controller;