function DiceApp() {
    this.windowWrapper = null,
    this.menubarWrapper = null,
    this.toolbarWrapper = null,
    this.close = null,
    this.ulForToolbar = null,
    this.liAdd = null,
    this.liRemove = null,
    this.ulCounter = null,
    this.liForulCounter = null,
    this.contentWrapper = null,
    this.ulForContent = null,
    this.dragStartX = null,
    this.dragStartY = null,

    this.diceOnBoardValue = 0; // håller en siffra som representerar det sammanlagda värdet av alla tärningar som blivit kastade.
    this.diceOnBoard = []; // array där varje index representerar en enskild kastad tärnings värde
    this.audio = new Audio('src/wav/add.wav'); // instansierar ett nytt Audio objekt
    
    /*
    eftersom .bind() returnerar funktionen med "this" värdet ändrat 
    måste returen från .bind() metoden sparas till mouseDown, mouseMove och mouseUp 
    så att när dessa eventhanterarena sedan ska tas bort genom "removeEventlistener" så är det
    denna nya, returnerade funktionen som refereras när man skriver this.mouse"Up","Down","Move"
    i event
    */
    this.mouseMove = this.mouseMove.bind(this),
    this.mouseUp = this.mouseUp.bind(this)
};


DiceApp.prototype.add = function () {
    let maxAmmDice = Math.floor(Math.floor(this.contentWrapper.clientHeight / 34) * Math.floor(this.contentWrapper.clientWidth / 33)) // räknar ut vad max antal tärningar som får plats inom contentWrapper baserat på hur bred och hög content wrapper är. En tärning har bredden 33 och höjden 34 med margin är inräknat

    if (this.diceOnBoard.length < maxAmmDice) {
        let dice = new Dice(this.diceClasses); // initiera ny instans av Dice
        dice.roll();//Anropar Dice instansens roll metod.
        this.ulForContent.appendChild(dice.element); // appenda returnerade <li> element från dice.add och fäst det till ulForContent
        this.diceOnBoardValue += dice.value; // addera tärningens värde till diceOnBoardValue
        this.diceOnBoard.push(dice); // lägg till tärningens värde till diceOnBoard arrayn
        this.displayScore(); // visa det nya värdet på poängen efter att tärningen tagits bort
        this.audio.play(); // spela upp ljud
    }
},

DiceApp.prototype.remove = function () {
    if (this.diceOnBoardValue !== 0) {//hindrar Remove från att utföras om det inte finns några tärningar på brädet
        this.diceOnBoardValue -= this.diceOnBoard[this.diceOnBoard.length - 1].value
        this.diceOnBoard[this.diceOnBoard.length - 1].destroy(); //Ta bort Dice instansen
        this.diceOnBoard.splice(-1) // ta bort den sista tärningen från diceOnBoardValue
        this.displayScore(); // visa det nya värdet på poängen efter att tärningen tagits bort
        this.audio.play(); // spela upp ljud
    };
},

