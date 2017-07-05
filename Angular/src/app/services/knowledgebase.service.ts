import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Knowledgebase } from '../models/knowledgebase';
import { ReplaySubject } from 'rxjs/Rx';
import { AppSettings } from '../globals';

@Injectable()
export class KnowledgebaseService {

  constructor(private http: Http) { }
  private dataObs$ = new ReplaySubject(1);

  getKnowledgeBase(forceRefresh?: boolean): ReplaySubject<Knowledgebase[]> {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested 
    if (!this.dataObs$.observers.length || forceRefresh) {
      this.http.get(AppSettings.API_ENDPOINT + '/kb/items').subscribe(
        data => this.dataObs$.next(data.json().items),
        error => {
          this.dataObs$.error(error);
          // Recreate the Observable as after Error we cannot emit data anymore
          this.dataObs$ = new ReplaySubject(1);
        }
      );
    }
    return this.dataObs$
  }
}