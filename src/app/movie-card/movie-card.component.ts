import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsysInfoComponent } from '../synopsys-info/synopsys-info.component';


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

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

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


  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { director },
      width: '500px'
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: { genre },
      width: '500px'
    });
  }

  getFavorites(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoriteMovies = this.user.favoriteMovies;
    this.favoriteMovies = this.user.favoriteMovies;
    console.log('Fav Movies in getFavMovie', this.favoriteMovies); 
  }


  isFav(movie: any): any {
    const MovieID = movie._id;
    if (this.favoriteMovies.some((movie) => movie === MovieID)) {
      return true;
    } else {
      return false;
    }
  }

  toggleFavorite(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite
      ? this.removeFavorite(movie)
      : this.addFavorite(movie);
  }

  addFavorite(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.addFavoriteMovie(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavorites(); 
      this.snackBar.open('Movie has been added to your favorites!', 'OK', {
        duration: 3000,
      });
    });
  }

  removeFavorite(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
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

  redirectProfile(): void {
    this.router.navigate(["/profile"]);
  }
}