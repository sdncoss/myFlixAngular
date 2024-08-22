import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * @description Component representing the director info dialog.
 * @selector 'app-director-info'
 * @templateUrl './director-info.component.html'
 * @styleUrls ['./director-info.component.scss']
 */
@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss']
})
export class DirectorInfoComponent implements OnInit {

  director: any = {}; 
  /**
   * @constructor - Constructor for DirectorInfoComponent.
   * @param - Data containing director information.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { director: any },
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
    
  ) {}

  ngOnInit(): void {
    this.director = this.data.director || {};
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}