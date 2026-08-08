import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Observe } from './observe';

describe('Observe', () => {
  let component: Observe;
  let fixture: ComponentFixture<Observe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Observe],
    }).compileComponents();

    fixture = TestBed.createComponent(Observe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
