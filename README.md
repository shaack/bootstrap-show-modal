# bootstrap-show-modal

bootstrap plugin to create bootstrap modals in pure JavaScript.

> This version is compatible with **Bootstrap 5**, but we remain a Bootstrap 4 compatible version with the branch
> <a href="https://github.com/shaack/bootstrap-show-modal/tree/bootstrap4-compatible">bootstrap4-compatible</a>.
> npm package versions 3.x are Bootstrap 5 compatible, versions 1.x Bootstrap 4 compatible.

> **With version 5.x of bootstrap-shop-modal we completely removed jQuery 🥳 🚀**

## References

- [Demo page with usage examples](https://shaack.com/projekte/bootstrap-show-modal)
- [GitHub repository](https://github.com/shaack/bootstrap-show-modal)
- [npm package](https://www.npmjs.com/package/bootstrap-show-modal)

## Installation

```bash
npm install bootstrap-show-modal
```

Or just download this repository and include `src/ShowModal.js`.

## Usage

### Simple Modal
```javascript
bootstrap.showModal({title: "Hello World!", body: "A very simple modal dialog without buttons."})
```

### Alert Dialog
```javascript
bootstrap.showAlert({title: "Hi", body: "Please press ok, if you like or dislike cookies."})
```

### Confirm Dialog
```javascript
bootstrap.showConfirm({
    title: "Please confirm", body: "Do you like cats?", textTrue: "Yes", textFalse: "No",
    onSubmit: function (result) { // callback on confirm
        if (result) {
            bootstrap.showAlert({title: "Result: " + result, body: "You like cats."})
        } else {
            bootstrap.showAlert({title: "Result: " + result, body: "You don't like cats."})
        }
    },
    onDispose: function() {
        console.log("The confirm dialog vanished")
    }
})
```

## Properties

```javascript
this.props = {
    title: "", // the dialog title html
    body: "", // the dialog body html
    footer: "", // the dialog footer html (mainly used for buttons)
    modalClass: "fade", // Additional css for ".modal", "fade" for fade effect
    modalDialogClass: "", // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
    options: { // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
        backdrop: 'static' // disallow closing on click in the background
    },
    draggable: false, // make the dialog draggable 🆕
    // Events:
    onCreate: null, // Callback, called after the modal was created
    onShown: null, // Callback, called after the modal was shown and completely faded in
    onDispose: null, // Callback, called after the modal was disposed
    onSubmit: null // Callback of bootstrap.showConfirm(), called after yes or no was pressed
}
```

See the [Bootstrap Modal documentation](https://getbootstrap.com/docs/5.3/components/modal/) for possible
values of `options`, `modalClass` and `modalDialogClass`.

## Minified version

I don't provide a minified version because I think it should be up to the using programmer 
to create minified versions, with all the used script sources concatenated to one file.

But, if you want it, it is easy to create your minified version with uglify: https://www.npmjs.com/package/uglify-js

Just install uglify
```bash
npm install uglify-js -g
```
and then in the src-folder
```bash
uglifyjs ShowModal.js --compress --mangle > ShowModal.min.js
```

## Browser support

It works in all modern browsers and in the Internet Explorer. Not tested with IE < 11.
 
---

Find more high quality modules from [shaack.com](https://shaack.com)
on [our projects page](https://shaack.com/works).

