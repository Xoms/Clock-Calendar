 // class of new element
class ClockCalendar extends HTMLElement {
    constructor (){
        super();
        //state of my clocks/calendar 
        this.isShortFormat = true;
        this.isUaDate = true;
        this.isClock = true;
        this.addEventListener ('click', this.eventsOnLeftClick);
        this.addEventListener ('contextmenu', this.eventsOnRightClick);
        this.addEventListener ('mouseover', this.onMouseOver);
        this.addEventListener ('mouseout', this.onMouseOut);
    }

// ***************** CONTROL *************
    //right mouse button
    switch(){
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
        const elem = this;
        let now = new Date();        
        elem.innerHTML = this.toTimeFormat(now);
        let timerId = setInterval(function (){
            now = new Date();            
            elem.innerHTML = elem.toTimeFormat(now);
        }, 1000);  
        return timerId;  
    }

    getShortTime(){
        const elem = this;  
        let now = new Date();        
        elem.innerHTML = this.toTimeFormat(now);
        let timerId = setInterval(function (){
            now = new Date();            
            elem.innerHTML = elem.toTimeFormat(now);
        }, 60000);  
        return timerId;  
    }
//   ************** DATE *******************
    getUaDate(){
        const elem = this;    
        let now = new Date();
        let interval = 3600000 - 60*60*1000*now.getHours() - 
                60*1000*now.getMinutes() - 1000*now.getSeconds();
        let timerId = setInterval(function (){
            let now = new Date();
            let uaDate = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}`;
            elem.innerHTML = uaDate;       
            }, interval);
        return timerId;
    }
    getEuDate(){
        const elem = this;
        let now = new Date();
        let interval = 3600000 - 60*60*1000*now.getHours() - 
                60*1000*now.getMinutes() - 1000*now.getSeconds();

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
            if (this.timerId){
                clearInterval(this.timerId);
            }
            this.timerId = this.getFullTime();
        }    
    }
    showCalendar() {
        if (this.isUaDate) {
            if (this.timerId) {
                clearInterval(this.timerId);
            }
            this.timerId = this.getUaDate();
        } else if (!this.isUaDate) {
            if (this.timerId){
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
        this.switch();
        this.run();    
    }
    onMouseOver(){
        this.style.backgroundColor = "#0c0c0c";
        this.style.color = "#ffffff";
    }
    onMouseOut(){
        this.style.backgroundColor = "#cfcfcf";
        this.style.color = "black";
    }    
}

// регистрируем новый элемент в браузере по современному
customElements.define('clock-calendar', ClockCalendar);










