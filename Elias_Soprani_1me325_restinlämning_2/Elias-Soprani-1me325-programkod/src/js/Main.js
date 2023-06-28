let Main = {
    init: function () {
        let diceIcon = document.getElementById("icon-dice");
        diceIcon.addEventListener("click", this.createobjs.bind(this)); // use bind to correctly set this
    },
    
    createobjs: function () {
        let newDiceAppInstance = new DiceApp();
        newDiceAppInstance.createDOM();
    }
}

window.addEventListener("load", function() {
    Main.init();
});