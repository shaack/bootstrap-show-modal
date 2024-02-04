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
        this.context = this.element
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
            const self = this

            this.element.addEventListener('shown.bs.modal', function () {

                if (self.props.resizeable) {
                    // alpha, resizing does not work yet
                    const resizer = document.createElement('div')
                    resizer.style.width = '20px'
                    resizer.style.height = '20px'
                    resizer.style.background = 'red'
                    resizer.style.position = 'absolute'
                    resizer.style.right = '0'
                    resizer.style.bottom = '0'
                    resizer.style.cursor = 'se-resize'

                    self.modalContent = self.element.querySelector(".modal-content")
                    self.modalContent.appendChild(resizer)

                    resizer.addEventListener('mousedown', initResize, false)

                    function initResize(e) {
                        window.addEventListener('mousemove', resize, false)
                        window.addEventListener('mouseup', stopResize, false)
                        self.clientX = e.clientX
                        self.clientY = e.clientY
                    }

                    function resize(e) {
                        self.modalContent.style.width = self.modalContent.getBoundingClientRect().width + (e.clientX - self.clientX) + 'px'
                        self.modalContent.style.height = self.modalContent.getBoundingClientRect().height + (e.clientY - self.clientY) + 'px'
                        self.clientX = e.clientX
                        self.clientY = e.clientY
                    }

                    function stopResize() {
                        window.removeEventListener('mousemove', resize, false)
                        window.removeEventListener('mouseup', stopResize, false)
                    }
                }

                if (self.props.draggable) {
                    const dialogHeader = self.element.querySelector('.modal-header')
                    dialogHeader.style.cursor = 'move'
                    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
                    if (dialogHeader) {
                        dialogHeader.onmousedown = dragMouseDown
                    } else {
                        self.element.onmousedown = dragMouseDown
                    }

                    function dragMouseDown(e) {
                        // get the mouse cursor position at startup
                        pos3 = e.clientX
                        pos4 = e.clientY
                        document.onmouseup = closeDragElement
                        // call a function whenever the cursor moves
                        document.onmousemove = elementDrag
                    }

                    function elementDrag(e) {
                        // calculate the new cursor position
                        pos1 = pos3 - e.clientX
                        pos2 = pos4 - e.clientY
                        pos3 = e.clientX
                        pos4 = e.clientY
                        // set the element's new position
                        self.element.style.top = (self.element.offsetTop - pos2) + "px"
                        self.element.style.left = (self.element.offsetLeft - pos1) + "px"
                    }

                    function closeDragElement() {
                        // stop moving when mouse button is released
                        document.onmouseup = null
                        document.onmousemove = null
                    }

                    if (self.props.onShown) {
                        self.props.onShown(self)
                    }
                }
            })
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
if(!window.bootstrap) {
    window.bootstrap = {}
}
let i = 0
bootstrap.showModal = (props) => {
    if (props.buttons) {
        let footer = "";
        for (let key in props.buttons) {
            const buttonText = props.buttons[key];
            footer += `<button type="button" class="btn btn-primary" data-value="${key}" data-bs-dismiss="modal">${buttonText}</button>`;
        }
        props.footer = footer;
    }
    return new Modal(props);
};

bootstrap.showAlert = (props) => {
    props.buttons = {OK: 'OK'};
    return bootstrap.showModal(props);
};

bootstrap.showConfirm = (props) => {
    props.footer = `<button class="btn btn-secondary btn-false btn-cancel">${props.textFalse}</button><button class="btn btn-primary btn-true">${props.textTrue}</button>`;
    props.onCreate = (modal) => {
        const modalInstance = bootstrap.Modal.getInstance(modal.element);
        modal.element.querySelector(".btn-false").addEventListener("click", function () {
            if (modalInstance) {
                modalInstance.hide();
            }
            modal.props.onSubmit(false, modal);
        });
        modal.element.querySelector(".btn-true").addEventListener("click", function () {
            if (modalInstance) {
                modalInstance.hide();
            }
            modal.props.onSubmit(true, modal);
        });
    };
    return bootstrap.showModal(props);
};
