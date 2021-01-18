# bootstrap-show-modal

jQuery plugin to create bootstrap 4 modals in pure JavaScript.

[Demo Page](https://shaack.com/projekte/bootstrap-show-modal)


## Installation

```bash
npm install bootstrap-show-modal
```

Or just download this repository and include `src/bootstrap-show-modal.js`.

## Usage

### Simple Modal
```javascript
$.showModal({title: "Hello World!", body: "A very simple modal dialog without buttons."})
```

### Alert Dialog
```javascript
$.showAlert({title: "Hi", body: "Please press ok, if you like or dislike cookies."})
```

### Confirm Dialog
```javascript
$.showConfirm({
    title: "Please confirm", body: "Do you like cats?", textTrue: "Yes", textFalse: "No",
    onSubmit: function (result) { // callback on confirm
        if (result) {
            $.showAlert({title: "Result: " + result, body: "You like cats."})
        } else {
            $.showAlert({title: "Result: " + result, body: "You don't like cats."})
        }
    },
    onDispose: function() {
        console.log("The confirm dialog vanished")
    }
})
```

## Properties

```javascript
props = {
    title: "", // the dialog title html
    body: "", // the dialog body html
    footer: "", // the dialog footer html (mainly used for buttons)
    modalClass: "fade", // Additional css for ".modal", "fade" for fade effect
    modalDialogClass: "", // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
    options: null, // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
    // Events:
    onCreate: null, // Callback, called after the modal was created
    onShown: null, // Callback, called after the modal was shown and completely faded in
    onDispose: null, // Callback, called after the modal was disposed
    onSubmit: null // Callback of $.showConfirm(), called after yes or no was pressed
}
```

See the [Bootstrap 4 Modal documentation](https://getbootstrap.com/docs/4.0/components/modal/) for possible
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
uglifyjs bootstrap-show-modal.js --compress --mangle > bootstrap-show-modal.min.js
```

## Browser support

It works in all modern browsers and in the Internet Explorer. Not tested with IE < 11.
 
# More Bootstrap extensions from shaack.com

You may want to check out our other Bootstrap and HTML extensions

- [bootstrap-input-spinner](https://shaack.com/en/open-source-components) – Input numbers
- [bootstrap-show-modal](https://shaack.com/en/open-source-components) – Show dialogs, dynamically
- [bootstrap-show-notification](https://shaack.com/en/open-source-components) – Show notifications, dynamically
- [bootstrap-detect-breakpoint](https://shaack.com/en/open-source-components) – Read the curr. BS BP from JS
- [auto-resize-textarea](https://shaack.com/en/open-source-components) – Auto resize textareas by its content
- [external-links-blank](https://shaack.com/en/open-source-components) – Open external links auto `_blank`

