chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_profile") {
    create_profile();
  }
  return true;
});

async function create_profile() {
  const nextBtn = document.querySelector('[data-qa="get-started-btn"]');
  nextBtn.click();

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
