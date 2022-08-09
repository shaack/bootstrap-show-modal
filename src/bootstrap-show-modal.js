/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/bootstrap-show-modal
 * License: MIT, see file 'LICENSE'
 */

;(function (bootstrap) {
    "use strict"

    let i = 0

    function Modal(props) {
        this.props = {
            title: "", // the dialog title html
            body: "", // the dialog body html
            footer: "", // the dialog footer html (mainly used for buttons)
            modalClass: "fade", // Additional css for ".modal", "fade" for fade effect
            modalDialogClass: "", // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
            options: { // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
                backdrop: 'static' // disallow closing on click in the background
            },
            // Events:
            onCreate: null, // Callback, called after the modal was created
            onShown: null, // Callback, called after the modal was shown and completely faded in
            onDispose: null, // Callback, called after the modal was disposed
            onSubmit: null // Callback of bootstrap.showConfirm(), called after yes or no was pressed
        }
        for (let prop in props) {
            // noinspection JSUnfilteredForInLoop
            this.props[prop] = props[prop]
        }
        this.id = "bootstrap-show-modal-" + i
        i++
        this.show()
        if (this.props.onCreate) {
            this.props.onCreate(this)
        }
    }

    Modal.prototype.createContainerElement = function () {
        const self = this
        this.element = document.createElement("div")
        this.element.id = this.id
        this.element.setAttribute("class", "modal " + this.props.modalClass)
        this.element.setAttribute("tabindex", "-1")
        this.element.setAttribute("role", "dialog")
        this.element.setAttribute("aria-labelledby", this.id)
        this.element.innerHTML = '<div class="modal-dialog ' + this.props.modalDialogClass + '" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h5 class="modal-title"></h5>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">' +
            '</button>' +
            '</div>' +
            '<div class="modal-body"></div>' +
            '<div class="modal-footer"></div>' +
            '</div>' +
            '</div>'
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

    Modal.prototype.show = function () {
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

    Modal.prototype.hide = function () {
        const modalInstance = bootstrap.Modal.getInstance(this.element)
        if (modalInstance) {
            modalInstance.hide()
        }
    }

    Modal.prototype.dispose = function () {
        const modalInstance = bootstrap.Modal.getInstance(this.element)
        if (modalInstance) {
            modalInstance.dispose()
        }
        document.body.removeChild(this.element)
        if (this.props.onDispose) {
            this.props.onDispose(this)
        }
    }

    bootstrap.showModal = function (props) {
        if (props.buttons) {
            let footer = ""
            for (let key in props.buttons) {
                // noinspection JSUnfilteredForInLoop
                const buttonText = props.buttons[key]
                footer += '<button type="button" class="btn btn-primary" data-value="' + key + '" data-bs-dismiss="modal">' + buttonText + '</button>'
            }
            props.footer = footer
        }
        return new Modal(props)
    }
    bootstrap.showAlert = function (props) {
        props.buttons = {OK: 'OK'}
        return this.showModal(props)
    }
    bootstrap.showConfirm = function (props) {
        props.footer = '<button class="btn btn-secondary btn-false btn-cancel">' + props.textFalse + '</button><button class="btn btn-primary btn-true">' + props.textTrue + '</button>'
        props.onCreate = function (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal.element)
            modal.element.querySelector(".btn-false").addEventListener("click", function(event) {
                if (modalInstance) {
                    modalInstance.hide()
                }
                modal.props.onSubmit(false, modal)
            })
            modal.element.querySelector(".btn-true").addEventListener("click", function(event) {
                if (modalInstance) {
                    modalInstance.hide()
                }
                modal.props.onSubmit(true, modal)
            })
        }
        return this.showModal(props)
    }

}(bootstrap))
