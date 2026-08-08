import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCompContainer } from './dynamic-comp-container';

describe('DynamicCompContainer', () => {
  let component: DynamicCompContainer;
  let fixture: ComponentFixture<DynamicCompContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicCompContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicCompContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
