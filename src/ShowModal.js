/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/bootstrap-show-modal
 * License: MIT, see file 'LICENSE'
 */

export class Modal {
    constructor(props) {
        this.props = {
            title: "", // the dialog title html
            body: "", // the dialog body html
            footer: "", // the dialog footer html (mainly used for buttons)
            modalClass: "fade", // Additional css for ".modal", "fade" for fade effect
            modalDialogClass: "", // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
            headerClass: "", // Additional css for ".modal-header"
            bodyClass: "", // Additional css for ".modal-body"
            footerClass: "", // Additional css for ".modal-footer"
            theme: undefined, // data-bs-theme
            options: { // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
                backdrop: 'static' // disallow closing on click in the background
            },
            draggable: false, // make the dialog draggable
            // Events:
            onCreate: null, // Callback, called after the modal was created
            onShown: null, // Callback, called after the modal was shown and completely faded in
            onDispose: null, // Callback, called after the modal was disposed
            onSubmit: null // Callback of bootstrap.showConfirm(), called after yes or no was pressed
        }
        Object.assign(this.props, props)
        this.id = "bootstrap-show-modal-" + i
        i++
        this.show()
        if (this.props.onCreate) {
            this.props.onCreate(this)
        }
    }

    createContainerElement() {
        const self = this
        this.element = document.createElement("div")
        this.element.id = this.id
        let cssClass = "modal " + this.props.modalClass
        // seems to be a bug in bootstrap, but I am not sure
        if(this.props.theme === "dark") {
            cssClass += " text-light"
        }
        this.element.setAttribute("class", cssClass)
        this.element.setAttribute("tabindex", "-1")
        this.element.setAttribute("role", "dialog")
        this.element.setAttribute("aria-labelledby", this.id)
        if (this.props.theme) {
            this.element.setAttribute("data-bs-theme", this.props.theme)
        }
        this.element.innerHTML = `
<div class="modal-dialog ${this.props.modalDialogClass}" role="document">
    <div class="modal-content">
    <div class="modal-header ${this.props.headerClass}">
        <h5 class="modal-title"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body ${this.props.bodyClass}"></div>
    <div class="modal-footer ${this.props.footerClass}"></div>
    </div>
</div>`
        document.body.appendChild(this.element)
        this.titleElement = this.element.querySelector(".modal-title")
        this.bodyElement = this.element.querySelector(".modal-body")
        this.footerElement = this.element.querySelector(".modal-footer")
        this.element.addEventListener('hidden.bs.modal', function () {
            self.dispose()
        })
        this.element.addEventListener('shown.bs.modal', function () {
            if (self.props.onShown) {
                self.props.onShown(self)
            }
        })
    }

    show() {
        if (!this.element) {
            this.createContainerElement()
            if (this.props.options) {
                const modalInstance = new bootstrap.Modal(this.element, this.props.options)
                if (modalInstance) {
                    modalInstance.show()
                }
            } else {
                const modalInstance = new bootstrap.Modal(this.element)
                if (modalInstance) {
                    modalInstance.show()
                }
            }
        } else {
            const modalInstance = bootstrap.Modal.getInstance(this.element)
            if (modalInstance) {
                modalInstance.show()
            }
        }
        if (this.props.title) {
            this.titleElement.style.display = ""
            this.titleElement.innerHTML = this.props.title
        } else {
            this.titleElement.style.display = "none"
        }
        if (this.props.body) {
            this.bodyElement.style.display = ""
            this.bodyElement.innerHTML = this.props.body
        } else {
            this.bodyElement.style.display = "none"
        }
        if (this.props.footer) {
            this.footerElement.style.display = ""
            this.footerElement.innerHTML = this.props.footer
        } else {
            this.footerElement.style.display = "none"
        }
    }

    hide() {
        const modalInstance = bootstrap.Modal.getInstance(this.element)
        if (modalInstance) {
            modalInstance.hide()
        }
    }

    dispose() {
        const modalInstance = bootstrap.Modal.getInstance(this.element)
        if (modalInstance) {
            modalInstance.dispose()
        }
        document.body.removeChild(this.element)
        if (this.props.onDispose) {
            this.props.onDispose(this)
        }
    }
}

let i = 0
bootstrap.showModal = (props) => {
    if (props.buttons) {
        let footer = ""
        for (let key in props.buttons) {
            const buttonText = props.buttons[key]
            footer += `<button type="button" class="btn btn-primary" data-value="${key}" data-bs-dismiss="modal">${buttonText}</button>`
        }
        props.footer = footer
    }
    return new Modal(props)
}

bootstrap.showAlert = (props) => {
    props.buttons = {OK: 'OK'}
    return bootstrap.showModal(props)
}

bootstrap.showConfirm = (props) => {
    props.footer = `<button class="btn btn-secondary btn-false btn-cancel">${props.textFalse}</button><button class="btn btn-primary btn-true">${props.textTrue}</button>`
    props.onCreate = (modal) => {
        const modalInstance = bootstrap.Modal.getInstance(modal.element)
        modal.element.querySelector(".btn-false").addEventListener("click", function () {
            if (modalInstance) {
                modalInstance.hide()
            }
            modal.props.onSubmit(false, modal)
        })
        modal.element.querySelector(".btn-true").addEventListener("click", function () {
            if (modalInstance) {
                modalInstance.hide()
            }
            modal.props.onSubmit(true, modal)
        })
    }
    return bootstrap.showModal(props)
}
