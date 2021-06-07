
var showClock = (start, end) => {
    let diff = end.diff(start)
    var timeToLeft = moment.utc(diff).format("HH:mm:ss")
    $('#timeToLeft').text(timeToLeft)
    return diff;
}
var timer = data => {
    var timerTime = moment(`${data.hr}:${data.min}:${data.sec}`, 'HH:m:s');
    var tt_5 = moment().add(5, 'seconds')
    if (tt_5 > timerTime) timerTime = tt_5;
    var timerInterval = setInterval(()=>{
        var currentTime = moment();
        showClock(currentTime, timerTime)
        if(currentTime.isAfter(timerTime)){
            clearInterval(timerInterval);
            window.open(window.atob(getUrlParamValue("ln")), "_blank");
            $('#timeToLeft').text("Started")
        }
    }, 1000)
}

timer(JSON.parse(localStorage[getUrlParamValue("id") + "-timer"]));