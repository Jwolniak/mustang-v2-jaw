var contactURLArray = [];
var contactArray = [];
var loadContact = 0;
var currentContactIndex = 0;
var newcontact= [];

function initApplication() {
    console.log("Welcome to Mustang v2!");
}

function viewCurrentContact(){
    currentContact = contactArray[currentContactIndex];
    console.log(currentContact);
    document.getElementById("nameID").value = currentContact.preferredName;
    document.getElementById("emailID").value = currentContact.email;
    document.getElementById("cityID").value = currentContact.city;
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("zipID").value = currentContact.zip;

    document.getElementById("statusID").innerHTML = "Status: Viewing contact" + (currentContactIndex) + " of " + contactArray.length;
}

function previous(){
    if (currentContactIndex > 0){
        currentContactIndex--;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
    if (currentContactIndex == 0){
        document.getElementById("prevtbtn").disabled = true;
    }
}

function next(){
    if (currentContactIndex < (contactArray.length-1)){
        currentContactIndex++;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
    if (currentContactIndex == contactArray.length){
        document.getElementById("nextbtn").disabled = true;
    }
}

function add(){
    firstvalue = '"' + document.getElementById("firstID").value + '"';
    lastvalue = '"' + document.getElementById("lastID").value + '"';
    prefnamevalue = '"' + document.getElementById("prefnameID").value + '"';
    emailvalue = '"' + document.getElementById("emailID").value + '"';
    phonevalue = '"' + document.getElementById("phoneID").value + '"';
    classvalue = '"' + document.getElementById("classID").value + '"';
    roomvalue= '"' + document.getElementById("roomID").value + '"';
    timevalue = '"' + document.getElementById("timeID").value + '"';
    seatvalue = '"' + document.getElementById("seatID").value + '"';
    inpersonvalue = '"' + document.getElementById("inpersonID").value + '"';
    virtualvalue = '"' + document.getElementById("vitrualID").value + '"';
    cityvalue = '"' + document.getElementById("cityID").value + '"';
    statevalue = '"' + document.getElementById("stateID").value + '"';
    zipvalue = '"' + document.getElementById("zipID").value + '"';
    latvalue = '"' + document.getElementById("latID").value + '"';
    lngvalue = '"' + document.getElementById("lngID").value + '"';
    hobbyvalue = '"' + document.getElementById("hobbyID").value + '"';
    newcontact = ['{\n "firstName": ' + firstvalue + ',\n "lastName": ' + lastvalue + ',\n"preferredName": ' + prefnamevalue + ',\n "email": '+ emailvalue + ',\n "phoneNumber":' + phonevalue + ',\n "class":' + classvalue + ',\n"room":' + roomvalue + ',\n "startTime":' + timevalue + ',\n "seatNumber":' + seatvalue + ',\n "inPerson":[\n' + inpersonvalue + '\n],\n "virtual":[\n' + virtualvalue + '\n],\n "city":' + cityvalue + ',\n "state":'  + statevalue + ',\n "zip":' + zipvalue + ',\n "lat":' + latvalue + ',\n "lng":' + lngvalue + ',\n "favortiteHobby":' + hobbyvalue];
    contactArray.push(newcontact);
    console.log(contactArray);
}

function remove(){
    delete contactArray[currentContactIndex];
}


function zipBlurFunction(){
    getPlace();
}

function keyPressed(){
    $("#zipID").autocomplete({
        source: "getCityState.php",
    });
}

function getPlace(){
    var zip = document.getElementById("zipID").value;
    console.log("zip:"+zip);

    console.log("function getPlace(zip) {...}");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if (document.getElementById("cityID").value == ""){
                document.getElementById("cityID").value = place[0];
            }
            if (document.getElementById("stateID").value == ""){
                document.getElementById("stateID").value = place[1];
            }
        }
        xhr.open("GET", "getCityState.php?zip=" + zip);
        xhr.send(null);
    }
}
function loadIndex() {
    var indexRequest = new XMLHttpRequest();
    indexRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    indexRequest.onload = function() {
        console.log("Index JSON: " + indexRequest.responseText);
        document.getElementById("indexID").innerHTML = indexRequest.responseText;
        contactIndex = JSON.parse(indexRequest.responseText);
        contactURLArray.length = 0;
        for (i=0; i < contactIndex.length; i++){
            contactURLArray.push(contactIndex[i].contactURL);
        }
        console.log("ContactURLArray: "+ JSONstringify(contactURLArray));
    }
    indexRequest.send();
}

function loadContacts() {
    contactArray = 0;
    loadContact = 0;

    if (contactURLArray.length > loadContact) {
        loadNextContact(contactURLArray[loadContact]);
    }

}

function loadNextContact(URL) {
    console.log("URL: " + URL);
    contactRequest = new XMLHttpRequest();
    contactRequest.open('GET', URL);
    contactRequest.onload = function() {
        console.log(contactRequest.responseText);
        var contact;
        contact = JSON.parse(contactRequest.responseText);
        console.log("Contact: " + contact.firstName);
        contactArray.push(contact);
        document.getElementById("contactID").innerHTML = JSON.stringify(contactArray);

        document.getElementById("statusID").innerHTML = "Status: Loading " + contact.firstName + " " + contact.lastName;

        loadContact++;
        if (contactURLArray.length > loadContact){
            loadNextContact(contactURLArray[loadContact]);
        } else {
            document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + contactURLArray.length + ")";
            viewCurrentContact();
            console.log(contactArray);
        }
    }
    contactRequest.send();
}

function logContacts() {
    console.log(contactArray);
}