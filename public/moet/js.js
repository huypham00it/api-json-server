$(".rcbArrowCell a").each((e, o) => o.click());
const provincesWrap = $(".rcbScroll")[3],
    schoolTypeWrap = $(".rcbScroll")[2];
let provinceData = {},
    provinceIndex = 0;
function provincesCrawler() {
    const e = [];
    $(provincesWrap)
        .find(".rcbList li")
        .each((o, n) => {
            e.push(n);
        }),
        provinceIndex < e.length
            ? (console.log("crawling: " + provinceIndex),
              (provinceData.name = e[provinceIndex].innerText),
              (provinceData.items = []),
              $(".rcbArrowCell a")[0].click(),
              e[provinceIndex].click(),
              schoolTypesCrawler(),
              provinceIndex++)
            : console.log("done");
}
console.log("start");
let schoolTypeIndex = 0;
const schoolTypes = [];
function schoolTypesCrawler(e) {
    const o = e || schoolTypeIndex;
    o < schoolTypes.length
        ? (provinceData.items.push({
              id: o,
              name: schoolTypes[o].innerText,
              items: [],
          }),
          $(".rcbArrowCell a")[1].click(),
          schoolTypes[o].click(),
          townsCrawler(o))
        : ((schoolTypeIndex = 0),
          sendData(provinceData),
          (provinceData = {}),
          provincesCrawler());
}
$(schoolTypeWrap)
    .find(".rcbList li")
    .each((e, o) => {
        schoolTypes.push(o);
    });
let towns = [],
    schools = [];
function townsCrawler(e, o) {
    const n = setInterval(() => {
        if (checkLoading()) {
            clearInterval(n);
            const c = $("#ctl00_ContentPlaceHolder1_rcbPhongGD_DropDown"),
                r = $("#ctl00_ContentPlaceHolder1_cbTruong_DropDown");
            $(".rcbArrowCell a")[2].click(), $(".rcbArrowCell a")[3].click();
            let l = [];
            $(c)
                .find(".rcbList li")
                .each((e, o) => {
                    l.push(o);
                }),
                (towns = l);
            let s = [];
            $(r)
                .find(".rcbList li")
                .each((e, o) => {
                    s.push(o);
                }),
                (schools = s);
            let t = o || 0;
            t < towns.length
                ? (provinceData.items[e].items.push({
                      id: t,
                      name: towns[t].innerText,
                      items: [],
                  }),
                  $(".rcbArrowCell a")[2].click(),
                  towns[t].click(),
                  schoolsCrawler(e, t),
                  t++)
                : 0 === t
                ? schools.length
                    ? provinceData.items[e].items.push({
                          index: t,
                          name: null,
                          items: schools.map((e, o) => ({
                              id: o,
                              name: e.innerText,
                          })),
                      })
                    : (provinceData.items[e].items.push({
                          id: t,
                          name: null,
                          items: [],
                      }),
                      schoolTypesCrawler(e + 1))
                : schoolTypesCrawler(e + 1);
        }
    }, 500);
}
function schoolsCrawler(e, o) {
    const n = setInterval(() => {
        checkLoading() &&
            (clearInterval(n),
            (provinceData.items[e].items[o].items = schools.map((e, o) => ({
                id: o,
                name: e.innerText,
            }))),
            townsCrawler(e, o + 1));
    }, 500);
}
function checkLoading() {
    return !($(".raDiv").length > 1);
}
function start(e) {
    e && (provinceIndex = e), provincesCrawler();
}
function sendData(e) {
    console.log(149, e),
        fetch("https://api-json-server-one.vercel.app/moet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(e),
        });
}
