import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {FilterService} from "../../services/filter.service";
import {Filter} from "../../models/filter.model";
import {sentiment_AFINN} from "./relationship_data";
import {buildMonth} from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-tools";

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.scss']
})

export class RelationshipComponent implements OnInit {

  filter: Filter;

  sentimentData: any[];

  @ViewChild('relationship')
  svgContainer: ElementRef;
  properties: any;

  constructor(private filterService: FilterService) {
    filterService.filter$.subscribe((newFilter) => {
      this.filter = newFilter;
    });
  }

  ngOnInit() {
    this.sentimentData = this.processSentimentData();

    for (let sd of this.sentimentData) {
      console.log(sd[0].id + " | " + sd[1].id);
    }
    // console.log(this.sentimentData[10]);
    this.buildSvg();
  }

  clearSentimentIfNoEngagement(pair): any {
    for (let scene of pair) {
      if (scene.speech_dist == 0) {
        scene.sentiment_value = 0;
      }
    }
    return pair;
  }

  processSentimentData(): any[] {
    let characterPairList = [];
    for (let key in sentiment_AFINN) {
      let characterPair = [];

      let value = sentiment_AFINN[key];
      if (!value.visited) {
        let characters = key.split('-');
        let otherKey = characters[1].concat('-', characters[0]);

        value = this.clearSentimentIfNoEngagement(value);
        if (sentiment_AFINN.hasOwnProperty(otherKey)) {
          let otherValue = sentiment_AFINN[otherKey];
          otherValue = this.clearSentimentIfNoEngagement(otherValue);
          characterPair.push({id: key, data: value}, {id: otherKey, data: otherValue});
          otherValue.visited = true;
        } else {
          characterPair.push({id: key, data: value}, {id: "null", data: []});
        }

        characterPairList.push(characterPair);
        value.visited = true;
      }
    }
    return characterPairList;
  }

  onResize() {
    this.buildSvg();
  }

  margin = {top: 20, right: 10, bottom: 20, left: 30};
  width: number;
  height: number;

