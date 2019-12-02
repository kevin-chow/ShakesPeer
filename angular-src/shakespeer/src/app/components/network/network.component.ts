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
  maxRadius = 80;
  minRadius = 15;

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

  selectedScn = 'overview';

  posColor = d3.color('black');
  negColor = d3.color('black');


  // Mouse event variables
  selectedNode = null;
 

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
    if(this.selectedScn == 'overview') {
      this.maxWords = 2035;
    } else if (this.selectedScn == 'a1s1') {
      this.maxWords = 432;
    } else if (this.selectedScn == 'a1s2') {
      this.maxWords = 365;
    } else if (this.selectedScn == 'a2s1') {
      this.maxWords = 605;
    } else if (this.selectedScn == 'a2s2') {
      this.maxWords = 359;
    } else if (this.selectedScn == 'a3s1') {
      this.maxWords = 707;
    } else if (this.selectedScn == 'a3s2') {
      this.maxWords = 899;
    } else if (this.selectedScn == 'a4s1') {
      this.maxWords = 395;
    } else if (this.selectedScn == 'a4s2') {
      this.maxWords = 157;
    } else if (this.selectedScn == 'a5s1') {
      this.maxWords = 949;
    }
  }


  setRadius() {
    for (let n of nodes) {
      let numWords = 0;
      if(this.selectedScn == 'overview') {
        numWords = n.total;
      } else if (this.selectedScn == 'a1s1') {
        numWords = n.a1s1;
      } else if (this.selectedScn == 'a1s2') {
        numWords = n.a1s2;
      } else if (this.selectedScn == 'a2s1') {
        numWords = n.a2s1;
      } else if (this.selectedScn == 'a2s2') {
        numWords = n.a2s2;
      } else if (this.selectedScn == 'a3s1') {
        numWords = n.a3s1;
      } else if (this.selectedScn == 'a3s2') {
        numWords = n.a3s2;
      } else if (this.selectedScn == 'a4s1') {
        numWords = n.a4s1;
      } else if (this.selectedScn == 'a4s2') {
        numWords = n.a4s2;
      } else if (this.selectedScn == 'a5s1') {
        numWords = n.a5s1;
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
  }

  setForces() {
    this.force = d3.forceSimulation()
      .force("link", d3.forceLink()
        .id(function(d) { return d.id; })
        .distance(function(d) {
          return d.source.radius + 55 + d.target.radius;
        }))
      .force('charge', d3.forceManyBody().strength(function(d) {
        return -85 * d.radius;
      }))
      .force('x', d3.forceX(this.width / 2).strength(0.35))
      .force('y', d3.forceY(this.height / 2).strength(0.35))
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
      .attr('fill', d3.rgb("#bbb"));
  
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

    // this.path.attr("d", function (d) {
    //   var dx = d.target.x - d.source.x,
    //       dy = d.target.y - d.source.y,
    //       dr = Math.sqrt(dx * dx + dy * dy);
      
    //     var sourceX = d.source.x + (d.source.radius * (dx / dr)),
    //       sourceY = d.source.y + (d.source.radius * (dy / dr)),
    //       targetX = d.target.x - (d.target.radius * (dx / dr)),
    //       targetY = d.target.y - (d.target.radius * (dy / dr));

    //   return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
    // });
   
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
      .style('stroke', d3.rgb("#bbb"))
      .style('stroke-width', '2px')
      .style('fill', 'none')
      .attr('marker-end','url(#arrow)')
      // .style('opacity', 0.5)
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
      .style('fill', (d) => this.colors(d.id))
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
