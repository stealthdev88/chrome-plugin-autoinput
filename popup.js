let selectedProfile;

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

document.addEventListener("DOMContentLoaded", () => {
  let profiles = [];

  if (localStorage.getItem("profiles")) {
    profiles = JSON.parse(localStorage.getItem("profiles"));

    profiles.forEach((profile) => {
      addListItem(profile);
    });
  }

  function addListItem(profile) {
    const profilesList = document.querySelector("#profilesList");
    const newListItem = document.createElement("li");
    const btns = document.getElementById("btns");
    newListItem.style.display = "block";

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "profile";
    radioInput.id = profile.name;
    radioInput.value = profile.name;

    const label = document.createElement("label");
    label.htmlFor = profile.name;
    label.textContent = profile.name;

    newListItem.appendChild(radioInput);
    newListItem.appendChild(label);

    // Modified click event listener
    newListItem.addEventListener("click", (event) => {
      if (event.target !== radioInput) {
        radioInput.click();
        newListItem.appendChild(btns);
      }

      // Clear `.selected` from any previously selected list item
      let selectedListItem = document.querySelector(
        "#profilesList li.selected"
      );
      if (selectedListItem) {
        selectedListItem.classList.remove("selected");
      }
      selectedProfile = profile;
      // Add `.selected` to the clicked list item
      newListItem.classList.add("selected");
    });

    profilesList.appendChild(newListItem);
  }
});

let btn_start = false;
document.getElementById("btn_start").addEventListener("click", async () => {
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  const tab = await getCurrentTab();
  if (!btn_start) {
    btn_start = true;
    // document.getElementById("btn_start").innerText = "Starting...";
    document.getElementById("btn_start").style.backgroundColor = "cadetblue";
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: create_profile_1,
      args: [selectedProfile],
    });
  }
}); //btn_set

let btn_reset = false;
document.getElementById("btn_reset").addEventListener("click", async () => {
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  const tab = await getCurrentTab();
  if (!btn_reset) {
    btn_reset = true;
    // document.getElementById("btn_reset").innerText = "Reseting...";
    document.getElementById("btn_reset").style.backgroundColor = "cadetblue";
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: create_profile_2,
      args: [selectedProfile],
    });
  }
}); //btn_set

document.getElementById("btn_set").addEventListener("click", function () {
  window.open(chrome.runtime.getURL("options.html"));
});

document.getElementById("searchBox").addEventListener("input", function () {
  let searchString = this.value.toLowerCase();
  let jobList = document.getElementById("profilesList");
  let jobs = jobList.getElementsByTagName("li");

  for (let job of jobs) {
    let label = job.getElementsByTagName("label")[0];
    let originalText = label.textContent;

    if (searchString === "") {
      label.innerHTML = originalText; // Reset to original text if search string is empty
      job.style.display = "block";
      continue;
    }

    let lowerCaseText = originalText.toLowerCase();
    let index = lowerCaseText.indexOf(searchString);

    if (index !== -1) {
      let highlightedText = originalText.substring(
        index,
        index + searchString.length
      );
      label.innerHTML = originalText.replace(
        new RegExp(searchString, "gi"),
        '<span class="highlight">$&</span>'
      );
      job.style.display = "block";
    } else {
      label.innerHTML = originalText;
      job.style.display = "none";
    }
  }
});

let btn_create = false;
document.getElementById("btn_create").addEventListener("click", async () => {
  if (!btn_create) {
    btn_create = true;
    document.getElementById("btn_create").style.backgroundColor = "cadetblue";
    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: createProfile
    });
  }
});

let btn_verify = false;
document.getElementById("btn_verify").addEventListener("click", async () => {
  if (!btn_verify) {
    btn_verify = true;
    document.getElementById("btn_verify").style.backgroundColor = "cadetblue";
    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: upworkVerify
    });
  }
});

let btn_upwork_help = false;
document.getElementById("btn_upwork_help").addEventListener("click", async () => {
  if (!btn_upwork_help) {
    btn_upwork_help = true;
    document.getElementById("btn_upwork_help").style.backgroundColor = "cadetblue";
    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: upworkFriend
    });
  }
});

