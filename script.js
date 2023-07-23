/* clear old session */
sessionStorage.clear();


/* Get the current date and time */
const urlParams = new URLSearchParams(window.location.search);
const yearFromUrl = Number(urlParams.get("year")) || 0;
const monthFromUrl = Number(urlParams.get("month")) || 0;
const dayFromUrl = Number(urlParams.get("day")) || 0;
const hourFromUrl = Number(urlParams.get("hour")) || 0;
const minuteFromUrl = Number(urlParams.get("minute")) || 0;
const secondFromUrl = Number(urlParams.get("second")) || 0;
const objective = urlParams.get("objective") || "";

/* check if urlParams are set */
if (yearFromUrl === 0 || monthFromUrl ===0 || dayFromUrl === 0) {
  /* prompt for setting the date and time */
  let date = new Date();
  const yearFromUrl = Number(prompt("Enter year")) || date.getFullYear();
  const monthFromUrl = Number(prompt("Enter month")) ||  date.getMonth();
  const dayFromUrl = Number(prompt("Enter day")) ||  date.getDate();
  const hourFromUrl = Number(prompt("Enter hour")) || 0;
  const minuteFromUrl = Number(prompt("Enter minute")) || 0;
  const secondFromUrl = Number(prompt("Enter second")) || 0;
  const objective = prompt("Objective?") || "";

  /* update query string */
  var newUrl = updateQueryStringParameter(window.location.href, "year", yearFromUrl);
  newUrl = updateQueryStringParameter(newUrl, "month", monthFromUrl + 1);
  newUrl = updateQueryStringParameter(newUrl, "day", dayFromUrl);
  newUrl = updateQueryStringParameter(newUrl, "hour", hourFromUrl);
  newUrl = updateQueryStringParameter(newUrl, "minute", minuteFromUrl);
  newUrl = updateQueryStringParameter(newUrl, "second", secondFromUrl);
  newUrl = updateQueryStringParameter(newUrl, "objective", objective);

  window.location.href = newUrl;
} else {
  const splash = document.querySelector("[data-splash]");
  splash.classList.add("hide");
}

/*Declare date and time*/
const countToDate = new Date(yearFromUrl, monthFromUrl - 1, dayFromUrl, hourFromUrl, minuteFromUrl, secondFromUrl).getTime();
const objectiveElement = document.querySelector("[data-objective]");
objectiveElement.innerHTML = objective;
/*Calculate time from current date and time compared to the Declared time*/
const timeUpdater = setInterval(() => {
  const currentDate = new Date().getTime();
  const timeBetweenDates = Math.ceil((countToDate - currentDate) / 1000);
  if (timeBetweenDates <= 0) {
    flipAllcard(0);
    clearInterval(timeUpdater);
    document.title = "Time up."
  } else {
    const seconds = timeBetweenDates % 60;
    const minutes = Math.floor(timeBetweenDates / 60) % 60;
    const hours = Math.floor(timeBetweenDates / 3600) % 24;
    const days = Math.floor(timeBetweenDates / 86400);

    var titleString = ""

    if(days > 0) {
      titleString += `${days} days, `;
    }

    if(hours > 0) {
      titleString += `${hours} hours, `;
    }

    if(minutes > 0) {
      titleString += `${minutes} mins, `;
    }

    if(seconds > 0) {
      titleString += `${seconds} secs left.`;
    }

    document.title = titleString;
    flipAllcard(timeBetweenDates);
  }
}, 250);

/*Populate the cards with the data coming from the Declared Time*/
function flipAllcard(time) {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600) % 24;
  const days = Math.floor(time / 86400);

  flip(document.querySelector("[data-days]"), days, true);
  flip(document.querySelector("[data-hours]"), hours);
  flip(document.querySelector("[data-minutes]"), minutes);
  flip(document.querySelector("[data-seconds]"), seconds);
}

/*Flip animation function for the cards*/
function flip(flipcard, newNumber, flag) {
  const cardTop = flipcard.querySelector("[data-card-top]");
  const startNumber = cardTop ? parseInt(cardTop.textContent, 10) : 0;

  const cardBot = flipcard.querySelector("[data-card-bot]"),
    topFlip = flipcard.querySelector("[data-flip-top]"),
    botFlip = flipcard.querySelector("[data-flip-bot]"),
    topFlipNum = flipcard.querySelector("[data-flip-top-num]"),
    botFlipNum = flipcard.querySelector("[data-flip-bot-num]");

  if (newNumber === startNumber) return;

  const displayStartNum = String(startNumber).padStart(2, "0");

  const displayNewNum = String(newNumber).padStart(2, "0");

  // if (flag) console.log("displayStartNum", displayStartNum, displayNewNum);

  const anim = (el, event, callback) => {
    const handler = () => {
      el.removeEventListener(event, handler);
      callback();
    };

    el.addEventListener(event, handler);
  };

  cardTop.textContent = displayStartNum;
  cardBot.textContent = displayStartNum;
  topFlipNum.textContent = displayStartNum;
  botFlipNum.textContent = displayNewNum;

  topFlip.classList.add("flip-card-top");
  botFlip.classList.add("flip-card-bottom");

  anim(topFlip, "animationstart", () => {
    cardTop.textContent = displayNewNum;
  });

  anim(topFlip, "animationend", () => {
    topFlipNum.innerText = displayNewNum;
    topFlip.classList.remove("flip-card-top");
  });

  anim(botFlip, "animationend", () => {
    cardBot.textContent = displayNewNum;
    botFlip.classList.remove("flip-card-bottom");
  });
}


function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

function enterFullScreen(element = document.getElementById("fullscreen-element")) {
  console.log("enterFullScreen");
  if(element.requestFullscreen) {
    element.requestFullscreen();
  }else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();     // Firefox
  }else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();  // Safari
  }else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();      // IE/Edge
  }
};