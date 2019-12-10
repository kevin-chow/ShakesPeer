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

  @ViewChild('graphContainer') graphContainer: ElementRef;

  
  maxWords: number;
  maxRadius = 50;
  minRadius = 12;
  maxLinkOffset = 75;
  minLinkOffset = 10;
  width = 0;
  height = 850;
 
  // Hard-coded for now
  selectedCharacterTypes: string[] = [
    type.ACTOR, type.LOVER, type.FAIRY, type.OTHER
  ];
  selectedScns: string[] = [];
  selectedCharacters: string[] = [];

  refreshView: boolean;

  filter: Filter;
  zoom: any;
  svg: any;
  force: any;
  path: any;
  circle: any;
  drag: any;
  

  // Colors and color schemes 
  neutralColor = d3.color('#d9d9d9');
  fairyColor = d3.color('#b3de69');
  loverColor = d3.color('#bc80bd');
  actorColor = d3.color('#fdb462');
  otherColor = d3.color('#bebada');
  colorBrewerRYG = ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];
  divergeRB = ['#c74643', '#ea9178', 'lightgray', '#7db6d6', '#3b83b9'];
  divergeRYB = ['#e75a3b', '#fdbc73', '#faf8c1', '#bbdfe9', '#6799c7'];
  
  colors = d3.scaleQuantize()
  .domain([-14, 14])
  .range(this.divergeRB);

  
  ngOnInit(): void {
    this.filter = new Filter();
    sceneAttribs.forEach(scene => { this.selectedScns.push(scene.id); });
    this.maxWords = Math.max.apply(Math, nodes.map(function(n) { return n.total }));
    this.refreshView = false;
  }
 
  constructor(private filterService: FilterService) {}
 
 
  readData(A: any, B: any, sceneIdx: any) {
   let retVal = [];
   let ab = sentiment_BL[A + '-' + B];
   if (ab != undefined) {
    sceneIdx.forEach(scene => {
     if (ab[scene] != undefined) {
      if (ab[scene].speech_dist > 0) retVal.push(ab[scene]);
     }
    });
    if (retVal.length > 0) return retVal;
  }
  return null;
}
 
  handleSidebarSelection() {
   this.selectedScns = this.filter.selectedScenes;
   this.selectedCharacterTypes = this.filter.selectedCharacterTypes;
   this.selectedCharacters = this.filter.selectedCharacters;
  }
 

  // Clear all nodes and links
  reset() {
   if (this.svg == undefined) return;
   this.svg.selectAll("*").remove();
   nodes.forEach(node => { 
     node.selected = false;
    });
   links.forEach(link => { 
     link['selected'] = false;
    });
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
   this.maxWords = Math.max(...numWordsArray);
   for (let n of nodes) {
    n.radius = (n.total / this.maxWords) * this.maxRadius;
 
    if (n.radius <= 0) {
     n.visible = false;
    } else if (this.selectedCharacterTypes.includes(n.type)) {
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
     .id((d) => d.id)
     .distance((d) => d.source.radius + 60 + d.target.radius))
    .force('charge', d3.forceManyBody().strength((d) => (-165 * d.radius)))
    .force('x', d3.forceX(this.width / 2).strength(0.6))
    .force('y', d3.forceY((this.height / 2)).strength(0.57))
    .on('tick', () => this.tick());
  }
 
 
  setSvg() {
   this.svg = d3.select('#graphContainer')
    .attr('height', '100vh')
    .attr('class', 'all')
    .attr('transform-origin', '50% 50% 0')
    .style('display', 'block');
   
    this.svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('fill-opacity', 0);
 

   // Sentiment valence legend
   let colorWidth = 30;
   let colorHeight = 25;
   let shiftRight = 0;
   let leftPadding = 50;
   this.svg.append('text')
    .text('Sentiment Valence')
    .attr('x', leftPadding)
    .attr('y', 45)
    .style('font-size', '10px');
   this.svg.append('text')
    .text('-ve')
    .attr('x', leftPadding)
    .attr('y', 80)
    .style('font-size', '10px');
   for (let idx in this.divergeRB) {
    this.svg.append('rect')
     .attr('width', colorWidth)
     .attr('height', colorHeight)
     .attr('x', leftPadding + colorWidth * shiftRight)
     .attr('y', 50)
     .attr('stroke', 'white')
     .attr('stroke-width', '2px')
     .attr('fill', this.divergeRB[idx]);
    shiftRight++;
   }
   this.svg.append('text')
    .text('+ve')
    .attr('x', leftPadding + 6 + colorWidth * (shiftRight - 1))
    .attr('y', 80)
    .style('font-size', '10px');
 
   // Handles to link and node element groups
   this.path = this.svg.append('svg:g').selectAll('path');
   this.circle = this.svg.append('svg:g').selectAll('g');

  }

  initDrag() {
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
  }
 
 
 
  ngAfterContentInit() {
   const rect = this.graphContainer.nativeElement.getBoundingClientRect();
   this.width = rect.width;
    
   this.initDrag();
 
   this.filterService.filter$.subscribe(newFilter => {
     if (this.filter != newFilter) {
       this.refreshView = true;
     }
     this.filter = newFilter;
     if (this.refreshView) {
      this.handleSidebarSelection();
      this.reset();
      this.setSvg();
      this.setRadius();
      this.setSentiment();
      this.setForces();
      if (this.selectedScns.length > 0) {
       this.restart();
      }
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
 
    let offsetPoint =
      this.computeOffsetPoint(
        d.target.x,
        d.target.y,
        (0.7 * d.target.x) + (0.3 * d.source.x),
        (0.7 * d.target.y) + (0.3 * d.source.y),
        7);

      let offsetPoint2 = 
      this.computeOffsetPoint(
        d.target.x,
        d.target.y,
        (0.7 * d.target.x) + (0.3 * d.source.x),
        (0.7 * d.target.y) + (0.3 * d.source.y),
        offsetMagnitude + 10
        );
    // this.computeIntersection(d.target.x, d.target.y, d.source.x, d.source.y, d.target.radius);
   
 
    const deltaX = d.target.x - d.source.x;
    const deltaY = d.target.y - d.source.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normX = deltaX / dist;
    const normY = deltaY / dist;
 
    return `
           M 
             ${d.source.x+(d.source.radius*normX)} ${d.source.y+(d.source.radius*normY)} 
             Q
             ${offsetPoint[0]} ${offsetPoint[1]}
             ${d.target.x-(d.target.radius*normX)} ${d.target.y-(d.target.radius*normY)}
          
             ${offsetPoint2[0]} ${offsetPoint2[1]}
             ${d.source.x+(d.source.radius*normX)} ${d.source.y+(d.source.radius*normY)} 

             Z
             
        
             


 
         `
   });
   this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }
  // M
  // ${d.target.x-(d.target.radius*normX)} ${d.target.y-(d.target.radius*normY)}
  computeIntersection(Ax, Ay, Bx, By, Ar) {
    let dx = Bx - Ax;
    let dy = By - Ay;
    let norm = Math.sqrt((dx * dx) + (dy * dy));
    let Px = Ax + (Ar * (dx/norm));
    let Py = Ay + (Ar * (dy/norm));
    return [ Px, Py];
  }

  

 
  computeOffsetPoint(targetX, targetY, sourceX, sourceY, distance) {
   let midX = (targetX + sourceX) * 0.5;
   let midY = (targetY + sourceY) * 0.5;
   let dirVecX = targetX - sourceX;
   let dirVecY = targetY - sourceY;
   let perpVecX = -dirVecY;
   let perpVecY = dirVecX;
   let normLen = Math.sqrt((perpVecX * perpVecX) + (perpVecY * perpVecY));
   return [midX + (distance * (perpVecX / normLen)), midY + (distance * (perpVecY / normLen))];
  }

  updateCharacterSelection() {
    this.filter.selectedCharacters = this.selectedCharacters;
    this.filter.selectedScenes = this.selectedScns;
    this.filter.selectedCharacterTypes = this.selectedCharacterTypes;
    this.filterService.updateFilter(this.filter);
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

   this.selectedCharacters = [];
   nodes.forEach(n => {
     if (n.selected == true) {
       this.selectedCharacters.push(n.id);
     }
   });
   this.refreshView = false;
   this.updateCharacterSelection();
   this.refreshView = true;

   d3.selectAll('circle')
    .style('stroke', function(n) {
     if (n == undefined) {
      return 'white';
     } else {
      if (n.selected) {
       return 'black';
      } else {
       return 'white';
      }
     }
    });
   this.path
    .style('fill', function(l) {
     l.selected = false;
     let color = temp.neutralColor;
     if (l != undefined) {
      if (l.source != undefined && l.target != undefined) {
       d3.selectAll('circle').each(function(d) {
        if (d != undefined) {
         if ((l.source.id == d.id) && (d.selected == true)) {
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
    .style('opacity', (d) => (d.selected) ? 0.8 : 0.2)
    .style('stroke', (d) => (d.selected) ? 'gray' : '');
 
 
 
   this.svg.selectAll('path').sort(function(a, b) {
    if (a != undefined && a != null) {
     if (a.selected) return 1;
     else return -1;
    }
   });
  }
 
 
 
 handleHover(d) {
  var temp = this;
  if (!temp.selectedCharacters.includes(d.id)) {
    console.log(this.path);
    
    
    
  }
 }
  
 
 
 
 
  // Update graph
  restart() {
    var temp = this;
   this.path = this.path.data(links);
   this.path.exit().remove();
 
   // Add new links
   this.path = this.path.enter().append('svg:path')
    .attr('class', 'link')
    .style('stroke-width', '1px')
    .style('stroke-opacity', 0.1)
    .style('opacity', 0.2) 
    .attr("fill", temp.neutralColor)
    .style('display', (d) => (d.visible) ? 'flex' : 'none');





 
   this.circle = this.circle.data(nodes, (d) => d.id);
 
   // Remove old Nodes
   this.circle.exit().remove();
 
   // Add new nodes
   const g = this.circle.enter().append('svg:g');
 
   
   g.append('svg:circle')
    .attr('class', 'node')
    .attr('r', (d) => d.radius)
    .style('fill', (d) =>
     (d.type == type.LOVER) ? this.loverColor :
     (d.type == type.FAIRY) ? this.fairyColor :
     (d.type == type.ACTOR) ? this.actorColor : this.otherColor)
    .style('display', (d) => (d.visible) ? 'flex' : 'none')
    .style('stroke-width', '2px')
    .style('stroke', (d) => (d.selected) ? 'black' : 'white')
    .on('click', function(d) {
     temp.handleSelect(d);
    })
    .on('mouseover', function(d) {
      if (temp.selectedCharacters.includes(d.id)) return;

      d3.select(this)
        .style('stroke', function() {
          if(!temp.selectedCharacters.includes(d.id)) {
            return 'gray';
          } else {
            return 'black';
          }
    });
    temp.path
    .style('fill', function(l) {
      if (l !== undefined) {
        if ((l.source.id == d.id) && (!temp.selectedCharacters.includes(l.source.id))) {
          return temp.colors(l.sentiment);
        } else if (temp.selectedCharacters.includes(l.source.id)) return temp.colors(l.sentiment);
      }
      return temp.neutralColor; 
      
    });
  })

  

  .on('mouseout', function(d) {
    if (temp.selectedCharacters.includes(d.id)) return;
    d3.select(this)
      .style('stroke', function() {
        if (temp.selectedCharacters.includes(d.id)) {
          return 'black';
        } else {
          return 'white';
        }
      });

      temp.path
      .style('fill', function(l) {
        if (l !== undefined) {
          if ((l.source.id == d.id) && (!temp.selectedCharacters.includes(l.source.id))) {
            return temp.neutralColor;
          } else if (temp.selectedCharacters.includes(l.source.id)) return temp.colors(l.sentiment);
        }
        return temp.neutralColor; 
        
      });
   
    

  });
 
 
   g.append('svg:text')
    .attr('x', 0)
    .attr('y', 4)
    .attr('class', 'id')
    .attr("text-anchor", "middle")
    .text((d) => d.id)
    .style('font-size', '10px')
    .style('display', (d) => (d.visible) ? 'flex' : 'none');
 
   this.circle = g.merge(temp.circle)
 
    .call(temp.drag);
 
 
 
   // set the graph in motion
   this.force
    .nodes(nodes)
    .force('link').links(links);
 
   this.force.alpha(0.75).restart();
 
 
  }

 }