import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  public getProfile(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.userData.Email = this.user.Email;
    this.userData.Birthday = this.user.Birthday;
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.favoriteMovies = response.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
    });
  }

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

  getFavoriteMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoriteMovies = this.user.favoriteMovies;
    this.favoriteMovies = this.user.favoriteMovies || [];
    console.log('Fav Movies in getFavoriteMovie', this.favoriteMovies);
  }
  
  isFav(movie: any): any {
    const MovieID = movie._id;
    if (this.favoriteMovies.some((movie) => movie === MovieID)) {
      return true;
    } else {
      return false;
    }
  }


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
  goToMovies(): void {
    this.router.navigate(['movies']);
  }
}

