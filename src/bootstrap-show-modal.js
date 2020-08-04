/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/bootstrap-show-modal
 * License: MIT, see file 'LICENSE'
 */

(function ($) {
    "use strict"

    var i = 0

    function Modal(props) {
        this.props = {
            title: "", // the dialog title html
            body: "", // the dialog body html
            footer: "", // the dialog footer html (mainly used for buttons)
            modalClass: "fade", // Additional css for ".modal", "fade" for fade effect
            modalDialogClass: "", // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
            options: null, // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
            // Events:
            onCreate: null, // Callback, called after the modal was created
            onDispose: null, // Callback, called after the modal was disposed
            onSubmit: null // Callback of $.showConfirm(), called after yes or no was pressed
        }
        for (var prop in props) {
            // noinspection JSUnfilteredForInLoop
            this.props[prop] = props[prop]
        }
        this.id = "bootstrap-show-modal-" + i
        i++
        this.show()
    }

    Modal.prototype.createContainerElement = function () {
        var self = this
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
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
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
        $(this.element).on('hidden.bs.modal', function () {
            self.dispose()
        })
        if (this.props.onCreate) {
            this.props.onCreate(this)
        }
    }

    Modal.prototype.show = function () {
        if (!this.element) {
            this.createContainerElement()
            if (this.props.options) {
                $(this.element).modal(this.props.options)
            } else {
                $(this.element).modal()
            }
        } else {
            $(this.element).modal('show')
        }
        if (this.props.title) {
            $(this.titleElement).show()
            this.titleElement.innerHTML = this.props.title
        } else {
            $(this.titleElement).hide()
        }
        if (this.props.body) {
            $(this.bodyElement).show()
            this.bodyElement.innerHTML = this.props.body
        } else {
            $(this.bodyElement).hide()
        }
        if (this.props.footer) {
            $(this.footerElement).show()
            this.footerElement.innerHTML = this.props.footer
        } else {
            $(this.footerElement).hide()
        }
    }

    Modal.prototype.hide = function () {
        $(this.element).modal('hide')
    }

    Modal.prototype.dispose = function () {
        $(this.element).modal('dispose')
        document.body.removeChild(this.element)
        if (this.props.onDispose) {
            this.props.onDispose(this)
        }
    }

    $.extend({
        showModal: function (props) {
            if (props.buttons) {
                var footer = ""
                for (var key in props.buttons) {
                    // noinspection JSUnfilteredForInLoop
                    var buttonText = props.buttons[key]
                    footer += '<button type="button" class="btn btn-primary" data-value="' + key + '" data-dismiss="modal">' + buttonText + '</button>'
                }
                props.footer = footer
            }
            return new Modal(props)
        },
        showAlert: function (props) {
            props.buttons = {OK: 'OK'}
            return this.showModal(props)
        },
        showConfirm: function (props) {
            props.footer = '<button class="btn btn-secondary btn-false btn-cancel">' + props.textFalse + '</button><button class="btn btn-primary btn-true">' + props.textTrue + '</button>'
            props.onCreate = function (modal) {
                $(modal.element).on("click", ".btn", function (event) {
                    event.preventDefault()
                    modal.hide()
                    modal.props.onSubmit(event.target.getAttribute("class").indexOf("btn-true") !== -1, modal)
                })
            }
            return this.showModal(props)
        }
    })

}(jQuery))