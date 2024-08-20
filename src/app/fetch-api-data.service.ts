import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

const apiUrl = 'https://my-flix-db-975de3fb6719.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }


  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/users', userDetails).pipe(
      catchError(this.handleError)
    );
  }


  //User login
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/login?Username=' + userDetails.Username + '&Password=' + userDetails.Password, userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //Get All movies from API
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + '/movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  //get one movie
  public getOneMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + `/movies/${encodeURIComponent(movieId)}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //get movie synopsys
  public getSynopsys(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + `/movies/${encodeURIComponent(movieId)}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // get Director
public getDirector(directorName: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get<any>(apiUrl + `/movies/director/${encodeURIComponent(directorName)}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

  // get Genre
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + `/movies/genre/${encodeURIComponent(genreName)}`, {
      headers: new HttpHeaders(
        {
        Authorization: 'Bearer' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //get User
  public getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  //Get User's favorite movies
  public  getFavoriteMovies(Username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + `/users/${Username}/movies/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Add movie to user favorites
  public addFavoriteMovie(movie: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.post<any>(apiUrl + `/users/${user.Username}/movies/${movie._id}`, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //delet movie from user favorites
  public removeFavoriteMovie(movie: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete<any>(apiUrl + `/users/${user.Username}/movies/${movie._id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Edit user profile info
  public updateUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(apiUrl + `/users/${localStorage.getItem('user')}`, userDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Delete user
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(apiUrl + '/users/:Username', {
      headers: new HttpHeaders({
        Authorization: 'Bearer' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
//logout
public logout(): Observable<any> {
  // Assuming the logout endpoint clears the session on the server
  const token = localStorage.getItem('token');
  return this.http.post<any>(apiUrl+ '/logout', {}, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

}