import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopsysInfoComponent } from './synopsys-info.component';

describe('SynopsysInfoComponent', () => {
  let component: SynopsysInfoComponent;
  let fixture: ComponentFixture<SynopsysInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SynopsysInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynopsysInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
