chrome.commands.onCommand.addListener(async (command) => {
  console.log(`back`);
  switch (command) {
    case "start_profile":
      await start_profile();
      break;
    case "profile_reset":
      await profile_reset();
      break;
    default:
      console.log(`Command ${command} not found`);
  }
});

const start_profile = async () => {
  console.log(`Command started`);
  getActiveTab = async () => {
    const query = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(query);

    return tabs[0];
  };
  const tab = await getActiveTab();
  chrome.tabs.sendMessage(tab.id, { action: "start_profile" });
};

const profile_reset = async () => {
  console.log(`Command started`);
  getActiveTab = async () => {
    const query = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(query);

    return tabs[0];
  };
  const tab = await getActiveTab();
  chrome.tabs.sendMessage(tab.id, { action: "profile_reset" });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting == "showNotification") {
    // createNotification();
    sendResponse({ farewell: "Notification was shown" });
  }
});

function createNotification() {
  let notificationOptions = {
    type: "basic",
    title: "Upwork",
    message: "Your profile is ready",
    iconUrl: "upwork.png",
  };
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTabId = tabs[0].id;
    chrome.notifications.create(
      currentTabId.toString(),
      notificationOptions,
      function () {
        console.log("Notification was created");
      }
    );
  });
}
