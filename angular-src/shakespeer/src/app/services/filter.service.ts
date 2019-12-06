import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Filter} from '../models/filter.model';

@Injectable()
export class FilterService {

  private filterSource = new Subject<Filter>();

  filter$ = this.filterSource.asObservable();

  constructor() { }

  updateFilter(newFilter: Filter) {
    this.filterSource.next(newFilter);
  }
}
