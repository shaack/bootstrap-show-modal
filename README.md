# bootstrap-show-modal

jQuery plugin to create bootstrap 4 modals in pure JavaScript.

[Demo Page](https://shaack.com/projekte/bootstrap-show-modal)

## Installation

`npm install` installs bootstrap, popper.js and jQuery, needed for bootstrap modals.

## Usage

### Simple
```javascript
$.showModal({title: "Hello World!", body: "A very simple modal dialog without buttons."})
```

### Alert with fade effect
```javascript
$.showAlert({modalClass: "fade", title: "Hi", body: "Please press ok, if you like or dislike cookies."})
```

### Confirm
```javascript
$.showConfirm({
    title: "Please confirm", body: "Do you like cats?", textTrue: "Yes", textFalse: "No",
    confirmed: function (result) { // callback on confirm
        if (result) {
            $.showAlert({title: "Result: " + result, body: "You like cats."})
        } else {
            $.showAlert({title: "Result: " + result, body: "You don't like cats."})
        }
    },
    hidden: function() { // callback on hide
        console.log("The dialog was hidden.")
    }
})
```

## Properties

```javascript
props = {
    title: "", // the dialog title html
    body: "", // the dialog body html
    footer: "", // the dialog footer html (mainly used for buttons)
    created: null, // callback, called after the modal is created
    hidden: null, // callback, called after the modal is hidden 
    confirmed: null, // $.showConfirm only. callback, called after yes or no was pressed
    modalClass: "", // Additional css for ".modal", like "fade" for fade effect
    modalDialogClass: "", // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
    options: null // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
}
```

[Also see the Bootstrap 4 Modal documentation](https://getbootstrap.com/docs/4.0/components/modal/). 


