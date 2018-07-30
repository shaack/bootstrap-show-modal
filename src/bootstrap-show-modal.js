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
            modalClass: "", // Additional css for ".modal"
            modalDialogClass: "", // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm"
            options: null // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
        }
        Object.assign(this.props, props)
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
            '<form>' +
            '<div class="modal-body"></div>' +
            '<div class="modal-footer"></div>' +
            '</form>' +
            '</div>' +
            '</div>'
        document.body.appendChild(this.element)
        this.titleElement = this.element.querySelector(".modal-title")
        this.bodyElement = this.element.querySelector(".modal-body")
        this.footerElement = this.element.querySelector(".modal-footer")
        $(this.element).on('hidden.bs.modal', function () {
            self.dispose()
            self.element = null
            if (self.props.hidden) {
                self.props.hidden(this)
            }
        })
        if (this.props.created) {
            this.props.created(this)
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
    }

    $.extend({
        showModal: function (props, postCreate, callback) {
            return new Modal(props, postCreate, callback)
        },
        showAlert: function (props, postCreate, callback) {
            props.footer = '<button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>'
            return this.showModal(props, postCreate, callback)
        },
        showConfirm: function (props, postCreate, callback) {
            props.footer = '<button class="btn btn-secondary btn-false">' + props.textFalse + '</button><button class="btn btn-primary btn-true">' + props.textTrue + '</button>'
            props.created = function (modal) {
                $(modal.element).on("click", ".btn", function (event) {
                    event.preventDefault()
                    modal.hide()
                    modal.props.confirmed(event.target.getAttribute("class").indexOf("btn-true") !== -1)
                })
            }
            return this.showModal(props, postCreate, callback)
        }
    })

    // polyfill for Object.assign
    if (typeof Object.assign !== 'function') {
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) {
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object')
                }
                var to = Object(target)
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index]

                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey]
                            }
                        }
                    }
                }
                return to
            },
            writable: true,
            configurable: true
        })
    }

}(jQuery))