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
  /**
   * Inject the HttpClient module to the constructor params
   * This will provide HttpClient to the entire class, 
   * making it available via this.http
   * @constructor
   * @param {HttpClient} http - for making http requests
   */
  constructor(private http: HttpClient) {
  }

  /**
   * handles all errors in response to fetching API endpoints
   * @param error 
   * @returns  error messages
   */
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
  /**
   * Makes the API call for the user registration endpoint
   * @param {any} userDetails - user credentials for registration
   * @returns {Observable<any>} - Observable for API response
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  
  /**
   * Calls to API for user to login endpoint
   * @param userDetails - User details for login
   * @returns {Observable<any>} - Observable for API response
   */
  public userLogin(userDetails: any): Observable<any> {
    //{
//     "Username": "userDemo1",
//     "Password": "userDemo1", //"$2b$10$RVZVhB2gen5R6g/FB9jy6eZ57GIkL8N4qHaw7QxHIsNXPCWHHGR9u",
//     "Email": "userDemo@email.com",
//     "Birthday": "2020-05-05T00:00:00.000Z",
//     "FavoriteMovies": [],
//     "_id": "66ca47104f604ebf83762013",
//     "__v": 0
// }
    console.log(userDetails);
    // return this.http.post(apiUrl + '/login?Username=' + userDetails.Username + '&Password=' + userDetails.Password, userDetails).pipe(
      return this.http.post(apiUrl + '/login', { Username: userDetails.Username, Password: userDetails.Password}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Calls to API for the Get All Movies endpoint
   * @returns {Observable<any>} - Observable for the API response.
   */
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

  /**
   * Calls to API for Get One Movie endpoint
   * @param {string} movieId - One movie it
   * @returns {Observable<any>} - Observable for the API response.
   */
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

  /**
   * Calls to API for Get Movie endpoint
   * @param {string} movieId - One movie information
   * @returns {Observable<any>} - Observable for the API response.
   */
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

  /**
   * Calls to API for the Get Director endpoint
   * @param {string} directorName - Director Name
   * @returns {Observable<any>} - Observable for the API response.
   */
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

  /**
   * Calls API for Get Genre endpoint
   * @param {string} genreName - Genre name
   * @returns {Observable<any>} - Observable for the API response.
   */
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

  /**
   * Calls to API for Get User endpoint
   * @returns {Observable<any>} - Observable for the API response.
   */
  public getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  /**
   * Calls Get Favorite Movies endoint
   * @param {string} Username  - Username from users
   * @param {string} movieId - Movie id from movies
   * @returns {Observable<any>} - Observable for the API response.
   */
  public getFavoriteMovies(Username: string, movieId: string): Observable<any> {
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

  /**
   * Calls API Add to Favorite Movies endpoint
   * @param {any} movie - Movie for adding to favorite Movies
   * @returns {Observable<any>} - Observable for the API response.
   */
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

  /**
   * Calls API for Delete from Favorite Movies endpoint
   * @param {any} movie - Movie to delete from favorite Movies
   * @returns {Observable<any>} - Observable for the API response.
   */
  public removeFavoriteMovie(movie: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    // Debugging to check movie object and _id
    console.log('Movie object passed to removeFavoriteMovie:', movie);
    console.log('Movie ID (movie._id):', movie?._id);
    console.log('in fetch api service: ', movie._id);
    return this.http.delete<any>(apiUrl + '/users/' + user.Username + '/movies/' + movie._id, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Calls API to Update User endpoint
   * @param {any} userDetails - User details that write over user information
   * @returns {Observable<any>} - Observable for the API response.
   */
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
  /**
   * Calls to API Delete User endpoint
   * USE THIS LINK
   * https://us04web.zoom.us/j/76744025963?pwd=SZS7PsZahiHMxbTzNeq1soEoqXqidu.1
   * @returns {Observable<any>} - Observable for the API response.
   */
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
    return this.http.post<any>(apiUrl + '/logout', {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

 /**
   * Non-typed response extraction.
   * @param {Object} res - API response.
   * @returns {any} - Extracted response data.
   */
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

}