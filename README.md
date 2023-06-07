# CoreUI form

**[DEMO](https://shabuninil.github.io/coreui-form)**


### Install with NPM

`npm install coreui-form`

### Example usage

![Preview](https://raw.githubusercontent.com/shabuninil/coreui-form/master/preview.png)

```html
<div id="form-all"></div>

<script>
    let allOptions = {
        id: "myform",
        lang: 'en',
        title: 'Form title',
        save: {
            url: '/path/to/object/1',
            method: 'post'
        },
        width: '100%',
        minWidth: 500,
        maxWidth: '100%',
        controlsWidth: 150,
        labelWidth: 150,
        fieldWidth: 200,
        readonly: false,
        validate: true,
        errorClass: 'error1 error2',
        onSubmit: function() { return false; },
        layout:
                '<div class="d-flex flex-wrap">' +
                '<div style="width: 500px">[column_left]</div>' +
                '<div class="flex-fill">[column_right]</div>' +
                '<div class="border-bottom w-100 my-4"></div>' +
                '<div class="w-100">[column_default]</div>' +
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
            { type: 'group', label: 'Text and numbers', show: true, showCollapsible: true, column: 'left',
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
                    { type: 'mask',     name: 'mask',     label: 'Mask',      mask: '0000 AA-0', options: { translation: { A: {pattern: /[A-Z]/}, } } },
                    { type: 'number',   name: 'float',    label: 'Float',     width: 100, attr: { min: -2, max: 50, step: 0.1 }, precision: 2 },
                    { type: 'number',   name: 'int',      label: 'Int',       width: 100, attr: { min: -2, max: 50 }, },
                    { type: 'email',    name: 'email',    label: 'Email'},
                    { type: 'tel',      name: 'tel',      label: 'Phone',     attr: { pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}" } },
                    { type: 'url',      name: 'url',      label: 'Url',       attr: { pattern: "https://.*" } },
                    { type: 'password', name: 'password', label: 'Password',  attr: { minlength: 8 }, outContent: ' <i>min length 8</i>' },
                    { type: 'textarea', name: 'textarea', label: 'Text Area', attr: { style: 'height:60px; resize: vertical' }, description: 'Description text' },
                    { type: 'hidden',   name: 'hidden' }
                ]
            },

            { type: 'group', label: 'Date and time', column: 'right', id: 'group_id',
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

            { type: 'select', name: 'select', label: 'Select', width: 200, column: 'default',
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
                options: [
                    { value: 1, text: 'Adams John' },
                    { value: 2, text: 'Johnson Peter' },
                    { value: 3, text: 'Lewis Frank' },
                    { value: 4, text: 'Cruz Steve' },
                    { value: 5, text: 'Donnun Nick' },
                ]
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

            { type: 'custom',  label: 'Custom', content: "<i>html</i>" },
            { type: 'wysiwyg', name: 'wysiwyg', label: 'Wysiwyg', width: 600, height: 300, options: 'simple' }
        ],
        controls: [
            { type: "submit", content: "Save",   onClick: function (e) { } },
            { type: "button", content: "Button", onClick: function (e) { } },
            { type: "link",   content: "Link", href: "#" },
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
</script>
```