// let btn_newSkills = false;
// document.getElementById("btn_newSkills").addEventListener("click", async () => {
//   const newSkills = document.getElementById ("newSkills").value;
//   console.log("newSkills: ", newSkills);
//   if (newSkills === null || newSkills === "") {
//     alert ("Please input skills: React, Next.js...");
//     return;
//   }

//   const tab = await getCurrentTab();
//   if (!btn_newSkills) {
//     btn_newSkills = true;
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: updateSkillset
//     });
//   }
// });


async function createProfile() {
  // const nextBtn = document.querySelector('[data-qa="get-started-btn"]');
  // nextBtn.click();

  await freelance_experience();
  await goal();
  await work_preference();
  await resume();

  async function freelance_experience() {
    await waitForPageLoad(2000);
    const currentURL = window.location.href;
    if (currentURL !== "https://www.upwork.com/nx/create-profile/experience") {
      return freelance_experience();
    } else {
      const inputElement = document.querySelector(
        'input[value="FREELANCED_BEFORE"]'
      );
      if (inputElement) {
        inputElement.click();
      } else {
        console.log("Input element not found");
      }
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function goal() {
    await waitForPageLoad(2000);
    const currentURL = window.location.href;
    if (currentURL !== "https://www.upwork.com/nx/create-profile/goal") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      }
      return goal();
    } else {
      const inputElement = document.querySelector('input[value="MAIN_INCOME"]');
      if (inputElement) {
        inputElement.click();
      } else {
        console.log("Input element not found");
      }
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function work_preference() {
    await waitForPageLoad(2000);
    const currentURL = window.location.href;
    if (
      currentURL !== "https://www.upwork.com/nx/create-profile/work-preference"
    ) {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return work_preference();
    } else {
      var inputElement = document.querySelector(
        'input[data-ev-label="button_box_checkbox"]'
      );

      if (inputElement) {
        inputElement.click();
      } else {
        console.log("Input element not found");
      }

      const checkElement = document.querySelector(
        'span[data-test="checkbox-input"]'
      );
      if (checkElement) {
        checkElement.click();
      } else {
        console.log("Button element not found");
      }

      const nextBtn1 = document.querySelector(
        'button[data-test="next-button"]'
      );
      nextBtn1.click();
      console.log("Button element clicked");
    }
  }

  async function resume() {
    await waitForPageLoad(2000);
    const currentURL = window.location.href;
    if (
      currentURL !== "https://www.upwork.com/nx/create-profile/resume-import"
    ) {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return resume();
    } else {
      const resumeElement = document.querySelector(
        'button[data-qa="resume-upload-btn-mobile"]'
      );
      if (resumeElement) {
        resumeElement.click();
      } else {
        console.log("Input element not found");
      }
    }
  }
}

function waitForPageLoad(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function updateSkillset () {
  await setSkills();

  async function setSkills() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });

    if (document.querySelector('div[class="air3-modal"]') == null) {
      if (!once) {
        var addBtn = document.querySelector("button[data-v-4579db22]");
        if (addBtn) addBtn.click();
        once = 1;
      }
      return setSkills();
    } else {
      const inputSkillElement = document.querySelector(
        'div[data-ev-sublocation="!tokenizer"]'
      );

      if (inputSkillElement == null) {
        return setSkills();
      }

      return new Promise((resolve, reject) => {
        processRemoveItem().then(() => {
          const skillstring = document.getElementById("newSkills").value.replaceAll(', ', ',');
          const skills = skillstring.split(',');
          processSkillArray(skills).then(() => {
            resolve(console.log("END"));
          });
        });
      });
    }
  }

  async function processRemoveItem() {
    return await new Promise(async (resolve, reject) => {
      var intervalId2 = setInterval(function () {
        var result = document.evaluate(
          '//li[@sortable-skip]//input[@type="search"]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        console.log("item remove...");
        const event = new KeyboardEvent("keydown", {
          bubbles: true, // Event bubbles up through the DOM
          cancelable: true, // Event can be canceled
          key: "Backspace", // Key value is 'Backspace'
          code: "Backspace", // Code is 'Backspace' (physical key location)
          keyCode: 8, // keyCode value for Backspace (deprecated but sometimes useful)
        });
        result.dispatchEvent(event);
        var existSkills = document.querySelectorAll(
          "ol > li:not([sortable-skip])"
        );
        if (existSkills.length === 0) {
          clearInterval(intervalId2);
          resolve(console.log("All removed"));
        }
      }, 50);
    });
  }

  function processSkillSearchItem(item, callback) {
    if (item === undefined) {
      setTimeout(() => {
        return;
      }, 1000);
    } else {
      var xpath = '//li[@sortable-skip]//input[@type="search"]';
      var result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (result && result instanceof HTMLInputElement) {
        result.focus();
        result.value = item;
        result.dispatchEvent(new Event("input", { bubbles: true }));
      }
      result.click();

      var xpath1 = '//*[contains(@id, "typeahead-input-control")]/li[1]';
      var attemptCount = 0;
      var intervalId = setInterval(function () {
        var result2 = document.evaluate(
          xpath1,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (result2 !== null) {
          result2.click();
          clearInterval(intervalId);
          callback();
        } else if (attemptCount > 3) {
          // checking if 7 seconds have passed
          console.log(
            "Element not found for",
            item,
            "in 7 seconds. Re-running function."
          );
          clearInterval(intervalId); // stop current interval
          return processSkillSearchItem(item.slice(0, -1), callback); // rerun the function
        } else {
          attemptCount++; // increment attempt count if element not found
        }
      }, 1000);
    }
  }

  function processSkillArray(array) {
    return new Promise((resolve, reject) => {
      if (array.length === 0) {
        const saveBtn = document.querySelector(
          'button[class="air3-btn air3-btn-primary"]'
        );
        saveBtn.click();
        resolve();
      }

      var item = array.shift();
      processSkillSearchItem(item, function () {
        processSkillArray(array).then(() => resolve());
      });
    });
  }
}

async function upworkFriend() {
  console.log (10);
  async function setNotificationTime () {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    // const currentURL = window.location.href;
    // console.log("current url", currentURL);
  }
}

async function upworkVerify() {
  // document.querySelector('.d-flex > a').click(); // identity-verification
  // await verifyStep1(); // Agree to sharing your ID
  // await clickNextButton();
  // await verifyStep2(); // select passport
  // await clickNextButton();

  // while (window.location.href.includes('step-up-verification') && document.querySelector('[style=""] h3').textContent === "Try again when you're ready for the camera") {
    await clickNextButton();
    await clickNextButton();
    await clickNextButton();
    await clickNextButton();
    await clickNextButton();
  // }

  // document.getElementById("misnapNativeCapture").click();
  
  // await clickNextButton(); // passport load
  // const wshShell = new ActiveXObject("WScript.Shell");
  // let commandtoRun = 'D:\\CopyandPaste\\copy.bat'; 
  // wshShell.run(commandtoRun, 1, false);
  // oShell.ShellExecute(commandtoRun,"","","open","1");
  // await clickNextButton();
  // await clickNextButton();
  // await clickNextButton();
  // await clickNextButton();

  // commandtoRun = "D:\\CopyandPaste\\copy.bat D:\\Passport\\CA\\CA-1\\selfi.jpg";
  // wshShell.run(commandtoRun);

  async function clickNextButton() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    if (!window.location.href.includes('step-up-verification')) return;
    if (document.querySelector('button[data-test="next-button"]') == null) {
      return clickNextButton();
    } else {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn && document.querySelector('button[data-test="next-button"]').innerText === "I'm ready") {
        nextBtn.click();
      } else {
        console.log("label element not found");
      }
    }
  }
  
  async function verifyStep1() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });

    if (document.querySelector('label[data-test="checkbox-label"]') == null) {
      // return verifyStep1();
    } else {
      const checkBox = document.querySelector('label[data-test="checkbox-label"]');
      if (checkBox) {
        checkBox.click();
      } else {
        console.log("label element not found");
      }
    }
  }

  async function verifyStep2() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });

    if (document.querySelector('input[value="PASSPORT"]') == null) {
      // return verifyStep2();
    } else {
      const checkBox = document.querySelector('input[value="PASSPORT"]');
      if (checkBox) {
        checkBox.click();
      } else {
        console.log("label element not found");
      }
    }
  }
}

