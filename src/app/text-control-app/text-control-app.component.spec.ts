import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextControlAppComponent } from './text-control-app.component';

describe('TextControlAppComponent', () => {
  let component: TextControlAppComponent;
  let fixture: ComponentFixture<TextControlAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextControlAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextControlAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
