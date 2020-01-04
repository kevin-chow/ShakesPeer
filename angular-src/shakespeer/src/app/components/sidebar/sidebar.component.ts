import { Component, OnInit } from '@angular/core';
import {allCharacters, allOutwardSentiments, allInwardSentiments, CharacterType, Filter, Scene} from "../../models/filter.model";
import {FilterService} from "../../services/filter.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  filter: Filter;
  sceneList: Scene[] = [];
  characterTypeList: CharacterType[] = [];
  ascOrder: boolean = false;
  show: boolean = true;
  showSummary: boolean = false;

  characterAppearList: any[] = allCharacters;
  characterList: any[] = allCharacters;
  selectedCharacters: any = {};

  constructor(private filterService: FilterService) {
    filterService.filter$.subscribe((newFilter) => {
      this.filter = newFilter;
    });
  }

  ngOnInit() {
    this.filter = new Filter();

    // Hard-coding this for now...
    this.sceneList.push(new Scene('a1s1', 'Act 1, Scene 1'));
    this.sceneList.push(new Scene('a1s2', 'Act 1, Scene 2'));
    this.sceneList.push(new Scene('a2s1', 'Act 2, Scene 1'));
    this.sceneList.push(new Scene('a2s2', 'Act 2, Scene 2'));
    this.sceneList.push(new Scene('a3s1', 'Act 3, Scene 1'));
    this.sceneList.push(new Scene('a3s2', 'Act 3, Scene 2'));
    this.sceneList.push(new Scene('a4s1', 'Act 4, Scene 1'));
    this.sceneList.push(new Scene('a4s2', 'Act 4, Scene 2'));
    this.sceneList.push(new Scene('a5s1', 'Act 5, Scene 1'));

    this.characterTypeList.push(new CharacterType('lover', 'Lover'));
    this.characterTypeList.push(new CharacterType('actor', 'Actor'));
    this.characterTypeList.push(new CharacterType('fairy', 'Fairy'));
    this.characterTypeList.push(new CharacterType('other', 'Other'));

    this.characterList.forEach((character) => character.selected = true);
    this.characterList.forEach((character) => 
      this.selectedCharacters[character.id] = character.selected);
    this.updateCharacter();

    this.updateFilter();
  }

  toggleScene(scene: Scene) {
    scene.selected = !scene.selected;
    this.updateCharacter();
    this.updateFilter();
  }

  toggleAllScenes(flag: boolean) {
    this.sceneList.forEach((scene) => scene.selected = flag);
    this.updateCharacter();
    this.updateFilter();
  }

  toggleType(type: any) {
    type.selected = !type.selected;
    this.updateCharacter();
    this.updateFilter();
  }

  toggleAllTypes(flag: boolean) {
    this.characterTypeList.forEach((type) => type.selected = flag);
    this.updateCharacter();
    this.updateFilter();
  }

  toggleCharacter(character: any) {
    character.selected = !character.selected;
    this.selectedCharacters[character.id] = character.selected;
    this.updateFilter();
  }

  toggleAllCharacters(flag: boolean) {
    this.characterList.forEach((character) => character.selected = flag);
    this.characterList.forEach((character) => 
      this.selectedCharacters[character.id] = character.selected);
    this.updateFilter();
  }

  updateCharacter() {
    this.characterList.forEach((character) => character.selected = this.selectedCharacters[character.id]);
    this.characterList.forEach((character) => character.show = false);
    this.characterList.forEach((character) => 
      this.sceneList.forEach((scene) =>
        this.characterTypeList.forEach((type) =>
        (this.characterAppearList[scene.id] != 0 && scene.selected && 
         character.type == type.id && type.selected ? 
          character.show = true :
          character.show = character.show))));

    this.characterList.forEach((character) =>
      (character.show ? 
        character.total = this.calcTotal(character) :
        character.total = 0
      )
    );

    this.updateSort();
  }

  updateSort() {
    this.characterList.sort((a, b) => (a.total < b.total) ? 1 : -1);
    if (this.ascOrder) {
      this.characterList.reverse();
    }
  }

  calcTotal(character) {
    var total = 0;
    this.sceneList.forEach((scene) =>
      (scene.selected ? 
        total = total + character[scene.id] :
        total = total));
    return total;
  }

  sortList(L) {
    if (L == 1) {
      this.characterList = allCharacters;
    }
    if (L == 2) {
      this.characterList = allOutwardSentiments;
    }
    if (L == 3) {
      this.characterList = allInwardSentiments;
    }
    this.updateCharacter();
  }

  sortListOrd(asc) {
    if (asc != this.ascOrder) {
      this.ascOrder = asc;
      this.characterList.reverse();
    }
  }

  showCharacters() {
    return this.characterList.filter((character) => character.show);
  }

  updateFilter() {
    this.filter.selectedScenes = this.sceneList.filter((scene) => scene.selected )
      .map((scene) => scene.id);
    this.filter.selectedCharacterTypes = this.characterTypeList.filter((type) => type.selected )
      .map((type) => type.id);
    this.filter.selectedCharacters = this.characterList.filter((char) => char.selected && char.show)
      .map((char) => char.id);
    this.filterService.updateFilter(this.filter);
  }

}
