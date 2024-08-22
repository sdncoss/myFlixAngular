import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * @description Component representing the genre info dialog.
 * @selector 'app-genre-info'
 * @templateUrl './genre-info.component.html'
 * @styleUrls ['./genre-info.component.scss']
 */
@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss']
})
export class GenreInfoComponent implements OnInit {

  genre: any = {};
  /**
   * @constructor - Constructor for GenreInfoComponent. 
   * @param data - Data containing genre information.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: { genre: string; },
    public dialogRef: MatDialogRef<GenreInfoComponent>,

  ) {}

  ngOnInit(): void {
    this.genre = this.data.genre || {};
  }

  

  closeDialog(): void {
    this.dialogRef.close();
  }
}