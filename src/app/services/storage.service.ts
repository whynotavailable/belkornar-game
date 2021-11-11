import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get<T>(key: string, def: T): T {
    let data = localStorage.getItem(key);
    if (data === null) {
      return def;
    }
    else {
      return <T>JSON.parse(data);
    }
  }
}
