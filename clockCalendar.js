 // class of new element

class ClockCalendar extends HTMLElement {
    constructor (){
        super();
        //state of my clocks/calendar 
        this.isShortFormat = true;
        this.isUaDate = true;
        this.isClock = true;
        this.timerId;

        //making shadow DOM
        const shadowRoot = this.attachShadow({mode: 'open'});
        const tmpl = document.querySelector('template');
        shadowRoot.appendChild(tmpl.content.cloneNode(true));        
        
        //events
        this.addEventListener ('click', this.eventsOnLeftClick);
        this.addEventListener ('contextmenu', this.switchClockCalendar);
        this.addEventListener ('mouseover', this.onMouseOver);
        this.addEventListener ('mouseout', this.onMouseOut);
    }


// ***************** CONTROLS *************
    //right mouse button
    switchClockCalendar(e){
        e.preventDefault(); //e - event for event listener
        this.isClock = !this.isClock;
        this.run();
    }

    //left mouse button
    switchClock() {
        this.isShortFormat = !this.isShortFormat;
        this.run();
    }
    switchCalendar(){
        this.isUaDate = !this.isUaDate;
        this.run();
    }

//   *****************  TIME **************
    
    getFullTime(){
        const elem = this.shadowRoot.querySelector("div");  
        const options = {hour: "numeric",
            minute: "numeric",
            second: "numeric"};

        let now = new Date;

        elem.innerHTML = now.toLocaleTimeString(options);
        this.timerId = setInterval(function (){
            now = new Date;           
            elem.innerHTML = now.toLocaleTimeString(options);
        }, 1000);
    }

    getShortTime(){
        const elem = this.shadowRoot.querySelector("div");
        const options = {hour: "numeric",
            minute: "numeric"};

        let now = new Date;
        let interval = 60000 - 1000*now.getSeconds(); //end of current minute
        elem.innerHTML = now.toLocaleTimeString("basic", options);
        //basic - locale for show just hours and minutes
        this.timerId = setInterval(this.resetInterval.bind(this, elem, options), interval);
    }

    //for recalculation of intervals
    resetInterval(elem, options){
        clearInterval(this.timerId);        
        let now = new Date;
        let interval;
        if (this.isClock){ //For Clocks (1 minute)      
            interval = 60000 - 1000*now.getSeconds();
            elem.innerHTML = now.toLocaleTimeString("basic", options);
        } else { //For Calendar (24hours)
            interval = this.calcIntervalForDate(now);
            if (this.isUaDate) {
                elem.innerHTML = now.toLocaleDateString("ua", options);
            } else {
                elem.innerHTML = now.toLocaleDateString("en-US", options);
            }
        }
        this.timerId = setInterval(this.resetInterval.bind(this, elem, options), interval);
    }    
//   ************** DATE *******************
    calcIntervalForDate(now){
        return 3600000 - 60*60*1000*now.getHours() - 
                60*1000*now.getMinutes() - 1000*now.getSeconds();
    }

    getUaDate(){
        const elem = this.shadowRoot.querySelector("div");
        const options = {year: "numeric",
                        month: "2-digit",
                        day: "2-digit"};

        let now = new Date();
        let interval = this.calcIntervalForDate(now);
        this.timerId = setInterval(this.resetInterval.bind(this, elem, options), interval);
    }

    getEuDate(){
        const elem = this.shadowRoot.querySelector("div");
        const options = {year: "2-digit",
                        month: "2-digit",
                        day: "2-digit"};

        let now = new Date();
        let interval = this.calcIntervalForDate(now);        
        this.timerId = setInterval(this.resetInterval.bind(this, elem, options), interval);
    }

// ************** RUN *****************
    showClock() {         
        if (this.isShortFormat) {            
            this.getShortTime();
        } else {
            this.getFullTime();
        }    
    }
    showCalendar() {
        if (this.isUaDate) {
            this.getUaDate();
        } else {
            this.getEuDate();
        }   
    }
    run(){
        if (this.timerId) { //clear current timer
            clearInterval(this.timerId);
        }
        if (this.isClock) {
            this.showClock();
        } else {
            this.showCalendar();
        }
    }
    connectedCallback(){
        this.run();
    }   
//  **************** EVENTS ***************
    eventsOnLeftClick(){
        if (this.isClock){
            this.switchClock();
        } else {
            this.switchCalendar();
        }
    }    
    onMouseOver(){
        const elem = this.shadowRoot.querySelector("div");
        elem.style.backgroundColor = "#0c0c0c";
        elem.style.color = "#ffffff";
    }
    onMouseOut(){
        const elem = this.shadowRoot.querySelector("div");
        elem.style.backgroundColor = "#cfcfcf";
        elem.style.color = "black";
    }    
}

// регистрируем новый элемент в браузере по современному
window.customElements.define('clock-calendar', ClockCalendar);










