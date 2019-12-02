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

  maxWords = 467;
  maxRadius = 80;
  minRadius = 10;

  title = 'ng-d3-graph-editor';
  @ViewChild('graphContainer') graphContainer: ElementRef;

  width = 4000;
  height = 700;
  colors = d3.scaleOrdinal(d3.schemeSet3);

  svg: any;
  force: any;
  path: any;
  circle: any;
  drag: any;
  dragLine: any;

  selectedScn = 'a1s1';

  posColor = d3.color('black');
  negColor = d3.color('black');


  // Mouse event variables
  selectedNode = null;
  selectedLink = null;
  mousedownLink = null;
  mousedownNode = null;
  mouseupNode = null;

  handleScnSelection(e) {
    if (e.target.checked) {
      this.selectedScn = e.target.id;
      console.log(this.selectedScn);
      this.reset();
      this.setRadius();
      this.setForces();
      this.setSvg();
      this.restart();
      }
  }

  reset() {
    this.svg.selectAll("*").remove();
  }


  setRadius() {
    let max = -1;
    for (let n of nodes) {
      let numWords = 0;
      switch (this.selectedScn) {
        case "overview": {
          numWords = n.total;
          break;
        }
        case "a1s1": {
          numWords = n.a1s1;
          break;
        } 
        case "a1s2": {
          numWords = n.a1s2;
          break;
        }
        case "a2s1": {
          numWords = n.a2s1;
          break;
        }
        case "a2s2": {
          numWords = n.a2s2;
          break;
        }
        default: {
          numWords = n.total;
          break;
        }
      }
      
      if (max < numWords) {
        max = numWords;
      }

      n.radius = (numWords / this.maxWords) * this.maxRadius;
      if (n.radius <= 0) {
        n.visible = false;
      } else {
        n.visible = true;
      }
      if (n.radius < this.minRadius && n.radius !== 0) {
        n.radius = this.minRadius;
      }
    }
    this.maxWords = max;
  }

  setForces() {
    this.force = d3.forceSimulation()
      .force("link", d3.forceLink()
        .id(function(d) { return d.id; })
        .distance(function(d) {
          return d.source.radius + 60 + d.target.radius;
        }))
      .force('charge', d3.forceManyBody().strength(function(d) {
        return -70 * d.radius;
      }))
      .force('x', d3.forceX(this.width / 2).strength(0.3))
      .force('y', d3.forceY(this.height / 2).strength(0.3))
      .on('tick', () => this.tick());
  }

  setSvg() {
    this.svg = d3.select('#graphContainer')
      .attr('oncontextmenu', 'return false;')
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 9)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append('svg:path') 
      .attr("d", "M 0, -5 L 10, 0 L 0, 5")
      .attr('fill', d3.rgb("gray"));
  
  // Handles to link and node element groups
  this.path = this.svg.append('svg:g').selectAll('path');
  this.circle = this.svg.append('svg:g').selectAll('g');
}
  

  ngAfterContentInit() {
    const rect = this.graphContainer.nativeElement.getBoundingClientRect();
    this.width = rect.width;

    

  
      this.drag = d3.drag()
      .on('start', (d: any) => {
        if (!d3.event.active) this.force.alphaTarget(0.2).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (d: any) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on('end', (d: any) => {
        if (!d3.event.active) this.force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

      

    
    
    // App starts here
    this.setSvg();
    this.setRadius();
    this.setForces();
    this.restart();
  }

  // Update force layout (called automatically each iteration)
  tick() {
    this.path.attr('d', (d) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = d.source.radius;
      const targetPadding = d.target.radius;
      const sourceX = d.source.x + (sourcePadding * normX);
      const sourceY = d.source.y + (sourcePadding * normY);
      const targetX = d.target.x - (targetPadding * normX);
      const targetY = d.target.y - (targetPadding * normY);
      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });
    this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  // Update graph 
  restart() {
    this.path = this.path.data(links);
    // Remove old links
    this.path.exit().remove();

    // Add new links
    this.path = this.path.enter().append('svg:path')
      .attr('class', 'link')
      .style('stroke', d3.rgb("gray"))
      .style('stroke-width', '2px')
      .attr('marker-end','url(#arrow)')
      .style('display', function(d) {
        if (d.source.visible) {
          if (d.target.visible) {
            return 'flex';
          } 
        }
        return 'none';
      });

    this.circle = this.circle.data(nodes, (d) => d.id);
    
    // Remove old Nodes
    this.circle.exit().remove();

    // Add new nodes
    const g = this.circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', function(d) { return d.radius })
      .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
      .style('stroke', () => d3.rgb("white"))
      .style('stroke-width', '2px');
      

    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .attr("text-anchor", "middle")
      .text((d) => d.id)
      .style('font-size', 'smaller')
      .style('display', (d) => (d.visible) ? 'flex' : 'none');

    this.circle = g.merge(this.circle)
      .call(this.drag)
      // .on('mouseover', function(d) {
      //   d3.select(this).style('fill', d3.rgb(this.colors(d.id)).brighter())
      // })
     
      // .on('mouseout', function(d) {
      //   d3.select(this)
      //   .style('opacity', 1.0);
      // })
      .on('click', function(d) {
        this.selectedNode = d;
      });

  

  
    // set the graph in motion
    this.force
      .nodes(nodes)
      .force('link').links(links);
    
    this.force.alpha(1).restart();
    
    

 // }

  }
//}





}
