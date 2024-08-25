import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @description Component representing the user profile page.
 * @selector 'app-user-profile'
 * @templateUrl './user-profile.component.html'
 * @styleUrls ['./user-profile.component.scss']
 */
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  @Input() userData: any = { Username: '', Password: '', Email: '', Birthday: '' };

  user: any = {};
  username: string | null = null;
  favoriteMovies: any[] = [];
  /**
   * @constructor - Constructor for UserProfileComponent.
   * @param {FetchApiDataService} fetchApiData - Service for fetching data from the API.
   * @param {MatSnackBar} snackBar - Material snack bar service for displaying notifications.
   * @param {Router} router - Router service for navigation.
   * @param {MatDialog} dialog - Material dialog service for opening dialogs.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.getProfile();
    this.getFavoriteMovies();
  }
  /**
   * Function for getting user.
   * @returns users username, email, birthday, and favorite movies.
   */
  public getProfile(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.userData.Email = this.user.Email;
    this.userData.Birthday = this.user.Birthday || Date;
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.favoriteMovies = response.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
    });
  }
  /**
   * Function to delete user profile.
   * @returns Message "User successfully deleted."
   */
  deleteUser(): void {
    this.router.navigate(['welcome']).then(() => {
      localStorage.clear();
      this.snackBar.open('User successfully deleted.', 'OK', {
        duration: 2000
      });
    })
    this.fetchApiData.deleteUser().subscribe((result) => {
      console.log(result);
    });
  }
  /**
   * Function for updating user information.
   * @returns Message "User update successful" / "Failed to update user"
   */
  updateUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe((result) => {
      console.log('User update success:', result);
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('User updated successfully!', 'OK', {
        duration: 2000,
      });
      this.getProfile();
    }, (error) => {
      console.log('Error updating user:', error);
      this.snackBar.open('Failed to update user', 'OK', {
        duration: 2000,
      });
    });
  }
  /**
   * Function to get favMovie list.
   * @returns Favorite movies of user.
  */
  getFavoriteMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoriteMovies = this.user.favoriteMovies;
    this.favoriteMovies = this.user.favoriteMovies || [];
    console.log('Fav Movies in getFavoriteMovie', this.favoriteMovies);
  }
  /**
   * Function to check if movie is a favorite movie.
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
   * Function to delete movie from favMovie list.
   * @param {any} movie - Movie to delete from favorite movies.
   * @returns Message "Movie has been deleted from your favorites!"
   */
  removeFavorite(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.removeFavoriteMovie(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies();
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
    this.router.navigate(['welcome']);
    this.snackBar.open('You have been logged out.', 'OK', { duration: 3000 });
  }
  //redirects to movies page
  goToMovies(): void {
    this.router.navigate(['movies']);
  }
}

