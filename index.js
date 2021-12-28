// d3 = require('d3', "d3-hexjson")

Promise.all([
    d3.json("https://raw.githubusercontent.com/odileeds/hexmaps/gh-pages/maps/uk-local-authority-districts-2021.hexjson"),
    d3.json("https://gist.githubusercontent.com/lnicoletti/ea975f97ccfec28619ed0ba71d598b4e/raw/6b74e733aadcbb70aee2a5f2939b954ddf2059b0/ukUpd_tot.json")
    ]).then((datasets) => {

    let hex_la = datasets[0]
    let ukUpd_tot = datasets[1]

    renderChart(hex_la, ukUpd_tot)
    // renderLegend()
    })

    var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];
        // console.log(fullTxt.split(" "))
        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        // console.log(this.txt)
        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
        
        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        setTimeout(function() {
        that.tick();
        }, delta);
    };

    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
        document.body.appendChild(css);
    };

    function renderChart(hex_la, ukUpd_tot) {

        const margin = ({ top: 20, right: 20, bottom: 20, left: 57.5})

        const marginTop = 0
        const marginBottom = 40
        const marginLeft = 100
        // const figScale = 2.1
        // const figWidth = width
        // const figHeight = height*figScale
        const figWidth = 850
        const scatterWidth = figWidth-100
        const figHeight = 600
        const radius = 10//9.8
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
            const k = 70/n;
            // const arrow = 1;
            //font-family=sans-serif
            // <g transform="translate(-${k * n / 2},-${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})">
            return svgDraw`<g class="legend">
            
              <marker id="arrow" markerHeight=10 markerWidth=10 refX=3 refY=3 orient=auto>
                <path d="M0,0L6,3L0,6Z" />
              </marker>
              ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svgDraw`<circle r=${k/2} cx=${(i * k)+k/2} cy=${((n - 1 - j) * k)+k/2} fill=${colors[j * n + i]}>
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
          colorBivar([ukUpd_tot.filter(c=>c.area_code===d.key)[0]["workplaces_percent_change_from_baseline"], ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"]]) 
                                                                            }))//.sort((a, b)=>a.category-b.category).map((d, i) =>({ ...d, row: i}))
        
        

        //   cluster data for dot clusters
        //   const clustered = hexes.map(d=>({...d, cluster: ukUpd_tot.filter(c=>c.area_code===d.key)[0] === undefined ? "#ccc": 
        //                                                     ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === null? "#ccc":
        //                                                     ukUpd_tot.filter(c=>c.area_code===d.key)[0]["Total annual income (£)"] === undefined ? "#ccc":        
        //                                                     colorBivar([d.mobilityWork, d.income])}))
                           
                                                        
        //   console.log(clustered)

        //   const clusterData = [hexes.sort((a, b)=>a.category-b.category).map((d, i) =>({ ...d, row: i})),
        //                        d3.rollups(hexes, v => v.length, d=>d.category).map(d=> { return {category: d[0], category_value: d[1]}}).filter(d=>d.category!=="#ccc")]

          const clusterData = d3.groups(hexes, v=>v.category).map(d=> { return {category: d[0], data: d[1].map((c, i) =>({ ...c, row: i}))}}).filter(d=>d.category!=="#ccc")

          console.log(clusterData)
        //   scales for dot clusters
          const categoriesX = ["#c8b35a", "#9972af", "#c8ada0", "#976b82", "#cbb8d7", "#af8e53", "#e4d9ac", "#e8e8e8", "#804d36"] 
          const categoryLabels = ["High Income, Low Travel", "Low Income, High Travel", "Mid. Income, Mid. Travel", "Mid. Income, High Travel", 
                                    "Low Income, Mid. Travel", "High Income, Mid. Travel", "Mid. Income, Low Travel", "Low Income, Low Travel", "High Income, High Travel"]                                                             
          const scaleXCategory = d3.scaleBand().domain(categoriesX).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);  
          const scaleXCategoryLabels = d3.scaleBand().domain(categoryLabels).range([margin.left, scatterWidth - margin.right]).paddingInner([0.4]);     
          const scaleY = d3.scaleLinear().domain([0, 85]).range([figHeight- margin.bottom, 0]); 
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
              .attr("stroke", "white")
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
                                            .attr("r", radius*2)
                                        
                                        annot.filter(c=>c.key===d.key)
                                        .attr("font-size", fontSize*2)
                                        .style("text-transform", "uppercase")
                                        .attr("font-weight", 700)
                                            // .raise()

                                        console.log(d)
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
                .attr("r", radius*2)
            
            annot.filter(c=>c.key===d.key)
            .attr("font-size", fontSize*2)
            .style("text-transform", "uppercase")
            .attr("font-weight", 700)
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
            .attr("cx", -100)
            .attr("cy", -100)
            .attr("opacity", 0)

            annot.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
            .attr("x", -100)
            .attr("y", -100)
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
            .attr("cx", -100)
            .attr("cy", -100)
            .attr("opacity", 0)

            annot.filter(d=>d.category==="#ccc")
            .transition()
           .duration(750)
           .ease(d3.easeLinear)
            .attr("x", -100)
            .attr("y", -100)
            .attr("opacity", 0)

            circles.filter(d=>d.category!=="#ccc")//.on("click", (event, d)=>console.log(clusterData.filter(c=>c.category===d.category)[0].data.filter(e=>e.key===d.key)[0].row))

            .transition()
           .duration(750)
           .ease(d3.easeLinear)
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

          }
        })
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
