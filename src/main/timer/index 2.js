function ret(el) {
  site = "";
  switch(el) {
    case "supreme":
      site = "Supreme";
      break;
    case "adidas":
      site = "Adidas";
      break;
    case "palace":
      site = "Palace";
      break;
    case "yeezy":
      site = "Yeezy Supply";
      break;
    case "bape":
      site = "Bape";
      break;
    case "cgear":
      site = "City Gear";
      break;
    case "ovo":
      site = "OVO";
      break;
    case "jdon":
      site = "Just Don";
      break;
    case "dsm":
      site = "DSM";
      break;
    case "barney":
      site = "Barney's";
      break;
    case "fsites":
      site = "FootSites";
      break;
    case "kicks":
      site = "Kicks USA";
      break;
    case "okini":
      site = "Okini";
      break;
    case "kylie":
      site = "Kylie";
      break;
    case "sns":
      site = "SNS";
      break;
    case "pacsun":
      site = "Pac Sun";
      break;
    case "lasco":
      site = "Lasco";
      break;
    case "kaw":
      site = "Kawsone";
      break;
    default:
    ;
  }
  return site;
}
function drawOutline(startTime, currTime){
    console.log(currTime/startTime)
    var angle = currentTime/startTime * 2 * Math.PI;
    var c = document.getElementById("clockCanvas");
    var ctx = c.getContext("2d");
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.clearRect(0, 0, 380, 380);
    ctx.arc(190, 190, 175, angle - 0.5*Math.PI, 1.5*Math.PI);
    ctx.strokeStyle = "#ff3a19";
    ctx.stroke();
    ctx.closePath();
}
var getTimeDifference = (cTime, tTime) => {
    var currentTime = cTime.split(":")[0]*3600000 + cTime.split(":")[1]*60000 + cTime.split(":")[2]*1000;
    var timerTime = tTime.split(":")[0]*3600000 + tTime.split(":")[1]*60000 + tTime.split(":")[2]*1000;
    var diff = timerTime-currentTime;
    var hoursLeft = Math.floor(diff/3600000);
    var minLeft = Math.floor((diff-3600000*hoursLeft)/60000)
    var secLeft = Math.floor((diff-3600000*hoursLeft-60000*minLeft)/1000);
    if(hoursLeft < 0){
        diff += 3600000*hoursLeft
        hoursLeft = 24+hoursLeft;
        diff += 3600000*hoursLeft
    }
    hoursLeft = hoursLeft.toString().length == 1 ? "0".concat(hoursLeft.toString()) : hoursLeft.toString();
    minLeft = minLeft.toString().length == 1 ? "0".concat(minLeft.toString()) : minLeft.toString();
    secLeft = secLeft.toString().length == 1 ? "0".concat(secLeft.toString()) : secLeft.toString();
    $("#hours").html(hoursLeft)
    $("#minutes").html(minLeft)
    $("#seconds").html(secLeft)
    return diff;
}
var timer = data => {
    var startDate = new Date();
    var startTime = startDate.getHours()*3600000 + startDate.getMinutes()*60000 + startDate.getSeconds()*1000;
    var timerInterval = setInterval(()=>{
        var currentTime = new Date();
        var current = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
        var timerTime = data.hr + ":" + data.min + ":" + data.sec;
        getTimeDifference(current, timerTime)
        if(current == timerTime){
            clearInterval(timerInterval);
            window.open(window.atob(getUrlParamValue("ln")), "_blank");
        }
    }, 1000)
}

timer(JSON.parse(localStorage[getUrlParamValue("id") + "-timer"]));