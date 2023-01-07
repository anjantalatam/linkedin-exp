const EXP_H2 =
  "section > div.pvs-header__container > div > div.pvs-header__left-container--stack > div > h2";

const STINTS =
  "div.pvs-list__outer-container > ul > li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > div.display-flex.flex-column.full-width > span.t-14.t-normal.t-black--light > span[aria-hidden=true]";

const LONG_STINTS =
  "div.pvs-list__outer-container > ul > li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > a > span.t-14.t-normal > span[aria-hidden=true]";

const STINT_SEPARATOR = "·";

let lastUrl = location.href;

const observer = new MutationObserver(() => {
  const url = location.href;

  // init on route change
  if (url !== lastUrl) {
    lastUrl = url;
    init();
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

// init on load
init();

function init() {
  const isProfilePage = document.querySelector("#profile-content");

  if (isProfilePage) {
    myMain();
  }

  function myMain() {
    const startNode = document.querySelector(".scaffold-layout__main");

    const elementChecker = setInterval(checkForElement, 500);
    let counter = 0;

    function checkForElement() {
      counter += 1;

      if (counter > 20) {
        clearInterval(elementChecker);
      }

      let expElement;

      const findExperienceElement = document.querySelector("#experience");

      if (findExperienceElement) {
        const findInside = startNode.querySelectorAll(EXP_H2);

        clearInterval(elementChecker);

        for (const hElement of findInside) {
          const spanText = hElement.querySelector("span");
          if (spanText !== null) {
            if (spanText.textContent === "Experience") {
              expElement = hElement;
            }
          }
        }
      }

      if (expElement) {
        const expParent = findExperienceElement.parentElement;
        const stints = expParent.querySelectorAll(STINTS);

        const longStints = expParent.querySelectorAll(LONG_STINTS);

        const expArr = [];
        if (longStints) {
          for (const stint of longStints) {
            const expFromStint = expExtractor(stint);
            expFromStint && expArr.push(expFromStint);
          }
        }

        if (stints.length > 0) {
          for (const stint of stints) {
            const expFromStint = expExtractor(stint);
            expFromStint && expArr.push(expFromStint);
          }
        }

        const totalExp = getTotalExperience(expArr);

        const totalExpElement = document.createElement("span");
        totalExpElement.textContent = totalExp;

        totalExpElement.classList.add("label-16dp-success", "ml2");

        expElement.appendChild(totalExpElement);
      }
    }
  }
}

function getTotalExperience(expArr) {
  let m = 0;
  let y = 0;

  expArr.forEach((exp) => {
    const { mo, yr } = exp;
    m += Number(mo) || 0;
    y += Number(yr) || 0;
  });

  if (m > 11) {
    const mtoy = Math.floor(m / 12);
    y += mtoy;
    m = m % 12;
  }

  const mSuffix = m < 2 ? "mo" : "mos";
  const ySuffix = y < 2 ? "yr" : "yrs";

  let totalExpValue = "";

  if (y !== 0) {
    totalExpValue += `${y} ${ySuffix}`;
  }

  if (m !== 0) {
    totalExpValue += ` ${m} ${mSuffix}`;
  }

  return totalExpValue.trim();
}

function expExtractor(stint) {
  const rawStint = stint.textContent;
  const ex = rawStint.split(STINT_SEPARATOR);

  const matchReg = /^(.*?\s(\byrs|yr|mo|mos\b)[^$]*)$/;

  if (matchReg.test(ex[0])) {
    return hashExpGenerator(ex[0]);
  } else if (matchReg.test(ex[1])) {
    return hashExpGenerator(ex[1]);
  }

  return null;
}

function hashExpGenerator(exp) {
  const hashExp = {};
  const expSplit = exp.trim().split(" ");

  for (let i = 1; i < expSplit.length; i += 2) {
    if (expSplit[i] === "yr" || expSplit[i] === "yrs") {
      hashExp["yr"] = expSplit[i - 1];
    } else if (expSplit[i] === "mo" || expSplit[i] === "mos") {
      hashExp["mo"] = expSplit[i - 1];
    }
  }

  return hashExp;
}
