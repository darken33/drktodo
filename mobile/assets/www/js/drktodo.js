/**
 * script pour drkTodo
 */
var list; 
var oldItems;

/**
 * addToList
 */
function addToList(e) {
	list.push(e);
	fillHTML();
} 

/**
 * removeFromList
 */
function removeFromList(i) {
	list.splice(i,1);
	fillHTML();
	writeTodoList();
}

/**
 * fillHTML
 */
function fillHTML() {
	// si le tableau est vide
	if (list.length == 0) {
		document.getElementById("notask").innerHTML = 'No task in todo list.';
		document.getElementById("todo").innerHTML = '';	
	}
	// on parcours le tableau
	else {
		document.getElementById("notask").innerHTML = '';
		var ul = ""; 
		for (i in list) {
			ul = ul + '<li data-theme="c" data-icon="delete">';
			ul = ul + '<a onclick="removeFromList('+i+')">'+list[i]+'</a>';
			ul = ul + '</li>';
		}
		document.getElementById("todo").innerHTML = ul;	
		$(document.getElementById("todo")).listview('refresh');
	} 
	var options = '<option value=" " selected="selected">NEW TASK...</option>';
	for (k in oldItems) {
		options = options + '<option value="'+oldItems[k]+'">'+oldItems[k]+'</option>';
	}
	document.getElementById("tasks").innerHTML = options;	
	$(document.getElementById("tasks")).selectmenu('refresh');
	selectChange();
} 

/**
 * initScreen
 */
function initScreen() {
	changePage('todolist');
	fillHTML();
} 

/**
 * selectChange() 
 */
function selectChange() {
	document.getElementById("task").value = "";
	if (document.getElementById("tasks").value == " ") {
		document.getElementById("task").style.display = "block";
		$('#task').focus();
	}
	else {
		document.getElementById("task").style.display = "none";
	}
}

/**
 * addItem
 */ 
function addItem() {
	var taskToAdd = document.getElementById("tasks").value; 
	if ( taskToAdd == "" || taskToAdd == " ") {
		taskToAdd = document.getElementById("task").value.toUpperCase().trim();
		if (taskToAdd != ""  && taskToAdd != " ") {
			oldItems.unshift(taskToAdd);
			if (oldItems.length > 15) oldItems.pop();
			writeTaskList();
		}
	}	
	if (taskToAdd != ""  && taskToAdd != " ") {
		changePage('todolist');
		addToList(taskToAdd);
		writeTodoList();
	}
} 

function changePage(id) {
	$('.page-content').hide();
	$('.page-content#'+id).show();
	$('.ui-btn').removeClass('ui-btn-active');    
	$('#navbar').removeClass('ui-btn-active');    
}

function loading() {
	if (isReady()) {
		clearInterval(thread);
		$("#navbar").click(function(evt) { changePage('help');});
		initScreen();
	}
}

function onBackbutton() {
    // the intro div is considered home, so exit if use
    // wants to go back with button from there
    if ($('.page-content#todolist').css('display') === 'block' || $('.page-content#loading').css('display') === 'block') {
        console.log("Exiting app");
        navigator.app.exitApp();
    } else {    
        $('.page-content').hide();
        $('.page-content#todolist').show();
        $.mobile.silentScroll(0);
    }
}
var onDeviceReady = function() {
    document.addEventListener("backbutton", onBackbutton, false);
	initFileSystem();
};

function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
}
