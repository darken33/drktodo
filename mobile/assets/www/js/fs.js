/**
 * FS.js - script pour accéder au FileSystem du téléphone
 */
var directoryName = "drktodo";
var fileNameTodoList = "todolist.txt";
var fileNameTasks = "tasks.txt";
var fileSystem = 0;
var dir = 0;
var fictodo = 0;
var fictask = 0;
var ready_todo = false;
var ready_task = false;
var ready_error = false;
var thread = null;

/** 
 * onFSInitSuccess - appelée lorsque l'initialisation du FS a abouti 
 */
function onFSInitSuccess(_fileSystem) {
 	fileSystem=_fileSystem;
 	fileSystem.root.getDirectory(directoryName, {create: true, exclusive: false}, onDirectoryInitSuccess, onFSError);
}

/** 
 * onDirectoryInitSuccess - appelée lorsque l'initialisation du DIR a abouti 
 */
function onDirectoryInitSuccess(_dir) {
	dir = _dir;
	dir.getFile(fileNameTodoList, {create: true, exclusive: false}, onFileTodoListInitSuccess, onFSError);
	dir.getFile(fileNameTasks, {create: true, exclusive: false}, onFileTaskListInitSuccess, onFSError);
}

/** 
 * onFileTodoListInitSuccess - appelée lorsque l'initialisation du fichier TODO a abouti 
 */
function onFileTodoListInitSuccess(_file) {
	fictodo = _file;
	readTodoList();
}

/** 
 * onFileTaskListInitSuccess - appelée lorsque l'initialisation du fichier TASK a abouti 
 */
function onFileTaskListInitSuccess(_file) {
	fictask = _file;
	readTaskList()
}

/** 
 * onFSError - appelée lorsqu'une erreur est levée
 */
function onFSError(_error) {
	var message = "File System Error: " + _error.code;
	switch (_error.code) {
		case FileError.NOT_FOUND_ERR : message = "File System Error: NOT FOUND"; break;
		case FileError.SECURITY_ERR : message = "File System Error: SECURITY"; break;
		case FileError.ABORT_ERR : message = "File System Error: ABORT"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: NOT READABLE"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: ENCODING"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: NO MODIFICATION ALLOWED"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: INVALID STATE"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: SYNTAX"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: INVALID MODIFICATION"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: QUOTA EXCEEDED"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: TYPE MISMATCH"; break;
		case FileError.NOT_FOUND_ERR : message = "File System Error: PATH EXISTS"; break;
	}
    ready_error=true;
    alert(message);
    console.log(message);
}

/**
 * readTodoList - lecture du fichier TODO
 */ 
function readTodoList() {
   var reader = new FileReader();
   reader.onloadend = function(_evt) {
		var res = _evt.target.result;
		if (res == "") {
			list = new Array();
		}
		else {
			list = res.split('\n');
		}
        ready_todo = true;
   };
   reader.readAsText(fictodo);
}

/**
 * readTaskList - lecture du fichier TASK
 */ 
function readTaskList() {
   var reader = new FileReader();
   reader.onloadend = function(_evt) {
		var res = _evt.target.result;
		if (res == "") {
			oldItems = new Array();
		}
		else {
			oldItems = res.split('\n');
		}
        ready_task = true;
   };
   reader.readAsText(fictask);
}

/**
 * writeTodoList - ecriture du fichier TODO
 */ 
function writeTodoList() {
	fictodo.createWriter(
		function(writer) {
			var text = list.join('\n');
			writer.onerror = onFSError;
			writer.write(text);
		}, onFSError
	);
}

function writeTask(writer) {
	var text = oldItems.join('\n');
	writer.onerror = onFSError;
	writer.write(text);
}

/**
 * writeTaskList - ecriture du fichier TASK
 */ 
function writeTaskList() {
	fictask.createWriter(writeTask, onFSError);
}

/**
 * initFileSystem - intialisation du File System
 */
function initFileSystem() {
	changePage('loading');
	thread = setInterval(loading, 1000);
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSInitSuccess, 
	function(_evt){	
		onFSError(_evt.target);
	}); 
}

/**
 * isReady - renvoie trus losque le périférique est pret
 */
function isReady() {
	return (ready_error || (ready_task && ready_todo));
}  
