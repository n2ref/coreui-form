document.addEventListener('DOMContentLoaded', function () {

    // Simple
    let simpleOptions = {
        send: {
            url: '/path/to/object/1',
            method: 'post'
        },
        record: {
            text: 'default text value',
            textarea: "123",
            date: "2023-01-01"
        },
        fields: [
            { type: 'text',     name: 'text',     label: 'Text',      width: 180 },
            { type: 'date',     name: 'date',     label: 'Date',      width: 180 },
            { type: 'textarea', name: 'textarea', label: 'Text Area', width: 180, attr: { style: 'height:60px; resize: vertical' }, description: 'Description text' }
        ],
        onSubmit: function() { return false; },
        controls: [
            { type: "submit", content: "Save" },
        ],
    };

    let formSimple = CoreUI.form.create(simpleOptions);
    formSimple.render('form-simple');


    // Group
    let groupOptions = {
        fields: [
            { type: 'group', label: 'Group collapsible', show: false,
                fields: [
                    { type: 'text',     name: 'text',     label: 'Text',      width: 180 },
                    { type: 'number',   name: 'float',    label: 'Float',     width: 180, attr: { min: -2, max: 50, step: 0.1 }, precision: 2 },
                    { type: 'date',     name: 'date',     label: 'Date',      width: 180 },
                ]
            },
            { type: 'group', label: 'Group 2', show: true, showCollapsible: false,
                fields: [
                    { type: 'textarea', name: 'textarea', label: 'Text Area', width: 180, attr: { style: 'height:60px; resize: vertical' }, description: 'Description text' }
                ]
            }
        ]
    };

    let formGroups = CoreUI.form.create(groupOptions);
    formGroups.render('form-groups');


    // Control types
    let controlsOptions = {
        fields: [
            { type: 'text', name: 'text', label: 'Text', width: 180}
        ],
        onSubmit: function() { return false; },
        controls: [
            { type: "submit", content: "Submit", onClick: function (form, e) { console.log('submit click') } },
            { type: "button", content: "Button", onClick: function (form, e) { console.log('button click') } },
            { type: "link",   content: "Link",   url: "#link-url", onClick: function (form, e) { console.log('link click') } },
            { type: "custom", content:
                '<div class="form-check">' +
                    '<label class="form-check-label">' +
                        '<input class="form-check-input" type="checkbox">Custom control' +
                    '</label>' +
                '</div>'
            }
        ],
    };

    let formControls = CoreUI.form.create(controlsOptions);
    formControls.render('form-controls');


    // Attach fields
    let attachOptions = {
        send: {
            url: '/path/to/object/1',
            method: 'post'
        },
        record: {
            text: 'Text value',
            date1: "2023-01-01",
            number0: 0,
            number1: 1,
            number2: 2,
            number3: 3,
            phone1: '+1-234-567',
            phone2: '+1-234-567',
            email1: 'example@mail.com',
            email2: 'example@mail.com'
        },
        fields: [
            { type: 'text', name: 'text',  label: 'Text', width: 180,
                fields: [
                    { type: 'number', name: 'number0', width: 90 }
                ]
            },
            { type: 'date', name: 'date1', label: 'Date range', width: 135,
                fields: [
                    { type: 'date', name: 'date2', width: 135 }
                ]
            },
            { type: 'number', name: 'number1', label: 'Numbers', width: 89,
                fields: [
                    { type: 'number', name: 'number2', width: 89 },
                    { type: 'range',  name: 'number3', width: 89, attr: { min: 0, max: 10, step: 1 } }
                ]
            },
            { type: 'tel', name: 'phone1', label: 'Contacts', width: 200, fieldsDirection: 'column',
                fields: [
                    { type: 'tel',   name: 'phone2', width: 200 },
                    { type: 'email', name: 'email1', width: 200 },
                    { type: 'email', name: 'email2', width: 200 }
                ]
            }
        ]
    };

    let formAttach = CoreUI.form.create(attachOptions);
    formAttach.render('form-attache');


    // Layout
    let layoutOptions = {
        send: {
            url: '/path/to/object/1',
            method: 'post'
        },
        controlsOffset: 0,
        layout:
            '<div class="d-flex flex-wrap">' +
                '<div class="rounded-3 border border-1 shadow-sm p-2 me-3 mb-3" style="width: 315px">' +
                    '<h6>Position left</h6>' +
                    '[position_left]' +
                '</div>' +

                '<div class="flex-fill rounded-3 border border-1 shadow-sm p-2 mb-3">' +
                    '<h6>Position right</h6>' +
                    '[position_right]' +
                '</div>' +

                '<div class="w-100 text-center text-success m-3">custom html content</div>' +

                '<div class="w-100 rounded-3 border border-1 shadow-sm p-2 mb-3">' +
                    '<h6>Position default</h6>' +
                    '[position_default]' +
                '</div>' +
            '</div>',
        fields: [
            { type: 'text',   position: 'left',  name: 'text',   label: 'Text',   labelWidth: 100, width: 180 },
            { type: 'number', position: 'left',  name: 'number', label: 'Number', labelWidth: 100, width: 180 },
            { type: 'date',   position: 'right', name: 'date',   label: 'Date',   labelWidth: 100, width: 180 },
            { type: 'group',  label: 'Group 2', show: true,
                fields: [
                    { type: 'textarea', name: 'textarea', label: 'Text Area', labelWidth: 150, width: 180, attr: { style: 'height:60px; resize: vertical' }, description: 'Description text' }
                ]
            }
        ],
        onSubmit: function() { return false; },
        controls: [
            { type: "submit", content: "Save" },
        ],
    };

    let formLayout = CoreUI.form.create(layoutOptions);
    formLayout.render('form-layout');


    // Readonly
    let readonlyOptions = {
        readonly: true,
        record: {
            text: 'Text value',
            textarea: "123",
            date: "2023-01-01",
            select: 2,
            checkbox: [1, 3],
        },
        fields: [
            { type: 'text',     name: 'text',     label: 'Text',      width: 180 },
            { type: 'date',     name: 'date',     label: 'Date',      width: 180 },
            { type: 'textarea', name: 'textarea', label: 'Text Area', width: 180, attr: { style: 'height:60px; resize: vertical' }, description: 'Description text' },
            { type: 'checkbox', name: 'checkbox', label: 'Check box',
                options: [
                    { value: 1, text: 'Check 1' },
                    { value: 2, text: 'Check 2' },
                    { value: 3, text: 'Check 3' }
                ]
            },
        ],
        controls: [
            { type: "button", content: "Writable all",  onClick: function (form, e) { form.readonly(false); } },
            { type: "button", content: "Readonly all",  onClick: function (form, e) { form.readonly(true); } },
            { type: "button", content: "Text writable", onClick: function (form, e) { form.getField('text').readonly(false); }, attr: { class: 'btn btn-success' } },
            { type: "button", content: "Text readonly", onClick: function (form, e) { form.getField('text').readonly(true); },  attr: { class: 'btn btn-success' } }
        ]
    };

    let formReadonly = CoreUI.form.create(readonlyOptions);
    formReadonly.render('form-readonly');


    // Validation
    let validationOptions = {
        validate: true,
        record: {
            phone: "abc",
            email: "example",
            date: "2023-06-01",
        },
        fields: [
            { type: 'text',           name: 'text',     label: 'Text',      width: 180, required: true, description: "Required field" },
            { type: 'tel',            name: 'phone',    label: 'Phone',     width: 180, attr: { pattern: '\\+[\\d\\-]+' }, description: "Phone format", invalidText: "format +1234" },
            { type: 'email',          name: 'email',    label: 'Email',     width: 180 },
            { type: 'passwordRepeat', name: 'pass',     label: 'Password',  width: 180, required: true, showBtn: true },
            { type: 'date',           name: 'date',     label: 'Date',      width: 180, attr: { min: "2023-06-06", max: "2023-06-14" }, description: "Date range validation" },
            { type: 'textarea',       name: 'textarea', label: 'Text area', width: 180, attr: { style: 'height:60px; resize: vertical' }, invalidText: "Invalid field text", validText: "Valid field text" }
        ],
        controls: [
            { type: "submit", content: "Save" },
            { type: "button", content: "Is valid text field", onClick: function (form, e) { alert(form.getField('text').isValid()); } },
            { type: "button", content: "Invalid text",        onClick: function (form, e) { form.getField('textarea').validate(false); } },
            { type: "button", content: "Valid text",          onClick: function (form, e) { form.getField('textarea').validate(true); } },
            { type: "button", content: "Custom validate",     onClick: function (form, e) { form.getField('textarea').validate(false, "Custom invalid text"); } },
            { type: "button", content: "Hide validate",       onClick: function (form, e) { form.getField('textarea').validate(null); } }
        ]
    };

    let formValidation = CoreUI.form.create(validationOptions);
    formValidation.render('form-validation');


    // Other methods
    let methodsOptions = {
        record: {
            text: "Text value",
            textarea: "Textarea value"
        },
        fields: [
            { type: 'text',  name: 'text',  label: 'Text', labelWidth: 100, width: 180, required: true },
            { type: 'group', label: 'Group fields', show: true,
                fields: [
                    { type: 'textarea', name: 'textarea', label: 'Text area', labelWidth: 100, width: 180, attr: { style: 'height:60px' }}
                ]
            }
        ],
        controlsOffset: 100,
        controls: [
            { type: "submit", content: "Save" },
            { type: "button", content: "Lock",              onClick: function (form) { form.lock(); } },
            { type: "button", content: "Unlock",            onClick: function (form) { form.unlock(); } },
            { type: "button", content: "getOptions",        onClick: function (form) { alert(JSON.stringify(form.getOptions())); } },
            { type: "button", content: "getRecord",         onClick: function (form) { alert(JSON.stringify(form.getRecord())) } },
            { type: "button", content: "getData",           onClick: function (form) { alert(JSON.stringify(form.getData())) } },
            { type: "button", content: "showError",         onClick: function (form) { form.showError('Text error') } },
            { type: "button", content: "hideError",         onClick: function (form) { form.hideError() } },
            { type: "button", content: "getFields (log)",   onClick: function (form) { console.log(form.getFields()) }, attr: { class: 'btn btn-dark' } },
            { type: "button", content: "getField (log)",    onClick: function (form) { console.log(form.getField('text')) }, attr: { class: 'btn btn-dark' } },
            { type: "button", content: "getControls (log)", onClick: function (form) { console.log(form.getControls()) }, attr: { class: 'btn btn-dark' } },
            { type: "button", content: "getGroups (log)",   onClick: function (form) { console.log(form.getGroups()) }, attr: { class: 'btn btn-dark' } },
        ]
    };

    let formMethods = CoreUI.form.create(methodsOptions);
    formMethods.render('form-methods');


    // Events
    let eventsOptions = {
        send: {
            url: '/path/to/object/1',
            method: 'post'
        },
        record: {
            text: "Text value",
            modal: { value: "1", text: "text modal" }
        },
        labelWidth: 100,
        fields: [
            { type: 'text',  name: 'text',  label: 'Text',  width: 250 },
            { type: 'modal', name: 'modal', label: 'Modal', width: 250,
                options: {
                    title: 'Modal title',
                    size: 'md',
                    url: 'data/modal.html',
                    onShow:   function () { console.log('modal onShow') },
                    onHidden: function () { console.log('modal onHidden') },
                    onClear:  function () { console.log('modal onClear') },
                    onChange: function () { console.log('modal onChange') },
                }
            },
        ],
        onSubmit: function() { console.log('form onSubmit'); },
        controls: [
            { type: "submit", content: "Submit" },
            { type: "button", content: "Button", onClick: function () { console.log('button onClick') } },
        ]
    };

    let formEvents = CoreUI.form.create(eventsOptions);

    formEvents.on('modal_load_before',   function(modal, xhr) {                          console.log('modal before-load-modal') } );
    formEvents.on('modal_load_success',  function(modal, result) {                       console.log('modal success-load-modal') } );
    formEvents.on('modal_load_error',    function(modal, xhr, textStatus, errorThrown) { console.log('modal error-load-modal') } );
    formEvents.on('modal_load_complete', function(modal, xhr, textStatus) {              console.log('modal complete-load-modal') } );
    formEvents.on('modal_select',        function(modal, xhr, textStatus) {              console.log('modal select-modal') } );

    formEvents.on('show',        function() {                                   console.log('form shown') } );
    formEvents.on('send',         function(form, data) {                         console.log('form send') } );
    formEvents.on('send_start',   function(form, xhr) {                          console.log('form start-send') } );
    formEvents.on('send_success', function(form, result) {                       console.log('form success-send') } );
    formEvents.on('send_error',   function(form, xhr, textStatus, errorThrown) { console.log('form error-send') } );
    formEvents.on('send_end',     function(form, xhr, textStatus) {              console.log('form end-send') } );

    formEvents.render('form-events');


    // File uploads
    let formFileUploads = CoreUI.form.create({
        send: {
            url: '/path/to/object/1',
            method: 'post'
        },
        record: {
            text: "Text value",
            files: [
                {
                    id: 1,
                    name: 'Cat.jpg',
                    size: 254361,
                    urlPreview: 'data/img/cat.jpg',
                    urlDownload: 'data/img/cat.jpg',
                },
                {
                    id: 2,
                    name: 'Flower.jpg',
                    size: 924160,
                    urlPreview: 'data/img/flower.jpg',
                    urlDownload: 'data/img/flower.jpg',
                },
            ]
        },
        fields: [
            { type: 'text',  name: 'text',  label: 'Text',  width: 250 },
            { type: 'fileUpload', name: 'files', label: 'File',
                options: {
                    url: 'data/file.json',
                    fieldName: 'file',
                    sizeLimit: 1024 * 1024,
                    filesLimit: 0
                }
            },
        ],
        onSubmit: function(form) {
            alert(JSON.stringify(form.getData()));
            return false;
        },
        controls: [
            { type: "submit", content: "Submit" },
        ]
    });

    formFileUploads.render('form-file-upload');


    // All
    let allOptions = {
        id: "myform",
        lang: 'en',
        title: 'Form title',
        send: {
            url: '/path/to/object/1',
            method: 'post',
            format: 'form'
        },
        validResponse: {
            headers : {
                'Content-Type': ['application/json', 'application/json; charset=utf-8']
            },
            dataType: ['json']
        },
        width: '100%',
        minWidth: 500,
        maxWidth: '100%',
        controlsOffset: 150,
        labelWidth: 150,
        fieldWidth: 200,
        readonly: false,
        validate: true,
        errorClass: 'error1 error2',
        onSubmit: function(form, data) { console.log(data); return false; },
        layout:
            '<div class="d-flex flex-wrap">' +
                '<div style="width: 500px">[position_left]</div>' +
                '<div class="flex-fill">[position_right]</div>' +
                '<div class="border-bottom w-100 my-4"></div>' +
                '<div class="w-100">[position_default]</div>' +
            '</div>',
        record: {
            text: 'default text value',
            mask: '1234 AB-7',
            int: 10,
            float: -1.1,
            range: 40,
            email: 'example@mail.com',
            tel: '123-456-7890',
            url: 'https://www.example.com',
            color: '#695D98',
            password: 123,
            password2: 123,
            textarea: "123",

            date: "2023-01-01",
            time: "12:00",
            datetime: "2023-06-12 19:30:00",
            date_month: "2023-01",
            date_week: "2023-W18",

            select: 2,
            select_multiple: [ 2, 3 ],
            modal: { value: 1, text: "text" },
            dataset: [
                { nmbr: 123,   date_order: "2023-01-01" },
                { nmbr: "234", date_order: "2023-02-01" },
            ],
            checkbox: [ 1, 3 ],
            radio: 2,
            is_active_sw: 'Y',
            hidden: 'value',
            wysiwyg: 'Simple wysiwyg editor'
        },
        fields: [
            { type: 'group', label: 'Text and numbers', show: true, showCollapsible: true, position: 'left',
                fields: [
                    { type: 'text', name: 'text', label: 'Text', attr: { minlength: 3, maxlength: 255 }, required: true, invalidText: 'Required field',
                        datalist: [
                            { value: 'Adams, John',    label: 'Group 1' },
                            { value: 'Johnson, Peter', label: 'Group 1' },
                            { value: 'Lewis, Frank',   label: 'Group 2' },
                            { value: 'Cruz, Steve',    label: 'Group 2' },
                            { value: 'Donnun, Nick',   label: 'Group 2' }
                        ]
                    },
                    { type: 'mask',           name: 'mask',      label: 'Mask',      mask: '0000 AA-0', options: { translation: { A: {pattern: /[A-Z]/}, } } },
                    { type: 'number',         name: 'float',     label: 'Float',     width: 100, attr: { min: -2, max: 50, step: 0.1 }, precision: 2 },
                    { type: 'number',         name: 'int',       label: 'Int',       width: 100, attr: { min: -2, max: 50 }, },
                    { type: 'email',          name: 'email',     label: 'Email'},
                    { type: 'tel',            name: 'tel',       label: 'Phone',     attr: { pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}" } },
                    { type: 'url',            name: 'url',       label: 'Url',       attr: { pattern: "https://.*" } },
                    { type: 'password',       name: 'password',  label: 'Password',  attr: { minlength: 8 }, outContent: ' <i>min length 8</i>' },
                    { type: 'passwordRepeat', name: 'password2', label: 'Password repeat', width: 100, showBtn: true },
                    { type: 'textarea',       name: 'textarea',  label: 'Text Area', attr: { style: 'height:60px; resize: vertical' }, description: 'Description text' },
                    { type: 'hidden',         name: 'hidden' }
                ]
            },

            { type: 'group', label: 'Date and time', position: 'right', id: 'group_id',
                fields: [
                    { type: 'date',           name: 'date',       label: 'Date',       width: 110, },
                    { type: 'time',           name: 'time',       label: 'time',       width: 110, },
                    { type: 'datetime-local', name: 'datetime',   label: 'Date time',  attr: { min: "2023-06-06 00:00:00", max: "2023-06-14 00:00:00" } },
                    { type: 'month',          name: 'date_month', label: 'Date month', },
                    { type: 'week',           name: 'date_week',  label: 'Date week', },
                    { type: 'date',           name: 'date_rage1', label: 'Date range', width: 110,
                        fields: [
                            { type: 'date', name: 'date_rage2', width: 110 }
                        ]
                    },
                ]
            },


            { type: 'color', name: 'color', label: 'Color' },
            { type: 'range', name: 'range', label: 'Range',  width: 200, attr: { min: 0, max: 100, step: 1 },
                datalist: [
                    { value: '10' },
                    { value: '20' },
                    { value: '30' },
                ]
            },

            { type: 'select', name: 'select', label: 'Select', width: 200, position: 'default',
                options: [
                    { value: '', text: 'No value' },
                    { type: "group", label: 'Group 1',
                        options : [
                            { value: 1, text: 'Adams John' },
                            { value: 2, text: 'Johnson Peter' },
                        ]
                    },
                    { type: "group", label: 'Group 2', attr: { class: "group-class"  },
                        options : [
                            { value: 3, text: 'Lewis Frank' },
                            { value: 4, text: 'Cruz Steve' },
                            { value: 5, text: 'Donnun Nick' }
                        ]
                    }
                ]
            },
            { type: 'select', name: 'select_multiple', label: 'Multiple', width: 200, attr: { multiple: "multiple" },
                options: {
                    '1': 'Adams John',
                    '2': 'Johnson Peter',
                    '3': 'Lewis Frank',
                    '4': 'Cruz Steve',
                    '5': 'Donnun Nick',
                }
            },
            { type: 'checkbox', name: 'checkbox', label: 'Check box',
                options: [
                    { value: 1, text: 'Check 1' },
                    { value: 2, text: 'Check 2' },
                    { value: 3, text: 'Check 3' }
                ]
            },
            { type: 'radio', name: 'radio', label: 'Radio Box', invalidText: 'Required field',
                options: [
                    { value: 1, text: 'Radio 1' },
                    { value: 2, text: 'Radio 2' },
                    { value: 3, text: 'Radio 3' }
                ]
            },
            { type: 'switch', name: 'is_active_sw', label: 'Switch', valueY: 'Y', valueN: 'N' },
            { type: 'file',   name: 'file',         label: 'Files',  width: 300 },
            { type: 'modal',  name: 'modal',        label: 'Modal',  width: 300,
                options: {
                    title: 'Modal title',
                    size: 'lg',
                    url: 'data/modal.html',
                    onHidden: function () { console.log('onHidden') },
                    onClear:  function () { console.log('onClear') },
                    onChange: function () { console.log('onChange') },
                }
            },
            { type: 'dataset', name: 'dataset', label: 'Dataset',
                options: [
                    {
                        type:  'text',
                        title: 'Номер',
                        name:  'nmbr',
                        attr:  { style: 'width: 200px' }
                    },
                    {
                        type:  'date',
                        title: 'Дата',
                        name:  'date_order',
                        attr:  { style: 'width: 140px' }
                    }
                ]
            },

            { type: 'custom',  label: 'Custom', content: '<div class="mt-2"><i>html</i></div>' },
            { type: 'wysiwyg', name: 'wysiwyg', label: 'Wysiwyg', width: 600, height: 300, options: 'simple' }
        ],
        controls: [
            { type: "submit", content: "Save",   onClick: function (e) { } },
            { type: "button", content: "Button", onClick: function (e) { } },
            { type: "link",   content: "Link",   url: "#" },
            { type: "custom", content:
                '<div class="form-check">' +
                    '<label class="form-check-label">' +
                    '<input class="form-check-input" type="checkbox">' +
                    'Check me</label>' +
                '</div>'
            }
        ]
    };

    let form = CoreUI.form.create(allOptions);
    $('#form-all').html(form.render());
    form.initEvents();



    // Code highlight
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
});