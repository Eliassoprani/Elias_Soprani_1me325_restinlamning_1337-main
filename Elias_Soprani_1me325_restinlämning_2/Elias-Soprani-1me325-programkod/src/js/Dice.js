function Dice() {
    this.value = 0; // Detta är en egenskap för att spara värdet av den tärningen som slagit.
    this.diceClasses = ["", "dice-side-one", "dice-side-two", "dice-side-three", "dice-side-four", "dice-side-five", "dice-side-six"], //Första indexet är tomt för att man inte kan få sidan 0
    this.element = document.createElement("li"); //Skapa ett li element som ska vara en Dice
    this.element.classList.add("dice"); // lägg till klassen dice till li elementet
}

Dice.prototype.roll = function() {
    let side = Math.floor( Math.random() * 6 + 1 ); // variablen side får värdet 1 till 6 menat att representera en sida av en tärning, + 1 i slutet för att side får inte vara 0
    this.value = side;
    this.element.className = ""; //Tar bort alla klasser från li-elementet
    this.element.classList.add("dice"); // lägg till dice klass
    this.element.classList.add(this.diceClasses[this.value]); // lägg till tärningsida klass.
}

Dice.prototype.destroy = function() {
    this.element.parentNode.removeChild(this.element); // Ta bort grafisk representation från DOM
    for (var prop in this) {//Stegar igenom varje egenskap av objektet och tar bort egenskapen. Detta gör så att hela objektet i slut kommer tas bort av javascripts garbage collector
        delete this[prop];//ta bort egenskapen från objektet
    }
}