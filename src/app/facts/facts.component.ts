import {
  CdkScrollable,
  CdkVirtualScrollViewport,
  ScrollDispatcher,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  retry,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { config } from '../shared/config';
import { Fact } from '../shared/interfaces/fact.interface';
import { AuthService } from '../shared/services/auth.service';
import { FactService } from '../shared/services/fact.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-facts',
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactsComponent implements OnDestroy {
  private readonly factService = inject(FactService);
  private readonly scrollDispatcher = inject(ScrollDispatcher);
  private readonly authService = inject(AuthService);
  cdRef = inject(ChangeDetectorRef);

  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const height = window.innerHeight;
    const initialFacts = Math.ceil(height / this.itemSize);
    this.initialFacts$.next(initialFacts);
  }

  constructor() {
    this.getScreenSize();
  }

  ngOnDestroy(): void {
    this.authService.logout();
  }

  itemSize = config.itemSize;
  initialFacts$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  scrolled$: Subject<void> = new Subject<void>();
  facts$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  stopFetching$: Subject<void> = new Subject<void>();
  hasEnded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  fetchInitialFacts$: Observable<Fact> = this.initialFacts$.pipe(
    switchMap((initialFacts: number) =>
      this.factService
        .getMany(initialFacts)
        .pipe(tap(({ data }: { data: string[] }) => this.updateFacts(data)))
    )
  );

  scrollDispatcher$: Observable<CdkScrollable | void> = this.scrollDispatcher
    .scrolled()
    .pipe(
      filter(() => {
        return (
          this.virtualScroll.measureScrollOffset('bottom') <
          config.virtualScrollOffset
        );
      }),
      tap(() => this.setLoading(true)),
      takeUntil(this.stopFetching$)
    );

  fetchFact$: Observable<unknown> = this.scrollDispatcher$.pipe(
    tap(() => this.setLoading(true)),
    switchMap(() =>
      this.factService.getOne().pipe(
        tap(({ data }: { data: string[] }) => {
          this.checkFactExistence(data[0]);
          this.updateFacts(data);
        }),
        retry(config.fetchFactRetries),
        tap(() => this.setLoading(false)),
        catchError((error: any) => this.handleError(error))
      )
    )
  );

  private setLoading(value: boolean): void {
    this.loading$.next(value);
    this.cdRef.detectChanges();
  }

  private checkFactExistence(fact: string): void {
    const exists = this.facts$.getValue().includes(fact);
    if (exists) {
      throw new Error('Fact already exists');
    }
  }

  private handleError(error: any) {
    this.stopFetching$.next();
    this.hasEnded$.next(true);
    this.setLoading(false);
    return error;
  }

  private updateFacts(value: string[]): void {
    this.facts$.next([...this.facts$.getValue(), ...value]);
    this.cdRef.detectChanges();
  }
}
