import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {FilterService} from "../../services/filter.service";
import {Filter, allCharacters} from "../../models/filter.model";
import {sentiment_BL} from "./relationship_data";

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.scss']
})

export class RelationshipComponent implements OnInit {


  filter: Filter;
  sentimentData: any[];

    private margin = {top: 20, right: 20, bottom: 50, left: 20};
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    private line: d3.line<[number, number]>; // this is line definition
    private counter = 0;


  isOneWayOnly: boolean = true;


  @ViewChild('relationship')
  svgContainer: ElementRef;
  relationshipSvg: any;
  margin: any;
  width: number;
  height: number;

  constructor(private filterService: FilterService) {
    filterService.filter$.subscribe((newFilter) => {
      this.filter = newFilter;
      this.refreshGraphs();
    });
  }

  ngOnInit() {
    this.refreshGraphs();
  }

  onResize() {
    this.refreshGraphs();
  }

  clearSentimentIfNoEngagement(pair): any {
    for (let scene of pair) {
      if (scene.speech_dist == 0) {
        scene.sentiment_value = 0;
      }
    }
    return pair;

    handleScnSelection(e) {
    
    var lexicon = "AFINN";
    if (e.target.checked) {
      var selectedRlt = e.target.id;
      console.log(selectedRlt);
      var ind = selectedRlt.indexOf("-");
      var A = selectedRlt.slice(0, ind);
      var B = selectedRlt.slice(ind+1);
      this.buildSvg('#svg1', A, B, lexicon, this.counter);
      this.counter = this.counter+1; 
    }
    
  }

  constructor() { 
      // configure margins and width/height of the graph
   this.width = 350 - this.margin.left - this.margin.right;
   this.height = 200 - this.margin.top - this.margin.bottom;}

  ngOnInit() {}

  ngAfterContentInit() {
      

  }

  resetVisitedData() {
    for (let key in sentiment_BL) {
      let value = sentiment_BL[key];
      value.visited = false;
    }
  }


  processSentimentData(): any[] {
    let characterPairList = [];
    for (let key in sentiment_BL) {
      let characterPair = [];

      let value = sentiment_BL[key];
      if (!value.visited) {
        let characters = key.split('-');
        let otherKey = characters[1].concat('-', characters[0]);

        value = this.clearSentimentIfNoEngagement(value);
        if (sentiment_BL.hasOwnProperty(otherKey)) {
          let otherValue = sentiment_BL[otherKey];
          otherValue = this.clearSentimentIfNoEngagement(otherValue);
          characterPair.push({id: key, data: value}, {id: otherKey, data: otherValue});
          otherValue.visited = true;
        } else {
          characterPair.push({id: key, data: value}, {id: "null", data: []});
        }
        characterPairList.push(characterPair);
        value.visited = true;
      }

    private buildSvg(svgID, A, B, lexicon, i) {
        
        this.readData(A, B, lexicon);

        var y = i * 200;
        this.svg = d3.select(svgID).append("rect")
            .attr("x", 0)
            .attr("y", y)
            .attr("width", 350)
            .attr("height", 200)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr("id", A+"-"+B)
            .on("click", this.removeGraph(A+"-"+B));

        var top = this.margin.top + y;
        this.svg = d3.select(svgID).append('g')
            .attr('class', 'line-and-dots')
            .attr('transform', 'translate(' + this.margin.left + ',' + top + ')');

        this.addXandYAxis();
        this.drawLineAndPath(this.sentimentAB, 'blue', 'circle');
        this.drawLineAndPath(this.sentimentBA, 'red', 'rect');
        this.addLegend(A, B);

    }
    return characterPairList;
  }


  filterSentimentData(dataToBeFiltered): any[] {
    let filteredData = dataToBeFiltered;
    if (this.isOneWayOnly == true) {
      filteredData = filteredData.filter((d) => {
        return (d[0].data.length != 0) && (d[1].data.length != 0);
      });

    private removeGraph(id) {
        d3.select(id).exit().remove();
    }

    private addXandYAxis() {
         // range of data configuring
         this.x = d3.scaleLinear().range([0, this.width]);
         this.y = d3.scaleLinear().range([this.height, 0]);
         this.x.domain(d3.extent(this.sentimentAB.concat(this.sentimentBA), (d) => d.scene ));
         this.y.domain(d3.extent(this.sentimentAB.concat(this.sentimentBA), (d) => d.sentiment_value ));

        // Configure the X Axis
        this.svg.append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .attr('class', 'axis axis--x')
            .call(d3.axisBottom(this.x));

        // Configure the Y Axis
        this.svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(this.y));

    }

    let processedSelectedScenes: number[] = this.filter.selectedScenes.map((scene) => {
      if (scene == "a1s1") return 1;
      else if (scene == "a1s2") return 2;
      else if (scene == "a2s1") return 3;
      else if (scene == "a2s2") return 4;
      else if (scene == "a3s1") return 5;
      else if (scene == "a3s2") return 6;
      else if (scene == "a4s1") return 7;
      else if (scene == "a4s2") return 8;
      else if (scene == "a5s1") return 9;
    });

    // Filter by the sidebar filter.
    // Two things to check: the selectedScenes and the selectedCharacterTypes.
    let finalFilteredData = [];
    if (this.filter.selectedScenes.length == 0) {
      finalFilteredData = [];
    } else if (this.filter.selectedScenes.length != 9) {
      for (let pair of filteredData) {
        let pair1 = pair[0];
        let pair2 = pair[1];

        let nullCheck1 = pair1.data == null || pair1.data.length == 0;
        let nullCheck2 = pair2.data == null || pair2.data.length == 0;

        let toBeFilteredOut = true;
        for (let scene of processedSelectedScenes) {
          let speechCheck1 = true;
          let speechCheck2 = true;
          if (!nullCheck1) {
            speechCheck1 = pair1.data[scene-1].speech_dist == 0;
          }
          if (!nullCheck2) {
            speechCheck2 = pair2.data[scene-1].speech_dist == 0;
          }
          if (!(speechCheck1 && speechCheck2)) {
            toBeFilteredOut = false;
            break;
          }
        }
        if (toBeFilteredOut == false) {
          finalFilteredData.push(pair);
        }
      }
    } else {
      finalFilteredData = filteredData;
    }

    if (this.filter.selectedCharacterTypes.length == 0) {
      finalFilteredData = [];
    } else if (this.filter.selectedCharacterTypes.length != 4) {
      finalFilteredData = finalFilteredData.filter((pair) => {
        let pair1 = pair[0];
        let charList = pair1.id.split("-");
        let char1 = charList[0];
        let char2 = charList[1];

        let check1 = false;
        let check2 = false;
        allCharacters.forEach((char) => {
          if (char.id.toUpperCase() === char1) {
            console.log("match!");
            console.log(this.filter.selectedCharacterTypes);
            console.log(char.type);
            if (this.filter.selectedCharacterTypes.includes(char.type)) {
              check1 = true;
            }
          }
          if (char.id.toUpperCase() === char2) {
            if (this.filter.selectedCharacterTypes.includes(char.type)) {
              check2 = true;
            }
          }
        });
        return check1 || check2;
      });
    }

    return finalFilteredData;
  }

  sortSentimentData(dataToBeSorted) {
    dataToBeSorted.sort((a, b): number => {
      let aTotal: number = 0;
      if (!(a[0].data == null || a[0].data.length == 0)) {
        for (let d of a[0].data) {
          aTotal += Math.abs(d.sentiment_value);
        }
      }
      if (!(a[1].data == null || a[1].data.length == 0)) {
        for (let d of a[1].data) {
          aTotal += Math.abs(d.sentiment_value);
        }
      }
      let bTotal: number = 0;
      if (!(b[0].data == null || b[0].data.length == 0)) {
        for (let d of b[0].data) {
          bTotal += Math.abs(d.sentiment_value);
        }
      }
      if (!(b[1].data == null || b[1].data.length == 0)) {
        for (let d of b[1].data) {
          bTotal += Math.abs(d.sentiment_value);
        }
      }
      a[0].total = aTotal;
      a[1].total = aTotal;
      b[0].total = bTotal;
      b[1].total = bTotal;
      if (aTotal > bTotal) return -1;
      if (aTotal < bTotal) return 1;
      else return 0;
    });
  }

  buildSvg(finalData) {
    d3.select('#relationship-viz svg').remove();

    this.margin = {top: 15, right: 10, bottom: 10, left: 25};
    this.width = this.svgContainer.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = (this.svgContainer.nativeElement.parentElement.offsetHeight / (3.5)) - this.margin.top - this.margin.bottom - 100;
    // const fullHeight = this.svgContainer.nativeElement.parentElement.offsetHeight - this.margin.top - this.margin.bottom - 100;

    const that = this;
    const minSentiment = -15;
    const maxSentiment = 15;

    const widthDivider = 2.25;


    this.relationshipSvg = d3.select('#relationship-viz').selectAll('svg');

    private mouseover = function(d) {
          var g = d3.select(this); // The node
          // The class is used to remove the additional text later
          var info = g.append('text')
             .classed('info', true)
             .attr('x', 20)
             .attr('y', 10)
             .text(d);
      };

    private mouseout = function() {
          // Remove the info text on mouse out.
          d3.select(this).select('text.info').remove()
      };

    private drawLineAndPath(data, color, shape) {
        this.line = d3.line()
            .x( (d: any) => this.x(d.scene) )
            .y( (d: any) => this.y(d.sentiment_value) );

        // Configuring line path
        this.svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', this.line)
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Data dots
        if (shape == 'circle') {
          this.svg.append('g')
              .selectAll("points")
              .data(data)
              .enter()
              .append(shape)
              .attr("class", "points")
              .on("mouseover", this.mouseover)
              .on("mouseout", this.mouseout)
              .attr("r", (d: any) => this.computePointSize(d.speech_dist))
              .attr("cx", (d: any) => this.x(d.scene))
              .attr("cy", (d: any) => this.y(d.sentiment_value) )
              .attr('fill', color)
              .attr('stroke', 'none');

    this.relationshipSvg.data(finalData, function(d) { return d[0].id + d[1].id; })
      .enter().append('svg')
      .attr('width', (this.width / widthDivider) + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      .each(function(perSentimentData) {
        const svg = d3.select(this);

        const xScene = d3.scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9]).rangeRound([0, that.width / widthDivider], .5);
        const xCharacter = d3.scaleBand().domain(d3.range(2)).range([2, xScene.bandwidth() - 2]);
        const y = d3.scaleLinear().domain([minSentiment, maxSentiment]).range([that.height, 0]);

        const xAxisTop = d3.axisTop().scale(xScene);
        const xAxisBottom = d3.axisBottom().scale(xScene);
        const yAxis = d3.axisLeft().scale(y).ticks(2);
        yAxis.tickValues(y.ticks(2).concat(y.domain()));
        const z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6"]);

        const chars1 = perSentimentData[0].id.split("-");
        const chars2 = perSentimentData[1].id.split("-");
        if (chars2[0] && chars2[1]) {
          // Totals (for debugging):
          // svg.append("text")
          //   .attr("x", -5)
          //   .attr("y", -9)
          //   .text(perSentimentData[0].total)
          //   .style("font-size", "10px")
          //   .attr("alignment-baseline","middle")
          //   .attr("text-anchor","middle");

          svg.append("text")
            .attr("x", (that.width / widthDivider) / 2)
            .attr("y", -9)
            .text(chars1[0] + " <--> " + chars1[1])
            .style("font-size", "10px")
            .attr("alignment-baseline","middle")
            .attr("text-anchor","middle");

          svg.append("rect")
            .attr("x", 4)
            .attr("y", -15)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "#98abc5")
            .attr("stroke", "black")
            .attr("stroke-width", "0.5px");

          svg.append("rect")
            .attr("x", (that.width / widthDivider) - 10)
            .attr("y", -15)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "#8a89a6")
            .attr("stroke", "black")
            .attr("stroke-width", "0.5px");
        } else {
          svg.append("text")
            .attr("x", (that.width / widthDivider) / 2)
            .attr("y", -9)
            .text(chars1[0] + " --> " + chars1[1])
            .style("font-size", "10px")
            .attr("alignment-baseline","middle")
            .attr("text-anchor","middle");

          svg.append("rect")
            .attr("x", 4)
            .attr("y", -15)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "#98abc5")
            .attr("stroke", "black")
            .attr("stroke-width", "0.5px");
        }


        // Add all vertical reference lines
        for (let x = 0; x < 9; x+=1) {
          let pair1 = perSentimentData[0].data[x];
          let pair2 = perSentimentData[1].data[x];
          if ((!pair1 || pair1.speech_dist == 0) && (!pair2 || pair2.speech_dist == 0)) {
            svg.append("rect")
              .attr("x", xScene(x+1))
              .attr("width", xScene.bandwidth())
              .attr("height", that.height + "px")
              .attr("fill", "rgb(220, 220, 220, 0.3)");
          } else {
            svg.append("rect")
              .attr("x", xScene(x+1))
              .attr("width", xScene.bandwidth())
              .attr("height", that.height + "px")
              .attr("fill", "white");
          }

          if (x == 8) continue;
          svg.append("svg:line")
            .attr("x1", xScene(x+2))
            .attr("y1", 0)
            .attr("x2", xScene(x+2))
            .attr("y2", that.height)
            .style("stroke", "rgb(170, 170, 170, 0.3)")
            .style("stroke-width", "1px")
            .style("stroke-dasharray", "4")
            .style("fill", "none");

        else {
          this.svg.append('g')
              .selectAll("points")
              .data(data)
              .enter()
              .append(shape)
              .attr("class", "points")
              .on("mouseover", (d: any) => this.mouseover(d.sentiment_value))
              .on("mouseout", this.mouseout)
              .attr("x", (d: any) => this.x(d.scene)-this.computePointSize(d.speech_dist))
              .attr("y", (d: any) => this.y(d.sentiment_value)-this.computePointSize(d.speech_dist))
              .attr("width", (d: any) => 2*this.computePointSize(d.speech_dist))
              .attr("height", (d: any) => 2*this.computePointSize(d.speech_dist))
              .attr('fill', color)
              .attr('stroke', 'none');

        }

        // Add 0-horizontal reference line
        svg.append("svg:line")
          .attr("x1", 0)
          .attr("y1", y(0))
          .attr("x2", that.width / widthDivider)
          .attr("y2", y(0))
          .style("stroke", "rgb(170, 170, 170, 0.8)")
          .style("stroke-width", "1px")
          .style("fill", "none");

        // Add the x axis (top)
        // svg.append('g')
        //   .attr('class', 'x axis')
        //   .attr('transform', `translate(0,0)`)
        //   .call(this.properties.xAxisTop);

        // Add the x axis (bottom)
        // svg.append('g')
        //   .attr('transform', `translate(0,${that.height})`)
        //   .call(xAxisBottom);

        // Add the y axis
        svg.append('g')
          .attr('class', 'y axis')
          .attr('transform', `translate(0,-0.75)`)
          .call(yAxis);


        // Add bounding rectangle
        svg.append("rect")
          .attr("x", 0.5)
          .attr("y", -1)
          .attr("width", that.width / widthDivider - 1)
          .attr("height", that.height + 1)
          .attr("fill", "none")
          .attr("stroke", "rgb(0, 0, 0, 0.8)")
          .attr("stroke-width", "1px");


        svg.append('g').selectAll('g')
          .data(perSentimentData)
          .enter().append('g')
          .style('fill', (d, i) => z(i))
          .attr('transform', (d, i) => {
            return "translate(" + xCharacter(i) + ",0)";
          })
          .selectAll('rect')
          .data((d) => d.data)
          .enter().append('rect')
          .attr("width", xCharacter.bandwidth())
          .attr("height", (d) => {
            let zeroValue = y(0);
            let scaledHeight = y(d.sentiment_value);
            let result = zeroValue - scaledHeight;
            if (result < 0) {
              return -result;
            }
            return result;
          })
          .attr("x", (d, i) => { return xScene(i + 1); })
          .attr("y", (d) => {
            if (d.sentiment_value < 0) {
              return y(0);
            }
            return y(d.sentiment_value);
          });
      });

    this.relationshipSvg.data(finalData, function(d) { return d[0].id + d[1].id; }).exit().remove();
  }

  refreshGraphs() {
    this.resetVisitedData();
    this.sentimentData = [];
    this.sentimentData = this.processSentimentData();
    let filteredData = this.filterSentimentData(this.sentimentData);
    this.sortSentimentData(filteredData);
    this.buildSvg(filteredData);
  }
}
