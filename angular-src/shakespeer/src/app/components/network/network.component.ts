import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { nodes, links, type, sceneAttribs } from './speech_data';
import { Filter } from 'src/app/models/filter.model';
import { FilterService } from 'src/app/services/filter.service';
import { sentiment_BL} from 'src/app/components/relationship/relationship_data';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})

export class NetworkComponent implements OnInit {
  ngOnInit(): void { }

  filter: Filter;


  minSentimentValue = -10;
  maxSentimentValue = 10;
  maxWords = 2035;
  maxRadius = 45;
  maxSentiment = 8;
  minRadius = 12;
  maxLinkOffset = 50;
  minLinkOffset = 7;
  width = 1000;
  height = 700;
  
  selectedScns = ['a1s1', 'a1s2', 'a2s1', 'a2s2', 'a3s1', 'a3s2', 'a4s1', 'a4s2', 'a5s1'];
  selectedCharacterTypes = [type.ACTOR, type.LOVER, type.FAIRY,  type.OTHER];

  @ViewChild('graphContainer') graphContainer: ElementRef;
  
  zoom: any;
  svg: any;
  force: any;
  path: any;
  circle: any;
  drag: any;
  brush: any;
  viewHeight: number;

  // Colors
  // posColor = d3.color('#80b1d3');
  // negColor = d3.color('#fb8072');
  neutralColor = d3.color('#d9d9d9');
  fairyColor = d3.color('#b3de69');
  loverColor = d3.color('#bc80bd');
  actorColor = d3.color('#fdb462');

  colors = d3.scaleQuantize()
  .domain([-14,11])
  .range(['#c74643', '#ea9178','lightgray','#7db6d6', '#3b83b9' ]);

  constructor(private filterService: FilterService) { }

  readData(A: any, B: any, sceneIdx: any) {
    let retVal = [];
    let ab = sentiment_BL[A+'-'+B];
    if (ab != undefined) {
      sceneIdx.forEach(scene => {
        if (ab[scene] != undefined) {
          if (ab[scene].speech_dist > 0) {
            retVal.push(ab[scene]);
          }
        }
      });
      if (retVal.length == 0) {
        return null;
      } else {
        return retVal;
      }
    }
    return null;
  }

  handleSidebarSelection() {
    this.selectedScns = this.filter.selectedScenes;
    this.selectedCharacterTypes = this.filter.selectedCharacterTypes;
  }

  reset() {
    if (this.svg == undefined) return;
    this.svg.selectAll("*").remove();
    nodes.forEach(node => {
      node.selected = false;
    });
    links.forEach(link => {
      link['selected'] = false;
    })
  }


  setRadius() {
    this.maxWords = 0;
    var numWordsArray = [];
    for (let n of nodes) {
      n.total = 0;
      if (this.selectedScns.includes('a1s1')) {
        n.total += n.a1s1;
      }
      if (this.selectedScns.includes('a1s2')) {
        n.total += n.a1s2;
      } 
      if (this.selectedScns.includes('a2s1')) {
        n.total += n.a2s1;
      }
      if (this.selectedScns.includes('a2s2')) {
        n.total += n.a2s2;
      }
      if (this.selectedScns.includes('a3s1')) {
        n.total += n.a3s1;
      } 
      if (this.selectedScns.includes('a3s2')) {
        n.total += n.a3s2;
      } 
      if (this.selectedScns.includes('a4s1')) {
        n.total += n.a4s1;
      } 
      if (this.selectedScns.includes('a4s2')) {
        n.total += n.a4s2;
      } 
      if (this.selectedScns.includes('a5s1')) {
        n.total += n.a5s1;
      } 
      numWordsArray.push(n.total);
    }
    this.maxWords = Math.max(... numWordsArray);
    for (let n of nodes) {
      n.radius = (n.total / this.maxWords) * this.maxRadius;
  
      if (n.radius <= 0) {
        n.visible = false;
      } else if (this.selectedCharacterTypes.includes(n.type)){
        n.visible = true;
      } else {
        n.visible = false;
      }

      if (n.radius < this.minRadius && n.radius !== 0) {
        n.radius = this.minRadius;
      }

    }
  }

  setSentiment() {
    let sceneArray = [];
    if (this.selectedScns.includes('a1s1')) {
      sceneArray.push(0);
    }
    if (this.selectedScns.includes('a1s2')) {
      sceneArray.push(1);
    }
    if (this.selectedScns.includes('a2s1')) {
      sceneArray.push(2);
    }
    if (this.selectedScns.includes('a2s2')) {
      sceneArray.push(3);
    }
    if (this.selectedScns.includes('a3s1')) {
      sceneArray.push(4);
    }
    if (this.selectedScns.includes('a3s2')) {
      sceneArray.push(5);
    }
    if (this.selectedScns.includes('a4s1')) {
      sceneArray.push(6);
    }
    if (this.selectedScns.includes('a4s2')) {
      sceneArray.push(7);
    }
    if (this.selectedScns.includes('a5s1')) {
      sceneArray.push(8);
    }
    for (let l of links) {
      l.visible = false;
      l.sentiment = 0;
      l.width = 0;
      let sentiment = 0;
      let engagement = 0;
      if (l.source.visible && l.target.visible) {
        let sourceid = (l.source.id).toUpperCase();
        let targetid = (l.target.id).toUpperCase();
        let result = this.readData(sourceid, targetid, sceneArray);
        if (result != null) {
          l.visible = true;
          let i = 0;
          sceneArray.forEach(sceneIdx => {
            if (result[i] != undefined) {
              sentiment += result[i].sentiment_value;
              engagement += result[i].speech_dist;
              i++;
            }
          });
        }
      }
      l.sentiment = sentiment;
      l.width = this.scale(engagement, 0, this.maxWords, this.minLinkOffset, this.maxLinkOffset);
    }
  }