DiceApp.prototype.roll = function () {
    if (this.diceOnBoardValue !== 0) {//hindrar Roll från att utföras om det inte finns några tärningar på brädet
        this.diceOnBoardValue = 0;
        for (let i = 0; i < this.diceOnBoard.length; i++) {
            this.diceOnBoard[i].roll()    
            this.diceOnBoardValue += this.diceOnBoard[i].value;
        }
        this.displayScore(); // visa det nya värdet på poängen efter att tärningen tagits bort
        this.audio.play(); // spela upp ljud
    }
}
//Metod som skapar elment, och tillsätter korrekt klassnamn till elementen. Metoden tillsätter också eventhanterare till vissa element för att anropa funktionalitet inom objektet och inom Dice.js
DiceApp.prototype.createDOM = function () {
    //skapar elementen för programmet 
    let windowWrapper = document.createElement('div'); //skapar div elementet Dice-window-wrapper
    windowWrapper.classList.add('dice-window-wrapper');//Lägger till klass för elementet) {},

    this.windowWrapper = windowWrapper
    this.windowWrapper.style.position = 'absolute'
    this.windowWrapper.style.zIndex = 1

    var menubarWrapper = document.createElement('div');
    menubarWrapper.classList.add("dice-menubar-wrapper");
    this.menubarWrapper = menubarWrapper;

    this.menubarWrapper.addEventListener('mousedown', this.mouseDown.bind(this));
    this.windowWrapper.addEventListener("click", this.adjustZIndex.bind(this));
    
    let close = document.createElement('div');//skapar div elementet close-wrapper
    close.classList.add("close");//Lägger till klass för elementet
    this.close = close;

    let toolbarWrapper = document.createElement('div');//skapar div elementet toolbar-wrapper
    toolbarWrapper.classList.add("dice-toolbar-wrapper");//Lägger till klass för elementet
    this.toolbarWrapper = toolbarWrapper;

    let ulForToolbar = document.createElement('ul'); //skapar ul element där nedanstående li element ska tillhöra
    this.ulForToolbar = ulForToolbar;

    let liAdd = document.createElement('li');//skapar li elementet Add
    liAdd.classList.add("add");
    this.liAdd = liAdd;

    let liRemove = document.createElement('li');//skapar li elementet Remove
    liRemove.classList.add("remove");
    this.liRemove = liRemove;

    let liRoll = document.createElement('li');//skapar li elementet Roll
    liRoll.classList.add("roll");
    this.liRoll = liRoll;

    let ulCounter = document.createElement('ul');//ul element som list element med add, roll och remove klasser appendas till
    ulCounter.classList.add("dice-toolbar-counter-wrapper")
    this.ulCounter = ulCounter;

    let liForulCounter = document.createElement('li');//list element som ulCounter ska appendas till
    this.liForulCounter = liForulCounter;

    for (let i = 0; i < 5; i++) {//loop som skapar 5 li element, ger dom klassen "zero" och appendar de till ulCounter
        let li = document.createElement('li');
        li.classList.add("zero");
        this.ulCounter.appendChild(li);
    }

    let contentWrapper = document.createElement('div');//Det div ulForContent ska appendas till
    contentWrapper.classList.add("dice-content-wrapper");
    this.contentWrapper = contentWrapper;

    let ulForContent = document.createElement('ul');//Det element som tärningar ska appendas till då liAdd aktiveras.
    ulForContent.classList.add("name");
    this.ulForContent = ulForContent;

    //Appendar olika element som child till andra element
    document.getElementById("page-content-wrapper").appendChild(this.windowWrapper); //fäster windowWrapper som child till page-content-wrapper där alla window applications ska vara child til
    this.windowWrapper.appendChild(this.menubarWrapper); //sätter menubarWrapper som child till windowWrapper
    this.windowWrapper.appendChild(this.toolbarWrapper);//sätter toolbarWrapper som child till windowWrapper
    this.windowWrapper.appendChild(this.contentWrapper); //sätter contentWrapper som child till windowWrapper
    this.menubarWrapper.appendChild(this.close); //sätter close som child till menuwrapper
    this.toolbarWrapper.appendChild(this.ulForToolbar);//sätter ul för toolbar som child till toolbarwrapper
    this.ulForToolbar.appendChild(this.liAdd);//sätter li class add som child till ulForToolbar
    this.ulForToolbar.appendChild(this.liRemove);//sätter li class remove som child till ulForToolbar
    this.ulForToolbar.appendChild(this.liRoll); //sätter li class roll som child till ulForToolbar
    this.ulForToolbar.appendChild(this.liForulCounter);
    this.liForulCounter.appendChild(this.ulCounter);
    this.contentWrapper.appendChild(this.ulForContent);

    /*
    bind används för samtliga eventhanterare för att låta this i anropade metoderna referera till det aktuella objektet
    Eftersom detta inte är eventhanterare som behövs tas bort behöver inte this.add sättas till this.add = this.add.bind(this)
    */
    liAdd.addEventListener("click", this.add.bind(this))//Event lyssnare för att anrope dice.Add
    liRemove.addEventListener("click", this.remove.bind(this))//Event lyssnare för att anrope dice.Remove
    liRoll.addEventListener("click", this.roll.bind(this));//Event lyssnare för att anrope dice.Roll
    close.addEventListener("click", this.deleteObjs.bind(this));//Event lyssnare för att anropa deleteObjs
},

