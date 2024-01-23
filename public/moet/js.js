$(".rcbArrowCell a").each((index, item) => item.click());

const provincesWrap = $(".rcbScroll")[3];
const schoolTypeWrap = $(".rcbScroll")[2];

let provinceData = {};

let provinceIndex = 0;

console.log("start");
function provincesCrawler(a, b) {
    const provinces = [];

    const start = a ? a : provinceIndex;
    const end = b ? b : provinces.length;

    $(provincesWrap)
        .find(".rcbList li")
        .each((_provinIndex, province) => {
            provinces.push(province);
        });

    if (start < end) {
        console.log("crawling: " + provinceIndex);
        provinceData.province = provinces[provinceIndex].innerText;
        provinceData.items = [];
        $(".rcbArrowCell a")[0].click();
        provinces[provinceIndex].click();
        // $(provinces[index]).trigger("click");

        schoolTypesCrawler();
        provinceIndex++;
    } else {
        console.log("done");
    }
}

let schoolTypeIndex = 0;

const schoolTypes = [];
$(schoolTypeWrap)
    .find(".rcbList li")
    .each((_provinIndex, type) => {
        schoolTypes.push(type);
    });

function schoolTypesCrawler(passIndex) {
    const index = passIndex ? passIndex : schoolTypeIndex;

    if (index < schoolTypes.length) {
        provinceData.items.push({
            id: index,
            schoolType: schoolTypes[index].innerText,
            items: [],
        });

        $(".rcbArrowCell a")[1].click();
        // $(schoolTypes[index]).trigger("click");
        schoolTypes[index].click();
        townsCrawler(index);
    } else {
        schoolTypeIndex = 0;
        sendData(provinceData);

        provinceData = {};

        provincesCrawler();
    }
}

let towns = [];
let schools = [];

function townsCrawler(schoolTypeIndex, townIndex) {
    const intervalId = setInterval(() => {
        if (checkLoading()) {
            clearInterval(intervalId);
            const townWrap = $(
                "#ctl00_ContentPlaceHolder1_rcbPhongGD_DropDown"
            );
            const schoolWrap = $(
                "#ctl00_ContentPlaceHolder1_cbTruong_DropDown"
            );
            $(".rcbArrowCell a")[2].click();
            $(".rcbArrowCell a")[3].click();

            let _towns = [];
            $(townWrap)
                .find(".rcbList li")
                .each((_provinIndex, province) => {
                    _towns.push(province);
                });

            towns = _towns;

            let _schools = [];

            $(schoolWrap)
                .find(".rcbList li")
                .each((_provinIndex, province) => {
                    _schools.push(province);
                });

            schools = _schools;

            let index = townIndex ? townIndex : 0;

            if (index < towns.length) {
                provinceData.items[schoolTypeIndex].items.push({
                    id: index,
                    town: towns[index].innerText,
                    items: [],
                });
                $(".rcbArrowCell a")[2].click();
                // $(towns[index]).trigger("click");
                towns[index].click();

                schoolsCrawler(schoolTypeIndex, index);
                index++;
            } else if (index === 0) {
                if (schools.length) {
                    provinceData.items[schoolTypeIndex].items.push({
                        index: index,
                        town: null,
                        items: schools.map((item, index) => ({
                            id: index,
                            school: item.innerText,
                        })),
                    });
                } else {
                    provinceData.items[schoolTypeIndex].items.push({
                        id: index,
                        town: null,
                        items: [],
                    });

                    schoolTypesCrawler(schoolTypeIndex + 1);
                }
            } else {
                schoolTypesCrawler(schoolTypeIndex + 1);
            }
        }
    }, 500);
}

function schoolsCrawler(schoolTypeIndex, townIndex) {
    const intervalId = setInterval(() => {
        if (checkLoading()) {
            clearInterval(intervalId);
            provinceData.items[schoolTypeIndex].items[townIndex].items =
                schools.map((item, index) => ({
                    id: index,
                    school: item.innerText,
                }));

            townsCrawler(schoolTypeIndex, townIndex + 1);
        }
    }, 500);
}

function checkLoading() {
    return $(".raDiv").length > 1 ? false : true;
}

function start(a, b) {
    provincesCrawler(a, b);
}

let db = "http://localhost:5000";

function sendData(data) {
    console.log(149, data);
    fetch(`${db}/moet`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}
