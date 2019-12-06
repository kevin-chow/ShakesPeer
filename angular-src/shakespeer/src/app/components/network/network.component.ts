import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { nodes, links, type } from './speech_data';
import { ResolveStart } from '@angular/router';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  ngOnInit(): void { }

  maxWords = 2035;
  maxRadius = 50;
  maxSentiment = 8;
  minRadius = 17;
  width = 4000;
  height = 600;
  selectedScn = 'overview';

  @ViewChild('graphContainer') graphContainer: ElementRef;

  svg: any;
  force: any;
  path: any;
  circle: any;
  drag: any;
  brush: any;

  // Colors
  posColor = d3.color('#80b1d3');
  negColor = d3.color('#fb8072');
  neutralColor = d3.color('#d9d9d9');
  fairyColor = d3.color('#b3de69');
  loverColor = d3.color('#bc80bd');
  actorColor = d3.color('#fdb462');

  colors = d3.scaleLinear().domain([-1, 1])
    .range([this.negColor, this.posColor]);


  // Mouse event variables
  selectedNode = null;
  selectedNodePair = null;
 

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
    nodes.forEach(node => {
      node.selected = false;
    })
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
          return d.source.radius + 60 + d.target.radius;
        }))
      .force('charge', d3.forceManyBody().strength((d) => (-105 * d.radius) ))
      .force('x', d3.forceX(this.width / 2).strength(0.45))
      .force('y', d3.forceY((this.height / 2)).strength(0.5))
      .on('tick', () => this.tick());
  }


  setSvg() {
    this.svg = d3.select('#graphContainer')
      .attr('oncontextmenu', 'return false;')
      .attr('width', this.width)
      .attr('height', this.height);

    // this.svg.append("defs").append("marker")
    // .attr("id", "arrow")
    // .attr("viewBox", "0 -5 10 10")
    // .attr("refX", 9)
    // .attr("refY", 0)
    // .attr("markerWidth", 3)
    // .attr("markerHeight", 3)
    // .attr("orient", "auto")
    // .append('svg:path') 
    // .attr("d", "M 0, -5 L 10, 0 L 0, 5")
    // .attr('fill', this.neutralColor);

    this.svg.append("defs").append("marker")
    .attr("id", "pos_arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 9)
    .attr("refY", 0)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append('svg:path') 
    .attr("d", "M 0, -5 L 10, 0 L 0, 5")
    .attr('fill', this.posColor);

  // this.svg.on('click', function() {
  //   this.selectedNode = null;
  //   d3.selectAll('circle')
  //   .style('stroke', d3.rgb('white'));
  // });
  
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
      let offset = 5;

      return `
            M 
              ${d.source.x} ${d.source.y} 
            C 
              ${(d.source.x + d.target.x) / 2} ${d.source.y} 
              ${(d.source.x + d.target.x) / 2} ${d.target.y} 
              ${d.target.x} ${d.target.y}
            M 
              ${d.source.x +offset} ${d.source.y+offset}
            C
            ${(d.source.x+offset + d.target.x) / 2} ${d.source.y+offset} 
            ${(d.source.x+offset + d.target.x) / 2} ${d.target.y} 
            ${d.target.x} ${d.target.y}

            L
            ${d.source.x} ${d.source.y}
            ${d.source.x+offset} ${d.source.y+offset}
            
          `
        });
      // const controlPts = [(d.target)]


      // const deltaX = d.target.x - d.source.x;
      // const deltaY = d.target.y - d.source.y;
      // const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      // const normX = deltaX / dist;
      // const normY = deltaY / dist;
      // const sourcePadding = d.source.radius;
      // const targetPadding = d.target.radius;
    
      // const sourceX = d.source.x + (sourcePadding * normX);
      // const sourceY = d.source.y + (sourcePadding * normY);
      // const targetX = d.target.x - (targetPadding * normX );
      // const targetY = d.target.y - (targetPadding * normY);

      // return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    // });
    this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }
  
  handleSelect(d) {
    nodes.forEach(n => {
      n.selected = false;
    });
    d.selected = !d.selected;
  }

 
  // Update graph
  restart() {
    this.path = this.path.data(links);
    this.path.exit().remove();

    // Add new links
    this.path = this.path.enter().append('svg:path')
      .attr('class', 'link')
      .style('stroke', this.neutralColor)
      .style('stroke-width', '2px')
      // .attr('marker-end','url(#arrow)')
      .style('opacity', 0.75)
      .attr("fill", 'transparent')
      .style('display', (d) => (d.source.visible) ? ((d.target.visible) ? 'flex' : 'none') : 'none');


    this.circle = this.circle.data(nodes, (d) => d.id);
    
    // Remove old Nodes
    this.circle.exit().remove();

    // Add new nodes
    const g = this.circle.enter().append('svg:g');

    var temp = this;
    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', (d) => d.radius)
      .style('fill', (d) => 
        (d.type == type.LOVER) ? this.loverColor : 
        (d.type == type.FAIRY) ? this.fairyColor : 
        (d.type == type.ACTOR) ? this.actorColor : this.neutralColor)
        .style('stroke-width', '2px')
        .style('stroke', 'white')
      .on('click', function(d) {
        temp.handleSelect(d);
        d3.selectAll('circle')
          .style('stroke', (d) => (d.selected) ? temp.neutralColor : 'white');
        d3.selectAll('path')
          .style('stroke', function(nd) {
            if (nd == undefined) {
              return temp.neutralColor;
            } else if ((nd.source.id == d.id || nd.target.id == d.id) && d.selected) {

              return temp.colors(nd.sentiment);
            }
            else return temp.neutralColor;
          
              
            //   if(nd.sentiment > 0) {
            //     return temp.posColor;
            //   } else if (nd.sentiment <= 0) {
            //     return temp.negColor;
            //   }
            //   else {
            //     return temp.neutralColor;
            //   }
           
            // } else {
            //   return temp.neutralColor;
            // }
          })
        
      });
        

    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .attr("text-anchor", "middle")
      .text((d) => d.id)
      .style('font-size', 'smaller')
      .style('display', (d) => (d.visible) ? 'flex' : 'none');

    this.circle = g.merge(this.circle)
      
      .call(this.drag);
      

  
    // set the graph in motion
    this.force
      .nodes(nodes)
      .force('link').links(links);
    
    this.force.alpha(1).restart();


  }






}

