const EXP_H2 =
  "section > div.pvs-header__container > div > div.pvs-header__left-container--stack > div > h2";

const STINT_S =
  "div.pvs-list__outer-container > ul li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > div.display-flex.flex-column.full-width > span.t-14.t-normal.t-black--light > span[aria-hidden=true]";

// missing navodit case

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
  console.log({ isProfilePage });

  if (isProfilePage) {
    console.log("run  main");
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
      console.log("checking", counter);
      let expElement;

      const findExperienceElement = document.querySelector("#experience");

      if (findExperienceElement) {
        const findInside = startNode.querySelectorAll(EXP_H2);

        clearInterval(elementChecker);
        console.log("finally found", findInside);
        for (const hElement of findInside) {
          const spanText = hElement.querySelector("span");
          if (spanText !== null) {
            console.log(spanText, "spanText");
            if (spanText.textContent === "Experience") {
              expElement = hElement;
            }
          }
        }
      }
      console.log(expElement);
      if (expElement) {
        const expParent = findExperienceElement.parentElement;
        const stints = expParent.querySelectorAll(STINT_S);
        const expArr = [];

        for (const stint of stints) {
          const rawStint = stint.textContent;
          const ex = rawStint.split(STINT_SEPARATOR);
          const hashExp = {};

          if (ex[1]) {
            const exp = ex[1];
            const expSplit = exp.trim().split(" ");

            for (let i = 1; i < expSplit.length; i += 2) {
              if (expSplit[i] === "yr" || expSplit[i] === "yrs") {
                hashExp["yr"] = expSplit[i - 1];
              } else if (expSplit[i] === "mon" || expSplit[i] === "mos") {
                hashExp["mon"] = expSplit[i - 1];
              }
            }
            expArr.push(hashExp);
          }
        }

        const totalExp = getTotalExperience(expArr);

        console.log(totalExp);

        const totalExpElement = document.createElement("span");
        totalExpElement.textContent = totalExp;

        totalExpElement.classList.add("label-16dp-success", "ml2");

        expElement.appendChild(totalExpElement);
      }
      // Check for experience and iterate for some time
    }
  }
}

function getTotalExperience(expArr) {
  let m = 0;
  let y = 0;

  expArr.forEach((exp) => {
    const { mon, yr } = exp;
    m += Number(mon) || 0;
    y += Number(yr) || 0;
  });

  if (m > 11) {
    const mtoy = Math.floor(m / 12);
    y += mtoy;
    m = m % 12;
  }

  const mSuffix = m < 2 ? "mon" : "mos";
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
