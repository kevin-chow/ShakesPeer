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
    }
    return characterPairList;
  }

  filterSentimentData(dataToBeFiltered): any[] {
    let filteredData = dataToBeFiltered;
    if (this.isOneWayOnly == true) {
      filteredData = filteredData.filter((d) => {
        return (d[0].data.length != 0) && (d[1].data.length != 0);
      });
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
