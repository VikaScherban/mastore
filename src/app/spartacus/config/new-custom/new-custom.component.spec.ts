import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomComponent } from './new-custom.component';

describe('NewCustomComponent', () => {
  let component: NewCustomComponent;
  let fixture: ComponentFixture<NewCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewCustomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