async function create_profile_1(profile) {
  console.log("hello started");
  const profileType = document.querySelector("input[type='text'");
  if (profileType !== null) {
    await profile_title();
    await work_experience();
    await profile_education();
    // await profile_language();
    await fill_skill();
    await profile_summary();
    await profile_category();
    await profile_rate();
    await profile_general();
  } else {
    await profile_category_2();
    await fill_skill();
    await profile_title();
    await work_experience();
    await profile_education();
    await profile_summary();
    await profile_rate();
    await profile_general();
  }
  
  document.getElementById("btn_start").innerText = "Start";
  document.getElementById("btn_start").style.backgroundColor = "#008cba";
  btn_start = false;

  function profile_title() {
    var inputTitle = document.querySelector("input[type='text']");
    inputTitle.value = profile.title;
    inputTitle.dispatchEvent(new Event("change", { bubbles: true }));
    inputTitle.dispatchEvent(new Event("input", { bubbles: true }));
    inputTitle.dispatchEvent(new Event("blur", { bubbles: true }));
    console.log("what is the problem");
    const nextBtn = document.querySelector('button[data-test="next-button"]');
    if (nextBtn) {
      nextBtn.click();
    } else {
      console.log("Button element not found");
    }
  }
  async function work_experience() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    console.log("current url", currentURL);
    if (currentURL !== "https://www.upwork.com/nx/create-profile/employment") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return work_experience();
    } else {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function profile_education() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    if (currentURL !== "https://www.upwork.com/nx/create-profile/education") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return profile_education();
    } else {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function profile_language() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    console.log("current url", currentURL);
    if (currentURL !== "https://www.upwork.com/nx/create-profile/languages") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return profile_language();
    } else {
      function checkAndClickElement() {
        let dropdownBox = document.querySelector("#dropdown-menu");
        if (dropdownBox) {
          let liElement = dropdownBox.querySelector("li:nth-child(4)");
          if (liElement) {
            liElement.click();
          } else {
            setTimeout(checkAndClickElement, 500); // Check again after 500ms
          }
        } else {
          setTimeout(checkAndClickElement, 500); // Check again after 500ms
        }
      }
      const dropdown = document.querySelector(
        'div[data-test="dropdown-toggle"]'
      );
      dropdown.click();
      // Call the function to start the process
      await checkAndClickElement();
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function fill_skill() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    console.log("current url", currentURL);
    if (currentURL !== "https://www.upwork.com/nx/create-profile/skills") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return fill_skill();
    }
    return new Promise((resolve, reject) => {
      const skillstring = profile.skills;
      const skills = skillstring.split(", ");
      processArray(skills).then(() => resolve());
    });
  }

  function processSearchItem(item, callback) {
    if (item == undefined) {
      var closeBtn = document.querySelector(
        'button[data-test="dropdown-close"]'
      );
      if (closeBtn) closeBtn.click();
      return;
    }
    var xpath = '//input[@type="search"]';
    var result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    result.focus();
    if (result && result instanceof HTMLInputElement) {
      result.value = item;
      result.dispatchEvent(new Event("input", { bubbles: true }));
    }
    result.click();

    var xpath1 = '//*[contains(@id, "typeahead-input-control")]/li[1]';
    var attemptCount = 0;
    var intervalId = setInterval(function () {
      var result2 = document.evaluate(
        xpath1,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (result2 !== null) {
        result2.click();
        clearInterval(intervalId);
        callback();
      } else if (attemptCount > 3) {
        // checking if 7 seconds have passed
        console.log(
          "Element not found for",
          item,
          "in 7 seconds. Re-running function."
        );
        clearInterval(intervalId); // stop current interval
        processSearchItem(item, callback); // rerun the function
      } else {
        attemptCount++; // increment attempt count if element not found
      }
    }, 1000);
  }

  function processArray(array) {
    return new Promise((resolve, reject) => {
      if (array.length === 0) resolve();

      var item = array.shift();
      processSearchItem(item, function () {
        processArray(array).then(() => resolve());
      });
    });
  }

  async function profile_summary() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    console.log("current url", currentURL);
    if (currentURL !== "https://www.upwork.com/nx/create-profile/overview") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return profile_summary();
    } else {
      const textElement = document.querySelector("textarea");
      textElement.value = profile.summary;
      textElement.dispatchEvent(new Event("change", { bubbles: true }));
      textElement.dispatchEvent(new Event("input", { bubbles: true }));
      textElement.dispatchEvent(new Event("blur", { bubbles: true }));
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function profile_category() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    console.log("current url", currentURL);
    if (currentURL !== "https://www.upwork.com/nx/create-profile/categories") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return profile_category();
    } else {
      function selectCategories() {
        let sublistItem = document.querySelectorAll(
          "#dropdown-menu > li:nth-child(11) > div > ul > li"
        );
        let sublistItem1 = document.querySelectorAll(
          "#dropdown-menu > li:nth-child(7) > div > ul > li"
        );
        let sublistItem2 = document.querySelectorAll(
          "#dropdown-menu > li:nth-child(4) > div > ul > li"
        );
        if (sublistItem.length !== 0) {
          sublistItem[0].click();
          sublistItem[1].click();
          sublistItem[2].click();
          sublistItem[3].click();
          sublistItem[4].click();
          sublistItem[5].click();
          sublistItem[8].click();
          sublistItem[10].click();
          sublistItem1[1].click();
          sublistItem2[4].click();
          var closeBtn = document.querySelector(
            'button[data-test="dropdown-close"]'
          );
          if (closeBtn) closeBtn.click();
        } else {
          setTimeout(selectCategories, 500); // Check again after 500ms
        }
      }
      try {
        const dropdown = document.querySelectorAll(
          'div[data-test="dropdown-toggle"]'
        );
        dropdown[dropdown.length - 1].click();
        // Call the function to start the process
        selectCategories();
      } catch (e) {
        console.log(e);
      }

      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        console.log("Button clicked!");
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function profile_category_2() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    console.log("current url", currentURL);
    if (currentURL !== "https://www.upwork.com/nx/create-profile/categories") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return profile_category();
    } else {
      function selectCategories() {
        document
          .querySelector("ul :nth-child(11) > a")
          .click();
        const sublistItem = document.querySelectorAll("label");
        if (sublistItem.length !== 0) {
          sublistItem[1].click();
          sublistItem[5].click();
          sublistItem[11].click();
        } else {
          setTimeout(selectCategories, 500); // Check again after 500ms
        }
      }
      try {
        // Call the function to start the process
        selectCategories();
      } catch (e) {
        console.log(e);
      }

      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        console.log("Button clicked!");
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function profile_rate() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    console.log("current url", currentURL);
    if (currentURL !== "https://www.upwork.com/nx/create-profile/rate") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return profile_rate();
    } else {
      let inputElement = document.querySelectorAll(
        'input[data-test="currency-input"]'
      )[0];
      // Setting a value
      inputElement.value = profile.rate;

      // Create a new 'Event' of type 'Event' (or 'InputEvent', 'UIEvent', etc., depending on the use case)
      let event = new Event("input", {
        bubbles: true,
        cancelable: true,
      });

      // Dispatch the event
      inputElement.dispatchEvent(event);
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
    }
  }

  async function profile_general() {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("After delay");
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });
    const currentURL = window.location.href;
    console.log("current url", currentURL);
    if (currentURL !== "https://www.upwork.com/nx/create-profile/location") {
      const nextBtn = document.querySelector('button[data-test="next-button"]');
      if (nextBtn) {
        nextBtn.click();
      } else {
        console.log("Button element not found");
      }
      return profile_general();
    } else {
      function fill_street() {
        var dateElement = document.querySelector(
          'input[aria-labelledby="date-of-birth-label"]'
        );

        dateElement.value = profile.birth;
        dateElement.dispatchEvent(new Event("change", { bubbles: true }));
        dateElement.dispatchEvent(new Event("input", { bubbles: true }));
        dateElement.dispatchEvent(new Event("blur", { bubbles: true }));

        var streetElement = document.querySelector(
          'input[aria-labelledby="street-label"]'
        );

        streetElement.value = profile.street;
        streetElement.dispatchEvent(new Event("change", { bubbles: true }));
        streetElement.dispatchEvent(new Event("input", { bubbles: true }));
        streetElement.dispatchEvent(new Event("blur", { bubbles: true }));

        var zipcodElement = document.querySelector(
          'input[aria-labelledby="postal-code-label"]'
        );
        zipcodElement.value = profile.zipCode;
        zipcodElement.dispatchEvent(new Event("change", { bubbles: true }));
        zipcodElement.dispatchEvent(new Event("input", { bubbles: true }));
        zipcodElement.dispatchEvent(new Event("blur", { bubbles: true }));

        var telephoneElement = document.querySelector('input[type="tel"]');
        telephoneElement.value = profile.telNumber;
        telephoneElement.dispatchEvent(new Event("change", { bubbles: true }));
        telephoneElement.dispatchEvent(new Event("input", { bubbles: true }));
        telephoneElement.dispatchEvent(new Event("blur", { bubbles: true }));
        // chrome.runtime.sendMessage(
        //   { greeting: "showNotification" },
        //   function (response) {
        //     console.log(response.farewell);
        //   }
        // );
      }
      async function selectCity() {
        var cityElement = document.querySelector(
          'input[aria-labelledby="city-label"]'
        );
        // Setting a value
        cityElement.click();
        var listCityElement = document.querySelectorAll(
          'input[aria-labelledby="city-label"]'
        );
        let event = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        if (listCityElement.length == 2) {
          listCityElement[1].value = profile.city;
          listCityElement[1].dispatchEvent(event);
        } else {
          listCityElement[0].value = profile.city;
          listCityElement[0].dispatchEvent(event);
        }
        let firstCityLi = document.querySelector(
          'ul[aria-labelledby="city-label"]'
        );

        if (firstCityLi !== null) {
          if (firstCityLi.childElementCount !== 0) {
            firstCityLi.firstElementChild.click();
            var closeBtn = document.querySelector(
              'button[data-test="dropdown-close"]'
            );
            if (closeBtn) closeBtn.click();
            setTimeout(fill_street, 1000);
            return;
          }
          setTimeout(selectCity, 2000); // Check again after 500ms
        } else {
          setTimeout(selectCity, 2000); // Check again after 500ms
        }
      }
      await selectCity();
    }
  }
}

