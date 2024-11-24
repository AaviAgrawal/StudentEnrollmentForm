var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var studentDBName = 'SCHOOL-DB';
var studentRelationName = 'STUDENT-TABLE';
var connToken = '90934416|-31949230538922380|90957296';

function saveRecNo2Ls(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getRollNoAsJsonObj(){
    var rollno = $("#rollno").val();
    var jsonStr = {
        id: rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2Ls(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#fullname").val(data.fullname);
    $("#class").val(data.class);
    $("#birthdate").val(data.birthdate);
    $("#address").val(data.address);
    $("#enrollmentdate").val(data.enrollmentdate);
}

function resetData() {
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}

function validateData() {
    var rollno = $("#rollno").val();
    if (rollno === "") {
        alert("Roll No is a required value");
        $("#rollno").focus();
        return "";
    }

    var fullname = $("#fullname").val();
    if (fullname === "") {
        alert("Full Name is a required value");
        $("#fullname").focus();
        return "";
    }

    var classVal = $("#class").val();
    if (classVal === "") {
        alert("Class is a required value");
        $("#class").focus();
        return "";
    }

    var birthdate = $("#birthdate").val();
    if (birthdate === "") {
        alert("Birth Date is a required value");
        $("#birthdate").focus();
        return "";
    }

    var address = $("#address").val();
    if (address === "") {
        alert("Address is a required value");
        $("#address").focus();
        return "";
    }

    var enrollmentdate = $("#enrollmentdate").val();
    if (enrollmentdate === "") {
        alert("Enrollment Date is a required value");
        $("#enrollmentdate").focus();
        return "";
    }

    var jsonStrObj = {
        id: rollno,
        fullname: fullname,
        class: classVal,
        birthdate: birthdate,
        address: address,
        enrollmentdate: enrollmentdate
    };

    return JSON.stringify(jsonStrObj);
}

function saveData() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest(connToken, jsonStr, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetData();
}

function changeData() {
    $("#change").prop('disabled', true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetData();
}

function getStudent() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, rollNoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resultObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#fullname").focus();
    } else if (resultObj.status === 200) {
        $("#rollno").prop('disabled', true);
        fillData(resultObj);
        $("#change").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#fullname").focus();
    }
}
