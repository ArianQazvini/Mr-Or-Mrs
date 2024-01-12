document.addEventListener('DOMContentLoaded',function () {
    var nameInput = document.getElementById('name');
    var submitButt = document.getElementById('submit-but');
    var saveButt = document.getElementById('save-but');
    var clearSelectionButt = document.getElementById('clear-selection-butt');
    var genderPrediction = document.getElementById('gender-prediction');
    var probPrediction = document.getElementById('probability-prediction');
    var maleRadioChecker = document.getElementById('male');
    var femaleRadioChecker = document.getElementById('female');
    var savedResDiv = document.getElementById('saved-section');
    var savedTextbox = document.getElementById('saved-text');
    var clearSavedButt = document.getElementById('clear-butt');
    var infoDiv = document.getElementById('info-section"');
    var infoTextBox = document.getElementById('info-textbox');
    savedResDiv.style.display = 'none';

    clearSelectionButt.addEventListener('click', clearSelection)
    submitButt.addEventListener('click',submit)
    saveButt.addEventListener('click',save)
    clearSavedButt.addEventListener('click',clear)

    function clearSelection() {
        var radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach(function (radio) {
            radio.checked = false;
        });
    }
    function submit(){
        var name = nameInput.value
        if(name===''){
            displayLog("Name not provided",true)
            return;
        }
        if (!name.match((/^[a-zA-Z]{1,254}$/))){
            displayLog("Name must only have English letters and be less than 255 characters",true)
            return
        }
        setDisabledButton(true)
        displayFromSavedItems()
        const api = 'https://api.genderize.io/?name=' + name;
        fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.gender === null) {
                throw new Error("Name not available in api");
            }
            console.log(data)
            displayPrediction(data.gender,data.probability)
            setDisabledButton(false)
        })
        .catch(error => {
           displayLog(error.message,true)
            genderPrediction.textContent = "Gender"
            probPrediction.textContent = "Probability"
        });
    }
    function save(){
            if(maleRadioChecker.checked===false && femaleRadioChecker.checked===false){
                if(genderPrediction.textContent !== "Gender" && probPrediction.textContent !== "Probability"){
                    if(nameInput.value != null){
                        displayLog("Item Saved Successfully",false)
                        savedTextbox.textContent= genderPrediction.textContent
                        localStorage.setItem(nameInput.value,genderPrediction.textContent)
                        savedResDiv.style.display = 'block';
                    }
                }
            }
            else{
                if(maleRadioChecker.checked===true){
                    displayLog("Item Saved Successfully",false)
                    savedTextbox.textContent= "male"
                    localStorage.setItem(nameInput.value,"male")
                    savedResDiv.style.display = 'block';
                }
                if(femaleRadioChecker.checked===true){
                    displayLog("Item Saved Successfully",false)
                    savedTextbox.textContent= "female"
                    localStorage.setItem(nameInput.value,"female")
                    savedResDiv.style.display = 'block';
                }
            }
    }
    function clear(){
        if(nameInput.value !== null && savedResDiv.style.display === 'block'){
            displayLog("Item Removed Successfully",false)
            localStorage.removeItem(nameInput.value)
            savedTextbox.textContent="No Data"
        }
    }
    function setDisabledButton(isdisable){
        submitButt.disabled = isdisable;
        saveButt.disabled = isdisable;
    }
    function displayPrediction(gender, probability){
        genderPrediction.textContent = gender;
        probPrediction.textContent = probability ;
    }
    function displayFromSavedItems(){
        if(nameInput.value != null){
            item = localStorage.getItem(nameInput.value)
            if(item !== null){
                savedResDiv.style.display = 'block';
                savedTextbox.textContent= item
            }
            else{
                savedResDiv.style.display = 'none';
            }
        }
    }
    function displayLog(logMessage,isError) {
        infoTextBox.textContent = logMessage
        if (isError) {
            infoDiv.style.backgroundColor = "#FF0000";
        } else {
            infoDiv.style.backgroundColor = "#14840f";
        }
        infoDiv.style.display = "inline-block"
        setTimeout(function () {
            infoDiv.style.display = "none"
        }, 3000);
    }
});
