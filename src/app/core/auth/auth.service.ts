import { User } from './../user/user.model';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';

@Injectable()
export class AuthService
{
    
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }
    _uLogin=environment._apiUrl+"users/login"
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('access_token', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('access_token') ?? '';
    }

    set _authenticated(isAuth: string)
    {
        localStorage.setItem('is_logged', isAuth);
    }

    get _authenticated(): string
    {
        return localStorage.getItem('is_logged') ?? '';
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
     login(credentials: { email: string, password: string })
     {
         // Throw error, if the user is already logged in
         if ( this._authenticated )
         {
             //return throwError('User is already logged in.');
         }
         console.log("Aqui")
         return this._httpClient.post(this._uLogin, credentials).toPromise();
        
    } 

    getUser(){
        return this._httpClient.get(environment._apiUrl+"users").toPromise();
    }

    signIn2(credentials: { email: string, password: string })
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated=="true" )
        {
           // return throwError('User is already logged in.');
           return
        }
        console.log("Aqui")
         return this._httpClient.post(this._uLogin, credentials).toPromise();
         
         
         
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken()
    {
        return this._httpClient.get(environment._apiUrl+"users").toPromise();

    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('is_logged');
        localStorage.clear();

        // Set the authenticated flag to false
        this._authenticated = "false";

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string, email: string, password: string, company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string, password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check()
    {
            console.log("Chequeo");
        // Check if the user is logged in
        //console.log(this.accessToken);

        if (this.accessToken=="undefined") {
            console.log("Removiendo Token")
            localStorage.removeItem('access_token');
            this._authenticated="false";
            return of(false)
        } else {
            this.accessToken=(this.accessToken);
           // this._authenticated=true;
        }
        if (this._userService.myUser.email==="Loading Email.."){
            this.signInUsingToken().then(data=>{
                console.log("Login token");
                let mUser:any=data;
                this._userService.myUser.email=mUser.email;
                this._userService.myUser.avatar="";
                this._userService.myUser.name=mUser.name;
                this._userService.myUser.id=mUser.id;
                this._userService.myUser.status="online";
                
                //console.log(this._userService.myUser);
            })
            // If
        }
       // console.log(this._authenticated);
        if ( this._authenticated=="true" )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }
 //the access token exists and it didn't expire, sign in using it
        //return this.signInUsingToken();

    }
}
