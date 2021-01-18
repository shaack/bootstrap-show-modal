
describe('bootstrap-show-modal', function () {
    it('Should display the modal', function () {
        $.showModal({
            title: "Hello World!", body: "A very simple modal dialog without buttons.",
            onCreate: function () {
                console.log("onCreate")
            },
            onShown: function () {
                console.log("onShown")
            },
            onDispose: function () {
                console.log("onDispose")
            }
        })
    })
    // TODO more testing
})
