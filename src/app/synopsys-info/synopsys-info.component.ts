import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * @description Component representing the movie synopsis dialog.
 * @selector 'app-movie-synopsis'
 * @templateUrl './movie-synopsis.component.html'
 * @styleUrls ['./movie-synopsis.component.scss']
 */
@Component({
  selector: 'app-synopsys-info',
  templateUrl: './synopsys-info.component.html',
  styleUrl: './synopsys-info.component.scss'
})
export class SynopsysInfoComponent  {
  /**
   * @constructor - Constructor for MovieSynopsisComponent. 
   * @param data - Data containing movie discription.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { synopsis: string },
    public dialogRef: MatDialogRef<SynopsysInfoComponent>,
    
  ) {}

  


  closeDialog(): void {
    this.dialogRef.close();
  }
}