# CoreUI layout


### Install with NPM

`npm install coreui-layout`

### Example usage

```js

CoreUI.layout.show("Title layout", "Body content", {
    footer: "Footer content",
    onShow: function (event) {
        console.log('Show');
    },
    onShown: function (event) {
        console.log('Shown');
    },
    onHide: function (event) {
        console.log('Hide');
    },
    onHidden: function (event) {
        console.log('Hidden');
    },
    onHidePrevented: function (event) {
        console.log('Hide prevented');
    }
})

```

![Layout](https://raw.githubusercontent.com/n2ref/coreui-layout/main/preview.png) 
