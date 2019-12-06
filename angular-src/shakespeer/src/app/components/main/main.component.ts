import { Component, OnInit } from '@angular/core';
import { allCharacters, CharacterType, Filter, Scene } from "../../models/filter.model";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  filter: Filter;
  sceneList: Scene[] = [];
  characterTypeList: CharacterType[] = [];

  characterList: any[] = allCharacters;

  constructor() {}

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

    this.updateFilter();
  }

  toggleScene(scene: Scene) {
    scene.selected = !scene.selected;
    this.updateFilter();
  }

  toggleAllScenes(flag: boolean) {
    this.sceneList.forEach((scene) => scene.selected = flag);
    this.updateFilter();
  }

  toggleType(type: any) {
    type.selected = !type.selected;
    this.updateFilter();
  }

  toggleAllTypes(flag: boolean) {
    this.characterTypeList.forEach((type) => type.selected = flag);
    this.updateFilter();
  }

  updateFilter() {
    this.filter.selectedScenes = this.sceneList.filter((scene) => scene.selected )
      .map((scene) => scene.id);
    this.filter.selectedCharacterTypes = this.characterTypeList.filter((type) => type.selected )
      .map((type) => type.id);

    console.log(this.filter.selectedScenes);
    console.log(this.filter.selectedCharacterTypes);
  }

}
