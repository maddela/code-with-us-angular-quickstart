import {
  Component, ComponentFactoryResolver, Directive, ViewContainerRef
} from '@angular/core';

import { Location }       from '@angular/common';
import { Router, Routes } from '@angular/router';

import { AppComponent as FinalComponent } from './final/app.component';
import { AppComponent as C01Component }   from './chapter-01/app.component';
import { AppComponent as C02Component }   from './chapter-02/app.component';
import { AppComponent as C02ecComponent } from './chapter-02-exercise-completed/app.component';
import { AppComponent as C03Component }   from './chapter-03/app.component';
import { AppComponent as C03ecComponent } from './chapter-03-exercise-completed/app.component';
import { AppComponent as C04Component }   from './chapter-04/app.component';
import { AppComponent as C05Component }   from './chapter-05/app.component';
import { AppComponent as C08Component }   from './chapter-08/app.component';
import { AppComponent as C09Component }   from './chapter-09/app.component';

import { routes as finalRoutes } from './final/app-routing.module';
import { routes as c08Routes }   from './chapter-08/app.module';
import { routes as c09Routes }   from './chapter-09/app.module';

const noRoutes: Routes = [];

// chapters: chapter components, some of which which have routes
const chapters: { [index: string]: { component: any, routes: Routes } } = {

  'Final':    { component: FinalComponent, routes: finalRoutes },

  'Chapter 1': { component: C01Component, routes: noRoutes },
  'Chapter 2': { component: C02Component, routes: noRoutes },
  'Chapter 2: exercise (completed)': { component: C02ecComponent, routes: noRoutes },
  'Chapter 3': { component: C03Component, routes: noRoutes },
  'Chapter 3: exercise (completed)': { component: C03ecComponent, routes: noRoutes },
  'Chapter 4': { component: C04Component, routes: noRoutes },
  'Chapter 5': { component: C05Component, routes: noRoutes },

  'Chapter 8': { component: C08Component, routes: c08Routes },
  'Chapter 9': { component: C09Component, routes: c09Routes },
};

@Directive( {selector: '[chapterView]'})
export class ChapterViewDirective {
  constructor(private viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'my-app',
  template: `
    <label>Chapter to run:
      <select [value]="currentChapter" (change)="onChapterChange($event.target.value)">
        <option *ngFor="let chapter of chapters">{{chapter}}</option>
      </select>
    </label>
    <hr>
    <div chapterView></div>`
})
export class AppComponent {

  currentChapter = 'Chapter 5';
  chapters = Object.keys(chapters);

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private location: Location,
    private router: Router,
    private viewContainerRef: ViewContainerRef) {
      // Set initial view
      const resetRouterConfig = this.currentChapter !== 'Final';
      this.onChapterChange(this.currentChapter, resetRouterConfig);
    }

  onChapterChange(chapter: string, resetRouterConfig = true) {
    const {component, routes} = chapters[chapter];
    this.setView(component);
    if (resetRouterConfig) {
      this.router.resetConfig(routes);
      this.location.go('/');
    }
  }

  setView(component?: { new(): any }): void {
    this.viewContainerRef.clear();

    if (component) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(component);
      this.viewContainerRef.createComponent(factory);
    }
  }
}
