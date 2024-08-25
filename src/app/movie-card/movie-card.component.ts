import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsysInfoComponent } from '../synopsys-info/synopsys-info.component';

/**
 * @description Component representing the movie card.
 * @selector 'app-movie-card'
 * @templateUrl './movie-card.component.html'
 * @styleUrls ['./movie-card.component.scss']
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input() movie: any;
  isFavorite: boolean = false;

  movies: any[] = [];

  genre: any = "";

  director: any = "";

  user: any = {};

  userData = { Username: "", favoriteMovies: [] }

  favoriteMovies: any[] = [];

  /**
   * @constructor - Constructor for MovieCardComponent.
   * @param {FetchApiDataService} fetchApiData - Service for fetching data from the API.
   * @param {MatDialog} dialog - Material dialog service for opening dialogs.
   * @param {MatSnackBar} snackBar - Material snack bar service for displaying notifications.
   * @param {Router} router - Navigation between displaying pages.
   * @param {ChangeDetectorRef} cdr - Change the heart for favorites UI.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  /**
   * Function for getting all movies.
   * @returns All movies.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  /**
   * Function that will open the dialog when synopisi button is clicked.
   * @param {string} movieId - Id of movie for description.
   * @returns Movie synopsis from Movie Description.
   */
  openSynopsysDialog(movieId: string): void {
    this.fetchApiData.getOneMovie(movieId).subscribe((movie: any) => {
      console.log('Fetched movie:', movie); // Debugging line
      if (movie && movie.Description) {
        this.dialog.open(SynopsysInfoComponent, {
          data: { synopsis: movie.Description },
          width: '500px'
        });
      } else {
        console.error('No data found for the movie');
        this.snackBar.open(`No details found for movie ${movieId}`, 'OK', {
          duration: 3000
        });
      }
    }, (error) => {
      console.error('Error fetching movie details', error);
      this.snackBar.open(`Failed to fetch details for movie ${movieId}`, 'OK', {
        duration: 3000
      });
    });
  }

  /**
   * Function that will open the dialog when director button is clicked.
   * @param {any} director - Director information.
   * @returns Directors name, bio, birth date and death date.
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { director },
      width: '500px'
    });
  }
  /**
   * Function that will open the dialog when genre button is clicked.
   * @param {any} genre - Genre information.
   * @returns Genre name, description.
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: { genre },
      width: '500px'
    });
  }
  /**
   * Function to get favoriteMovies list.
   * @returns Favorite movies of user.
   */
  getFavorites(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoriteMovies = this.user.favoriteMovies;
    this.favoriteMovies = this.userData.favoriteMovies || [];
    console.log('Fav Movies in getFavoriteMovie', this.favoriteMovies);
  }

  /**
   * Function to check if movie is in favoriteMovies list.
   * @param {any} movie  - Movie object to check.
   * @returns {boolean} - Boolean indicating whether the movie is a favorite.
   */
  isFav(movie: any): any {
    const MovieID = movie._id;
    if (this.favoriteMovies.some((movie) => movie === MovieID)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Function add / delete favoriteMovies by icon button
   * @param {any} movie - Movie to toggle favorite icon for. 
   */
  toggleFavorite(movie: any): void {
    const isFavorite = this.isFav(movie._id);
    isFavorite
      ? this.removeFavorite(movie._id)
      : this.addFavorite(movie._id);

      this.cdr.detectChanges();
  }
  /**
   * Function to add movie to favoriteMovies list
   * @param {any} movie - Movie to add to favorite movies.
   * @returns Message "Movie has been added to your favorites!"
   */
  addFavorite(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.favoriteMovies.push(movie._id);
    this.fetchApiData.addFavoriteMovie(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavorites();
      this.snackBar.open('Movie has been added to your favorites!', 'OK', {
        duration: 3000,
      });
    });
  }
  /**
   * Function to delete movie to favoriteMovies list
   * @param {any} movie - Movie to delete from favorite movies.
   * @returns Message "Movie has been deleted to your favorites!"
   */
  removeFavorite(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.favoriteMovies = this.favoriteMovies.filter(id => id !== movie._id);
    this.fetchApiData.removeFavoriteMovie(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavorites();
      this.snackBar.open('Movie has been deleted from your favorites!', 'OK', {
        duration: 3000,
      });
    });
  }


  // Logout method
  logout(): void {
    // Clear user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page
    this.router.navigate(['/welcome']);
    this.snackBar.open('You have been logged out.', 'OK', { duration: 3000 });
  }
  //redirects to the profile page
  redirectProfile(): void {
    this.router.navigate(['/profile']);
  }
}