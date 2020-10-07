var assert = chai.assert

afterEach(function () {
})

describe('bootstrap-show-modal', function () {
    it('Should display the modal', function () {
        $.showModal({title: "Hello World!", body: "A very simple modal dialog without buttons."})
    })
    // TODO more testing
})
