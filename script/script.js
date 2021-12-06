$(document).ready(function () {

    //Shiny.addCustomMessageHandler('addFiltersHandler', addFilters)
    // for each columns and filter
    // add all filters inside #BOWFiltersDiv


    let selectedItem = [];

    let selectedValMap = new Map();
    let preSelected = {};
    let preSelectedItem = []

    // LABELS for filters:

    const BOW_labels1 = {
        "bow_status": "Bow Status",
        "csr_iss_date": "CSR Issued",
        "therapeutic_area": "Therapeutic Area",
        "bow_status_comments": "BOW Comments",
        "bow_status_reason": "Out-of-Scope Reason",
        "clin_study_status": "Clinical Study Status",
        "clinical_insight_lead": "CIE Lead",
        "co_dev_partner_agreement": "Co-developed Partner name",
        "comments_gpl": "Comments from GPL",
        "conducted_eu": "Conducted EU",
        "conducted_nl": "Conducted NL",
        "conducted_tur": "Conducted TUR",
        "db_lock_date": "Database Lock",
        "dev_category": "Development Category",
        "eu_decision_tracker": "EU CTR Decision Indicator",
        "eu_submission_indicator": "EU Submission Indicator",
        "fpi_date": "First Patient In (Consented) (FPI)",
        "gpl_cpl": "GPL/CPL",
        "gtl_gtm_ctm": "GTL-GTM/CTM",
        "interventional": "Interventional",
        "lpi_date": "Last Patient Consented (LPI)",
        "lpld_date": "Last Patient Last Dose (LPLD)",
        "lpo_date": "Last Patient Last Visit (LPO)",
        "market_auth_approval": "Market Authorization approval?",
        "num_countries": "No. of Countries",
        "num_sites": "No. of Sites",
        "num_study_participants": "No of participants",
        "pediatric_mdm": "Pediatric MDM",
        "pls_followup_actual_date": "PLS followup Actual",
        "pls_followup_planned_date": "PLS followup Planned",
        "pls_req": "PLS Required",
        "primary_prod_name": "Primary Product Name",
        "protocol_id": "Protocol ID",
        "protocol_iss_date": "Protocol Issued",
        "protocol_writer": "Protocol writer",
        "rnd_partner": "R&D Partner",
        "roadmap_desc": "Roadmap Description",
        "sponsor_company": "Sponsoring Company",
        "sponsor_type": "Sponsor Type",
        "st_mgmt_cro": "St Mgmt CRO (Study)",
        "subject_type": "Subject type",
        "talking_points_emp": "Talking Points employed?",
        "tlf_date": "Listings and Graphs",
        "topline_date": "Topline Results Available",
        "trial_phase": "Trial Phase",
        "trial_segment": "Trial Segment"
    }

    let bowJsonData = {
        "protocol_id": ["test1", "test2", "test3"],
        "bow_status": ["clinical1", "clinical2", "clinical3"],
        "csr_iss": ["clinical1", "clinical2", "clinical3"],
        "bow_status_date": ["2004-01-01", "2004-01-02", "2004-02-01", "2004-03-01", "blank", "2005-01-01", "2005-02-01", "2005-03-01"]
    }
   
    function sendSelectedFilters(filteredMap, statusFlag) {

       
        if (statusFlag) {
            const filterInfoJSON = JSON.stringify(filteredMap)
            console.log(filterInfoJSON)
            //Shiny.setInputValue("filterInfo", filterInfoJSON);
        } else {
            console.log("filtermap", filteredMap)
            let myJson = {};

            myJson = mapToObj(filteredMap);

            const filterInfoJSON = JSON.stringify(myJson)
            console.log(filterInfoJSON)

            // Shiny.setInputValue("filterInfo", filterInfoJSON);
        }

    }


    function addFilters(message) {

        const { choices, selected } = message
        //const selected = selectedItem;
        bowJsonData = choices;
        console.log("bow refresh")
        console.log(selected);
        preSelected = selected;
        modifyDropDownData(choices)
    }

    modifyDropDownData(bowJsonData)


    function modifyDropDownData(data) {
        preSelected = {"bow_status": ["clinical1", "clinical2", "clinical3"]};

        $(".dynamic-dropdown").empty().append("<div id='e2e-dynamic-dropdown-wrapper'>")
        let index = 0;
        let yearList = [];
        for (const [bowJsonKey, value] of Object.entries(data)) {
            bowJsonValue = Array.from(new Set(value));

            if (bowJsonKey.includes("date")) {

                const formatValue = formatDateList(bowJsonValue);
                bowJsonValue = formatValue[0]
                yearList = Object.keys(bowJsonValue);
                // bowJsonValue = jsonData
            }

            let label = "";

            if (BOW_labels1.hasOwnProperty(bowJsonKey)) {
                label = BOW_labels1[bowJsonKey]
            } else {
                label = bowJsonKey;
            }
            preSelectedItem = [];
            if (preSelected[bowJsonKey]) {
                preSelectedItem = preSelected[bowJsonKey]
            }

            // console.log("label : ", label)
            createDefaultDropdown(bowJsonKey, bowJsonValue, index, yearList, label, preSelectedItem);
            index++;


        }

        $(".dynamic-dropdown").append("</div>")

        if (Object.keys(preSelected).length > 0) {
            sendSelectedFilters(preSelected, true)
        }
    }


    function createDefaultDropdown(bowJsonKey, bowJsonValue, bowJsonindex, yearList, fieldLabel) {

        $("#e2e-dynamic-dropdown-wrapper").append(`<div class="custom-accordion-wrapper float-left" id="e2e-dynamic-wrapper-${bowJsonindex}">

        <div class="btn-group w-100" id="e2e-btn-group-${bowJsonindex}">
          <button class="btn btn-lg dropdown-toggle dropdown-btn hover-dropdown" type="button" data-toggle="dropdown tooltip" aria-haspopup="true" aria-expanded="false" id="${bowJsonKey}-stop-toggle-e2e-${bowJsonindex}">
          ${fieldLabel}
          </button>
          <div class="dropdown-menu keep-open" id="e2e-dropdown-menu-${bowJsonindex}">`)


        // dynamic select box starts
        if (bowJsonKey.includes("date")) {

            $(`#e2e-dropdown-menu-${bowJsonindex}`).append(`<select name="" class="form-control search-box date-Search" id="e2e-date-search-${bowJsonindex}-${bowJsonKey}">`);

            // searchInput = $(`<select name="" class="form-control search-box date-Search" id="date-search-${bowJsonindex}">`);
            $(`#e2e-date-search-${bowJsonindex}-${bowJsonKey}`).append(`<option value="">Search the date</option>`);
            yearList.forEach((year, yearIndex) => {
                $(`#e2e-date-search-${bowJsonindex}-${bowJsonKey}`).append(`<option id="${year}-${yearIndex} value="${year}">${year}</option>`);
            })

            $(`#e2e-date-search-${bowJsonindex}`).append("</select>")
        } else {
            // searchInput = `<input type="text" name="" class="form-control dropdown-search" id="dropdown-search-${bowJsonindex}">`;
            $(`#e2e-dropdown-menu-${bowJsonindex}`).append(`<input type="text" name="" class="form-control dropdown-search" id="e2e-dropdown-search-${bowJsonindex}-${bowJsonKey}">`)
        }
        // dynamic select box ends

        $(`#e2e-dropdown-menu-${bowJsonindex}`).append(`
          <div class="select-wrapper">
            <button class="btn selectAll" id="e2e-dataDropdown-selectAll-${bowJsonindex}">Select All</button>
            <button class="btn unSelectAll" id="e2e-dataDropdown-unSelectAll-${bowJsonindex}">Unselect All</button>
          </div>

          <div  id="e2e-dropdown-data-${bowJsonindex}">`)

        //dynamic date/default value starts
        if (bowJsonKey.includes("date")) {

            bindDateAccordion(bowJsonindex,bowJsonKey,bowJsonValue)

        } else {
            bindDefaultAccordion(bowJsonindex, bowJsonKey, bowJsonValue)
        }

        //dynamic date/default value ends

        $(`#e2e-dropdown-menu-${bowJsonindex}`).append("</div>");
        $("#e2e-dynamic-dropdown-wrapper").append("</div></div></div>")
    }





    // bind date accordion
    function bindDateAccordion(bowJsonindex, bowJsonKey, bowJsonValue) {
        $(`#e2e-dropdown-data-${bowJsonindex}`).empty().append(`<div class='panel panel-default template' id="e2e-default-template-${bowJsonindex}">`);
        parentKey = 0;
        for (const [parent, parentValue] of Object.entries(bowJsonValue)) {
            $(`#e2e-default-template-${bowJsonindex}`).append(`<div class="panel-wrapper-${bowJsonindex}-parent-${parentKey}"><div class="panel-heading header-panel parent-heading" id="e2e-template-${bowJsonindex}"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion"
                    href="#e2e-${bowJsonindex}-${parentKey}-parent"><i class="fa fa-plus"></i><span> ${parent}</span></a><input type="checkbox" id="${bowJsonindex}-${parentKey}-check" class="selectAll-checkbox"></div><div id="e2e-${bowJsonindex}-${parentKey}-parent" class="panel-collapse collapse"> <div class="panel-body"><div class="panel-group " id="e2e-${bowJsonindex}-parent-${parentKey}-child">`);

            let childID = 0
            for (const [child, childValue] of Object.entries(parentValue)) {

                $(`#e2e-${bowJsonindex}-parent-${parentKey}-child`).append(`<div class="panel panel-default border-none"><div class="panel-heading header-panel child-heading" id="e2e-child-panel-${bowJsonindex}-parent-${parentKey}-child-${childID}"> <a class=" arrow collapsed" data-toggle="collapse"
                        data-target="#e2e-${bowJsonindex}-parent-${parentKey}-child-${childID}">
                        <i class="fa fa-plus"></i><span> ${child}</span></a><input type="checkbox" id="${bowJsonindex}-parent-${parentKey}-child-${childID}-check" class="child-month-checkbox">
                      </div><div id="e2e-${bowJsonindex}-parent-${parentKey}-child-${childID}" class="panel-collapse  collapse">`)

                childValue.forEach((grandChild, grandChildID) => {
                    $(`#e2e-${bowJsonindex}-parent-${parentKey}-child-${childID}`).append(`<div class="panel-body task" id='${bowJsonKey}-${bowJsonindex}-parent-${parentKey}-child-${childID}-grandChild-${grandChildID}'>${grandChild}</div>`)

                    if (preSelectedItem.includes(grandChild)) {
                        $(`#${bowJsonKey}-${bowJsonindex}-parent-${parentKey}-child-${childID}-grandChild-${grandChildID}`).addClass("tickItem")
                    }
                })
                $(`#e2e-${bowJsonindex}-parent-${parentKey}-child`).append("</div>")

                childID++;
            }
            $(`#e2e-default-template-${bowJsonindex}`).append("</div></div></div></div>")
            parentKey++;
        }

        $(`#e2e-dropdown-data-${bowJsonindex}`).append("</div>")
    }

    // bind default accordion
    function bindDefaultAccordion(bowJsonindex, bowJsonKey, bowJsonValue){
        $(`#e2e-dropdown-data-${bowJsonindex}`).empty().append(`<ul class="dropdown-data-wrapper" id="e2e-data-wrapper-${bowJsonindex}">`)

        bowJsonValue.forEach((ele, index) => {
            $(`#e2e-data-wrapper-${bowJsonindex}`).append(`<li class="task" id="${bowJsonKey}-${bowJsonindex}-${index}">${ele}</li>`)

            if (preSelectedItem.includes(ele)) {
                console.log("ele :", ele)
                $(`#${bowJsonKey}-${bowJsonindex}-${index}`).addClass("tickItem")
            }
        })
        $(`#e2e-dropdown-data-${bowJsonindex}`).append(`</ul></div>`)
    }

    //dynamically select individual item
    $("body").on("click", ".task", function (event) {

        const { id } = event.target;
        const val = $(this).text();
        const selectedKey = id.split("-")[0];

        if (!$("#" + id).hasClass("tickItem")) {
            $(this).addClass("tickItem");
            if (!selectedItem.includes(val)) {
                selectedItem.push(val)

                if (selectedValMap.has(selectedKey)) {
                    console.log("map", selectedValMap)
                    let mapData = selectedValMap.get(selectedKey);
                    mapData.push(val);
                    selectedValMap.set(selectedKey, mapData)
                } else {
                    let newMapData = [];
                    newMapData.push(val);
                    console.log("new mapdata", newMapData);
                    selectedValMap.set(selectedKey, newMapData)
                    console.log("newMap", selectedValMap);
                }

                sendSelectedFilters(selectedValMap, false);
            }
        } else {
            $(this).removeClass("tickItem");
            if (selectedItem.includes(val)) {
                selectedItem.splice(val, 1);

                if (selectedValMap.has(selectedKey)) {
                    let mapData = selectedValMap.get(selectedKey);
                    if (mapData.includes(val)) {
                        mapData.splice(val, 1);
                        selectedValMap.set(selectedKey, mapData)
                    }

                }
            }
            //todo check with test cases
            sendSelectedFilters(selectedValMap, false);
        }
    });



    //select All
    $("body").on("click", ".selectAll", function () {
        const rowId = this.id.split("-").pop();

        $(`#e2e-dropdown-data-${rowId}`).find(".task").each(function () {
            $(this).addClass("tickItem");
            const selectedKey = this.id.split("-")[0];
            val = $(this).text();
            if (!selectedItem.includes(val)) {
                selectedItem.push(val)
                updateSelectedItem(selectedKey, val)
            }
        })
        $(`#e2e-dropdown-data-${rowId}`).find(".selectAll-checkbox").each(function () {
            $(this).prop("checked", true);
        })
        $(`#e2e-dropdown-data-${rowId}`).find(".child-month-checkbox").each(function () {
            $(this).prop("checked", true);
        })
    })

    //Unselect All
    $("body").on("click", ".unSelectAll", function () {
        const rowId = this.id.split("-").pop();
        $(`#e2e-dropdown-data-${rowId}`).find(".task").each(function () {
            $(this).removeClass("tickItem");
            val = $(this).text();
            const selectedKey = this.id.split("-")[0];
            if (selectedItem.includes(val)) {
                selectedItem.splice(val, 1)
            }
            removeSelectedItem(selectedKey, val)
        })
        $(`#e2e-dropdown-data-${rowId}`).find(".selectAll-checkbox").each(function () {
            $(this).prop("checked", false);
        })
        $(`#e2e-dropdown-data-${rowId}`).find(".child-month-checkbox").each(function () {
            $(this).prop("checked", false);
        })
    })

    //checkbox select item
    $("body").on("change", ".selectAll-checkbox", function (event) {
        const { checked, id } = event.target;
        const currentID = id.split("check")[0];

        // $(`#${currentID}-parent`).find(".child-month-checkbox").each(function () {
        //     console.log(this);
        //     $(this).prop("checked", false);
        // })

        if (checked) {
            checkAllValue("e2e-"+currentID + "parent");
        } else {
            unCheckAllValue("e2e-"+currentID + "parent");
        }
      
    });

    //checkbox select month
    $("body").on("change", ".child-month-checkbox", function (event) {
        const { checked, id } = event.target;

        const currentID = id.split("-check")[0];

        if (checked) {
            checkAllValue("e2e-"+currentID);

        } else {
            unCheckAllValue("e2e-"+currentID);

        }
    });

    //remove selected item
    function checkAllValue(currentID) {
        $(`#${currentID}`).find(".task").each(function () {
            $(this).addClass("tickItem");
            const val = $(this).text();
            const selectedKey = this.id.split("-")[0];
            if (!selectedItem.includes(val)) {
                selectedItem.push(val);
                updateSelectedItem(selectedKey, val)
            }
        })
    }
    // add selected item 
    function unCheckAllValue(currentID) {
        $(`#${currentID}`).find(".task").each(function () {
            const selectedKey = this.id.split("-")[0];
            $(this).removeClass("tickItem");
            const val = $(this).text();
            if (selectedItem.includes(val)) {
                selectedItem.splice(val, 1);
                removeSelectedItem(selectedKey, val);
            }
        })
    }

    // Add filtered item
    function updateSelectedItem(key, val) {
        if (selectedValMap.has(key)) {
            console.log("map", selectedValMap)
            let mapData = selectedValMap.get(key);
            mapData.push(val);
            selectedValMap.set(key, mapData)
        } else {
            let newMapData = [];
            newMapData.push(val);
            console.log("new mapdata", newMapData);
            selectedValMap.set(key, newMapData)
            console.log("newMap", selectedValMap);
        }

        sendSelectedFilters(selectedValMap, false);
    }

    // Remove filtered item
    function removeSelectedItem(key, val) {
        if (selectedValMap.has(key)) {
            let mapData = selectedValMap.get(key);
            if (mapData.includes(val)) {
                mapData.splice(val, 1);
                selectedValMap.set(key, mapData)
            }

        }

        sendSelectedFilters(selectedValMap, false);
    }



    //Filter date
    $(".date-search").on('input' , function () {
          let currentIdList = this.id.split("-");
          currentIdList.splice(0,2);

        if ($(this).val() === "") {
            const formatDate = formatDateList(bowJsonData[currentIdList[1]]);
            bindDateAccordion(currentIdList[0],currentIdList[1], formatDate[0]);
        } else {
            const val = parseInt($(this).val());
            const formatDate = formatDateList(bowJsonData[currentIdList[1]]);
            const filteredDate = {[val] : formatDate[0][val]};
            bindDateAccordion(currentIdList[0],currentIdList[1], filteredDate);
            
        }
    })

    //Filter item
  $(".dropdown-search").on('input' , function () {

        let currentIdList = this.id.split("-");
        currentIdList.splice(0,2);
    
        const val = $(this).val()

        if (val === "") {
            bindDefaultAccordion(currentIdList[0], currentIdList[1], bowJsonData[currentIdList[1]]);
        } else {
            const updatedData = bowJsonData[currentIdList[1]].filter(ele => ele.includes(val));
            bindDefaultAccordion(currentIdList[0], currentIdList[1], updatedData);
        }
    })

    //show tooltip on hover
    $(document).on("mouseover", ".hover-dropdown", function (event) {

        let currentKey = this.id.split("-")[0];
        let showItem = []
        if (selectedValMap.has(currentKey) && selectedValMap.get(currentKey).length > 0) {
            showItem = selectedValMap.get(currentKey);
            $(this).attr("title", showItem.join(", "))
        }
        else {
            showItem = [];
            $(this).removeAttr("title");
        }
    });


    //dynamically selected item in data dropdown
    $("body").on("click", ".dataDropdown-task", function (event) {

        const { id } = event.target;
        if (!$(this).hasClass("tickItem")) {
            $(this).addClass("tickItem");
        } else {
            $(this).removeClass("tickItem");
        }
    });



    $(".panel-collapse.in").each(function () {
        $(this).prev(".panel-heading").find(".fa").addClass("fa-minus").removeClass("fa-plus");
    });
    $(".collapse").on('show.bs.collapse', function () {
        $(this).prev(".panel-heading").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function (event) {
        console.log(this.id);
        if (this.id.includes("child")) {
            $(this).prev(".panel-heading.child-heading").find(".fa").removeClass("fa-minus").addClass("fa-plus");
        } else {
            $(this).prev(".panel-heading.parent-heading").find(".fa").removeClass("fa-minus").addClass("fa-plus");
        }
        event.stopPropagation();
    });





    function getMonthName(month) {
        if (month === "01") {
            monthName = "Jan"
        } else if (month === "02") {
            monthName = "Feb"
        } else if (month === "03") {
            monthName = "Mar"
        } else if (month === "04") {
            monthName = "Apr"
        } else if (month === "05") {
            monthName = "May"
        } else if (month === "06") {
            monthName = "Jun"
        } else if (month === "07") {
            monthName = "Jul"
        } else if (month === "08") {
            monthName = "Aug"
        } else if (month === "09") {
            monthName = "Sep"
        } else if (month === "10") {
            monthName = "Oct"
        } else if (month === "11") {
            monthName = "Nov"
        } else {
            monthName = "Dec"
        }

        return monthName
    }

    function formatDateList(dates) {
        let dateList = {}
        if (dates.length) {
            const newDates = dates.forEach(date => {
                if (date !== "blank") {
                    const splitDate = date.split('-')
                    const day = splitDate[2]
                    const month = splitDate[1]
                    const monthName = getMonthName(month)
                    const year = splitDate[0]

                    if (dateList[year] && dateList[year][monthName]) {
                        const dateYearMonth = dateList[year][monthName];
                        dateYearMonth.push(date);
                        dateList[year][monthName] = dateYearMonth;
                    } else if (dateList[year]) {
                        const dateObject = {
                            [monthName]: [date]
                        }
                        dateList[year][monthName] = [date]
                        //dateList = {...dateList,[year]:dateObject}
                    } else {
                        //   const dateObject = {
                        //     [monthName] : [date]
                        //   }
                        let dateObject = {
                            [monthName]: [date]
                        }
                        dateList[year] = dateObject;
                        //   dateList = {...dateList,[year]:dateObject}
                    }
                }
            })
        }


        return [dateList, dates.includes("blank")]
    }

    // dropdown data filter
    $("#e2e-filter-dropDown").keyup(function () {
        const val = $(this).val()
        var myKeys = Object.keys(bowJsonData);
        var matchingKeys = myKeys.filter(function (key) { return key.includes(val) });

        if (val === "") {
            modifyDropDownData(bowJsonData)
        } else {
            let filterObj = {};

            matchingKeys.forEach(key => {
                filterObj[key] = bowJsonData[key];
            })

            modifyDropDownData(filterObj)
        }


    });

    // convert map to object
    function mapToObj(map) {
        const obj = {}
        for (let [k, v] of map) {
            if (v && v.length > 0) {
                obj[k] = v
            }
        }

        return obj
    }


    // stop dropdown defualt collapse
    $("body").on('click', '.dropdown-toggle', function (e) {
        const currentID = this.id.split("-").pop();
        //  $(this).next().toggle();

        $(`#e2e-btn-group-${currentID}`).toggleClass("is-active open");

        $(".custom-accordion-wrapper").find(".btn-group").each(function () {
            const innerId = this.id.split("-").pop();

            if (currentID !== innerId) {
                $(this).removeClass("is-active open");
            }
        })
    });

    const $menu = $('.btn-group');

    $(document).mouseup(e => {
        if (!$menu.is(e.target) 
            && $menu.has(e.target).length === 0)
        {
            $menu.removeClass('is-active open');
        }
    });

    // reset all the checked items
    $("#e2e-restAll").click(function(){
        $(".custom-accordion-wrapper").find(".task").removeClass("tickItem");
        sendSelectedFilters({},true)
    });
});
