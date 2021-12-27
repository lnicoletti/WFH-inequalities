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
        const xVar = "mobilityRes"
        const xVarLabel = "Average Change in Work From Home Households Since Feb. 2020"
        const yVarLabel = "Average Change in People Going to Workplaces Since Feb. 2020"
        // const grid = d3.select(DOM.svg(figWidth, figHeight+marginTop+marginBottom));
        const grid = d3.select("#chart")
                        .append("svg")
                        .attr("width", figWidth)
                        .attr("height", figHeight+marginTop+marginBottom)
      
        const svg = grid
          .append("g")
          .attr("viewBox", [0, 0, figWidth, figHeight])
          // .style("overflow", "visible")
          .attr('transform', `translate(${0}, ${marginTop})`)
        
      
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
                ukUpd_tot.filter(c=>c.area_code===d.key)[0]["residential_percent_change_from_baseline"]
                                                                            }))
        
        // bivar settings
        colors = ["#e8e8e8", "#e4d9ac", "#c8b35a", "#cbb8d7", "#c8ada0", "#af8e53", "#9972af", "#976b82", "#804d36"]
        let dataBivar = Object.assign(new Map(ukUpd_tot.map(d=>[d.area_code, [d["workplaces_percent_change_from_baseline"], d["Total annual income (£)"]]])), {title: ["Travel to Work", "Med. Income"]})
        n = Math.floor(Math.sqrt(colors.length))
        yBivar = d3.scaleQuantile(Array.from(dataBivar.values(), d => d[1]), d3.range(n))
        xBivar = d3.scaleQuantile(Array.from(dataBivar.values(), d => d[0]), d3.range(n))
        labels = ["low", "", "high"]
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
              ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svgDraw`<rect width=${k} height=${k} x=${i * k} y=${(n - 1 - j) * k} fill=${colors[j * n + i]}>
                <title>${dataBivar.title[0]}${labels[j] && ` (${labels[j]})`}
          ${dataBivar.title[1]}${labels[i] && ` (${labels[i]})`}</title>
              </rect>`)}
              <line marker-end="url(#arrow)" x1=0 x2=${n * k} y1=${n * k} y2=${n * k} stroke=black stroke-width=1.5 />
              <line marker-end="url(#arrow)" y2=0 y1=${n * k} stroke=black stroke-width=1.5 />
              <text font-weight="bold" dy="0.71em" transform="rotate(90) translate(${n / 2 * k},6)" text-anchor="middle">${dataBivar.title[0]}</text>
              <text font-weight="bold" dy="0.71em" transform="translate(${n / 2 * k},${n * k + 6})" text-anchor="middle">${dataBivar.title[1]}</text>
            </g>
          </g>`;
          }

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
              .attr("x", scatterWidth - margin.right)
              .attr("y", 30)
              .attr("fill", "#000")
              .attr("font-weight", "bold")
              .attr("text-anchor", "end")
              .text(xVarLabel))
      
      
        const yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(yScaleMob))
          .call(g => g.select(".domain").remove())
          .call(g => g.select(".tick:last-of-type text").clone()
              .attr("x", 4)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .text(yVarLabel))
        
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
          .on("mouseover", function(event, d) { 
                                          d3.select(this)
                                            .attr("stroke-width", "1.5")
                                            // .raise()
          })
          .on("mouseleave", function(event, d) { 
                                          d3.select(this)
                                            .attr("stroke-width", "0.5")
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
          .attr("y", function(hex) {return hex.y;})
              // .append("tspan")
              .attr("text-anchor", "middle")
          .attr('class', 'LStextUK')
          .attr('font-size', fontSize)
          // .attr('font-size', 3*figScale)
          .attr('fill', 'rgb(255,255,255)')
          .attr("z-index", 10)
              .text(function(hex) {return hex.n.slice(0,3);});
      
      
        d3.select("#chartView").on("change", function(select){
          var view = d3.select("#chartView").node().value
          console.log(view)
      
          if (view==="chart") {
      
            circles
              .transition()
              .duration(750)
              .ease(d3.easeLinear)
      
              .attr("cx", d => xScaleInc(d[xVar]))
              .attr("cy", d=> yScaleMob(d[yVar]))
            //   .attr("transform", function(hex) {
                  // 	return "translate(" + (-hex.x) + "," + (-hex.y) + ")";
                  // })
              .attr("r", radius/1.5)
              .attr("opacity", d=>d.income!==null?1:0)
      
            annot
               .transition()
              .duration(750)
              .ease(d3.easeLinear)
      
              .attr("cx", d => xScaleInc(d[xVar]))
              .attr("cy", d=> yScaleMob(d[yVar]))
              .attr("opacity", 0)
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
          }
        })
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