  scale(num, inMin, inMax, outMin, outMax) {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }


  setForces() {
    this.force = d3.forceSimulation()
      .force("link", d3.forceLink()
        .id(function(d) { return d.id; })
        .distance(function(d) {
          return d.source.radius + 60 + d.target.radius;
        }))
      .force('charge', d3.forceManyBody().strength((d) => (-155 * d.radius) ))
      .force('x', d3.forceX(this.width / 2).strength(0.55))
      .force('y', d3.forceY((this.height / 2)).strength(0.55))
      .on('tick', () => this.tick());
  }


  setSvg() {
    this.svg = d3.select('#graphContainer')
      .attr('oncontextmenu', 'return false;')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'all')
      .attr('transform-origin', '50% 50% 0')
      .style('display', 'block');
    //   .call(d3.zoom()
    //     .scaleExtent([-2, 2])
    //     .translateExtent([[0, 0], [this.width / 2, this.height/ 2]])
    //     // .extent([[0, 0], [this.width, this.height]])
    //     .on('zoom', function () {
        
    //     temp.svg.attr("transform",d3.event.transform);
    //   })

      
    //  );



  // this.svg.on('click', function() {
  //   this.selectedNode = null;
  //   d3.selectAll('circle')
  //   .style('stroke', d3.rgb('white'));
  // });
  
  // Handles to link and node element groups
  this.path = this.svg.append('svg:g').selectAll('path');
  this.circle = this.svg.append('svg:g').selectAll('g');

  this.svg
  .attr('transform', 'translate(0, 10)')
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

    // this.zoom = d3.zoom()
    // .on('zoom', this.zoomHandler);

// zoom_handler(svg);  
    
    this.filterService.filter$.subscribe(newFilter => {
      this.filter = newFilter;
      this.handleSidebarSelection();
      this.reset();
      this.setSvg();
      this.setRadius();
      this.setSentiment();
      this.setForces();
      if (this.selectedScns.length > 0) {
        this.restart();
      }
    });

    // App starts here
    this.setSvg();
    this.setRadius();
    this.setSentiment();
    this.setForces();
    this.restart();
  }

  // Update force layout (called automatically each iteration)
  tick() {
    this.path.attr('d', (d) => {
      let offsetMagnitude = d.width;
      let offsetY = offsetMagnitude;
      let offsetX = offsetMagnitude;

      if (d.target.y < d.source.y) {
        offsetY *= -1;
      } 

      if(d.target.x > d.source.x) {
        offsetX *= -1;
      } 

      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;

      return `
            M 
              ${d.source.x+(d.source.radius*normX)} ${d.source.y+(d.source.radius*normY)} 
            
              Q
              ${(d.source.x/5 + (4*d.target.x)/5) + offsetX} ${d.target.y+offsetY} 
              ${d.target.x+(d.target.radius*normX)} ${d.target.y+(d.target.radius*normY)}

              Z

          `
        });
    this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
    // this.path.style('opacity', (d) => (d.)
  }
  
  handleSelect(d) {
    var temp = this;
    let selectState = !d.selected;
    if (!d3.event.shiftKey) {
      nodes.forEach(n => {
        n.selected = false;
      });
    }
    d.selected = selectState;
    d3.selectAll('circle')
      .style('stroke', function(n) {
        if (n == undefined) {
          return 'white';
        } else {
          if (n.selected) {
            // return '#007bff';
            return 'black';
          } else {
            return 'white';
          }
        }
      });
      this.path 
        .style('fill', function (l) {
          l.selected = false;
          let color = temp.neutralColor;
          if (l != undefined) {
            if (l.source != undefined && l.target != undefined) {
              d3.selectAll('circle').each(function(d) {
                if (d != undefined) {
                  if (l.source.id == d.id && (d.selected == true)) {
                    color = temp.colors(l.sentiment);
                    l.selected = true;
                    return false;
                  }
                } 
              });
            }
          }
          return color;
        })
        .style('opacity', (d) => (d.selected) ? 0.8 : 0.3)
        .style('stroke', (d) => (d.selected) ? 'black' : '');

        

      this.svg.selectAll('path').sort(function(a,b){
        if (a != undefined && a != null) {
          if (a.selected) return 1;
          else return -1;
        }
      });
                  
  


        // if (d != undefined || d!= null) {
        //   if (d.selected) {
        //     console.log(d3.select(d.parentNode).raise());
        //   } 
        // }
        
        
     
      }

    
          
          
    
     
       
  

 
  // Update graph
  restart() {
    this.path = this.path.data(links);
    this.path.exit().remove();

    // Add new links
    this.path = this.path.enter().append('svg:path')
      .attr('class', 'link')
      .style('stroke-width', '1px')
      .style('stroke-opacity', 0.1)
      .style('opacity', 0.3)
      .attr("fill", this.neutralColor)
      .style('display', (d) => (d.visible) ? 'flex' : 'none');

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
        .style('display', (d) => (d.visible) ? 'flex' : 'none')
        .style('stroke-width', '2px')
        .style('stroke', 'white')
      // .on('mouseover', function(d) {
      //   temp.handleSelect(d);
      // })
      .on('click', function(d) {
        temp.handleSelect(d);
      });
        

    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .attr("text-anchor", "middle")
      .text((d) => d.id)
      .style('font-size', '11px')
      .style('display', (d) => (d.visible) ? 'flex' : 'none');

    this.circle = g.merge(temp.circle)
      
      .call(temp.drag);
      

  
    // set the graph in motion
    this.force
      .nodes(nodes)
      .force('link').links(links);
    
    this.force.alpha(1).restart();


  }






}

