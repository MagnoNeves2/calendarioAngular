import { TestBed } from '@angular/core/testing';

import { CompromissosService } from './compromissos.service';

describe('CompromissosService', () => {
  let service: CompromissosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompromissosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
