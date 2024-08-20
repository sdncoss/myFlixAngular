import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-synopsys-info',
  templateUrl: './synopsys-info.component.html',
  styleUrl: './synopsys-info.component.scss'
})
export class SynopsysInfoComponent  {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { synopsis: string },
    public dialogRef: MatDialogRef<SynopsysInfoComponent>,
    
  ) {}

  


  closeDialog(): void {
    this.dialogRef.close();
  }
}