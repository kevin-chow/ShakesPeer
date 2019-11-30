import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { nodes, links } from './speech_data';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  ngOnInit(): void { }

  maxWords = 2035;

  viewState = "overview";

  title = 'ng-d3-graph-editor';
  @ViewChild('graphContainer') graphContainer: ElementRef;

  width = 2000;
  height = 800;
  colors = d3.scaleOrdinal(d3.schemeSet3);

  svg: any;
  force: any;
  path: any;
  circle: any;
  drag: any;
  dragLine: any;

  // Mouse event variables
  selectedNode = null;
  selectedLink = null;
  mousedownLink = null;
  mousedownNode = null;
  mouseupNode = null;

  handleScnSelection(e) {
    console.log(e.target.id);
    if (e.target.checked) {
      if (e.target.id == "overview") {
        d3.selectAll('svg').selectAll('circle')
        .attr('r', (d) => (d.total / this.maxWords) * 110);

        d3.selectAll('svg').selectAll('text')
        .style('opacity', 1.0);
      } else if (e.target.id == "a1s1") {
        d3.selectAll('svg').selectAll('circle')
        .attr('r', (d) => (d.a1s1 / this.maxWords) * 400);

        d3.selectAll('svg').selectAll('text')
        .style('opacity', (d) => (d.a1s1 == 0) ? 0.0 : 1.0);



      } else if (e.target.id == "a1s2") {
        d3.selectAll('svg').selectAll('circle')
        .attr('r', (d) => (d.a1s2 / this.maxWords) * 400);

        d3.selectAll('svg').selectAll('text')
        .style('opacity', (d) => (d.a1s2 == 0) ? 0.0 : 1.0);

      } else if (e.target.id == "a2s1") {
        d3.selectAll('svg').selectAll('circle')
        .attr('r', (d) => (d.a2s1 / this.maxWords) * 400);

        d3.selectAll('svg').selectAll('text')
        .style('opacity', (d) => (d.a2s1 == 0) ? 0.0 : 1.0);
      } else if (e.target.id == "a2s2") {
        d3.selectAll('svg').selectAll('circle')
        .attr('r', (d) => (d.a2s2 / this.maxWords) * 400);

        d3.selectAll('svg').selectAll('text')
        .style('opacity', (d) => (d.a2s2 == 0) ? 0.0 : 1.0);
      }
    }
  }

  ngAfterContentInit() {
    const rect = this.graphContainer.nativeElement.getBoundingClientRect();
    this.width = rect.width;

    this.svg = d3.select('#graphContainer')
      .attr('oncontextmenu', 'return false;')
      .attr('width', this.width)
      .attr('height', this.height);

    this.force = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('x', d3.forceX(this.width / 2))
      .force('y', d3.forceY(this.height / 2))
      .on('tick', () => this.tick());

    // Handles to link and node element groups
    this.path = this.svg.append('svg:g').selectAll('path');
    this.circle = this.svg.append('svg:g').selectAll('g');

    // d3.select("#overview").on("change",function() {
    //   if (d3.select("#overview").property("checked")) {
    //     console.log("overview selected");
    //     this.viewState = "overview";
    //   }});
      
    // App starts here
    this.restart();
  }

  // Update force layout (called automatically each iteration)
  tick() {
    this.path.attr('d', (d: any) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = d.left ? 17 : 12;
      const targetPadding = d.right ? 17 : 12;
      const sourceX = d.source.x + (sourcePadding * normX);
      const sourceY = d.source.y + (sourcePadding * normY);
      const targetX = d.target.x - (targetPadding * normX);
      const targetY = d.target.y - (targetPadding * normY);
      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });
    this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  resetMouseVars() {
    this.mousedownNode = null;
    this.mouseupNode = null;
    this.mousedownLink = null;
  }

  // update graph (called when needed)
  restart() {
    
    this.path = this.path.data(links);


    // Remove old links
    this.path.exit().remove();

    // Add new links
    this.path = this.path.enter().append('svg:path')
      // .attr('class', 'link')
      .style('stroke', 'black');

    this.circle = this.circle.data(nodes, (d) => d.id);

    // this.circle.selectAll('circle')
    //   .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id));

    
    // Remove old Nods
    this.circle.exit().remove();

    // Add new nodes
    const g = this.circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', (d) => (d.total / this.maxWords) * 110)
      .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
      .style('stroke', () => d3.rgb("black"))
      .on('mousedown', (d) => {
        this.mousedownNode = d;
        this.selectedNode = (this.mousedownNode === this.selectedNode) ? null : this.mousedownNode;
        this.restart();
      })
      //   d3.select(this)
      //     .style('fill', d3.rgb(this.colors(d.id)).brighter().toString());
      // })
      ;
   
    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .attr("text-anchor", "middle")
      .text((d) => d.id);

    this.circle = g.merge(this.circle);

    




    // set the graph in motion
    this.force
      .nodes(nodes)
      .force('link').links(links);

    this.force.alphaTarget(0.3).restart();
  }

  mousedown(dataItem: any, value: any, source: any) {
    // because :active only works in WebKit?
    // this.svg.classed('active', true);


    // this.restart();
  }

  mousemove(source: any) {
    if (!this.mousedownNode) return;

    // update drag line
    this.dragLine.attr('d', `M${this.mousedownNode.x},${this.mousedownNode.y}L${d3.mouse(d3.event.currentTarget)[0]},${d3.mouse(d3.event.currentTarget)[1]}`);

    this.restart();
  }

  mouseup(source: any) {
    if (this.mousedownNode) {
      // hide drag line
      // this.dragLine
      //   .classed('hidden', true)
      //   .style('marker-end', '');
    }

    // because :active only works in WebKit?
    this.svg.classed('active', false);

    // clear mouse event vars
    this.resetMouseVars();
  }

}