  buildSvg() {
    d3.select('#relationship-viz svg').remove();

    this.width = this.svgContainer.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = (this.svgContainer.nativeElement.parentElement.offsetHeight / (3.5)) - this.margin.top - this.margin.bottom - 100;
    // const fullHeight = this.svgContainer.nativeElement.parentElement.offsetHeight - this.margin.top - this.margin.bottom - 100;

    // var svg = d3.select("body").selectAll("svg")
    //   .data(symbols)
    //   .enter().append("svg")
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //   .each(multiple);

    const that = this;
    const minSentiment = -36;
    const maxSentiment = 36;

    const svg = d3.select('#relationship-viz').selectAll('svg')
      .data(this.sentimentData)
      .enter().append('svg')
      .attr('width', (this.width / 2.25) + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      .each(function(perSentimentData) {
        const svg = d3.select(this);

        const xScene = d3.scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9]).rangeRound([0, that.width / 2.25], .2);
        const xCharacter = d3.scaleBand().domain(d3.range(2)).range([0, xScene.bandwidth() - 5]);
        const y = d3.scaleLinear().domain([minSentiment, maxSentiment]).range([that.height, 0]);

        const xAxisTop = d3.axisTop().scale(xScene);
        const xAxisBottom = d3.axisBottom().scale(xScene);
        const yAxis = d3.axisLeft().scale(y).ticks(2);

        yAxis.tickValues(y.ticks(2).concat(y.domain()));

        // Background color
        // svg.append("rect")
        //   .attr("width", "100%")
        //   .attr("height", "100%")
        //   .attr("fill", "white");

        let z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6"]);

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

        // Add 0-horizontal reference line
        svg.append("svg:line")
          .attr("x1", 0)
          .attr("y1", y(0))
          .attr("x2", that.width / 2.25)
          .attr("y2", y(0))
          .style("stroke", "rgb(170, 170, 170, 0.5)")
          .style("stroke-width", "1px")
          .style("fill", "none");

        // Add the x axis (top)
        // svg.append('g')
        //   .attr('class', 'x axis')
        //   .attr('transform', `translate(0,0)`)
        //   .call(this.properties.xAxisTop);

        // Add the x axis (bottom)
        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', `translate(0,${that.height})`)
          .call(xAxisBottom);

        // Add the y axis
        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);
      });
  }

  updateSvg() {
    // this.properties.svg.transition();

  }

  // constructor() {
  //     // configure margins and width/height of the graph
  //
  //  this.width = 350 - this.margin.left - this.margin.right;
  //  this.height = 200 - this.margin.top - this.margin.bottom;
  // }
  //
  // ngOnInit() {
  //       var A = "THESEUS";
  //       var B = "HIPPOLYTA";
  //       var lexicon = "AFINN";
  //       this.readData(A, B, lexicon);
  //       this.buildSvg('#svg1', A, B);
  //
  //       A = "LYSANDER";
  //       B = "HERMIA";
  //       this.readData(A, B, lexicon);
  //       this.buildSvg('#svg2', A, B);
  // }

  // title = 'Line Chart';
  //
  // private margin = {top: 20, right: 20, bottom: 50, left: 20};
  // private width: number;
  // private height: number;
  // private x: any;
  // private y: any;
  // private svg: any;
  // private line: d3.line<[number, number]>; // this is line definition
  //
  // sentimentAB: any;
  // sentimentBA: any;

    // private readData(A, B, lexicon) {
    //     if (lexicon == "AFINN") {
    //         this.sentimentAB = sentiment_AFINN[A+'-'+B];
    //         this.sentimentBA = sentiment_AFINN[B+'-'+A];
    //     }
    //     else {
    //         this.sentimentAB = sentiment_BL[A+'-'+B];
    //         this.sentimentBA = sentiment_BL[B+'-'+A];
    //     }
    // }
    //
    // private buildSvg(svgID, A, B) {
    //     d3.select(svgID).append("rect")
    //         .attr("x", 0)
    //         .attr("y", 0)
    //         .attr("width", 350)
    //         .attr("height", 200)
    //         .attr("stroke", "black")
    //         .attr("stroke-width", 1)
    //         .attr("fill", "none");
    //
    //     this.svg = d3.select(svgID)
    //         .append('g')
    //         .attr('class', 'line-and-dots')
    //         .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    //
    //     this.addXandYAxis();
    //     this.drawLineAndPath(this.sentimentAB, 'blue', 'circle');
    //     this.drawLineAndPath(this.sentimentBA, 'red', 'rect');
    //     this.addLegend(A, B);
    // }
    //
    // private addXandYAxis() {
    //      // range of data configuring
    //      this.x = d3.scaleLinear().range([0, this.width]);
    //      this.y = d3.scaleLinear().range([this.height, 0]);
    //      this.x.domain(d3.extent(this.sentimentAB.concat(this.sentimentBA), (d) => d.scene ));
    //      this.y.domain(d3.extent(this.sentimentAB.concat(this.sentimentBA), (d) => d.sentiment_value ));
    //
    //     // Configure the X Axis
    //     this.svg.append('g')
    //         .attr('transform', 'translate(0,' + this.height + ')')
    //         .attr('class', 'axis axis--x')
    //         .call(d3.axisBottom(this.x));
    //
    //     // Configure the Y Axis
    //     this.svg.append('g')
    //         .attr('class', 'axis axis--y')
    //         .call(d3.axisLeft(this.y));
    // }
    //
    // private computePointSize (s) {
    //     if (s == 0) {
    //       return 0;
    //     }
    //     else if (s < 100) {
    //       return 5;
    //     }
    //     else if (s < 200) {
    //       return 7;
    //     }
    //     else if(s < 400) {
    //       return 9;
    //     }
    //     else {
    //       return 11;
    //     }
    // }
    //
    // private drawLineAndPath(data, color, shape) {
    //     this.line = d3.line()
    //         .x( (d: any) => this.x(d.scene) )
    //         .y( (d: any) => this.y(d.sentiment_value) );
    //
    //     // Configuring line path
    //     this.svg.append('path')
    //         .datum(data)
    //         .attr('class', 'line')
    //         .attr('d', this.line)
    //         .attr('stroke', color)
    //         .attr('stroke-width', 2)
    //         .attr('fill', 'none');
    //
    //     // Data dots
    //     if (shape == 'circle') {
    //       this.svg.append('g')
    //           .selectAll("points")
    //           .data(data)
    //           .enter()
    //           .append(shape)
    //           .attr("class", "points")
    //           .attr("r", (d: any) => this.computePointSize(d.speech_dist))
    //           .attr("cx", (d: any) => this.x(d.scene))
    //           .attr("cy", (d: any) => this.y(d.sentiment_value) )
    //           .attr('fill', color)
    //           .attr('stroke', 'none');
    //
    //     }
    //     else {
    //       this.svg.append('g')
    //           .selectAll("points")
    //           .data(data)
    //           .enter()
    //           .append(shape)
    //           .attr("class", "points")
    //           .attr("x", (d: any) => this.x(d.scene)-this.computePointSize(d.speech_dist))
    //           .attr("y", (d: any) => this.y(d.sentiment_value)-this.computePointSize(d.speech_dist))
    //           .attr("width", (d: any) => 2*this.computePointSize(d.speech_dist))
    //           .attr("height", (d: any) => 2*this.computePointSize(d.speech_dist))
    //           .attr('fill', color)
    //           .attr('stroke', 'none');
    //     }
    // }
    //
    // private addLegend(A, B) {
    //
    //   this.svg.append("circle")
    //     .attr("cx",0)
    //     .attr("cy",170)
    //     .attr("r", 5)
    //     .style("fill", "blue")
    //   this.svg.append("rect")
    //     .attr("x",145)
    //     .attr("y",165)
    //     .attr("width", 10)
    //     .attr("height", 10)
    //     .style("fill", "red")
    //   this.svg.append("text")
    //     .attr("x", 10)
    //     .attr("y", 170)
    //     .text(A + " -> " +  B)
    //     .style("font-size", "11px")
    //     .attr("alignment-baseline","middle")
    //   this.svg
    //     .append("text")
    //     .attr("x", 160)
    //     .attr("y", 170)
    //     .text(B + " -> " +  A)
    //     .style("font-size", "11px")
    //     .attr("alignment-baseline","middle")
    // }
  
}
