let map;
let pos;
let marker;
let markers = [];
let reportList = [];
const addMarkerButton = document.getElementById("add-marker");
addMarkerButton.disabled = true;

const reportBox = document.getElementById("report-box");
const openReportButton = document.getElementById("report-button");

const dirtywaterTable = document.getElementById("dirtywaterTable");
const groupTable = document.getElementById("groupTable");
const jellyfishTable = document.getElementById("jellyfishTable");
const wavesTable = document.getElementById("wavesTable");
const windTable = document.getElementById("windTable");
const fixedTable = document.getElementById("fixedTable");

/*Initialize map*/

let uniqueId = 0;
function initMap() {
  infoWindow = new google.maps.InfoWindow();
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
  var mapOptions = {
    center: pos,
    zoom: 17,
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

/*Create header for marker box when user adds new marker*/
function createrMarkerBoxHeader(markerBox) {
  const markerBoxHeader = document.createElement("div");
  markerBoxHeader.className = "marker-box-header";
  const markerBoxHeaderTextNode = document.createTextNode("Guille");
  markerBoxHeader.appendChild(markerBoxHeaderTextNode);
  markerBox.appendChild(markerBoxHeader);
  return markerBoxHeader;
}

/*Create container for list of images in report box when user adds new marker*/
function createMarkerBoxImgContainer(markerBox) {
  const markerBoxImgContainer = document.createElement("div");
  markerBoxImgContainer.className = "marker-box-container";
  markerBox.appendChild(markerBoxImgContainer);
  if (reportList.length > 0) {
    for (i = 0; i < reportList.length; i++) {
      const reportImg = document.createElement("img");
      reportImg.setAttribute("src", reportList[i].currentSrc);
      reportImg.setAttribute("id", " ");
      reportImg.className = "marker-box-img";
      reportImg.height = "32";
      reportImg.width = "32";
      markerBoxImgContainer.appendChild(reportImg);
    }
  }
}

/*Create heart image in report box header when user adds new marker*/

function createHeart(markerBoxHeader) {
  const heart = document.createElement("img");
  heart.src = "../assets/pictures/64/like2.png";
  heart.height = "18";
  heart.width = "18";
  heart.className = "marker-box-heart";
  markerBoxHeader.appendChild(heart);
  return heart;
}

/*Delete marker using its id*/
function deleteMarkerById(id) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].id == id) {
      //Remove the marker from Map
      markers[i].setMap(null);
      //Remove the marker from array.
      markers.splice(i, 1);
      console.log(markers);
      marker = null;
      /*container.removeChild(markerBox);*/
    }
  }
}

function Timer(callback, time) {
  this.setTimeout(callback, time);
}

Timer.prototype.setTimeout = function(callback, time) {
  var self = this;
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.finished = false;
  this.callback = callback;
  this.time = time;
  this.timer = setTimeout(function() {
    self.finished = true;
    callback();
  }, time);
  this.start = Date.now();
};

Timer.prototype.add = function(time) {
  console.log("Timer " + time);
  if (!this.finished) {
    time = this.time - (Date.now() - this.start) + time;
    this.setTimeout(this.callback, time);
  }
};

/*Function used to remove a marker after a certain time*/

let markerDuration;
function markerSetTimeOut(id, markerBox) {
  markerDuration = new Timer(function() {
    deleteMarkerById(id);
    container.removeChild(markerBox);
    openReportButton.disabled = false;
    reportList = [];
    /*3600000*/
  }, 50000);
}

/*Creates the box with the icons chosen by the user*/
function createMarkerBox(newMarker) {
  const container = document.getElementById("container");
  const markerBox = document.createElement("div");
  markerBox.className = "marker-box";
  container.appendChild(markerBox);

  const markerBoxHeader = createrMarkerBoxHeader(markerBox);

  google.maps.event.addListener(newMarker, "click", function(e) {
    if (markerBox.style.display == "none") {
      markerBox.style.display = "block";
    } else {
      markerBox.style.display = "none";
    }
  });

  createMarkerBoxImgContainer(markerBox);

  let actualLikeNumber = 0;
  const likeNumber = document.createElement("p");

  likeNumber.className = "marker-box-heart-number";
  likeNumberText = document.createTextNode(actualLikeNumber);
  likeNumber.appendChild(likeNumberText);
  markerBoxHeader.appendChild(likeNumber);

  createHeart(markerBoxHeader);

  const likeButton = document.createElement("img");
  likeButton.src = "../assets/pictures/64/like.png";
  likeButton.height = "32";
  likeButton.width = "32";
  likeButton.className = "marker-box-like-button";
  likeButton.onclick = () => {
    likeNumber.removeChild(likeNumberText);
    actualLikeNumber++;
    const newlikeNumberText = document.createTextNode(actualLikeNumber);
    likeNumber.appendChild(newlikeNumberText);
    markerDuration.add(1800000);
  };
  markerBox.appendChild(likeButton);

  const timeOut = markerSetTimeOut(newMarker.id, markerBox);

  /*
  const deleteButton = document.createElement("button");
  const deleteButtonText = document.createTextNode("delete");
  deleteButton.className = "delete-button";
  deleteButton.onclick = () => {
    deleteMarkerById(newMarker.id);
    container.removeChild(markerBox);
    openReportButton.disabled = false;
    reportList = [];
    clearTimeout(timeOut);
  };
  deleteButton.appendChild(deleteButtonText);
  markerBox.appendChild(deleteButton);
  */
}

