# bootstrap-show-modal

A Bootstrap 5 plugin to create [Bootstrap Modals](https://getbootstrap.com/docs/5.3/components/modal/) in pure JavaScript. No HTML markup needed, no jQuery, no dependencies besides Bootstrap itself.

```js
bootstrap.showModal({title: "Hello World!", body: "A very simple modal dialog."})
```

Besides plain modals there are `showAlert()` for a message with an OK button and `showConfirm()` for a yes/no question with a callback. The modal markup is created on the fly, shown immediately and removed from the DOM again when it was closed.

## References

- [Demo page with usage examples](https://shaack.com/projekte/bootstrap-show-modal)
- [GitHub repository](https://github.com/shaack/bootstrap-show-modal)
- [npm package](https://www.npmjs.com/package/bootstrap-show-modal)

## Compatibility

| bootstrap-show-modal | Bootstrap | Notes |
|---|---|---|
| 5.x and newer | 5 | ES module, no jQuery |
| 3.x and 4.x | 5 | with jQuery |
| 1.x | 4 | maintained in the branch [bootstrap4-compatible](https://github.com/shaack/bootstrap-show-modal/tree/bootstrap4-compatible) |

## Installation

```sh
npm install bootstrap-show-modal
```

Or load it from a CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap-show-modal@6/src/ShowModal.js"></script>
```

Or just copy `src/ShowModal.js` into your project. It is a single file.

## Usage

The plugin is an ES module that extends the global `bootstrap` object, so Bootstrap's JavaScript bundle has to be loaded before the module is imported.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script type="module">
    import "./node_modules/bootstrap-show-modal/src/ShowModal.js"

    bootstrap.showModal({title: "Hello World!", body: "A very simple modal dialog without buttons."})
</script>
```

### Simple modal

```js
bootstrap.showModal({title: "Hello World!", body: "A very simple modal dialog without buttons."})
```

The header close button is always there. Set `closeButtonClass: "btn-close-white"` on dark backgrounds and `closeButtonLabel` for its `aria-label` in your language.

### Alert dialog

A modal with an OK button that closes it.

```js
bootstrap.showAlert({title: "Hi", body: "Please press OK."})
```

### Confirm dialog

A modal with two buttons. `onSubmit` is called with `true` for the first button and `false` for the second, after which the dialog closes. `onSubmit` is required for `showConfirm()`.

```js
bootstrap.showConfirm({
    title: "Please confirm",
    body: "Do you like cats?",
    textTrue: "Yes",
    textFalse: "No",
    onSubmit: (result) => {
        bootstrap.showAlert({title: "Result: " + result, body: result ? "You like cats." : "You don't like cats."})
    },
    onDispose: () => {
        console.log("The confirm dialog vanished")
    }
})
```

Use `classTrue` and `classFalse` to style the buttons, for example a red confirm button for a destructive action. They default to `"btn btn-primary"` and `"btn btn-secondary"`.

```js
bootstrap.showConfirm({
    title: "Delete file?",
    body: "This cannot be undone.",
    textTrue: "Delete", classTrue: "btn btn-danger",
    textFalse: "Cancel", classFalse: "btn btn-outline-secondary",
    onSubmit: (result) => { /* ... */ }
})
```

### Buttons that just close the modal

`buttons` takes an object of value/label pairs and renders a primary button for each in the footer. Every button closes the modal. The value is stored in `data-value` on the button, in case you attach your own click listeners in `onCreate`.

```js
bootstrap.showModal({
    title: "Choose",
    body: "Red pill or blue pill?",
    buttons: {red: "Red pill", blue: "Blue pill"},
    onCreate: (modal) => {
        modal.element.querySelectorAll("[data-value]").forEach((button) => {
            button.addEventListener("click", () => console.log("chosen:", button.dataset.value))
        })
    }
})
```

### Custom footer and forms

For anything else, pass your own `footer` HTML and wire it up in `onCreate`. The modal object gives you access to the DOM element and to `hide()`.

```js
bootstrap.showModal({
    title: "Your name",
    body: `<form><input type="text" class="form-control" id="name" placeholder="Name"></form>`,
    footer: `<button type="button" class="btn btn-link" data-bs-dismiss="modal">Cancel</button>
             <button type="submit" class="btn btn-primary">Send</button>`,
    onCreate: (modal) => {
        modal.element.querySelector("button[type='submit']").addEventListener("click", (event) => {
            event.preventDefault()
            const name = modal.element.querySelector("#name").value
            modal.hide()
            bootstrap.showAlert({title: "Hello " + name})
        })
    },
    onShown: (modal) => {
        modal.element.querySelector("#name").focus()
    }
})
```

A button with `data-bs-dismiss="modal"` closes the modal without any JavaScript.

### Sizes, themes and classes

```js
// large dialog, dark theme
bootstrap.showModal({
    title: "Settings",
    body: "...",
    modalDialogClass: "modal-lg",
    theme: "dark"
})

// centered, scrollable, without fade animation
bootstrap.showModal({
    title: "Terms",
    body: longText,
    modalDialogClass: "modal-dialog-centered modal-dialog-scrollable",
    modalClass: ""
})

// closable by clicking the backdrop and with the escape key
bootstrap.showModal({
    title: "Info",
    body: "Click outside to close.",
    options: {backdrop: true, keyboard: true}
})
```

`theme` sets `data-bs-theme` on the modal, so `"dark"` and `"light"` work like everywhere in Bootstrap 5.3.

## API

### bootstrap.showModal(props)

Creates a `Modal`, shows it and returns it.

### bootstrap.showAlert(props)

Like `showModal()`, with a single OK button in the footer.

### bootstrap.showConfirm(props)

Like `showModal()`, with two buttons in the footer. Additional props:

| Prop | Default | Meaning |
|---|---|---|
| `textTrue` | | label of the confirm button, required |
| `textFalse` | | label of the cancel button, required |
| `classTrue` | `"btn btn-primary"` | classes of the confirm button |
| `classFalse` | `"btn btn-secondary"` | classes of the cancel button |
| `onSubmit` | | `(result, modal) => {}`, called with `true` or `false` when a button was pressed, required |

### Props

All props are optional unless stated otherwise. `title`, `body` and `footer` are HTML, so escape user input before putting it there.

| Prop | Default | Meaning |
|---|---|---|
| `title` | `""` | the dialog title, HTML. The header title is hidden when empty |
| `body` | `""` | the dialog body, HTML. The body is hidden when empty |
| `footer` | `""` | the dialog footer, HTML, mainly for buttons. The footer is hidden when empty |
| `buttons` | | object of value/label pairs, rendered as primary buttons that close the modal, see above |
| `modalClass` | `"fade"` | additional classes for `.modal`, `"fade"` enables the fade animation |
| `modalDialogClass` | `""` | additional classes for `.modal-dialog`, for example `"modal-lg"`, `"modal-sm"`, `"modal-dialog-centered"` or `"modal-dialog-scrollable"` |
| `headerClass` | `""` | additional classes for `.modal-header` |
| `bodyClass` | `""` | additional classes for `.modal-body` |
| `footerClass` | `""` | additional classes for `.modal-footer` |
| `closeButtonClass` | `""` | additional classes for the header close button, `"btn-close-white"` on dark backgrounds |
| `closeButtonLabel` | `"Close"` | `aria-label` of the header close button, for translation |
| `theme` | `undefined` | sets `data-bs-theme` on the modal, for example `"dark"` |
| `options` | `{backdrop: "static"}` | the [Bootstrap modal options](https://getbootstrap.com/docs/5.3/components/modal/#options). The default prevents closing by clicking the backdrop |
| `onCreate` | `null` | `(modal) => {}`, called right after the modal was created and shown, the place to attach event listeners |
| `onShown` | `null` | `(modal) => {}`, called when the modal is fully visible, after the fade animation |
| `onDispose` | `null` | `(modal) => {}`, called after the modal was hidden and removed from the DOM |
| `onSubmit` | `null` | `(result, modal) => {}`, used by `showConfirm()` |

### The Modal object

`showModal()`, `showAlert()` and `showConfirm()` return a `Modal` instance. The class is also exported, in case you prefer `new Modal(props)`.

```js
import {Modal} from "./node_modules/bootstrap-show-modal/src/ShowModal.js"
const modal = new Modal({title: "Hi"})
```

| Member | Meaning |
|---|---|
| `element` | the `.modal` DOM element |
| `id` | the element id, `bootstrap-show-modal-<n>` |
| `props` | the props merged with the defaults |
| `titleElement`, `bodyElement`, `footerElement` | the header title, body and footer elements |
| `show()` | called by the constructor, applies `title`, `body` and `footer` from `props`. A hidden modal is disposed, so create a new one instead of calling `show()` again |
| `hide()` | hides the modal. The modal is then disposed automatically |
| `dispose()` | removes the modal from the DOM and calls `onDispose` |

### Lifecycle

1. The modal is created and shown right away, then `onCreate` is called.
2. When the fade animation is over, `onShown` is called.
3. The modal is hidden by the close button, a button with `data-bs-dismiss="modal"`, `hide()` or, if `options` allow it, the backdrop or the escape key.
4. After hiding, the modal is disposed, removed from the DOM and `onDispose` is called.

To get Bootstrap's own `Modal` instance, for example for its events, use `bootstrap.Modal.getInstance(modal.element)`.

## Minified version

There is no minified build. Minify it together with the rest of your sources, or with [uglify-js](https://www.npmjs.com/package/uglify-js):

```sh
npm install -g uglify-js
uglifyjs src/ShowModal.js --compress --mangle > ShowModal.min.js
```

## Browser support

All modern browsers that support ES modules, which is every browser that runs Bootstrap 5.

## License

MIT, see [LICENSE](LICENSE). Author: [Stefan Haack](https://shaack.com)

---

Find more high quality modules from [shaack.com](https://shaack.com) on [our projects page](https://shaack.com/works).
