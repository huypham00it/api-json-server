$(".rcbArrowCell a").each((index, item) => item.click());

const provincesWrap = $(".rcbScroll")[3];
const schoolTypeWrap = $(".rcbScroll")[2];

let provinceData = {};

let provinceIndex = 0;

console.log("start");
function provincesCrawler() {
    const provinces = [];

    $(provincesWrap)
        .find(".rcbList li")
        .each((_provinIndex, province) => {
            provinces.push(province);
        });

    if (provinceIndex < 2) {
        //provinces.length
        console.log("crawling: " + provinceIndex);
        provinceData.name = provinces[provinceIndex].innerText;
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
            name: schoolTypes[index].innerText,
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
                    name: towns[index].innerText,
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
                        name: null,
                        items: schools.map((item, index) => ({
                            id: index,
                            name: item.innerText,
                        })),
                    });
                } else {
                    provinceData.items[schoolTypeIndex].items.push({
                        id: index,
                        name: null,
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
                    name: item.innerText,
                }));

            townsCrawler(schoolTypeIndex, townIndex + 1);
        }
    }, 500);
}

function checkLoading() {
    return $(".raDiv").length > 1 ? false : true;
}

function start(index) {
    if (index) {
        provinceIndex = index;
    }
    provincesCrawler();
}

function sendData(data) {
    console.log(149, data);
    fetch("https://api-json-server-one.vercel.app/moet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}