/*Creates a new marker with its box and adds it to the map in users location*/
function addMarker() {
  if (marker == null) {
    marker = new google.maps.Marker({
      position: pos,
      map: map,
      draggable: true,
      id: uniqueId
    });
    console.log("Paso 1: marker con id " + uniqueId + " es creado");
    console.log("Lista de markers sigue vacia: ");
    console.log(markers);
    markers.push(marker);
    console.log("El marker fue agregado a la lista: ");
    console.log(markers);
    createMarkerBox(marker);
    uniqueId++;
    if (reportBox.style.display == "block") {
      reportBox.style.display = "none";
    }
    openReportButton.disabled = true;
    addMarkerButton.disabled = true;
  }
}

/*Clickable functionability for each image in list one*/
document.querySelectorAll('img[class="listImage1"]').forEach(function(image) {
  image.addEventListener("click", function(e) {
    if (this.id === "dirtywater") {
      if (
        dirtywaterTable.style.display == "none" &&
        groupTable.style.display == "none" &&
        jellyfishTable.style.display == "none" &&
        wavesTable.style.display == "none" &&
        windTable.style.display == "none" &&
        fixedTable.style.display == "block"
      ) {
        dirtywaterTable.style.display = "block";
        fixedTable.style.display = "none";
      } else {
        dirtywaterTable.style.display = "none";
        fixedTable.style.display = "block";
      }
    }
    if (this.id === "group") {
      if (
        groupTable.style.display == "none" &&
        dirtywaterTable.style.display == "none" &&
        jellyfishTable.style.display == "none" &&
        wavesTable.style.display == "none" &&
        windTable.style.display == "none" &&
        fixedTable.style.display == "block"
      ) {
        groupTable.style.display = "block";
        fixedTable.style.display = "none";
      } else {
        groupTable.style.display = "none";
        fixedTable.style.display = "block";
      }
    }
    if (this.id === "jellyfish") {
      if (
        groupTable.style.display == "none" &&
        dirtywaterTable.style.display == "none" &&
        jellyfishTable.style.display == "none" &&
        wavesTable.style.display == "none" &&
        windTable.style.display == "none" &&
        fixedTable.style.display == "block"
      ) {
        jellyfishTable.style.display = "block";
        fixedTable.style.display = "none";
      } else {
        jellyfishTable.style.display = "none";
        fixedTable.style.display = "block";
      }
    }
    if (this.id === "waves") {
      if (
        groupTable.style.display == "none" &&
        dirtywaterTable.style.display == "none" &&
        jellyfishTable.style.display == "none" &&
        wavesTable.style.display == "none" &&
        windTable.style.display == "none" &&
        fixedTable.style.display == "block"
      ) {
        wavesTable.style.display = "block";
        fixedTable.style.display = "none";
      } else {
        wavesTable.style.display = "none";
        fixedTable.style.display = "block";
      }
    }
    if (this.id === "wind") {
      if (
        groupTable.style.display == "none" &&
        dirtywaterTable.style.display == "none" &&
        jellyfishTable.style.display == "none" &&
        wavesTable.style.display == "none" &&
        windTable.style.display == "none" &&
        fixedTable.style.display == "block"
      ) {
        windTable.style.display = "block";
        fixedTable.style.display = "none";
      } else {
        windTable.style.display = "none";
        fixedTable.style.display = "block";
      }
    }
  });
});

/*Clickable functionability for each image in list two*/
document.querySelectorAll('img[class="listImage2"]').forEach(function(image) {
  image.addEventListener("click", function(e) {
    if (!reportList.includes(this)) {
      addMarkerButton.disabled = false;
      console.log("Imagen seleccionada: ");
      console.log(this);
      reportList.push(this);
    } else {
      alert("Element is already in the report");
    }
  });
});

/*Clickable functionability for each image in sub lists of list one*/
document.querySelectorAll('img[class="listImage3"]').forEach(function(image) {
  image.addEventListener("click", function(e) {
    if (!reportList.includes(this)) {
      addMarkerButton.disabled = false;
      console.log("Imagen seleccionada: ");
      console.log(this);
      reportList.push(this);
    } else {
      alert("Element is already in the report");
    }
  });
});

function openReportBox() {
  if (reportBox.style.display == "none") {
    reportBox.style.display = "block";
  } else {
    reportBox.style.display = "none";
  }
}

addMarkerButton.addEventListener("click", () => {
  addMarker();
});
