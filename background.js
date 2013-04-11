if (webkitNotifications) {

// Helper function to show a notification
function showNotification(extension) {

  if (extension) {
    // Save temporary the old version to display it in the notification
    extension.oldVersion = localStorage[extension.id];
  }
  
  var icon = '';
  if (extension.icons && extension.icons.length !== 0) {
    icon = extension.icons[extension.icons.length-1].url;
  } else {
    icon = 'chrome://extension-icon/' + extension.id + '/32/0';
  }
  
  var title = '';
  title = extension.name + ' Updated';
  
  var text = '';
  text = 'From: ' + extension.oldVersion + '\nTo: ' + extension.version;

  var notification = webkitNotifications.createNotification(icon,title,text);
  notification.show();
}

function checkExtensionVersion(extension) {

  if (localStorage[extension.id] && (localStorage[extension.id] != extension.version) ) {
    showNotification(extension);
  }
    
  // Store new version of this extension
  localStorage[extension.id] = extension.version;
}

function checkChromeVersion() {
		if(getChromeVersion() != localStorage["ver"]) {
				localStorage["prev_ver"] = localStorage["ver"];
				localStorage["ver"] = getChromeVersion();
				
				var chtext = 'From: ' + localStorage["prev_ver"] + '\nTo: ' + localStorage["ver"];
				var notification = webkitNotifications.createNotification('chrome.png','Google Chrome Updated',chtext);
				notification.show();
		}
}

function getChromeVersion() {
  return window.navigator.appVersion.match(/Chrome\/(\S+) /)[1];
}

checkChromeVersion();

chrome.management.getAll(function (extensions) {

  // Store versions of installed extensions once
  extensions.forEach(function (extension) {
    checkExtensionVersion(extension);
  });

  // Show a notification each time a new version of an extension is installed
  //chrome.management.onEnabled.addListener(checkExtensionVersions);
  chrome.management.onInstalled.addListener(function (extension) {
    checkExtensionVersion(extension);
  });
});

} else {
    // Show a new tab with an error message.
    chrome.tabs.create({url: 'error.html'});
}
