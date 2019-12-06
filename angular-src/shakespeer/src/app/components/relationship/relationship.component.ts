import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import {sentiment_AFINN, sentiment_BL} from './relationship_data';

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.scss']
})
export class RelationshipComponent implements OnInit {
    title = 'Line Chart';

    private margin = {top: 20, right: 20, bottom: 50, left: 20};
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    private line: d3.line<[number, number]>; // this is line definition
    private counter = 0;

    sentimentAB: any;
    sentimentBA: any;

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

    private readData(A, B, lexicon) {
        if (lexicon == "AFINN") {
            this.sentimentAB = sentiment_AFINN[A+'-'+B];
            this.sentimentBA = sentiment_AFINN[B+'-'+A];
        }
        else {
            this.sentimentAB = sentiment_BL[A+'-'+B];
            this.sentimentBA = sentiment_BL[B+'-'+A];
        }
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

    private computePointSize (s) {
        if (s == 0) {
          return 0;
        }
        else if (s < 100) {
          return 5;
        }
        else if (s < 200) {
          return 7;
        }
        else if(s < 400) {
          return 9;
        }
        else {
          return 11;
        }
    }

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

        }
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
    }

    private addLegend(A, B) {

      this.svg.append("circle")
        .attr("cx",0)
        .attr("cy",170)
        .attr("r", 5)
        .style("fill", "blue")
      this.svg.append("rect")
        .attr("x",145)
        .attr("y",165)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", "red")
      this.svg.append("text")
        .attr("x", 10)
        .attr("y", 170)
        .text(A + " -> " +  B)
        .style("font-size", "11px")
        .attr("alignment-baseline","middle")
      this.svg
        .append("text")
        .attr("x", 160)
        .attr("y", 170)
        .text(B + " -> " +  A)
        .style("font-size", "11px")
        .attr("alignment-baseline","middle")
    }
  
}
