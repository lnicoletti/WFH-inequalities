// d3 = require('d3', "d3-hexjson")
// const vizTheme = "theEconomist"
const vizTheme = "theNytimes"
// const vizTheme = "original"
        // color settings
const colorSchemes = new Map([{scheme:"original", colors:["#e8e8e8", "#e4d9ac", "#c8b35a", "#cbb8d7", "#c8ada0", "#af8e53", "#9972af", "#976b82", "#804d36"]}, 
                        {scheme:"theEconomist", colors:["#d3d3d3", "#a3a3a3", "#747474", "#db9381", "#a97264", "#795147", "#e83000", "#b32500", "#801b00"]}, 
                        {scheme:"theNytimes", colors:["#e6e6e6", "#99c5a2", "#47a45b", "#ddb08e", "#939765", "#457e38", "#d5742f", "#8d6421", "#425312"]}].map(obj => [obj.scheme, obj.colors]))


// if (vizTheme=== "theNytimes"||vizTheme=== "theEconomist") {
//     d3.select("body").style("background-color", "white")
//     d3.select("#chartView").style("background-color", "white")
//     d3.select("#chartCountry").style("background-color", "white")
// }

Promise.all([
    d3.json("https://raw.githubusercontent.com/odileeds/hexmaps/gh-pages/maps/uk-local-authority-districts-2021.hexjson"),
    d3.json("https://gist.githubusercontent.com/lnicoletti/2e08ca8357c8d4e4cf9bf869d890ab99/raw/a8135c1175715c9d8715be58de2ce8752fe236a4/ukUpd_tot_final_reduced.json"),
    d3.json("https://gist.githubusercontent.com/lnicoletti/8025f10314c9004f5c0d9e392bbf5b17/raw/f5fa0d5c86d1b8d41f9ed6624d6b23b0b1b2ec37/ukUpdGroupMonth"),
    
    // uk urb rural
    //// old data
    // d3.csv("https://gist.githubusercontent.com/lnicoletti/6800cd1df1205c0260f685fd83399cef/raw/e3a7d34515f4f96a8d5b4794d6cdc878f3f7b1f8/ukUrbRural_simple.csv", d3.autoType),
    d3.csv("https://gist.githubusercontent.com/lnicoletti/9b5df10403fd89cc6af0ee8cd26b7925/raw/cacd508ed040a1d190401e9b16247b970181aac1/ukUrbRural_2class.csv", d3.autoType),
    // d3.csv("https://gist.githubusercontent.com/lnicoletti/7baf3e11996edb30a5fb590d3f76f7ef/raw/11a7c8f3ff3525e565776f9406facc2f793bede4/ukUrbRural.csv", d3.autoType),
    
    //// d3.csv("https://gist.githubusercontent.com/lnicoletti/97a897e8d32fa77e1bbfd4b53f2973bf/raw/686be1c93395524e5fae49adf4ba33046979f6c2/urbanRuralUkthreeFold.csv", d3.autoType),
    
    // scot urb rural
    //// old data
    // d3.csv("https://gist.githubusercontent.com/lnicoletti/5646b53ec08fd460afec2c92a083de13/raw/49410a19ab75ed3dcbb4106b4c5002477dc4517a/urbanRuralScotland_simple.csv", d3.autoType),
    d3.csv("https://gist.githubusercontent.com/lnicoletti/1117ef6f526534506e96f981758a5602/raw/e0611a8a1ce43b9debb8c04465d8a67a054e6b2c/urbanRuralScotland_2class.csv", d3.autoType),
    // d3.csv("https://gist.githubusercontent.com/lnicoletti/6e16123616cf30fb88bf3b217d98f398/raw/314fea2e2a9fd778543a8dcf195bc0f845c57730/urbanRuralScotland.csv", d3.autoType),

    // old data with naming problem
    // d3.json("https://gist.githubusercontent.com/lnicoletti/4f576610004076d7b8f0e7b7ec0d08c5/raw/67ed1b2e38d5678808ad9ad4ce3e9309a83deb6d/usUpd_tot.json", d3.autoType),
    // new data with correct naming
    d3.json("https://gist.githubusercontent.com/lnicoletti/abbd577e047a3f501430869a2b6833ca/raw/2de81f38eaf396c5c2d1d75901660c9f86b10e64/usUpd_tot_fixed_reduced.json", d3.autoType),
    // old hexes
    // d3.csv("https://gist.githubusercontent.com/lnicoletti/62ee1b2144ad7dbcd6a66eddbc1b0544/raw/6cd8ed474e719767f40e7de88e02b6815b1e0d03/usCountiesHex.csv", d3.autoType),
    // new hexes
    // d3.csv("https://gist.githubusercontent.com/lnicoletti/866f91b3aa45e5d26412bc57c199b333/raw/4597f9f3c161849af6d2c4d64b766b23087e286f/usCountiesHex_tilemaps.csv", d3.autoType),
    // square:
    d3.csv("https://gist.githubusercontent.com/lnicoletti/a01622da3e106830fe1c51ab96403234/raw/2b0d35c4efff50a65beb29759ae1a55eb99f73ac/usCountiesHex_tilemaps_albers.csv"),
    // US time data, need to reduce
    // d3.json("https://gist.githubusercontent.com/lnicoletti/77843584cf6a2d6eb544e7b23eab2910/raw/a0074d2e6005f8f3eed2e2fd5fe616f8e92c18cb/uSUpdGroupMonth.json", d3.autoType)

    ]).then((datasets) => {

    let hex_la = datasets[0]
    let ukUpd_tot = datasets[1]
    let ukUpd_time = datasets[2]
    let engUrbRural = datasets[3]
    let scotUrbRural = datasets[4]
    let uSuPd_tot = datasets[5]
    let hex_us = datasets[6]

    let ukUrbRural = d3.merge([engUrbRural, scotUrbRural])
    // let ukUrbRural = engUrbRural

    // console.log(ukUrbRural)
    renderChartUk(hex_la, ukUpd_tot, ukUpd_time, ukUrbRural, vizTheme)

    d3.select("#chartCountry").on("change", function(select){
        // d3.selectAll(".AxisLAN").remove()
        // d3.selectAll(".laCircle").remove()
        d3.select("#chart").selectAll("svg").remove()
        var country = d3.select("#chartCountry").node().value
            console.log(country)

        if (country==="UK") {
            renderChartUk(hex_la, ukUpd_tot, ukUpd_time, ukUrbRural, vizTheme)

        } else if (country==="USA") {
            renderChartUs(hex_us, uSuPd_tot, vizTheme)
        }
    })
    // console.log(hex_us)
    // renderChartUs(hex_us, uSuPd_tot)
    // renderLegend()
    })


    new TypeIt("#FigTitle", {
        speed: 150,
        strings: [
          `A <span class="rich${vizTheme}">Rich</span> vs. <span class="poor${vizTheme}">Poor</span> issue`,
          `An <span class="rich${vizTheme}">urban</span> vs. <span class="poor${vizTheme}">rural</span> issue`,
        ],
        breakLines: false,
        loop: true,
        pause: 1000,
      }).go();

    function renderChartUk(hex_la, ukUpd_tot, ukUpd_time, ukUrbRural, vizTheme) {

        const margin = ({ top: 20, right: 20, bottom: 20, left: 57.5})

        const marginTop = 5
        const marginBottom = 40
        const marginLeft = 100
        // const figScale = 2.1
        // const figWidth = width
        // const figHeight = height*figScale
        const figWidth = 850
        const scatterWidth = figWidth-100
        const figHeight = 600
        const radius = 10//9.8
        const radiusHover = radius*2
        const boundWidth = 4
        const fontSize = 6.5
        const yVar = "mobilityWork"
        // const xVar = "mobilityRes"
        const xVar = "income"
        const xVarLabel = "Median Household Income"
        // const xVarLabel = "Average Change in Work From Home Households Since Feb. 2020"
        const yVarLabel = "Average Change in People Going to Workplaces Since Feb. 2020 (%)"
        // const grid = d3.select(DOM.svg(figWidth, figHeight+marginTop+marginBottom));
        const grid = d3.select("#chart")
                        .append("svg")
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        // .attr("viewBox", `0 0 ${figWidth} ${figHeight+marginTop+marginBottom}`)
                        // .classed("svg-content", true);
                        // .attr("preserveAspectRatio", "xMidYMid meet")
                        // .attr("viewBox", "0 0 "+ (figWidth+margin.left+margin.right) +"," + (figHeight+marginTop+marginBottom)+"")
                        .attr("width", figWidth)
                        .attr("height", figHeight+marginTop+marginBottom)
      
        const svg = grid
          .append("g")
        //   .attr("preserveAspectRatio", "xMinYMin meet")
        //   .attr("viewBox", [0, 0, figWidth, figHeight])
          // .style("overflow", "visible")
          .attr('transform', `translate(${0}, ${marginTop})`)
        
      
        // color settings
        colors = colorSchemes.get(vizTheme)
        // colors = ["#e8e8e8", "#e4d9ac", "#c8b35a", "#cbb8d7", "#c8ada0", "#af8e53", "#9972af", "#976b82", "#804d36"]
        // const categoriesX = ["#9972af", "#c8b35a", "#c8ada0", "#976b82", "#af8e53", "#cbb8d7", "#e4d9ac", "#e8e8e8", "#804d36"] 
        const categoriesX = [colors[6], colors[2], colors[4], colors[7], colors[5], colors[3], colors[1], colors[0], colors[8]] 
        const categoryLabels = ["Low Income, High Travel", "High Income, Low Travel", "Mid. Income, Mid. Travel", "Mid. Income, High Travel", 
                                "High Income, Mid. Travel", "Low Income, Mid. Travel", "Mid. Income, Low Travel", "Low Income, Low Travel", "High Income, High Travel"]  

        // var sortOrder = [categoriesX[1], categoriesX[6], categoriesX[4], categoriesX[2], categoriesX[7], categoriesX[5], categoriesX[0], categoriesX[3], categoriesX[8]] 
        var sortOrder = [categoriesX[1], categoriesX[0], categoriesX[4], categoriesX[2], categoriesX[7], categoriesX[5], categoriesX[6], categoriesX[3], categoriesX[8]] 

        // bivar settings
        let dataBivar = Object.assign(new Map(ukUpd_tot.map(d=>[d.area_code, [d["workplaces_percent_change_from_baseline"], d["Total annual income (??)"]]])), {title: ["Travel to Work", "Med. Income"]})
        n = Math.floor(Math.sqrt(colors.length))
        yBivar = d3.scaleQuantile(Array.from(dataBivar.values(), d => d[1]), d3.range(n))
        xBivar = d3.scaleQuantile(Array.from(dataBivar.values(), d => d[0]), d3.range(n))
        labels = ["low", "medium", "high"]
        colorBivar = function(value) {
              if (!value) return "lightgrey";
              let [a, b] = value;
              return colors[yBivar(b) + xBivar(a) * n];
          }
        
        legendIndex = () => {
            const k = 63/n;
            // const arrow = 1;
            //font-family=sans-serif
            // <g transform="translate(-${k * n / 2},-${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})">
            return svgDraw`<g class="legend">
            
              <marker id="arrow" markerHeight=10 markerWidth=10 refX=3 refY=3 orient=auto>
                <path d="M0,0L6,3L0,6Z" />
              </marker>
              ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svgDraw`<circle r=${radius} cx=${(i * k)+k/2} cy=${((n - 1 - j) * k)+k/2} fill=${colors[j * n + i]} class="legendCircle" value=${colors[j * n + i]}>
                <title>${dataBivar.title[0]}${labels[j] && ` (${labels[j]})`}
          ${dataBivar.title[1]}${labels[i] && ` (${labels[i]})`}</title>
              </circle>`)}
              <line marker-end="url(#arrow)" x1=0 x2=${n * k} y1=${n * k} y2=${n * k} stroke=black stroke-width=1.5 />
              <line marker-end="url(#arrow)" y2=0 y1=${n * k} stroke=black stroke-width=1.5 />
              <text font-weight="bold" dy="0.71em" transform="rotate(90) translate(${n / 2 * k},6)" text-anchor="middle">${dataBivar.title[0]}</text>
              <text font-weight="bold" dy="0.71em" transform="translate(${n / 2 * k},${n * k + 6})" text-anchor="middle">${dataBivar.title[1]}</text>
            </g>
          </g>`;
          }

          
          // Render the hexes
          var hexes = d3.renderHexJSON(hex_la, figWidth, figHeight).map(d=> ({ ...d, 
          income: 
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined)||
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === null)||
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === undefined)?null:
                ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"],
          mobilityWork: 
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined)||
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0]["workplaces_percent_change_from_baseline"] === null)||
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0]["workplaces_percent_change_from_baseline"] === undefined)?null:
                ukUpd_tot.filter(c=>c.area_code===d.key)[0]["workplaces_percent_change_from_baseline"],
                                                  
          mobilityRes: 
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined)||
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0]["residential_percent_change_from_baseline"] === null)||
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0]["residential_percent_change_from_baseline"] === undefined)?null:
                ukUpd_tot.filter(c=>c.area_code===d.key)[0]["residential_percent_change_from_baseline"],
          
          category: ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
          ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === null? "#ccc":
          ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === undefined ? "#ccc":        
          colorBivar([ukUpd_tot.filter(c=>c.area_code===d.key)[0]["workplaces_percent_change_from_baseline"],ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"]]),

          urbCategory: ukUrbRural.filter(c=>c.LAD11CD===d.key)[0] === undefined ? null: 
          ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"] === null? null:
          ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"] === undefined ? null:        
          ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"],
          
        //   urbCategory: ukUrbRural.filter(c=>c.LAD11CD===d.key)[0] === undefined ? "No Data": 
        //   ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"] === null? "No Data":
        //   ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"] === undefined ? "No Data":        
        //   ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"],

        //   urbCategory: ukUrbRural.filter(c=>c["LAD11CD"]===d.key)[0] === undefined ? null: 
        //   ukUrbRural.filter(c=>c["LAD11CD"]===d.key)[0]["Rural Urban Classification 2011 (6 fold)"] === null? null:
        //   ukUrbRural.filter(c=>c["LAD11CD"]===d.key)[0]["Rural Urban Classification 2011 (6 fold)"] === undefined ? null:        
        //   ukUrbRural.filter(c=>c["LAD11CD"]===d.key)[0]["Rural Urban Classification 2011 (6 fold)"],
                                                                            
        }))//.filter(d=>d.urbCategory!==null)//.sort((a, b)=>a.category-b.category).map((d, i) =>({ ...d, row: i}))
        
        console.log("urb",ukUrbRural)
        console.log("hex", hexes)
        
        //   variables for dot clusters bars
          const clusterData = d3.groups(hexes, v=>v.category).map(d=> { return {category: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}}).filter(d=>d.category!=="#ccc")

          console.log(clusterData)
        //   const categoriesX = ["#9972af", "#c8b35a", "#c8ada0", "#976b82", "#af8e53", "#cbb8d7", "#e4d9ac", "#e8e8e8", "#804d36"] 
        //   const categoryLabels = ["Low Income, High Travel", "High Income, Low Travel", "Mid. Income, Mid. Travel", "Mid. Income, High Travel", 
        //                             "High Income, Mid. Travel", "Low Income, Mid. Travel", "Mid. Income, Low Travel", "Low Income, Low Travel", "High Income, High Travel"]  

        // //   var sortOrder = ["#c8b35a", "#e4d9ac", "#af8e53", "#c8ada0", "#e8e8e8", "#cbb8d7", "#9972af", "#976b82", "#804d36"]  
        //   var sortOrder = [categoriesX[1], categoriesX[6], categoriesX[4], categoriesX[2], categoriesX[7], categoriesX[5], categoriesX[0], categoriesX[3], categoriesX[8]]       
          const scaleXCategory = d3.scaleBand().domain(categoriesX).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);  
          const scaleXCategoryLabels = d3.scaleBand().domain(categoryLabels).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);     
          const scaleY = d3.scaleLinear().domain([0, 85]).range([figHeight- margin.bottom, 0]); 

          //   variables for dot clusters bars urban rural
          const ruralData = d3.groups(
              ukUrbRural
              .map(d=>({...d, category: hexes.filter(c=>c.key===d.LAD11CD)[0]!==undefined?
                                        hexes.filter(c=>c.key===d.LAD11CD)[0].category:null
                                                }))
                .filter(d=>d.category!=="#ccc")
                .filter(d=>hexes.map(d=>d.key).filter(onlyUnique).includes(d.LAD11CD)), v=>v.RUC11)
                .map(d=> { 
                  return {urbCategory: d[0], data: d[1].sort(function(a, b) {
                    return sortOrder.indexOf(a.category) - sortOrder.indexOf(b.category);
                  })//.sort((a,b)=> d3.descending(a.category,b.category))
                    .map((c, i) =>({ ...c, row: i}))
                    }
                })
                // .map(d=>({...d, data: d.data.sort((a,b)=> d3.descending(a.category,b.category))}))

          console.log(ruralData)
        //   console.log("ruralRaw", ukUrbRural)
          const urbCategoriesX = ruralData.sort((a,b)=>b.data.length-a.data.length).map(d=>d.urbCategory)
                                                      
          const scaleXurbCategory = d3.scaleBand().domain(urbCategoriesX).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);  
        // more categories of urban
        //   const scaleYurb = d3.scaleLinear().domain([0, 115]).range([figHeight- margin.bottom, 0]); 
        // less categories of urban
        const scaleYurb = d3.scaleLinear().domain([0, 285]).range([figHeight-margin.bottom, 0]); 


        grid.append(legendIndex)
            .attr("transform", `translate(${figWidth*0.91},${figHeight*0.85})`);

        // legend interaction
        d3.selectAll(".legendCircle")
        .on("mouseover", function(event, d) { 
          const selectedCat = this.attributes.value.value
          d3.select(this).attr("cursor", "pointer").attr("stroke-width", "1.5")
          d3.select(this.parentNode).raise()
          d3.selectAll(".laCircle").filter(d=>d.category!==selectedCat).attr("opacity", 0.2)
          console.log(selectedCat)
        })
        .on("mouseout", function(event, d) { 
          const selectedCat = this.attributes.value.value
          d3.select(this).attr("stroke-width", "0.5").moveToBack()
          d3.selectAll(".laCircle").attr("opacity", 1) //.filter(d=>d.urbCategory!==null&&d.category!=="#ccc")
          console.log(selectedCat)
        })



        // axes
        const xScaleInc = d3.scaleLinear()
                        .domain(d3.extent(hexes, d => d[xVar])).nice()
                        .range([margin.left, scatterWidth - margin.right])
      
        const yScaleMob = d3.scaleLinear()
                        .domain(d3.extent(hexes, d => d[yVar])).nice()
                        .range([figHeight - margin.bottom, margin.top])
      
      
        const xAxis = g => g
          .attr("transform", `translate(0,${figHeight - margin.bottom})`)
          .call(d3.axisBottom(xScaleInc))
          .call(g => g.select(".domain").remove())
          .call(g => g.append("text")
              .attr("x", scatterWidth)
            //   .attr("x", scatterWidth - margin.right)
              .attr("y", 30)
              .attr("fill", "#000")
              .attr("font-weight", "bold")
              .attr("text-anchor", "end")
              .attr("class", "legend")
              .text(xVarLabel))
      
      
        const yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(yScaleMob))
          .call(g => g.select(".domain").remove())
          .call(g => g.select(".tick:last-of-type text").clone()
              .attr("x", 4)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .attr("class", "legend")
              .text(yVarLabel))

        
        const xAxisBars = g => g
        .attr("transform", `translate(0,${figHeight - margin.bottom})`)
        .call(d3.axisBottom(scaleXCategoryLabels))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", scatterWidth)
        //   .attr("x", scatterWidth - margin.right)
            .attr("y", 30)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("class", "legend")
            .text(""))


        const xAxisBarsUrb = g => g
        .attr("transform", `translate(0,${figHeight - margin.bottom})`)
        .call(d3.axisBottom(scaleXurbCategory))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", scatterWidth)
        //   .attr("x", scatterWidth - margin.right)
            .attr("y", 30)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("class", "legend")
            .text(""))
        
          // Bind the hexes to g elements of the svg and position them
          var hexmap = svg
              .selectAll("g")
              .data(hexes)
              .join("g")
              // .attr("transform", function(hex) {
              // 	return "translate(" + hex.x + "," + hex.y + ")";
              // });
      
        
      
          // Draw the polygons around each hex's centre
          const circles = hexmap
              .append("circle")
              .attr("cx", function(hex) {return hex.x;})
          .attr("cy", function(hex) {return hex.y;})
          .attr("r", radius)
              .attr("stroke", "#fffae7")
              .attr("stroke-width", "0.5")
      
          .attr("fill", d => ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === null? "#ccc":
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === undefined ? "#ccc":        
                            colorBivar([d.mobilityWork, d.income]))
          .attr("class", "laCircle")
          .attr("cursor", "pointer")
          .on("mouseover", function(event, d) { 
                                        //   d3.select(this)
                                        //     .attr("stroke-width", "1.5")
                                        //     .attr("r", radius*2)
                                        //     // .moveToFront()
                                        d3.select(this.parentNode).raise()
                                        //     // .attr("z-index", 1000)

                                        // console.log(d3.select(this.parentNode))
                                        //     .attr("font-size", fontSize*1.5)
                                        //     .attr("font-weight", 900)

                                        circles.filter(c=>c.key===d.key)
                                            .attr("stroke-width", "1.5")
                                            .attr("r", radiusHover)
                                        
                                        annot.filter(c=>c.key===d.key)
                                        .attr("font-size", fontSize*2)
                                        .style("text-transform", "uppercase")
                                        .attr("font-weight", 700)
                                            // .raise()
                                        showTooltip(d, ukUpd_time.filter(c=>c.area_code===d.key)[0], categoryLabels, categoriesX, "UK")
                                        // console.log(ukUpd_time.filter(c=>c.area_code===d.key)[0])
                                        console.log(d)
                                        // console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(c=>c.LAD11CD===d.key)[0])
          })
          .on("mouseleave", function(event, d) { 
                                          d3.select(this)
                                            .attr("stroke-width", "0.5")
                                            .attr("r", radius)
                                            .moveToBack()

                                        annot.filter(c=>c.key===d.key)
                                        .attr("font-size", fontSize)
                                        .style("text-transform", "capitalize")
                                        .attr("font-weight", 500)
                                        hideTooltip()
                                            // .lower()
          })
      
          // Add the hex codes as labels
          const annot = hexmap
              .append("text")
          .attr("x", function(hex) {return hex.x;})
          .attr("y", function(hex) {return hex.y+1;})
              // .append("tspan")
              .attr("text-anchor", "middle")
          .attr('class', 'LStextUK')
          .attr('font-size', fontSize)
          // .attr('font-size', 3*figScale)
          .attr('fill', 'rgb(255,255,255)')
          .attr("z-index", 10)
          .text(function(hex) {return hex.n.slice(0,3);})
          .attr("cursor", "pointer")
          .on("mouseover", function(event, d) { 
            //   d3.select(this)
            //     .attr("stroke-width", "1.5")
            //     .attr("r", radius*2)
            //     // .moveToFront()
            d3.select(this.parentNode).raise()
            //     // .attr("z-index", 1000)

            // console.log(d3.select(this.parentNode))
            //     .attr("font-size", fontSize*1.5)
            //     .attr("font-weight", 900)

            circles.filter(c=>c.key===d.key)
                .attr("stroke-width", "1.5")
                .attr("r", radiusHover)
            
            annot.filter(c=>c.key===d.key)
            .attr("font-size", fontSize*2)
            .style("text-transform", "uppercase")
            .attr("font-weight", 700)
            showTooltip(d, ukUpd_time.filter(c=>c.area_code===d.key)[0], categoryLabels, categoriesX, "UK")
                // .raise()
            })
            .on("mouseleave", function(event, d) { 
                    circles.filter(c=>c.key===d.key)
                            .attr("stroke-width", "0.5")
                            .attr("r", radius)
                            .moveToBack()

                        annot.filter(c=>c.key===d.key)
                        .attr("font-size", fontSize)
                        .style("text-transform", "capitalize")
                        .attr("font-weight", 500)
                            // .lower()
            })

      
      
        d3.select("#chartView").on("change", function(select){
          var view = d3.select("#chartView").node().value
          console.log(view)
      
          if (view==="chart") {

            svg.selectAll(".AxisLAN").remove()
            d3.selectAll(".annotation-group").remove()

            circles.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
            .attr("cx", 200)
            .attr("cy", 1000)
            .attr("opacity", 0)

            annot.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
            .attr("x", 200)
            .attr("y", 1000)
            .attr("opacity", 0)
      
            circles.filter(d=>d.category!=="#ccc")
              .transition()
              .duration(750)
              .ease(d3.easeLinear)
      
              .attr("cx", d => xScaleInc(d[xVar]))
              .attr("cy", d=> yScaleMob(d[yVar]))
              .attr("opacity", d=>d.income!==null?1:0)
              .attr("fill", d => ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === null? "#ccc":
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === undefined ? "#ccc":        
                            colorBivar([d.mobilityWork, d.income]))

      
            annot.filter(d=>d.category!=="#ccc")
               .transition()
              .duration(750)
              .ease(d3.easeLinear)
      
              .attr("x", d => xScaleInc(d[xVar]))
              .attr("y", d=> yScaleMob(d[yVar]))
              .attr("opacity", d=>d.income!==null?1:0)
              


              svg.append("g")
              .call(xAxis)
              .attr("class", "AxisLAN").attr("opacity", 0)
              .transition()
              .duration(1250)
              .ease(d3.easeLinear).attr("opacity", 1);
        
              svg.append("g")
                .call(yAxis)
                .attr("class", "AxisLAN").attr("opacity", 0)
              .transition()
              .duration(1250)
              .ease(d3.easeLinear).attr("opacity", 1);
            
          } else if (view==="map"){
      
            svg.selectAll(".AxisLAN").remove()
            d3.selectAll(".annotation-group").remove()
            
            circles
               .transition()
              .duration(750)
              .ease(d3.easeLinear)
            //   .attr("transform", function(hex) {
                  // 	return "translate(" + hex.x + "," + hex.y + ")";
                  // })
              .attr("cx", function(hex) {return hex.x;})
              .attr("cy", function(hex) {return hex.y;})
              .attr("r", radius)
              .attr("opacity", 1)
              .attr("fill", d => ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === null? "#ccc":
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === undefined ? "#ccc":        
                            colorBivar([d.mobilityWork, d.income]))
      
             annot
               .transition()
              .duration(750)
              .ease(d3.easeLinear)
            //   .attr("transform", function(hex) {
                  // 	return "translate(" + hex.x + "," + hex.y + ")";
                  // })
              .attr("x", function(hex) {return hex.x;})
              .attr("y", function(hex) {return hex.y;})
              .attr("opacity", 1)

          } else if (view==="bars"){

            d3.selectAll(".annotation-group").remove()
            // console.log((circles.filter(d=>d.category==="#9972af")._groups[0].length/circles._groups[0].length*100).toFixed()+"%")

            const pctLH = (circles.filter(d=>d.category==="#e8e8e8")._groups[0].length/circles._groups[0].length*100).toFixed()+"%"
            console.log(pctLH)
            const numZeros = d3.range(0, 100, 3)
            // console.log(numZeros)
            const numTwos = d3.range(1, 100, 3)
            // console.log(numTwos)
            const numThrees = d3.range(2, 100, 3)
            // console.log(numThrees)

            svg.selectAll(".AxisLAN").remove()

            circles.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
           .attr("cx", 200)
           .attr("cy", 1000)
           .attr("opacity", 0)

            annot.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
           .attr("x", 200)
           .attr("y", 1000)
           .attr("opacity", 0)

            circles.filter(d=>d.category!=="#ccc")//.on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))

            .transition()
            .delay((d, i) => {
            return i * Math.random() * 1.5;
            })
            .duration(800)
        //     .transition()
        //    .duration(750)
        //    .ease(d3.easeLinear)
         //   .attr("transform", function(hex) {
               // 	return "translate(" + hex.x + "," + hex.y + ")";
               // })
        //    .attr("cx", (d, i)=>isOdd(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?scaleXCategory(d.category)+20:scaleXCategory(d.category))
            // .attr("cx", (d, i)=>
            //                     isMthree(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
            //                     scaleXCategory(d.category)+40:
            //                     isOdd(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)&&
            //                     ~isMthree(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
            //                     scaleXCategory(d.category)+20:
            //                     scaleXCategory(d.category))
            .attr("cx", (d, i)=>
                                numThrees.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
                                scaleXCategory(d.category)+40:
                                numTwos.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
                                scaleXCategory(d.category)+20:
                                scaleXCategory(d.category))
            // .attr("cx", (d, i)=>console.log(isOdd(i)))
            // .attr("cy", (d, i) =>isMthree(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)? 
            //                      scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row-3):
            //                      isOdd(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)&&
            //                     ~isMthree(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
            //                      scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row):
            //                      scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row-2))

            // .attr("cy", (d, i) =>isOdd(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)? 
            //                      scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row-1):
            //                      scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))

            .attr("cy", (d, i)=>
                                numThrees.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row):
                                numTwos.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row+1):
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row+2))

                                //    .attr("cy", (d, i) => d.category!=="#ccc"?scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row):null)
        //    .attr("cy", (d, i) => i * r * 2)
        //    .attr("cy", figHeight-marginTop)
           .attr("r", radius)
           .attr("opacity", d=>d.income!==null?1:0)
           .attr("fill", d => ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === null? "#ccc":
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (??)"] === undefined ? "#ccc":        
                            colorBivar([d.mobilityWork, d.income]))

           annot.filter(d=>d.category!=="#ccc").on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))

            .transition()
            .duration(750)
            .ease(d3.easeLinear)
            .attr("x", (d, i)=>
                                numThrees.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
                                scaleXCategory(d.category)+40:
                                numTwos.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
                                scaleXCategory(d.category)+20:
                                scaleXCategory(d.category))
            

            .attr("y", (d, i)=>
                                numThrees.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row):
                                numTwos.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row+1):
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row+2))
            .attr("opacity", d=>d.income!==null?1:0)                              

            let barAxis = svg.append("g")
            .call(xAxisBars)
            .attr("class", "AxisLAN").attr("opacity", 0)
            .transition()
            .duration(1250)
            .ease(d3.easeLinear).attr("opacity", 1);


            setTimeout(() => {
                barAxis.selectAll(".tick text")
                    .attr("class", "legend")
                  .call(wrap, scaleXCategory.bandwidth()*1.5, 0)
              }, 0);

            annotateBars(scaleXCategory, 
                         scaleY, 
                         categoriesX[0], 
                         78, 
                         grid, 
                         "50% of localities are either low income, high travel or high income, low travel", 
                         scaleXCategory.bandwidth()*1.3,
                         30,
                         162)

            } else if (view==="barsUrban"){

              d3.selectAll(".annotation-group").remove()

                // console.log((circles.filter(d=>d.category==="#9972af")._groups[0].length/circles._groups[0].length*100).toFixed()+"%")
    
                // const pctLH = (circles.filter(d=>d.category==="#e8e8e8")._groups[0].length/circles._groups[0].length*100).toFixed()+"%"
                // console.log(pctLH)

                // const numZeros = d3.range(0, 400, 4)
                // // console.log(numZeros)
                // const numTwos = d3.range(1, 400, 4)
                // // console.log(numTwos)
                // const numThrees = d3.range(2, 400, 4)
                // // console.log(numThrees)
                // const numFours = d3.range(3, 400, 4)
                
                // // 4 columns of bars
                // const numZeros = d3.range(0, 400, 4)
                // // console.log(numZeros)
                // const numTwos = d3.range(1, 400, 4)
                // // console.log(numTwos)
                // const numThrees = d3.range(2, 400, 4)
                // // console.log(numThrees)
                // const numFours = d3.range(3, 400, 4)

                // seven columns of bars
                const numZeros = d3.range(0, 500, 10)
                // console.log(numZeros)
                const numTwos = d3.range(1, 500, 10)
                // console.log(numTwos)
                const numThrees = d3.range(2, 500, 10)
                // console.log(numThrees)
                const numFours = d3.range(3, 500, 10)
                const numFives = d3.range(4, 500, 10)
                const numSix = d3.range(5, 500, 10)
                const numSeven = d3.range(6, 500, 10)
                const numEights = d3.range(7, 500, 10)
                const numNines = d3.range(8, 500, 10)
                const numTens = d3.range(9, 500, 10)
    
                svg.selectAll(".AxisLAN").remove()
    
                circles.filter(d=>d.urbCategory===null||d.category==="#ccc")
                .transition()
               .duration(750)
               .ease(d3.easeLinear)
               .attr("cx", 200)
               .attr("cy", 1000)
               .attr("opacity", 0)
    
                annot.filter(d=>d.urbCategory===null||d.category==="#ccc")
                .transition()
               .duration(750)
               .ease(d3.easeLinear)
               .attr("x", 200)
               .attr("y", 1000)
               .attr("opacity", 0)
    
                circles.filter(d=>d.urbCategory!==null&&d.category!=="#ccc")//.on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))
    
                .transition()
                .delay((d, i) => {
                return i * Math.random() * 1.5;
                })
                .duration(800)
            //     .transition()
            //    .duration(750)
            //    .ease(d3.easeLinear)

                // .attr("cx", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                //                     numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+60:
                //                     numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+40:
                //                     numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+20:
                //                     scaleXurbCategory(d.urbCategory))
    
                // .attr("cy", (d, i)=>
                //                     numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
                //                     numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
                //                     numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3))

                .attr("cx", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                                    numTens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+180+35:
                                    numNines.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+160+35:
                                    numEights.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+140+35:
                                    numSeven.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+120+35:
                                    numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+100+35:
                                    numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+80+35:
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+60+35:
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+40+35:
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+20+35:
                                    scaleXurbCategory(d.urbCategory)+35)
    
                .attr("cy", (d, i)=>
                                    numTens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
                                    numNines.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
                                    numEights.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
                                    numSeven.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3):
                                    numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+4):
                                    numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+5):
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+6):
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+7):
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+8):
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+9))

            .attr("fill", d=>[categoriesX[1], categoriesX[0]].includes(d.category)?colorBivar([d.mobilityWork, d.income]):"#ccc")
            // .attr("opacity", d=>[categoriesX[1], categoriesX[0]].includes(d.category)?1:0.3)

            //    .attr("opacity", d=>d.income!==null?1:0)
    
               annot.filter(d=>d.urbCategory!==null&&d.category!=="#ccc")//.filter(d=>d.category!=="#ccc").on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))
    
                .transition()
                .duration(750)
                .ease(d3.easeLinear)
                // .attr("x", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                //                     numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+60:
                //                     numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+40:
                //                     numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+20:
                //                     scaleXurbCategory(d.urbCategory))
    
                // .attr("y", (d, i)=>
                //                     numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
                //                     numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
                //                     numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3))

                .attr("x", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                                    numTens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+180+35:
                                    numNines.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+160+35:
                                    numEights.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+140+35:
                                    numSeven.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+120+35:
                                    numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+100+35:
                                    numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+80+35:
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+60+35:
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+40+35:
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+20+35:
                                    scaleXurbCategory(d.urbCategory)+35)
    
                .attr("y", (d, i)=>
                                    numTens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
                                    numNines.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
                                    numEights.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
                                    numSeven.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3):
                                    numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+4):
                                    numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+5):
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+6):
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+7):
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+8):
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+9))

                let barAxis = svg.append("g")
                .call(xAxisBarsUrb)
                .attr("class", "AxisLAN").attr("opacity", 0)
                .transition()
                .duration(1250)
                .ease(d3.easeLinear).attr("opacity", 1);
    
    
                setTimeout(() => {
                    barAxis.selectAll(".tick text")
                        .attr("class", "legend")
                      .call(wrap, scaleXCategory.bandwidth()*1.5, 0)
                  }, 0);


                annotateBars(scaleXurbCategory, 
                             scaleYurb, 
                             "Urban", 
                             78, 
                             grid, 
                             "The majority of low income, high travel and high income, low travel localities are located in urban areas", 
                             scaleXurbCategory.bandwidth(),
                             -40,
                             50)
    
              }
        })
    }

    function renderChartUs(hex_la, ukUpd_tot, vizTheme) { //}, ukUpd_time, ukUrbRural) {

        const margin = ({ top: 20, right: 40, bottom: 20, left: 20})

        const marginTop = 5
        const marginBottom = 40
        const marginLeft = 100
        // const figScale = 2.1
        // const figWidth = width
        // const figHeight = height*figScale
        const figWidth = 880
        const scatterWidth = figWidth-100
        const figHeight = 580
        const radius = 4.2//10//9.8
        const radiusHover = radius*2
        const boundWidth = 4
        const fontSize = 6.5
        const yVar = "mobilityWork"
        // const xVar = "mobilityRes"
        const xVar = "income"
        const xVarLabel = "Median Household Income"
        // const xVarLabel = "Average Change in Work From Home Households Since Feb. 2020"
        const yVarLabel = "Average Change in People Going to Workplaces Since Feb. 2020 (%)"
        // const grid = d3.select(DOM.svg(figWidth, figHeight+marginTop+marginBottom));
        const grid = d3.select("#chart")
                        .append("svg")
                        // .attr("preserveAspectRatio", "xMinYMin meet")
                        // .attr("viewBox", "0 0 300 300")
                        // .classed("svg-content", true);
                        // .attr("preserveAspectRatio", "xMidYMid meet")
                        // .attr("viewBox", "0 0 "+ (figWidth+margin.left+margin.right) +"," + (figHeight+marginTop+marginBottom)+"")
                        
                        // .attr("width", figWidth)
                        .attr("width", figWidth+margin.right+margin.left)
                        // .attr("height", figHeight+marginTop+marginBottom)
                        .attr("height", figHeight+margin.top+margin.bottom)

      
        const svg = grid
          .append("g")
        //   .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", [0, 0, figWidth, figHeight])
          // .style("overflow", "visible")
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
          // .attr('transform', `translate(${0}, ${marginTop})`)
        
      
          // bivar settings
        colors = colorSchemes.get(vizTheme)
         
        const categoriesX = [colors[2], colors[6], colors[7], colors[4], colors[3], colors[5], colors[8], colors[1], colors[0]] 
        const categoryLabels = ["High Income, Low Travel", "Low Income, High Travel", "Mid. Income, High Travel", "Mid. Income, Mid. Travel", 
                                "Low Income, Mid. Travel", "High Income, Mid. Travel", "High Income, High Travel", "Mid. Income, Low Travel", "Low Income, Low Travel"]  

        // var sortOrder = [categoriesX[0], categoriesX[7], categoriesX[5], categoriesX[3], categoriesX[8], categoriesX[4], categoriesX[1], categoriesX[2], categoriesX[6]]

        var sortOrder = [categoriesX[0], categoriesX[1], categoriesX[5], categoriesX[3], categoriesX[8], categoriesX[4], categoriesX[7], categoriesX[2], categoriesX[6]]

        let dataBivar = Object.assign(new Map(ukUpd_tot.map(d=>[d.area_code, [d["workplaces_percent_change_from_baseline"], d["Total annual income (??)"]]])), {title: ["Travel to Work", "Med. Income"]})
        n = Math.floor(Math.sqrt(colors.length))
        yBivar = d3.scaleQuantile(Array.from(dataBivar.values(), d => d[1]), d3.range(n))
        xBivar = d3.scaleQuantile(Array.from(dataBivar.values(), d => d[0]), d3.range(n))
        labels = ["low", "medium", "high"]
        colorBivar = function(value) {
              if (!value) return "lightgrey";
              let [a, b] = value;
              return colors[yBivar(b) + xBivar(a) * n];
          }
        
        legendIndex = () => {
            const k = 63/n;
            // const arrow = 1;
            //font-family=sans-serif
            // <g transform="translate(-${k * n / 2},-${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})">
            return svgDraw`<g class="legend">
            
              <marker id="arrow" markerHeight=10 markerWidth=10 refX=3 refY=3 orient=auto>
                <path d="M0,0L6,3L0,6Z" />
              </marker>
              ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svgDraw`<circle r=${10} cx=${(i * k)+k/2} cy=${((n - 1 - j) * k)+k/2} fill=${colors[j * n + i]} class="legendCircle" value=${colors[j * n + i]}>
                <title>${dataBivar.title[0]}${labels[j] && ` (${labels[j]})`}
          ${dataBivar.title[1]}${labels[i] && ` (${labels[i]})`}</title>
              </circle>`)}
              <line marker-end="url(#arrow)" x1=0 x2=${n * k} y1=${n * k} y2=${n * k} stroke=black stroke-width=1.5 />
              <line marker-end="url(#arrow)" y2=0 y1=${n * k} stroke=black stroke-width=1.5 />
              <text font-weight="bold" dy="0.71em" transform="rotate(90) translate(${n / 2 * k},6)" text-anchor="middle">${dataBivar.title[0]}</text>
              <text font-weight="bold" dy="0.71em" transform="translate(${n / 2 * k},${n * k + 6})" text-anchor="middle">${dataBivar.title[1]}</text>
            </g>
          </g>`;
          }
          // Render the hexes
          var hexes = hex_la.map(d=> ({ ...d, 
          income: 
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]===undefined?null:
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["Total annual income (??)"],
                
          mobilityWork: 
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]===undefined?null:
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["workplaces_percent_change_from_baseline"],
                                                  
          mobilityRes: 
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]===undefined?null:
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["residential_percent_change_from_baseline"],
          
          category: ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]===undefined? "#ccc": 
          ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["Total annual income (??)"] === null? "#ccc":
          ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["Total annual income (??)"] === undefined ? "#ccc":        
          colorBivar([ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["workplaces_percent_change_from_baseline"],ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["Total annual income (??)"]]),

          urbCategory: 
                  ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]===undefined?null:
                  ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["urbCategory"]
          
        //   urbCategory: ukUrbRural.filter(c=>c.LAD11CD===d.key)[0] === undefined ? "No Data": 
        //   ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"] === null? "No Data":
        //   ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"] === undefined ? "No Data":        
        //   ukUrbRural.filter(c=>c.LAD11CD===d.key)[0]["RUC11"],

        //   urbCategory: ukUrbRural.filter(c=>c["LAD11CD"]===d.key)[0] === undefined ? null: 
        //   ukUrbRural.filter(c=>c["LAD11CD"]===d.key)[0]["Rural Urban Classification 2011 (6 fold)"] === null? null:
        //   ukUrbRural.filter(c=>c["LAD11CD"]===d.key)[0]["Rural Urban Classification 2011 (6 fold)"] === undefined ? null:        
        //   ukUrbRural.filter(c=>c["LAD11CD"]===d.key)[0]["Rural Urban Classification 2011 (6 fold)"],
                                                                            
        }))//.filter(d=>d.urbCategory!==null)//.sort((a, b)=>a.category-b.category).map((d, i) =>({ ...d, row: i}))
        
        console.log("hex", hexes)
       
        //   variables for dot clusters bars
          const clusterData = d3.groups(hexes, v=>v.category).map(d=> { return {category: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}}).filter(d=>d.category!=="#ccc")

          console.log(clusterData)
        //   const categoriesX = ["#c8b35a", "#9972af", "#976b82", "#c8ada0", "#cbb8d7", "#af8e53", "#804d36", "#e4d9ac", "#e8e8e8"] 
        //   const categoryLabels = ["High Income, Low Travel", "Low Income, High Travel", "Mid. Income, High Travel", "Mid. Income, Mid. Travel", 
        //                              "Low Income, Mid. Travel", "High Income, High Travel", "High Income, Mid. Travel", "Mid. Income, Low Travel", "Low Income, Low Travel"]  

        //  var sortOrder = ["#c8b35a", "#e4d9ac", "#af8e53", "#c8ada0", "#e8e8e8", "#cbb8d7", "#9972af", "#976b82", "#804d36"]  
        //   var sortOrder = ["High Income, Low Travel", "Mid. Income, Low Travel", "High Income, Mid. Travel", "Mid. Income, Mid. Travel", 
        //                     "Low Income, Low Travel", "Low Income, Mid. Travel", "Low Income, High Travel", "Mid. Income, High Travel", 
        //                     "High Income, High Travel"]                                                           
          const scaleXCategory = d3.scaleBand().domain(categoriesX).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);  
          const scaleXCategoryLabels = d3.scaleBand().domain(categoryLabels).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);     
          const scaleY = d3.scaleLinear().domain([0, 480]).range([figHeight- margin.bottom, 0]); 

          /////////////////////UNCOMMENT
          //   variables for dot clusters bars urban rural
          const ruralData = d3.groups(
              hexes,
            //   .map(d=>({...d, category: hexes.filter(c=>c.key===d.LAD11CD)[0]!==undefined?
            //                                       hexes.filter(c=>c.key===d.LAD11CD)[0].category:null
            //                                     }))
                // .filter(d=>hexes.map(d=>d.fullName).filter(onlyUnique).includes(d.fullName)), 
                v=>v.urbCategory
                )
                .filter(d=>d[0]!==null)
                .map(d=> { 
                  return {urbCategory: d[0], data: d[1]
                    .filter(d=>d.urbCategory!==null&&colors.includes(d.category)&&d.mobilityWork!==null&&d.income!==null).sort(function(a, b) {
                    return sortOrder.indexOf(a.category) - sortOrder.indexOf(b.category);
                  })//.sort((a,b)=> d3.descending(a.category,b.category))
                    .map((c, i) =>({ ...c, row: i}))
                    }
                })
                // .map(d=>({...d, data: d.data.sort((a,b)=> d3.descending(a.category,b.category))}))


          console.log("rural", ruralData)
        //   console.log("ruralRaw", ukUrbRural)
          const urbCategoriesX = ruralData.sort((a,b)=>b.data.length-a.data.length).map(d=>d.urbCategory)
                               
          const scaleXurbCategory = d3.scaleBand().domain(urbCategoriesX).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);  
        //   const scaleXCategoryLabels = d3.scaleBand().domain(categoryLabels).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);     
          const scaleYurb = d3.scaleLinear().domain([0, 1550]).range([figHeight- margin.bottom, 0]); 
        // const scaleYurb = d3.scaleLinear().domain([0, 140]).range([figHeight- margin.bottom, 0]); 


          /////////////////////UNCOMMENT

          grid.append(legendIndex)
          // .attr("transform", `translate(550, 500)`);
            .attr("transform", `translate(${figWidth*0.91},${figHeight*0.85})`);


        // legend interaction
        d3.selectAll(".legendCircle")
        .on("mouseover", function(event, d) { 
          const selectedCat = this.attributes.value.value
          d3.select(this).attr("cursor", "pointer").attr("stroke-width", "1.5")
          d3.select(this.parentNode).raise()
          d3.selectAll(".laCircle").filter(d=>d.category!==selectedCat).attr("opacity", 0.2)
          console.log(selectedCat)
        })
        .on("mouseout", function(event, d) { 
          const selectedCat = this.attributes.value.value
          d3.select(this).attr("stroke-width", "0.5").moveToBack()
          d3.selectAll(".laCircle").attr("opacity", 1) //.filter(d=>d.urbCategory!==null&&d.category!=="#ccc")
          console.log(selectedCat)
        })

        // axes
        const xScaleInc = d3.scaleLinear()//d3.scaleSymlog()//
                        .domain(d3.extent(hexes, d => d[xVar])).nice()
                        .range([margin.left, scatterWidth - margin.right])
      
        const yScaleMob = d3.scaleLinear()
                        // .domain([d3.min(hexes, d => d[yVar]), 5])//.nice()
                        .domain(d3.extent(hexes, d => d[yVar])).nice()
                        .range([figHeight - margin.bottom, margin.top])

        const xScaleHex = d3.scaleLinear()
                  .domain(d3.extent(hexes, d => d.x)).nice()
                  .range([margin.left, figWidth - margin.right])

        const yScaleHex = d3.scaleLinear()
                  .domain(d3.extent(hexes, d => d.y)).nice()
                  // .range([figHeight - margin.top, margin.bottom])

                  .range([margin.bottom, figHeight - margin.top])

        var featureCollection = { type:"FeatureCollection", features: hexes.map(function(d) {
                    return {     
                      "type": "Feature",
                      "geometry": {
                         "type": "Point",
                         "coordinates": [d.x, d.y]
                      },
                      "properties": { "name":d.county }
                    }
                }) }

        var projection = d3.geoAlbersUsa()
        // .center([-96.5795, 39.828175])
        // .scale(850)
        .fitSize([figWidth-margin.right-margin.left, figHeight-margin.top-margin.bottom], featureCollection);
      
      
        const xAxis = g => g
          .attr("transform", `translate(0,${figHeight - margin.bottom})`)
          .call(d3.axisBottom(xScaleInc))
          .call(g => g.select(".domain").remove())
          .call(g => g.append("text")
              .attr("x", scatterWidth)
            //   .attr("x", scatterWidth - margin.right)
              .attr("y", 30)
              .attr("fill", "#000")
              .attr("font-weight", "bold")
              .attr("text-anchor", "end")
              .attr("class", "legend")
              .text(xVarLabel))
      
      
        const yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(yScaleMob))
          .call(g => g.select(".domain").remove())
          .call(g => g.select(".tick:last-of-type text").clone()
              .attr("x", 4)
              .attr("y", -10)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .attr("class", "legend")
              .text(yVarLabel))

        
        const xAxisBars = g => g
        .attr("transform", `translate(8,${figHeight - margin.bottom})`)
        .call(d3.axisBottom(scaleXCategoryLabels))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", scatterWidth)
        //   .attr("x", scatterWidth - margin.right)
            .attr("y", 30)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("class", "legend")
            .text(""))


        const xAxisBarsUrb = g => g
        .attr("transform", `translate(0,${figHeight - margin.bottom})`)
        .call(d3.axisBottom(scaleXurbCategory))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", scatterWidth)
        //   .attr("x", scatterWidth - margin.right)
            .attr("y", 30)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("class", "legend")
            .text(""))
        
          // Bind the hexes to g elements of the svg and position them
          var hexmap = svg
              .selectAll("g")
              .data(hexes)
              .join("g")
              // .attr("transform", function(hex) {
              // 	return "translate(" + hex.x + "," + hex.y + ")";
              // });
      
        
      
          // Draw the polygons around each hex's centre
          const circles = hexmap
              .append("circle")
              .attr("cx", function(hex) {return projection([hex.x, hex.y])[0]})
              .attr("cy", function(hex) {return projection([hex.x, hex.y])[1]})
              // .attr("cx", function(hex) {return xScaleHex(hex.x);})
              // .attr("cy", function(hex) {return yScaleHex(hex.y);})
            .attr("r", radius)
              .attr("stroke", "#fffae7")
              .attr("stroke-width", "0.5")
          // .attr("fill", d => boroughIncMob.filter(c=>c.borough_abbr===d.n)[0] === undefined? "#ccc": 
          //                 colorScale(boroughIncMob.filter(c=>c.borough_abbr===d.n)[0][mapMetric]))
          // .attr("fill", d => ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined? "#ccc": 
          //                 colorScale(ukUpd_tot.filter(c=>c.area_code===d.key)[0][mapMetric]))
      
          .attr("fill", d => d.mobilityWork===null?"#ccc": 
                             d.income===null?"#ccc":      
                            colorBivar([d.mobilityWork, d.income]))
          .attr("class", "laCircle")
          .attr("cursor", "pointer")
          .on("mouseover", function(event, d) { 
                                        //   d3.select(this)
                                        //     .attr("stroke-width", "1.5")
                                        //     .attr("r", radius*2)
                                        //     // .moveToFront()
                                        d3.select(this.parentNode).raise()
                                        //     // .attr("z-index", 1000)

                                        // console.log(d3.select(this.parentNode))
                                        //     .attr("font-size", fontSize*1.5)
                                        //     .attr("font-weight", 900)

                                        // circles.filter(c=>c.fullName===d.fullName)
                                        circles.filter(c=>c.GEOID===d.GEOID)
                                            .attr("stroke-width", "1.5")
                                            .attr("r", radiusHover)
                                        
                                        // annot.filter(c=>c.key===d.key)
                                        // .attr("font-size", fontSize*2)
                                        // .style("text-transform", "uppercase")
                                        // .attr("font-weight", 700)
                                            // .raise()
                                        showTooltip(d, "", categoryLabels, categoriesX, "USA")
                                        // console.log(ukUpd_time.filter(c=>c.area_code===d.key)[0])
                                        console.log(d)
                                        // console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(c=>c.fullName===d.fullName)[0])
          })
          .on("mouseleave", function(event, d) { 
                                          d3.select(this)
                                            .attr("stroke-width", "0.5")
                                            .attr("r", radius)
                                            .moveToBack()

                                        // annot.filter(c=>c.key===d.key)
                                        // .attr("font-size", fontSize)
                                        // .style("text-transform", "capitalize")
                                        // .attr("font-weight", 500)
                                        hideTooltip()
                                            // .lower()
          })
      
      
        d3.select("#chartView").on("change", function(select){
          var view = d3.select("#chartView").node().value
          console.log(view)
      
          if (view==="chart") {

            svg.selectAll(".AxisLAN").remove()
            d3.selectAll(".annotation-group").remove()

            circles.filter(d=>d.category==="#ccc")//||d.mobilityWork===0
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
            .attr("cx", 200)
            .attr("cy", 1000)
            .attr("opacity", 0)

        //     annot.filter(d=>d.category==="#ccc")
        //     .transition()
        //    .duration(750)
        //    .ease(d3.easeLinear)
        //     .attr("x", 200)
        //     .attr("y", 200)
        //     .attr("opacity", 0)
      
            circles.filter(d=>d.category!=="#ccc")//||d.mobilityWork!==0
              .transition()
              .duration(750)
              .ease(d3.easeLinear)
      
              .attr("cx", d => xScaleInc(d[xVar]))
              .attr("cy", d=> yScaleMob(d[yVar]))
              .attr("fill", d => d.mobilityWork===null?"#ccc": 
                             d.income===null?"#ccc":      
                            colorBivar([d.mobilityWork, d.income]))
            //   .attr("transform", function(hex) {
                  // 	return "translate(" + (-hex.x) + "," + (-hex.y) + ")";
                  // })
            //   .attr("r", radius/1.5)
            //   .attr("opacity", d=>d.income!==null?1:0)
      
            // annot.filter(d=>d.category!=="#ccc")
            //    .transition()
            //   .duration(750)
            //   .ease(d3.easeLinear)
      
            //   .attr("x", d => xScaleInc(d[xVar]))
            //   .attr("y", d=> yScaleMob(d[yVar]))
            //   .attr("opacity", 0)
              
              // .attr("transform", d => `translate(${xScaleIncome(d["income"])},
              //                                    ${yScaleTotMob(d["workplaces_percent_change_from_baseline"])})`)
              // .attr("r", 2.5)

              svg.append("g")
              .call(xAxis)
              .attr("class", "AxisLAN").attr("opacity", 0)
              .transition()
              .duration(1250)
              .ease(d3.easeLinear).attr("opacity", 1);
        
              svg.append("g")
                .call(yAxis)
                .attr("class", "AxisLAN").attr("opacity", 0)
              .transition()
              .duration(1250)
              .ease(d3.easeLinear).attr("opacity", 1);
            
          } else if (view==="map"){
      
            svg.selectAll(".AxisLAN").remove()
            d3.selectAll(".annotation-group").remove()

            circles
               .transition()
              .duration(750)
              .ease(d3.easeLinear)
            //   .attr("transform", function(hex) {
                  // 	return "translate(" + hex.x + "," + hex.y + ")";
                  // })
              // .attr("cx", function(hex) {return xScaleHex(hex.x);})
              // .attr("cy", function(hex) {return yScaleHex(hex.y);})
              .attr("cx", function(hex) {return projection([hex.x, hex.y])[0]})
              .attr("cy", function(hex) {return projection([hex.x, hex.y])[1]})
              .attr("r", radius)
              .attr("opacity", 1)
              .attr("fill", d => d.mobilityWork===null?"#ccc": 
                             d.income===null?"#ccc":      
                            colorBivar([d.mobilityWork, d.income]))
      
            //  annot
            //    .transition()
            //   .duration(750)
            //   .ease(d3.easeLinear)
            // //   .attr("transform", function(hex) {
            //       // 	return "translate(" + hex.x + "," + hex.y + ")";
            //       // })
            //   .attr("x", function(hex) {return hex.x;})
            //   .attr("y", function(hex) {return hex.y;})
            //   .attr("opacity", 1)

          } else if (view==="bars"){

            d3.selectAll(".annotation-group").remove()

            // #c8b35a
            // "#804d36", "#e8e8e8"
            console.log("highInc/lowCom + lowInc/highCom = ", 
                            circles.filter(d=>d.category==="#9972af")._groups[0].length/circles._groups[0].length+
                            circles.filter(d=>d.category==="#c8b35a")._groups[0].length/circles._groups[0].length)

            console.log("highInc/highCom + lowInc/lowCom = ", 
                            circles.filter(d=>d.category==="#804d36")._groups[0].length/circles._groups[0].length+
                            circles.filter(d=>d.category==="#e8e8e8")._groups[0].length/circles._groups[0].length)

            // const pctLH = (circles.filter(d=>d.category==="#e8e8e8")._groups[0].length/circles._groups[0].length*100).toFixed()+"%"
            // console.log(pctLH)
            const numZeros = d3.range(0, 1000, 8)
            // console.log(numZeros)
            const numTwos = d3.range(1, 1000, 8)
            // console.log(numTwos)
            const numThrees = d3.range(2, 1000, 8)
            // console.log(numThrees)
            const numFours = d3.range(3, 1000, 8)
            const numFives = d3.range(4, 1000, 8)
            const numSix = d3.range(5, 1000, 8)
            const numSevens = d3.range(6, 1000, 8)
            const numEights = d3.range(7, 1000, 8)

            svg.selectAll(".AxisLAN").remove()

            circles.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
           .attr("cx", 200)
           .attr("cy", 1000)
           .attr("opacity", 0)

        //     annot.filter(d=>d.category==="#ccc")
        //     .transition()
        //    .duration(750)
        //    .ease(d3.easeLinear)
        //    .attr("x", 200)
        //    .attr("y", 500)
        //    .attr("opacity", 0)

            circles.filter(d=>d.category!=="#ccc")//.on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))

            .transition()
            .delay((d, i) => {
            return i * Math.random() * 1.5;
            })
            .duration(800)
        //     .transition()
        //    .duration(750)
        //    .ease(d3.easeLinear)
         //   .attr("transform", function(hex) {
               // 	return "translate(" + hex.x + "," + hex.y + ")";
               // })
        //    .attr("cx", (d, i)=>isOdd(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?scaleXCategory(d.category)+20:scaleXCategory(d.category))
            // .attr("cx", (d, i)=>
            //                     isMthree(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
            //                     scaleXCategory(d.category)+40:
            //                     isOdd(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)&&
            //                     ~isMthree(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
            //                     scaleXCategory(d.category)+20:
            //                     scaleXCategory(d.category))
            .attr("cx", (d, i)=>
                                numEights.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleXCategory(d.category)+63:
                                numSevens.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleXCategory(d.category)+54:
                                numSix.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleXCategory(d.category)+45:
                                numFives.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleXCategory(d.category)+36:
                                numFours.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleXCategory(d.category)+27:
                                numThrees.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleXCategory(d.category)+18:
                                numTwos.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleXCategory(d.category)+9:
                                scaleXCategory(d.category))
            

            .attr("cy", (d, i)=>
                                numEights.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row):
                                numSevens.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row+1):
                                numSix.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row+2):
                                numFives.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row+3):
                                numFours.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row+4):
                                numThrees.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row+5):
                                numTwos.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row+6):
                                scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.fullName===d.fullName)[0].row+7))

        //    .attr("cy", (d, i) => d.category!=="#ccc"?scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row):null)
        //    .attr("cy", (d, i) => i * r * 2)
        //    .attr("cy", figHeight-marginTop)
           .attr("r", radius)
           .attr("opacity", d=>d.income!==null?1:0)
           .attr("fill", d => d.mobilityWork===null?"#ccc": 
                             d.income===null?"#ccc":      
                            colorBivar([d.mobilityWork, d.income]))


        //    annot.filter(d=>d.category!=="#ccc").on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))

        //     .transition()
        //     .duration(750)
        //     .ease(d3.easeLinear)
        //     .attr("x", (d, i)=>
        //                         numThrees.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
        //                         scaleXCategory(d.category)+40:
        //                         numTwos.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
        //                         scaleXCategory(d.category)+20:
        //                         scaleXCategory(d.category))
            

        //     .attr("y", (d, i)=>
        //                         numThrees.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
        //                         scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row):
        //                         numTwos.includes(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row)?
        //                         scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row+1):
        //                         scaleY(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row+2))

            let barAxis = svg.append("g")
            .call(xAxisBars)
            .attr("class", "AxisLAN").attr("opacity", 0)
            .transition()
            .duration(1250)
            .ease(d3.easeLinear).attr("opacity", 1);


            setTimeout(() => {
                barAxis.selectAll(".tick text")
                    .attr("class", "legend")
                  .call(wrap, scaleXCategory.bandwidth()*1.5, 0)
              }, 0);
              
            annotateBars(scaleXCategory, 
              scaleY, 
              categoriesX[0], 
              460, 
              grid, 
              "30% of localities are either low income, high travel or high income, low travel", 
              scaleXCategory.bandwidth()*1.75,
              15,
              170)

            } else if (view==="barsUrban"){

              d3.selectAll(".annotation-group").remove()

                // console.log((circles.filter(d=>d.category==="#9972af")._groups[0].length/circles._groups[0].length*100).toFixed()+"%")
    
                // const pctLH = (circles.filter(d=>d.category==="#e8e8e8")._groups[0].length/circles._groups[0].length*100).toFixed()+"%"
                // console.log(pctLH)

                // const numZeros = d3.range(0, 400, 4)
                // // console.log(numZeros)
                // const numTwos = d3.range(1, 400, 4)
                // // console.log(numTwos)
                // const numThrees = d3.range(2, 400, 4)
                // // console.log(numThrees)
                // const numFours = d3.range(3, 400, 4)
                
                const numZeros = d3.range(0, 3000, 26)
                // console.log(numZeros)
                const numTwos = d3.range(1, 3000, 26)
                // console.log(numTwos)
                const numThrees = d3.range(2, 3000, 26)
                // console.log(numThrees)
                const numFours = d3.range(3, 3000, 26)
                const numFives = d3.range(4, 3000, 26)
                const numSix = d3.range(5, 3000, 26)
                const numSevens = d3.range(6, 3000, 26)
                const numEights = d3.range(7, 3000, 26)
                const numNines = d3.range(8, 3000, 26)
                const numTens = d3.range(9, 3000, 26)
                const numElevens = d3.range(10, 3000, 26)
                const numTwelves = d3.range(11, 3000, 26)
                const numThirteens = d3.range(12, 3000, 26)
                const numFourteens = d3.range(13, 3000, 26)
                const numFifteens = d3.range(14, 3000, 26)
                const numSixteens = d3.range(15, 3000, 26)
                const numSeventeens = d3.range(16, 3000, 26)
                const numEighteens = d3.range(17, 3000, 26)
                const numNineteens = d3.range(18, 3000, 26)
                const numTwenties = d3.range(19, 3000, 26)
                const numTwentyone = d3.range(20, 3000, 26)
                const numTwentytwo = d3.range(21, 3000, 26)
                const numTwentythree = d3.range(22, 3000, 26)
                const numTwentyfour = d3.range(23, 3000, 26)
                const numTwentyfive = d3.range(24, 3000, 26)
                const numTwentysix = d3.range(25, 3000, 26)

    
                svg.selectAll(".AxisLAN").remove()
    
                circles.filter(d=>d.urbCategory===null||!colors.includes(d.category))
                .transition()
               .duration(750)
               .ease(d3.easeLinear)
               .attr("cx", 200)
               .attr("cy", 1000)
               .attr("opacity", 0)
    
            //     annot.filter(d=>d.urbCategory===null)
            //     .transition()
            //    .duration(750)
            //    .ease(d3.easeLinear)
            //    .attr("x", 200)
            //    .attr("y", 500)
            //    .attr("opacity", 0)

                // var transition = d3.transition()

                // function getTransition() {
                //     return d3.transition()
                //     .delay((d, i) => {
                //     return i * Math.random() * 1.5;
                //     })
                //     .duration(800)
                // }

                function transitionCircles(data) {
                    // var transition = new d3.transition()
                    data.transition()
                    .delay((d, i) => {
                    return i * Math.random() * 1.5;
                    })
                    .duration(5000)
                //     .transition()
                //    .duration(750)
                //    .ease(d3.easeLinear)
    
                    .attr("cx", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                                        numTwentysix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+225:
                                        numTwentyfive.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+216:
                                        numTwentyfour.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+207:
                                        numTwentythree.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+198:
                                        numTwentytwo.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+189:
                                        numTwentyone.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+180:
                                        numTwenties.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+171:
                                        numNineteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+162:
                                        numEighteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+153:
                                        numSeventeens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+144:
                                        numSixteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+135:
                                        numFifteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+126:
                                        numFourteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+117:
                                        numThirteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+108:
                                        numTwelves.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+99:
                                        numElevens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+90:
                                        numTens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+81:
                                        numNines.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+72:
                                        numEights.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+63:
                                        numSevens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+54:
                                        numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+45:
                                        numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+36:
                                        numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+27:
                                        numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+18:
                                        numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleXurbCategory(d.urbCategory)+9:
                                        scaleXurbCategory(d.urbCategory))
        
                    .attr("cy", (d, i)=>
                                        numTwentysix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row):
                                        numTwentyfive.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+1):
                                        numTwentyfour.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+2):
                                        numTwentythree.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+3):
                                        numTwentytwo.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+4):
                                        numTwentyone.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+5):
                                        numTwenties.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+6):
                                        numNineteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+7):
                                        numEighteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+8):
                                        numSeventeens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+9):
                                        numSixteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+10):
                                        numFifteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+11):
                                        numFourteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+12):
                                        numThirteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+13):
                                        numTwelves.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+14):
                                        numElevens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+15):
                                        numTens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+16):
                                        numNines.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+17):
                                        numEights.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+18):
                                        numSevens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+19):
                                        numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+20):
                                        numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+21):
                                        numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+22):
                                        numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+23):
                                        numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+24):
                                        scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+25))
                    .attr("fill", d=>[categoriesX[1], categoriesX[0]].includes(d.category)?colorBivar([d.mobilityWork, d.income]):"#ccc")

                }

                transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder.includes(d.category)))

                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[0].includes(d.category)))
                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[1].includes(d.category)))
                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[2].includes(d.category)))
                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[3].includes(d.category)))
                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[4].includes(d.category)))
                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[5].includes(d.category)))
                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[6].includes(d.category)))
                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[7].includes(d.category)))
                // transitionCircles(circles.filter(d=>d.urbCategory!==null&&sortOrder[8].includes(d.category)))

                // console.log(circles.filter(d=>d.urbCategory===null&&d!==undefined))

                let barAxis = svg.append("g")
                .call(xAxisBarsUrb)
                .attr("class", "AxisLAN").attr("opacity", 0)
                // .transition()
                // .duration(1250)
                // .ease(d3.easeLinear)
                .attr("opacity", 1);
    
    
                setTimeout(() => {
                    barAxis.selectAll(".tick text")
                        .attr("class", "legend")
                      .call(wrap, scaleXCategory.bandwidth()*1.5, 0)
                  }, 0);

                annotateBars(scaleXurbCategory, 
                  scaleYurb, 
                  "Rural", 
                  250, 
                  grid, 
                  "In contrast with the U.K., in the U.S. the majority of low income, high travel areas are rural", 
                  scaleXurbCategory.bandwidth(),
                  -40,
                  50)

                annotateBars(scaleXurbCategory, 
                  scaleYurb, 
                  "Rural", 
                  250, 
                  grid, 
                  "While the majority of high income, low travel localities are urban", 
                  scaleXurbCategory.bandwidth()*1.6,
                  40,
                  -50)
    
              }
        })
    }

    function showTooltip(data, dataTime, categoryLabels, categoriesX, country) {
        // console.log(data, dataTime)
        d3.select("#staticTooltip")
          .selectAll("html").remove()


        d3.select("#staticTooltip")
          .append("html")
          .html(`During the COVID-19 Pandemic, residents of the <strong class="rich${vizTheme}" style="background-color:${data.category}">${categoryLabels[categoriesX.indexOf(data.category)].split(",")[0]}</strong> locality of <strong>${country==="UK"?data.n: data.fullName}</strong>, traveled to work <strong class="rich${vizTheme}" style="background-color:${data.category}">${data.mobilityWork*-1}% less</strong> than in 2019.`)

    }

    function annotateBars(x, y, category, row, svg, text, offset, yOffset, xOffset) {
        // console.log(y)
        const type = d3.annotationLabel

        const annotations = [{
        note: {
            label: text,
            bgPadding: 10,
            // title: text
        },
        connector: {
          end: "dot",
          // type: "curve",
        },
        //can use x, y directly instead of data
        data: {category: category, row: row},
        className: "show-bg",
        dy: yOffset,
        dx: xOffset
        }]


        const makeAnnotations = d3.annotation()
        // .editMode(true)
        //also can set and override in the note.padding property
        //of the annotation object
        .notePadding(15)
        .type(type)
        //accessors & accessorsInverse not needed
        //if using x, y in annotations JSON
        .accessors({
            x: d => x(d.category)+offset,
            y: d => y(d.row)
        })
        // .accessorsInverse({
        //     category: d => x.invert(d.x),
        //     row: d => y.invert(d.y)
        // })
        .annotations(annotations)

        // console.log(d3.annotation())

        // const annotationData = [{ category: category, row: row, text: text}]

        // // const annotations = 
        // d3.select("#chart")//.select("svg")
        // // .data(annotationData)
        svg.append("g")
        .attr("class", "annotation-group")
        .style("font-size", "15px")
        // .append("text")
        // .attr("x", d=>x(d.category))
        // .attr("y", d=>y(d.row))
        // .text(text)
        .call(makeAnnotations)
        // .transition().duration(1000)
        // .attr("transform", `translate(${x.bandwidth()}, 0)`)

        d3.selectAll(".annotation-group").attr("opacity", 0).transition().duration(1000).attr("opacity", 1)
    }

    function hideTooltip() {

        d3.select("#staticTooltip")
          .selectAll("html").remove()
    }

    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
    };

      d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

    function isOdd(num) { return num % 2;}

    function isMthree(num) 
        {
        if (num % 3 == 0) 
        {
            return true;
        } 
        else {
            return false;
        }
    }

    function wrap(text, wrapWidth, yAxisAdjustment = 0) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")) - yAxisAdjustment,
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", `${dy}em`);
            while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > wrapWidth) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
            }
        });
        return 0;
    }

    function renderLegend() {

        // const mapContainer = map.getCanvasContainer();
      
        const dim = 100
        const svg = d3
          // .select(mapContainer)
          .select("#chart")
          .append("svg")
            .attr('width', dim)
            .attr('height', dim)
            .style('position', 'absolute')
            .style('z-index', 0)
            .attr("id", "legend")
            // .style("transform", `translate(45px, 100px)`)
          
        const leg = svg.append("g")
          //   .attr("height", height)
          // .attr("width", width);
          // .style("overflow", "visible")
                    // .attr('transform', `translate(${0}, ${marginTop+20})`)
        
        leg.append(legendIndex)
        .style("transform", `translate(20px, 10px)`)
            
      
        // const credit = //d3
        //   // .select("#bivmap")
        //   // .append("div")
        //   //  .attr('width', dim)
        //   // .attr('height', dim)
        //   titleCont.append("html")
        //   .html("by <a href='https://www.leonardonicoletti.com/' style='text-decoration:underline; color:black' target='_blank'><b>LEONARDO NICOLETTI</b></a>")
        //   // .style("transform", "translate(10px,100px)")
        //     .attr("class", "mapCredit")
        //     .style('position', 'absolute')
      
        
    }

    function template(render, wrapper) {
        return function(strings) {
          var string = strings[0],
              parts = [], part,
              root = null,
              node, nodes,
              walker,
              i, n, j, m, k = -1;
      
          // Concatenate the text using comments as placeholders.
          for (i = 1, n = arguments.length; i < n; ++i) {
            part = arguments[i];
            if (part instanceof Node) {
              parts[++k] = part;
              string += "<!--o:" + k + "-->";
            } else if (Array.isArray(part)) {
              for (j = 0, m = part.length; j < m; ++j) {
                node = part[j];
                if (node instanceof Node) {
                  if (root === null) {
                    parts[++k] = root = document.createDocumentFragment();
                    string += "<!--o:" + k + "-->";
                  }
                  root.appendChild(node);
                } else {
                  root = null;
                  string += node;
                }
              }
              root = null;
            } else {
              string += part;
            }
            string += strings[i];
          }
      
          // Render the text.
          root = render(string);
      
          // Walk the rendered content to replace comment placeholders.
          if (++k > 0) {
            nodes = new Array(k);
            walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT, null, false);
            while (walker.nextNode()) {
              node = walker.currentNode;
              if (/^o:/.test(node.nodeValue)) {
                nodes[+node.nodeValue.slice(2)] = node;
              }
            }
            for (i = 0; i < k; ++i) {
              if (node = nodes[i]) {
                node.parentNode.replaceChild(parts[i], node);
              }
            }
          }
      
          // Is the rendered content
          // ??? a parent of a single child? Detach and return the child.
          // ??? a document fragment? Replace the fragment with an element.
          // ??? some other node? Return it.
          return root.childNodes.length === 1 ? root.removeChild(root.firstChild)
              : root.nodeType === 11 ? ((node = wrapper()).appendChild(root), node)
              : root;
        };
      }

    svgDraw = template(function(string) {
        var root = document.createElementNS("http://www.w3.org/2000/svg", "g");
        root.innerHTML = string.trim();
        return root;
      }, function() {
        return document.createElementNS("http://www.w3.org/2000/svg", "g");
      });
