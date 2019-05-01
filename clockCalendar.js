 // class of new element
class ClockCalendar extends HTMLElement {
    constructor (){
        super();
        //state of my clocks/calendar 
        this.isShortFormat = true;
        this.isUaDate = true;
        this.isClock = true;

        //making shadow DOM
        let shadowRoot = this.attachShadow({mode: 'open'});
        let tmpl = document.querySelector('template');
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        //console.log (tmpl);
        //console.log (shadowRoot.querySelector("div"));

        //events
        this.addEventListener ('click', this.eventsOnLeftClick);
        this.addEventListener ('contextmenu', this.eventsOnRightClick);
        this.addEventListener ('mouseover', this.onMouseOver);
        this.addEventListener ('mouseout', this.onMouseOut);
    }

// ***************** CONTROL *************
    //right mouse button
    switchClockCalendar(){
        this.isClock = !this.isClock;
    }   

    //left mouse button
    switchClock() {
        this.isShortFormat = !this.isShortFormat;    
    }
    switchCalendar(){
        this.isUaDate = !this.isUaDate;
    }


//   *****************  TIME **************
    toTimeFormat(now){
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let timeStr;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }        
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (this.isShortFormat) {
            timeStr = `${hours}:${minutes}`;
        } else {
            timeStr = `${hours}:${minutes}:${seconds}`
        }
        return timeStr;
    }
    getFullTime(){
        const me = this; //to bind context for interval
        const elem = this.shadowRoot.querySelector("div");
        let now = new Date();        
        elem.innerHTML = this.toTimeFormat(now);
        let timerId = setInterval(function (){
            now = new Date();            
            elem.innerHTML = me.toTimeFormat(now);
        }, 1000);  
        return timerId;  
    }
    getShortTime(){
        const me = this;//to bind context for interval
        const elem = this.shadowRoot.querySelector("div");        
        let now = new Date();        
        elem.innerHTML = this.toTimeFormat(now);
        let interval = this.calcIntervalForShort(now);
        let timerId = setInterval(function (){
            clearInterval (timerId);
            now = new Date();
            elem.innerHTML = me.toTimeFormat(now);                  
        }, interval);        
        return timerId;  
    }    
    calcIntervalForShort (now){
        return 60000 - 1000*now.getSeconds();
    }
//   ************** DATE *******************
    calcIntervalForDate(now){
        return 3600000 - 60*60*1000*now.getHours() - 
                60*1000*now.getMinutes() - 1000*now.getSeconds();
    }

    getUaDate(){
        //const elem = this;//to bind context for interval 
        const elem = this.shadowRoot.querySelector("div"); 
        let now = new Date();
        let interval = this.calcIntervalForDate(now);
        let timerId = setInterval(function (){
            let now = new Date();
            let uaDate = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}`;
            elem.innerHTML = uaDate;       
            }, interval);
        return timerId;
    }
    getEuDate(){
        //const elem = this;//to bind context for interval
        const elem = this.shadowRoot.querySelector("div");
        let now = new Date();
        let interval = this.calcIntervalForDate(now);        
        let timerId = setInterval(function (){
            let now = new Date();
            let year = now.getFullYear().toString().slice(2);
            let euDate = `${now.getMonth()+1}/${now.getDate()}/${year}`;
            elem.innerHTML = euDate;        
            }, interval);
        return timerId;
    }
// ************** RUN *****************
    showClock() {         
        if (this.isShortFormat) {
            if (this.timerId) { //clear current timer
                clearInterval(this.timerId);
            }
            this.timerId = this.getShortTime();
        } else if (!this.isShortFormat) {
            if (this.timerId){ //clear current timer
                clearInterval(this.timerId);
            }
            this.timerId = this.getFullTime();
        }    
    }
    showCalendar() {
        if (this.isUaDate) {
            if (this.timerId) { //clear current timer
                clearInterval(this.timerId);
            }
            this.timerId = this.getUaDate();
        } else if (!this.isUaDate) {
            if (this.timerId){ //clear current timer
                clearInterval(this.timerId);
            }
            this.timerId = this.getEuDate();
        }   
    }
    run(){
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
            this.run();
        } else {
            this.switchCalendar();        
            this.run();        
        }
    }
    eventsOnRightClick(){
        this.switchClockCalendar();
        this.run();    
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