DiceApp.prototype.mouseDown = function (event) {
    this.dragStartX = event.clientX; //uppdatera dragstartX för nya värdet efter mouseMove
    this.dragStartY = event.clientY;
    this.adjustZIndex(); //gör så att denna ruta plaseras överst till och med när man drar fönstret

    document.addEventListener('mousemove', this.mouseMove); //lägg till nya eventlyssnare till dokumentet
    document.addEventListener('mouseup', this.mouseUp);
}
DiceApp.prototype.mouseMove = function (event) {
    this.windowWrapper.style.left = (parseInt(this.windowWrapper.style.left || 0) + event.clientX - this.dragStartX) + "px";
    this.windowWrapper.style.top = (parseInt(this.windowWrapper.style.top || 0) + event.clientY - this.dragStartY) + "px";

    this.dragStartX = event.clientX; //uppdatera dragstartX för nya värdet efter mouseMove
    this.dragStartY = event.clientY;//uppdatera dragstartY för nya värdet efter mouseMove
},

DiceApp.prototype.mouseUp = function () {
    document.removeEventListener('mousemove', this.mouseMove); // ta bort eventlyssnare
    document.removeEventListener('mouseup', this.mouseUp); // ta bort eventlyssnare
},
DiceApp.prototype.adjustZIndex = function() {
    if(this.windowWrapper){
        this.windowWrapper.style.zIndex = Math.floor(new Date().getTime()/1000); //eftersom getTime alltid kommer vara större än föregående getTime anropas så kommer det aktiva fönstret bli placerat överst.
    }
};
DiceApp.prototype.displayScore = function () {
    let score = this.diceOnBoardValue;

    if (score >= 0) {
        let numClass = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']; //strängar med ord för att sätta korrekt klassnamn
        let liElems = Array.from(this.ulCounter.children);//nämtar alla li element 
        let scoreArray = score.toString().split("").map(Number);//omvandlar först talet till en string, detta för att det gör att ental blir enskilda, tiotal enskilda, hundratal osv... Sedan splitas string vid "" för att få enkild 10tal 1tal osv.
        for (let i = 0; i < liElems.length; i++) {//tömmer alla siffer elementens klasser, för att senare bytas ut mot nya klassen
            liElems[i].className = "";
        }
        scoreArray.reverse();//  därmed att siffran splittas till tiondelar så omvandlas ordningen så att entalen alltid är på scoreArray[0], 10talen blir alltid index 1, 100tal index 2 etc...
        liElems[4].classList.add(numClass[scoreArray[0]])//Sista indexet i liElems får första indexet i score array. så att mätaren fylls på från höger till vänster
        liElems[3].classList.add(numClass[scoreArray[1]])
        liElems[2].classList.add(numClass[scoreArray[2]])
        liElems[1].classList.add(numClass[scoreArray[3]])
        liElems[0].classList.add(numClass[scoreArray[4]])
    }
},

//ta bort valt element från DOMen
DiceApp.prototype.deleteObjs = function () {    
    this.windowWrapper.remove()// ta bort elementet från DOMen
    for (var prop in this) {//Stegar igenom varje egenskap av objektet och tar bort egenskapen. Detta gör så att hela objektet i slut kommer tas bort av javascripts garbage collector
        delete this[prop];//ta bort egenskapen från objektet
    }
}