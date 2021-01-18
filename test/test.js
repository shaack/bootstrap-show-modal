
describe('bootstrap-show-modal', function () {
    it('Should display the modal', function () {
        $.showModal({
            title: "Hello World!", body: "A very simple modal dialog without buttons.",
            onCreate: function (modal) {
                console.log("onCreate", modal)
            },
            onShown: function (modal) {
                console.log("onShown", modal)
            },
            onDispose: function (modal) {
                console.log("onDispose", modal)
            }
        })
    })
    // TODO more testing
})
