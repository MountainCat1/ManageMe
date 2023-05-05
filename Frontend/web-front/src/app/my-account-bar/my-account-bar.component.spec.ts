import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountBarComponent } from './my-account-bar.component';

describe('MyAccountBarComponent', () => {
  let component: MyAccountBarComponent;
  let fixture: ComponentFixture<MyAccountBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAccountBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAccountBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
