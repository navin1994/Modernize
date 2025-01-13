import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscloseFormComponent } from './disclose-form.component';

describe('DiscloseFormComponent', () => {
  let component: DiscloseFormComponent;
  let fixture: ComponentFixture<DiscloseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscloseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscloseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
