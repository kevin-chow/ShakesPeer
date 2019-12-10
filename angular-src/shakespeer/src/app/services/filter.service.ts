import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Filter} from '../models/filter.model';

@Injectable()
export class FilterService {

  private filterSource = new Subject<Filter>();
  private hoverSource = new Subject<string>();

  filter$ = this.filterSource.asObservable();
  hover$ = this.hoverSource.asObservable();

  constructor() { }

  updateFilter(newFilter: Filter) {
    this.filterSource.next(newFilter);
  }

  updateHover(newHover: string) {
    this.hoverSource.next(newHover)
  }
}
