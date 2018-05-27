import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestInputComponent } from './rest-input.component';

describe('RestInputComponent', () => {
  let component: RestInputComponent;
  let fixture: ComponentFixture<RestInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
