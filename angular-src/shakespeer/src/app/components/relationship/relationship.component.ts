import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import {sentimentAB, sentimentBA, characterPairs} from './relationship_data';

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.scss']
})
export class RelationshipComponent implements OnInit {
    title = 'Line Chart';

    private margin = {top: 10, right: 20, bottom: 50, left: 50};
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private r: any;
    private svg: any;
    private line: d3.line<[number, number]>; // this is line definition

    sentimentAB: any;
    sentimentBA: any;

  constructor() { 
      // configure margins and width/height of the graph

   this.width = 400 - this.margin.left - this.margin.right;
   this.height = 200 - this.margin.top - this.margin.bottom;}

  ngOnInit() {
        this.readData("THESEUS", "HIPPOLYTA");
        this.buildSvg();
        this.addXandYAxis();
        this.drawLineAndPath(this.sentimentAB, 'blue', 'circle');
        this.drawLineAndPath(this.sentimentBA, 'red', 'rect');
        this.addLegend();
    }

    private readData(A, B) {
        this.sentimentAB = sentimentAB;
        this.sentimentBA = sentimentBA;
        //d3.csv("./sentiment_data.csv")
          //.row(function(d) { return {scene: d.scene, sentiment_value: +d[A+'-'+B]}; })
          //.get(function(error, rows) { console.log(rows); });
    }

    private buildSvg() {
        this.svg = d3.select('svg')
            .append('g')
            .attr('class', 'line-and-dots')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    private addXandYAxis() {
         // range of data configuring
         this.x = d3.scaleLinear().range([0, this.width]);
         this.y = d3.scaleLinear().range([this.height, 0]);
         this.x.domain(d3.extent(sentimentAB, (d) => d.scene ));
         this.y.domain(d3.extent(sentimentAB, (d) => d.sentiment_value ));

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

    private drawLineAndPath(data, color, shape) {
        this.line = d3.line()
            .x( (d: any) => this.x(d.scene) )
            .y( (d: any) => this.y(d.sentiment_value) );
        
        this.r = d3.scaleLog().range([0, 10])
            .domain(d3.extent(sentimentAB, (d) => d.speech_dist ))
            .base(2)

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
              .attr("r", 5)
              .attr("cx", (d: any) => this.x(d.scene))
              .attr("cy", (d: any) => this.y(d.sentiment_value) )
              .attr('fill', color)
              .attr('stroke', 'none');

        }
        else {
          this.svg.append('g')
              .selectAll("points")
              .data(data)
              .enter()
              .append(shape)
              .attr("class", "points")
              .attr("x", (d: any) => this.x(d.scene)-5)
              .attr("y", (d: any) => this.y(d.sentiment_value)-5)
              .attr("width", 10)
              .attr("height",10)
              .attr('fill', color)
              .attr('stroke', 'none');
        }
    }

    private addLegend() {

      this.svg.append("circle")
        .attr("cx",20)
        .attr("cy",180)
        .attr("r", 6)
        .style("fill", "blue")
      this.svg.append("circle")
        .attr("cx",170)
        .attr("cy",180)
        .attr("r", 6)
        .style("fill", "red")
      this.svg.append("text")
        .attr("x", 30)
        .attr("y", 180)
        .text("LYSANDER -> HERMIA")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle")
      this.svg
        .append("text")
        .attr("x", 180)
        .attr("y", 180)
        .text("HERMIA -> LYSANDER")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle")
    }
  
}
