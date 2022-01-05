// d3 = require('d3', "d3-hexjson")

Promise.all([
    d3.json("https://raw.githubusercontent.com/odileeds/hexmaps/gh-pages/maps/uk-local-authority-districts-2021.hexjson"),
    d3.json("https://gist.githubusercontent.com/lnicoletti/9be9db8307920b88fe71d5ec304e0fa3/raw/64881a3e2e97ef5cb15c6768e4b401c8018ec39a/ukUpd_tot_final.json"),
    d3.json("https://gist.githubusercontent.com/lnicoletti/8025f10314c9004f5c0d9e392bbf5b17/raw/f5fa0d5c86d1b8d41f9ed6624d6b23b0b1b2ec37/ukUpdGroupMonth"),
    // d3.csv("https://gist.githubusercontent.com/lnicoletti/6800cd1df1205c0260f685fd83399cef/raw/e3a7d34515f4f96a8d5b4794d6cdc878f3f7b1f8/ukUrbRural_simple.csv", d3.autoType),
    d3.csv("https://gist.githubusercontent.com/lnicoletti/7baf3e11996edb30a5fb590d3f76f7ef/raw/11a7c8f3ff3525e565776f9406facc2f793bede4/ukUrbRural.csv", d3.autoType),
    // d3.csv("https://gist.githubusercontent.com/lnicoletti/97a897e8d32fa77e1bbfd4b53f2973bf/raw/686be1c93395524e5fae49adf4ba33046979f6c2/urbanRuralUkthreeFold.csv", d3.autoType),
    d3.csv("https://gist.githubusercontent.com/lnicoletti/6e16123616cf30fb88bf3b217d98f398/raw/314fea2e2a9fd778543a8dcf195bc0f845c57730/urbanRuralScotland.csv", d3.autoType),
    d3.json("https://gist.githubusercontent.com/lnicoletti/4f576610004076d7b8f0e7b7ec0d08c5/raw/67ed1b2e38d5678808ad9ad4ce3e9309a83deb6d/usUpd_tot.json", d3.autoType),
    d3.csv("https://gist.githubusercontent.com/lnicoletti/62ee1b2144ad7dbcd6a66eddbc1b0544/raw/6cd8ed474e719767f40e7de88e02b6815b1e0d03/usCountiesHex.csv", d3.autoType)

    ]).then((datasets) => {

    let hex_la = datasets[0]
    let ukUpd_tot = datasets[1]
    let ukUpd_time = datasets[2]
    let engUrbRural = datasets[3]
    let scotUrbRural = datasets[4]
    let uSuPd_tot = datasets[5]
    let hex_us = datasets[6]

    let ukUrbRural = d3.merge([engUrbRural, scotUrbRural])

    // console.log(ukUrbRural)
    // renderChartUk(hex_la, ukUpd_tot, ukUpd_time, ukUrbRural)

    console.log(hex_us)
    renderChartUs(hex_us, uSuPd_tot)
    // renderLegend()
    })


    new TypeIt("#FigTitle", {
        speed: 150,
        strings: [
          'A <span class="rich">Rich</span> vs. <span class="poor">Poor</span> issue',
          'An <span class="rich">urban</span> vs. <span class="poor">rural</span> issue',
        ],
        breakLines: false,
        loop: true,
        pause: 1000,
      }).go();


    function renderChartUk(hex_la, ukUpd_tot, ukUpd_time, ukUrbRural) {

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
                        // .attr("preserveAspectRatio", "xMinYMin meet")
                        // .attr("viewBox", "0 0 300 300")
                        // .classed("svg-content", true);
                        // .attr("preserveAspectRatio", "xMidYMid meet")
                        // .attr("viewBox", "0 0 "+ (figWidth+margin.left+margin.right) +"," + (figHeight+marginTop+marginBottom)+"")
                        .attr("width", figWidth)
                        .attr("height", figHeight+marginTop+marginBottom)
      
        const svg = grid
          .append("g")
        //   .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", [0, 0, figWidth, figHeight])
          // .style("overflow", "visible")
          .attr('transform', `translate(${0}, ${marginTop})`)
        
      
          // bivar settings
        colors = ["#e8e8e8", "#e4d9ac", "#c8b35a", "#cbb8d7", "#c8ada0", "#af8e53", "#9972af", "#976b82", "#804d36"]
        let dataBivar = Object.assign(new Map(ukUpd_tot.map(d=>[d.area_code, [d["workplaces_percent_change_from_baseline"], d["Total annual income (£)"]]])), {title: ["Travel to Work", "Med. Income"]})
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
              ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svgDraw`<circle r=${radius} cx=${(i * k)+k/2} cy=${((n - 1 - j) * k)+k/2} fill=${colors[j * n + i]}>
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
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === null)||
                (ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === undefined)?null:
                ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"],
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
          ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === null? "#ccc":
          ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === undefined ? "#ccc":        
          colorBivar([ukUpd_tot.filter(c=>c.area_code===d.key)[0]["workplaces_percent_change_from_baseline"],ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"]]),

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
        //   cluster data for dot clusters
        //   const clustered = hexes.map(d=>({...d, cluster: ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
        //                                                     ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === null? "#ccc":
        //                                                     ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === undefined ? "#ccc":        
        //                                                     colorBivar([d.mobilityWork, d.income])}))
                           
                                                        
        //   console.log(clustered)

        //   const clusterData = [hexes.sort((a, b)=>a.category-b.category).map((d, i) =>({ ...d, row: i})),
        //                        d3.rollups(hexes, v => v.length, d=>d.category).map(d=> { return {category: d[0], category_value: d[1]}}).filter(d=>d.category!=="#ccc")]
        
        //   variables for dot clusters bars
          const clusterData = d3.groups(hexes, v=>v.category).map(d=> { return {category: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}}).filter(d=>d.category!=="#ccc")

          console.log(clusterData)
          const categoriesX = ["#9972af", "#c8b35a", "#c8ada0", "#976b82", "#af8e53", "#cbb8d7", "#e4d9ac", "#e8e8e8", "#804d36"] 
          const categoryLabels = ["Low Income, High Travel", "High Income, Low Travel", "Mid. Income, Mid. Travel", "Mid. Income, High Travel", 
                                    "High Income, Mid. Travel", "Low Income, Mid. Travel", "Mid. Income, Low Travel", "Low Income, Low Travel", "High Income, High Travel"]  

         var sortOrder = ["#c8b35a", "#e4d9ac", "#af8e53", "#c8ada0", "#e8e8e8", "#cbb8d7", "#9972af", "#976b82", "#804d36"]  
        //   var sortOrder = ["High Income, Low Travel", "Mid. Income, Low Travel", "High Income, Mid. Travel", "Mid. Income, Mid. Travel", 
        //                     "Low Income, Low Travel", "Low Income, Mid. Travel", "Low Income, High Travel", "Mid. Income, High Travel", 
        //                     "High Income, High Travel"]                                                           
          const scaleXCategory = d3.scaleBand().domain(categoriesX).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);  
          const scaleXCategoryLabels = d3.scaleBand().domain(categoryLabels).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);     
          const scaleY = d3.scaleLinear().domain([0, 85]).range([figHeight- margin.bottom, 0]); 

          //   variables for dot clusters bars urban rural
          const ruralData = d3.groups(
              ukUrbRural
              .map(d=>({...d, category: hexes.filter(c=>c.key===d.LAD11CD)[0]!==undefined?
                                                  hexes.filter(c=>c.key===d.LAD11CD)[0].category:null
                                                }))
                .filter(d=>hexes.map(d=>d.key).filter(onlyUnique).includes(d.LAD11CD)), v=>v.RUC11)
                .map(d=> { 
                  return {urbCategory: d[0], data: d[1].sort(function(a, b) {
                    return sortOrder.indexOf(a.category) - sortOrder.indexOf(b.category);
                  })//.sort((a,b)=> d3.descending(a.category,b.category))
                    .map((c, i) =>({ ...c, row: i}))
                    }
                })
                // .map(d=>({...d, data: d.data.sort((a,b)=> d3.descending(a.category,b.category))}))

        //   const ruralData = d3.groups(ukUrbRural, v=>v.RUC11).map(d=> { return {urbCategory: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}})
        // const ruralData = d3.groups(hexes, v=>v.urbCategory).filter(d=>d[0]!==null).map(d=> { return {urbCategory: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}})

        //   console.log(ukUrbRural.filter(d=>d.LAD11CD==="E08000037"))

          console.log(ruralData)
        //   console.log("ruralRaw", ukUrbRural)
          const urbCategoriesX = ruralData.sort((a,b)=>b.data.length-a.data.length).map(d=>d.urbCategory)
        //   urbCategoriesX.push("No Data")
        //   console.log(urbCategoriesX)
        //   const categoryLabels = ["Low Income, High Travel", "High Income, Low Travel", "Mid. Income, Mid. Travel", "Mid. Income, High Travel", 
        //                             "High Income, Mid. Travel", "Low Income, Mid. Travel", "Mid. Income, Low Travel", "Low Income, Low Travel", "High Income, High Travel"]                                                             
          const scaleXurbCategory = d3.scaleBand().domain(urbCategoriesX).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);  
        //   const scaleXCategoryLabels = d3.scaleBand().domain(categoryLabels).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);     
          const scaleYurb = d3.scaleLinear().domain([0, 115]).range([figHeight- margin.bottom, 0]); 
        // const scaleYurb = d3.scaleLinear().domain([0, 140]).range([figHeight- margin.bottom, 0]); 

          
          
        //   ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svgDraw`<rect width=${k} height=${k} x=${i * k} y=${(n - 1 - j) * k} fill=${colors[j * n + i]}>
        //         <title>${dataBivar.title[0]}${labels[j] && ` (${labels[j]})`}
        //   ${dataBivar.title[1]}${labels[i] && ` (${labels[i]})`}</title>
        //       </rect>`)}

          grid.append(legendIndex)
          // .attr("transform", `translate(550, 500)`);
            .attr("transform", `translate(${figWidth*0.91},${figHeight*0.85})`);


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
          // .attr("fill", d => boroughIncMob.filter(c=>c.borough_abbr===d.n)[0] === undefined? "#ccc": 
          //                 colorScale(boroughIncMob.filter(c=>c.borough_abbr===d.n)[0][mapMetric]))
          // .attr("fill", d => ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined? "#ccc": 
          //                 colorScale(ukUpd_tot.filter(c=>c.area_code===d.key)[0][mapMetric]))
      
          .attr("fill", d => ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === null? "#ccc":
                            ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === undefined ? "#ccc":        
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
      
        // d3.selectAll(".hex")
        //   .on("mouseover", function(event, d) {d3.select(this).attr("stroke-width", "3")})
      
          // .on("mouseover", (event, d) => d3.select(this).attr("stroke-width", "3"))
          // .on("mousemove", (event, d) => d3.select(this).attr("stroke-width", "3"))
          // .on("mouseout", (event, d) => d3.select(this).attr("stroke-width", "1"))
            
              // .attr("fill", "#b0e8f0");
      
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
        //   .on("mouseover", function(event, d) { 
        //     d3.select(this)
            //   .attr("font-size", fontSize*1.5)
            //   .attr("font-weight", 900)
        //       // .moveToFront()
        //     //   d3.select(this.parentNode).raise()
        //       // .attr("z-index", 1000)
        // })
        // .on("mouseleave", function(event, d) { 
        //     d3.select(this)
        //     .attr("font-size", fontSize)
        //     .attr("font-weight", 500)
        //                 // .lower()
        // });
      
      
        d3.select("#chartView").on("change", function(select){
          var view = d3.select("#chartView").node().value
          console.log(view)
      
          if (view==="chart") {

            svg.selectAll(".AxisLAN").remove()

            circles.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
            .attr("cx", 200)
            .attr("cy", 200)
            .attr("opacity", 0)

            annot.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
            .attr("x", 200)
            .attr("y", 200)
            .attr("opacity", 0)
      
            circles.filter(d=>d.category!=="#ccc")
              .transition()
              .duration(750)
              .ease(d3.easeLinear)
      
              .attr("cx", d => xScaleInc(d[xVar]))
              .attr("cy", d=> yScaleMob(d[yVar]))
            //   .attr("transform", function(hex) {
                  // 	return "translate(" + (-hex.x) + "," + (-hex.y) + ")";
                  // })
            //   .attr("r", radius/1.5)
            //   .attr("opacity", d=>d.income!==null?1:0)
      
            annot.filter(d=>d.category!=="#ccc")
               .transition()
              .duration(750)
              .ease(d3.easeLinear)
      
              .attr("x", d => xScaleInc(d[xVar]))
              .attr("y", d=> yScaleMob(d[yVar]))
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
           .attr("cy", 500)
           .attr("opacity", 0)

            annot.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
           .attr("x", 200)
           .attr("y", 500)
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

            } else if (view==="barsUrban"){

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
                
                const numZeros = d3.range(0, 400, 4)
                // console.log(numZeros)
                const numTwos = d3.range(1, 400, 4)
                // console.log(numTwos)
                const numThrees = d3.range(2, 400, 4)
                // console.log(numThrees)
                const numFours = d3.range(3, 400, 4)

                // const numZeros = d3.range(0, 100, 6)
                // // console.log(numZeros)
                // const numTwos = d3.range(1, 100, 6)
                // // console.log(numTwos)
                // const numThrees = d3.range(2, 100, 6)
                // // console.log(numThrees)
                // const numFours = d3.range(3, 100, 6)
                // const numFives = d3.range(4, 100, 6)
                // const numSix = d3.range(5, 100, 6)
    
                svg.selectAll(".AxisLAN").remove()
    
                circles.filter(d=>d.urbCategory===null)
                .transition()
               .duration(750)
               .ease(d3.easeLinear)
               .attr("cx", 200)
               .attr("cy", 500)
               .attr("opacity", 0)
    
                annot.filter(d=>d.urbCategory===null)
                .transition()
               .duration(750)
               .ease(d3.easeLinear)
               .attr("x", 200)
               .attr("y", 500)
               .attr("opacity", 0)
    
                circles.filter(d=>d.urbCategory!==null)//.on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))
    
                .transition()
                .delay((d, i) => {
                return i * Math.random() * 1.5;
                })
                .duration(800)
            //     .transition()
            //    .duration(750)
            //    .ease(d3.easeLinear)

                .attr("cx", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+60:
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+40:
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+20:
                                    scaleXurbCategory(d.urbCategory))
    
                .attr("cy", (d, i)=>
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3))

                // .attr("cx", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                //                     numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+100:
                //                     numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+80:
                //                     numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+60:
                //                     numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+40:
                //                     numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+20:
                //                     scaleXurbCategory(d.urbCategory))
    
                // .attr("cy", (d, i)=>
                //                     numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
                //                     numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
                //                     numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
                //                     numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3):
                //                     numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+4):
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+5))

               .attr("r", radius)
            //    .attr("opacity", d=>d.income!==null?1:0)
    
               annot.filter(d=>d.urbCategory!==null)//.filter(d=>d.category!=="#ccc").on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))
    
                .transition()
                .duration(750)
                .ease(d3.easeLinear)
                .attr("x", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+60:
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+40:
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleXurbCategory(d.urbCategory)+20:
                                    scaleXurbCategory(d.urbCategory))
    
                .attr("y", (d, i)=>
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3))

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
    
              }
        })
    }

    function renderChartUs(hex_la, ukUpd_tot) {//}, ukUpd_time, ukUrbRural) {

        const margin = ({ top: 20, right: 20, bottom: 20, left: 57.5})

        const marginTop = 5
        const marginBottom = 40
        const marginLeft = 100
        // const figScale = 2.1
        // const figWidth = width
        // const figHeight = height*figScale
        const figWidth = 850
        const scatterWidth = figWidth-100
        const figHeight = 540
        const radius = 4.3//10//9.8
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
                        .attr("width", figWidth)
                        .attr("height", figHeight+marginTop+marginBottom)
      
        const svg = grid
          .append("g")
        //   .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", [0, 0, figWidth, figHeight])
          // .style("overflow", "visible")
          .attr('transform', `translate(${0}, ${marginTop})`)
        
      
          // bivar settings
        colors = ["#e8e8e8", "#e4d9ac", "#c8b35a", "#cbb8d7", "#c8ada0", "#af8e53", "#9972af", "#976b82", "#804d36"]
        let dataBivar = Object.assign(new Map(ukUpd_tot.map(d=>[d.area_code, [d["workplaces_percent_change_from_baseline"], d["Total annual income (£)"]]])), {title: ["Travel to Work", "Med. Income"]})
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
              ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svgDraw`<circle r=${10} cx=${(i * k)+k/2} cy=${((n - 1 - j) * k)+k/2} fill=${colors[j * n + i]}>
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
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["Total annual income (£)"],
                
          mobilityWork: 
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]===undefined?null:
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["workplaces_percent_change_from_baseline"],
                                                  
          mobilityRes: 
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]===undefined?null:
                ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["residential_percent_change_from_baseline"],
          
          category: ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]===undefined? "#ccc": 
          ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["Total annual income (£)"] === null? "#ccc":
          ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["Total annual income (£)"] === undefined ? "#ccc":        
          colorBivar([ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["workplaces_percent_change_from_baseline"],ukUpd_tot.filter(c=>c.fullName === d.fullName)[0]["Total annual income (£)"]]),

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
        //   cluster data for dot clusters
        //   const clustered = hexes.map(d=>({...d, cluster: ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
        //                                                     ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === null? "#ccc":
        //                                                     ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === undefined ? "#ccc":        
        //                                                     colorBivar([d.mobilityWork, d.income])}))
                           
                                                        
        //   console.log(clustered)

        //   const clusterData = [hexes.sort((a, b)=>a.category-b.category).map((d, i) =>({ ...d, row: i})),
        //                        d3.rollups(hexes, v => v.length, d=>d.category).map(d=> { return {category: d[0], category_value: d[1]}}).filter(d=>d.category!=="#ccc")]
        
        //   variables for dot clusters bars
          const clusterData = d3.groups(hexes, v=>v.category).map(d=> { return {category: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}}).filter(d=>d.category!=="#ccc")

          console.log(clusterData)
          const categoriesX = ["#c8b35a", "#9972af", "#976b82", "#c8ada0", "#cbb8d7", "#af8e53", "#804d36", "#e4d9ac", "#e8e8e8"] 
          const categoryLabels = ["Low Income, High Travel", "High Income, Low Travel", "Mid. Income, Mid. Travel", "Mid. Income, High Travel", 
                                    "High Income, Mid. Travel", "Low Income, Mid. Travel", "Mid. Income, Low Travel", "Low Income, Low Travel", "High Income, High Travel"]  

         var sortOrder = ["#c8b35a", "#e4d9ac", "#af8e53", "#c8ada0", "#e8e8e8", "#cbb8d7", "#9972af", "#976b82", "#804d36"]  
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
                  return {urbCategory: d[0], data: d[1].sort(function(a, b) {
                    return sortOrder.indexOf(a.category) - sortOrder.indexOf(b.category);
                  })//.sort((a,b)=> d3.descending(a.category,b.category))
                    .map((c, i) =>({ ...c, row: i}))
                    }
                })
                // .map(d=>({...d, data: d.data.sort((a,b)=> d3.descending(a.category,b.category))}))

        //   const ruralData = d3.groups(ukUrbRural, v=>v.RUC11).map(d=> { return {urbCategory: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}})
        // const ruralData = d3.groups(hexes, v=>v.urbCategory).filter(d=>d[0]!==null).map(d=> { return {urbCategory: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}})

        //   console.log(ukUrbRural.filter(d=>d.LAD11CD==="E08000037"))

          console.log("rural", ruralData)
        //   console.log("ruralRaw", ukUrbRural)
          const urbCategoriesX = ruralData.sort((a,b)=>b.data.length-a.data.length).map(d=>d.urbCategory)
        //   urbCategoriesX.push("No Data")
        //   console.log(urbCategoriesX)
        //   const categoryLabels = ["Low Income, High Travel", "High Income, Low Travel", "Mid. Income, Mid. Travel", "Mid. Income, High Travel", 
        //                             "High Income, Mid. Travel", "Low Income, Mid. Travel", "Mid. Income, Low Travel", "Low Income, Low Travel", "High Income, High Travel"]                                                             
          const scaleXurbCategory = d3.scaleBand().domain(urbCategoriesX).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);  
        //   const scaleXCategoryLabels = d3.scaleBand().domain(categoryLabels).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);     
          const scaleYurb = d3.scaleLinear().domain([0, 1500]).range([figHeight- margin.bottom, 0]); 
        // const scaleYurb = d3.scaleLinear().domain([0, 140]).range([figHeight- margin.bottom, 0]); 

          
          
        //   ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svgDraw`<rect width=${k} height=${k} x=${i * k} y=${(n - 1 - j) * k} fill=${colors[j * n + i]}>
        //         <title>${dataBivar.title[0]}${labels[j] && ` (${labels[j]})`}
        //   ${dataBivar.title[1]}${labels[i] && ` (${labels[i]})`}</title>
        //       </rect>`)}

          /////////////////////UNCOMMENT

          grid.append(legendIndex)
          // .attr("transform", `translate(550, 500)`);
            .attr("transform", `translate(${figWidth*0.91},${figHeight*0.85})`);


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
                  .range([margin.bottom, figHeight - margin.top])
      
      
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
              .attr("cx", function(hex) {return xScaleHex(hex.x);})
              .attr("cy", function(hex) {return yScaleHex(hex.y);})
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

                                        circles.filter(c=>c.fullName===d.fullName)
                                            .attr("stroke-width", "1.5")
                                            .attr("r", radiusHover)
                                        
                                        // annot.filter(c=>c.key===d.key)
                                        // .attr("font-size", fontSize*2)
                                        // .style("text-transform", "uppercase")
                                        // .attr("font-weight", 700)
                                            // .raise()
                                        showTooltip(d, "", categoryLabels, categoriesX, "USA")
                                        // console.log(ukUpd_time.filter(c=>c.area_code===d.key)[0])
                                        // console.log(d)
                                        console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(c=>c.fullName===d.fullName)[0])
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
      
       
      
          // Add the hex codes as labels
        //   const annot = hexmap
        //       .append("text")
        //   .attr("x", function(hex) {return hex.x;})
        //   .attr("y", function(hex) {return hex.y+1;})
        //       // .append("tspan")
        //       .attr("text-anchor", "middle")
        //   .attr('class', 'LStextUK')
        //   .attr('font-size', fontSize)
        //   // .attr('font-size', 3*figScale)
        //   .attr('fill', 'rgb(255,255,255)')
        //   .attr("z-index", 10)
        //   .text(function(hex) {return hex.n.slice(0,3);})
        //   .attr("cursor", "pointer")
        //   .on("mouseover", function(event, d) { 
        //     //   d3.select(this)
        //     //     .attr("stroke-width", "1.5")
        //     //     .attr("r", radius*2)
        //     //     // .moveToFront()
        //     d3.select(this.parentNode).raise()
        //     //     // .attr("z-index", 1000)

        //     // console.log(d3.select(this.parentNode))
        //     //     .attr("font-size", fontSize*1.5)
        //     //     .attr("font-weight", 900)

        //     circles.filter(c=>c.key===d.key)
        //         .attr("stroke-width", "1.5")
        //         .attr("r", radiusHover)
            
        //     annot.filter(c=>c.key===d.key)
        //     .attr("font-size", fontSize*2)
        //     .style("text-transform", "uppercase")
        //     .attr("font-weight", 700)
        //     showTooltip(d, "", categoryLabels, categoriesX, "USA")
        //         // .raise()
        //     })
        //     .on("mouseleave", function(event, d) { 
        //             circles.filter(c=>c.key===d.key)
        //                     .attr("stroke-width", "0.5")
        //                     .attr("r", radius)
        //                     .moveToBack()

        //                 annot.filter(c=>c.key===d.key)
        //                 .attr("font-size", fontSize)
        //                 .style("text-transform", "capitalize")
        //                 .attr("font-weight", 500)
        //                     // .lower()
        //     })
        //   .on("mouseover", function(event, d) { 
        //     d3.select(this)
            //   .attr("font-size", fontSize*1.5)
            //   .attr("font-weight", 900)
        //       // .moveToFront()
        //     //   d3.select(this.parentNode).raise()
        //       // .attr("z-index", 1000)
        // })
        // .on("mouseleave", function(event, d) { 
        //     d3.select(this)
        //     .attr("font-size", fontSize)
        //     .attr("font-weight", 500)
        //                 // .lower()
        // });
      
      
        d3.select("#chartView").on("change", function(select){
          var view = d3.select("#chartView").node().value
          console.log(view)
      
          if (view==="chart") {

            svg.selectAll(".AxisLAN").remove()

            circles.filter(d=>d.category==="#ccc")//||d.mobilityWork===0
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
            .attr("cx", 200)
            .attr("cy", 200)
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
            //   .attr("transform", function(hex) {
                  // 	return "translate(" + (-hex.x) + "," + (-hex.y) + ")";
                  // })
            //   .attr("r", radius/1.5)
            //   .attr("opacity", d=>d.income!==null?1:0)
      
            // annot.filter(d=>d.category!=="#ccc")
            //    .transition()
            //   .duration(750)
            //   .ease(d3.easeLinear)
      
              .attr("x", d => xScaleInc(d[xVar]))
              .attr("y", d=> yScaleMob(d[yVar]))
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
            circles
               .transition()
              .duration(750)
              .ease(d3.easeLinear)
            //   .attr("transform", function(hex) {
                  // 	return "translate(" + hex.x + "," + hex.y + ")";
                  // })
              .attr("cx", function(hex) {return xScaleHex(hex.x);})
              .attr("cy", function(hex) {return yScaleHex(hex.y);})
              .attr("r", radius)
              .attr("opacity", 1)
      
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

            // console.log((circles.filter(d=>d.category==="#9972af")._groups[0].length/circles._groups[0].length*100).toFixed()+"%")

            const pctLH = (circles.filter(d=>d.category==="#e8e8e8")._groups[0].length/circles._groups[0].length*100).toFixed()+"%"
            console.log(pctLH)
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
           .attr("cy", 500)
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

            } else if (view==="barsUrban"){

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
                
                const numZeros = d3.range(0, 3000, 25)
                // console.log(numZeros)
                const numTwos = d3.range(1, 3000, 25)
                // console.log(numTwos)
                const numThrees = d3.range(2, 3000, 25)
                // console.log(numThrees)
                const numFours = d3.range(3, 3000, 25)
                const numFives = d3.range(4, 3000, 25)
                const numSix = d3.range(5, 3000, 25)
                const numSevens = d3.range(6, 3000, 25)
                const numEights = d3.range(7, 3000, 25)
                const numNines = d3.range(8, 3000, 25)
                const numTens = d3.range(9, 3000, 25)
                const numElevens = d3.range(10, 3000, 25)
                const numTwelves = d3.range(11, 3000, 25)
                const numThirteens = d3.range(12, 3000, 25)
                const numFourteens = d3.range(13, 3000, 25)
                const numFifteens = d3.range(14, 3000, 25)
                const numSixteens = d3.range(15, 3000, 25)
                const numSeventeens = d3.range(16, 3000, 25)
                const numEighteens = d3.range(17, 3000, 25)
                const numNineteens = d3.range(18, 3000, 25)
                const numTwenties = d3.range(19, 3000, 25)
                const numTwentyone = d3.range(20, 3000, 25)
                const numTwentytwo = d3.range(21, 3000, 25)
                const numTwentythree = d3.range(22, 3000, 25)
                const numTwentyfour = d3.range(23, 3000, 25)
                const numTwentyfive = d3.range(24, 3000, 25)
                // const numZeros = d3.range(0, 100, 6)
                // // console.log(numZeros)
                // const numTwos = d3.range(1, 100, 6)
                // // console.log(numTwos)
                // const numThrees = d3.range(2, 100, 6)
                // // console.log(numThrees)
                // const numFours = d3.range(3, 100, 6)
                // const numFives = d3.range(4, 100, 6)
                // const numSix = d3.range(5, 100, 6)
    
                svg.selectAll(".AxisLAN").remove()
    
                circles.filter(d=>d.urbCategory===null)
                .transition()
               .duration(750)
               .ease(d3.easeLinear)
               .attr("cx", 200)
               .attr("cy", 500)
               .attr("opacity", 0)
    
            //     annot.filter(d=>d.urbCategory===null)
            //     .transition()
            //    .duration(750)
            //    .ease(d3.easeLinear)
            //    .attr("x", 200)
            //    .attr("y", 500)
            //    .attr("opacity", 0)
    
                circles.filter(d=>d.urbCategory!==null)//.on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))
    
                // .transition()
                // .delay((d, i) => {
                // return i * Math.random() * 1.5;
                // })
                // .duration(800)
                .transition()
               .duration(750)
               .ease(d3.easeLinear)

                .attr("cx", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
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
                                    numTwentyfive.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row):
                                    numTwentyfour.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+1):
                                    numTwentythree.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+2):
                                    numTwentytwo.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+3):
                                    numTwentyone.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+4):
                                    numTwenties.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+5):
                                    numNineteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+6):
                                    numEighteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+7):
                                    numSeventeens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+8):
                                    numSixteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+9):
                                    numFifteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+10):
                                    numFourteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+11):
                                    numThirteens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+12):
                                    numTwelves.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+13):
                                    numElevens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+14):
                                    numTens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+15):
                                    numNines.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+16):
                                    numEights.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+17):
                                    numSevens.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+18):
                                    numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+19):
                                    numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+20):
                                    numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+21):
                                    numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+22):
                                    numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row)?
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+23):
                                    scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.fullName===d.fullName)[0].row+24))

                // .attr("cx", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
                //                     numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+100:
                //                     numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+80:
                //                     numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+60:
                //                     numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+40:
                //                     numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleXurbCategory(d.urbCategory)+20:
                //                     scaleXurbCategory(d.urbCategory))
    
                // .attr("cy", (d, i)=>
                //                     numSix.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
                //                     numFives.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
                //                     numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
                //                     numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3):
                //                     numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+4):
                //                     scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+5))

               .attr("r", radius)
            //    .attr("opacity", d=>d.income!==null?1:0)
    
            //    annot.filter(d=>d.urbCategory!==null)//.filter(d=>d.category!=="#ccc").on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))
    
            //     .transition()
            //     .duration(750)
            //     .ease(d3.easeLinear)
            //     .attr("x", (d, i)=> //console.log(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0]))
            //                         numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
            //                         scaleXurbCategory(d.urbCategory)+60:
            //                         numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
            //                         scaleXurbCategory(d.urbCategory)+40:
            //                         numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
            //                         scaleXurbCategory(d.urbCategory)+20:
            //                         scaleXurbCategory(d.urbCategory))
    
            //     .attr("y", (d, i)=>
            //                         numFours.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
            //                         scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row):
            //                         numThrees.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
            //                         scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+1):
            //                         numTwos.includes(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row)?
            //                         scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+2):
            //                         scaleYurb(ruralData.filter(c=>c.urbCategory===d.urbCategory)[0].data.filter(e=>e.LAD11CD===d.key)[0].row+3))

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
    
              }
        })
    }

    function showTooltip(data, dataTime, categoryLabels, categoriesX, country) {
        // console.log(data, dataTime)
        d3.select("#staticTooltip")
          .selectAll("html").remove()


        d3.select("#staticTooltip")
          .append("html")
          .html(`During the COVID-19 Pandemic, residents of the <strong class="rich" style="background-color:${data.category}">${categoryLabels[categoriesX.indexOf(data.category)].split(",")[0]}</strong> locality of <strong>${country==="UK"?data.n: data.fullName}</strong>, traveled to work <strong class="rich" style="background-color:${data.category}">${data.mobilityWork*-1}% less</strong> than in 2019.`)

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
          // … a parent of a single child? Detach and return the child.
          // … a document fragment? Replace the fragment with an element.
          // … some other node? Return it.
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
