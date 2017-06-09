'use strict';
 
(function () {  


    /* =========== Variables start ===========*/
    var header = document.getElementsByTagName('body')[0];
    var timerButtons = document.getElementsByClassName('circle-btn');
    var customTimerInput = document.getElementById('custom-timer-input');
    var sandClockTop = document.getElementById('sand-clock-top');
    var sandClockBottom = document.getElementById('sand-clock-bottom'); 
    var fallingSands = document.getElementById('falling-sands');
    var timerShow = document.getElementById('timer-show');
    var timerPercentage = document.getElementById('timer-percentage');
    var timerExpiresAt = document.getElementById('timer-expires-at');
    var timerFinishedButtons = document.getElementById('timer-finished-buttons');
    var sandHeight = sandClockTop.offsetHeight;
    var selectedTimer = null;
    var timerIsActive = false;
    var maximumInputNumber = 24 * 60; // 1440


    var startTimerBtn = document.getElementById('start-timer-btn');
    var setAnotherTimerBtn = document.getElementById('set-another-btn');
    var closeBtn = document.getElementById('close-btn');
    /* =========== Variables end ===========*/


    /* =========== Helpers start ===========*/
    function addClass(element, newClass) {
        var newClassNameNotFound = element.className.indexOf(' ' + newClass) === -1;
        if (newClassNameNotFound) {
            element.className += ' ' + newClass;
        }
    }
    function removeClass(element, className) { 
        element.className = element.className.replace(' ' + className, ''); 
    }
    function ToggleStartTimerBtn(enable) {
        if (enable) {
            startTimerBtn.removeAttribute('disabled');
        } else if (!startTimerBtn.hasAttribute('disabled')) {
            startTimerBtn.setAttribute('disabled', 'disabled');
        }
    } 
    function toTimePart(amount) {
        return ('0' + Math.floor(amount)).slice(-2);    // (012).slice(-2) -> 12, (02).slice(-2) -> 02
    }
    function msToTime(seconds) {
        var date = new Date(0,0,0,0,0,0,seconds*1000);
        var ret = '';
        if (date.getHours() > 0) {
            ret += toTimePart(date.getHours()) + ':';
            addClass(timerShow, 'smaller-text');
        } else { 
            removeClass(timerShow, 'smaller-text');
        }
        ret += toTimePart(date.getMinutes()) + ':'
        ret += toTimePart(date.getSeconds()); 
        return ret; 
    }
    function dateToString(date) {

       
        var ret =
            toTimePart(date.getHours()) + ':' +
            toTimePart(date.getMinutes()) + ':' +
            toTimePart(date.getSeconds()); 

         
        var deltaDays = date.getDate() - new Date().getDate(); 
        if (deltaDays > 0) {
            ret += ' <small>+' + deltaDays + ' Day';
            if (deltaDays > 1)
                ret += 's';
            ret += '</small>';
        }

        return ret;
    }
    /* =========== Helpers end ===========*/



    /* =========== Main methods start ===========*/
    function countdown(seconds, requestedSeconds) {
        if (seconds <= 0) {
            timerFinishedButtons.style.display = 'block';
        }
        if (seconds <  0 || !timerIsActive) {
            fallingSands.style.display = 'none';

            return;
        }
        if (fallingSands.style.display !== 'block')
            fallingSands.style.display = 'block';

        var offset = (( seconds-1)  * sandHeight) / requestedSeconds; 

        var bottomOffset = offset > 10 ? offset : 10;
        
        sandClockTop.style.height = offset + 'px';
        sandClockTop.style.top = (sandHeight - offset) + 'px';
        sandClockBottom.style.height = (sandHeight - bottomOffset ) + 'px';
        timerShow.innerHTML = msToTime(seconds);
        timerPercentage.innerHTML = Math.round(100 - (seconds * 100 / requestedSeconds) ) + '%';

        setTimeout(function () {
            countdown(--seconds, requestedSeconds);
        }, 1000);
    }
    function setCountdown(minutes) {
        var seconds = minutes * 60;
        var requestedSeconds = minutes * 60;
        var expiresAt = new Date(new Date().getTime() + (seconds * 1000));
        timerExpiresAt.innerHTML = 'Expires at : ' + dateToString(expiresAt);
        timerFinishedButtons.style.display = 'none'; 
        timerIsActive = true;
        countdown(--seconds, requestedSeconds);
    } 
    function timerButtonsClickHandler() {
         
        // remove selected class from all timer buttns first
        for (var index = 0; index < timerButtons.length; index++) { 
            removeClass(timerButtons[index],'selected');
        } 
        selectedTimer = this;
         
        if (this.getAttribute('id') === 'custom-timer') { 
            addClass(this.parentNode, 'active'); 
            this.children[1].focus();
        } else {
            customTimerInput.value = '';
            addClass(this,'selected');
            ToggleStartTimerBtn(true);
        }
    } 
    function startTimerBtnClickHandler() {
        if (selectedTimer !== null){
            addClass(header, 'expand');
            addClass(fallingSands, 'fall');

            var minutes = 0;
            if (selectedTimer.getAttribute('id') === 'custom-timer') {
                minutes = customTimerInput.value;
            } else
                minutes = selectedTimer.innerHTML;

            setCountdown(parseInt(minutes));
        }
    }
    function closeApp() {
        window.location.href = 'https://www.google.com';
    } 
    function setAnotherTimer() {

        sandClockTop.style.height = '50%';
        sandClockTop.style.top = '0px';
        sandClockBottom.style.height = '0px';

        timerFinishedButtons.style.display = 'none'; 
        removeClass(header,'expand');
        timerIsActive = false;
    }
    function customTimer_keyDown(e) {
        var circleBtnParent = this.parentNode;
        var integer = parseInt(e.key);
        var value = this.value ? parseInt(this.value) : 0; 
        // prevent typeing characters or 0 if value is 0 
        if ((isNaN(integer) && (e.key !== 'Backspace')) || (value === 0 && integer === 0) ) { 
            e.preventDefault();  
        }    
    }
    function customTimer_keyUp() {
        var circleBtnParent = this.parentNode;
        if (this.value <= 0 || isNaN(this.value) || this.value > maximumInputNumber) {
            removeClass(circleBtnParent, 'selected');
            addClass(circleBtnParent, 'error');
            ToggleStartTimerBtn(false);
        } else {
            removeClass(circleBtnParent, 'error');
            addClass(circleBtnParent, 'selected');
            ToggleStartTimerBtn(true);
        }
    }
    function bindEvents() {
        // Add click listener to timer buttons
        for (var index = 0; index < timerButtons.length; index++) {
            timerButtons[index].addEventListener("click", timerButtonsClickHandler);
        }

        // submit, set new and close buttons events
        startTimerBtn.addEventListener("click", startTimerBtnClickHandler);
        setAnotherTimerBtn.addEventListener("click", setAnotherTimer);
        closeBtn.addEventListener("click", closeApp);

        // Custom timer event listeners
        customTimerInput.addEventListener("keydown", customTimer_keyDown);
        customTimerInput.addEventListener("keyup", customTimer_keyUp);
    } 
    /* =========== Main methods end ===========*/
   
     
    ToggleStartTimerBtn(false);
    customTimerInput.value = '';
    bindEvents();
 
})();