async function create_profile_2(profile) {
  var once = 0;

  await setTitle();
  await setDescription();
  await setSkills();

  document.getElementById("btn_reset").innerText = "Reset";
  document.getElementById("btn_reset").style.backgroundColor = "#008cba";
  btn_reset = false;

  async function setTitle() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });

    if (document.querySelector('div[class="air3-modal"]') == null) {
      if (!once) {
        var addBtn = document.querySelector('button[aria-label="Edit title"]');
        if (addBtn) addBtn.click();
        once = 1;
      }
      return setTitle();
    } else {
      const titleElement = document.querySelector('input[id="profile-title"]');
      // item.project_title && item.project_description && item.skills && item.content_type && item.content_inform;

      titleElement.value = profile.title;
      titleElement.dispatchEvent(new Event("change", { bubbles: true }));
      titleElement.dispatchEvent(new Event("input", { bubbles: true }));
      titleElement.dispatchEvent(new Event("blur", { bubbles: true }));

      const saveBtn = document.querySelector(
        'button[class="air3-btn air3-btn-primary"]'
      );
      once = 0;
      saveBtn.click();
    }
  }

  async function setDescription() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });

    if (document.querySelector('div[class="air3-modal"]') == null) {
      if (!once) {
        var addBtn = document.querySelector(
          'button[aria-label="Edit description"]'
        );
        if (addBtn) addBtn.click();
        once = 1;
      }
      return setDescription();
    }

    const descriptionElement = document.querySelector(
      'textarea[id="profile-description"]'
    );

    if (descriptionElement == null) {
      return setDescription();
    }

    descriptionElement.value = profile.summary;
    descriptionElement.dispatchEvent(new Event("change", { bubbles: true }));
    descriptionElement.dispatchEvent(new Event("input", { bubbles: true }));
    descriptionElement.dispatchEvent(new Event("blur", { bubbles: true }));

    const saveBtn = document.querySelector(
      'button[class="air3-btn air3-btn-primary"]'
    );
    once = 0;
    saveBtn.click();
  }

  async function setSkills() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolving the promise after the delay
      }, 2000); // Delay is specified in milliseconds (2 seconds in this example)
    });

    if (document.querySelector('div[class="air3-modal"]') == null) {
      if (!once) {
        var addBtn = document.querySelector("button[data-v-4579db22]");
        if (addBtn) addBtn.click();
        once = 1;
      }
      return setSkills();
    } else {
      const inputSkillElement = document.querySelector(
        'div[data-ev-sublocation="!tokenizer"]'
      );

      if (inputSkillElement == null) {
        return setSkills();
      }

      return new Promise((resolve, reject) => {
        processRemoveItem().then(() => {
          const skillstring = profile.skills;
          const skills = skillstring.split(", ");
          processSkillArray(skills).then(() => {
            resolve(console.log("END"));
          });
        });
      });
    }
  }

  async function processRemoveItem() {
    return await new Promise(async (resolve, reject) => {
      var intervalId2 = setInterval(function () {
        var result = document.evaluate(
          '//li[@sortable-skip]//input[@type="search"]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        console.log("item remove...");
        const event = new KeyboardEvent("keydown", {
          bubbles: true, // Event bubbles up through the DOM
          cancelable: true, // Event can be canceled
          key: "Backspace", // Key value is 'Backspace'
          code: "Backspace", // Code is 'Backspace' (physical key location)
          keyCode: 8, // keyCode value for Backspace (deprecated but sometimes useful)
        });
        result.dispatchEvent(event);
        var existSkills = document.querySelectorAll(
          "ol > li:not([sortable-skip])"
        );
        if (existSkills.length === 0) {
          clearInterval(intervalId2);
          resolve(console.log("All removed"));
        }
      }, 50);
    });
  }

  function processSkillSearchItem(item, callback) {
    if (item === undefined) {
      setTimeout(() => {
        return;
      }, 1000);
    } else {
      var xpath = '//li[@sortable-skip]//input[@type="search"]';
      var result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (result && result instanceof HTMLInputElement) {
        result.focus();
        result.value = item;
        result.dispatchEvent(new Event("input", { bubbles: true }));
      }
      result.click();

      var xpath1 = '//*[contains(@id, "typeahead-input-control")]/li[1]';
      var attemptCount = 0;
      var intervalId = setInterval(function () {
        var result2 = document.evaluate(
          xpath1,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (result2 !== null) {
          result2.click();
          clearInterval(intervalId);
          callback();
        } else if (attemptCount > 3) {
          // checking if 7 seconds have passed
          console.log(
            "Element not found for",
            item,
            "in 7 seconds. Re-running function."
          );
          clearInterval(intervalId); // stop current interval
          return processSkillSearchItem(item, callback); // rerun the function
        } else {
          attemptCount++; // increment attempt count if element not found
        }
      }, 1000);
    }
  }

  function processSkillArray(array) {
    return new Promise((resolve, reject) => {
      if (array.length === 0) {
        const saveBtn = document.querySelector(
          'button[class="air3-btn air3-btn-primary"]'
        );
        saveBtn.click();
        resolve();
      }

      var item = array.shift();
      processSkillSearchItem(item, function () {
        processSkillArray(array).then(() => resolve());
      });
    });
  }
}
