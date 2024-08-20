import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss']
})
export class GenreInfoComponent implements OnInit {

  genre: any = {};

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